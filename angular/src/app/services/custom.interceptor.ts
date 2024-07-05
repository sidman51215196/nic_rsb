import { HttpInterceptorFn } from '@angular/common/http';

export const customInterceptor: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem('token');
  const clonerequest = req.clone({
    setHeaders:{
      Authorization :`Bearer ${token}` 
    }
  })
 
  return next(clonerequest);
};
