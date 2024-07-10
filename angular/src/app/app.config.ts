import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { CustomInterceptor   } from './services/custom.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), 
              provideAnimationsAsync(),
              {
                provide: HTTP_INTERCEPTORS,
                useClass: CustomInterceptor,
                multi: true
              },
              provideHttpClient()
            ]
};
