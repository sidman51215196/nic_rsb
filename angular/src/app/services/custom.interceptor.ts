import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take, finalize } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CustomInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Interceptor: Intercepted request', req);

    const token = localStorage.getItem('token');
    if (token) {
      req = this.addToken(req, token);
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.handle401Error(req, next);
        }
        console.error('Interceptor: Error occurred', error);
        return throwError(error);
      })
    );
  }

  private addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refreshToken = localStorage.getItem('refresh');
      return this.refreshToken(refreshToken).pipe(
        switchMap((tokenResponse: any) => {
          if (tokenResponse && tokenResponse.access) {
            localStorage.setItem('token', tokenResponse.access);
            this.refreshTokenSubject.next(tokenResponse.access);
            return next.handle(this.addToken(req, tokenResponse.access));
          }

          // If refresh token fails or no valid token received, handle appropriately
          // For example, logout the user or redirect to login
          return throwError('Failed to refresh token');
        }),
        catchError(error => {
          // Handle refresh token errors here
          console.error('Interceptor: Error refreshing token', error);
          return throwError(error);
        }),
        finalize(() => {
          this.isRefreshing = false;
        })
      );
    } else {
      // Wait while refreshing token
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => {
          return next.handle(this.addToken(req, token));
        })
      );
    }
  }

  private refreshToken(refreshToken: string | null): Observable<any> {
    if (!refreshToken) {
      return throwError('No refresh token available');
    }

    const refreshTokenUrl = 'http://127.0.0.1:8000/token/refresh/';
    return this.http.post<any>(refreshTokenUrl, { refresh: refreshToken });
  }
}
