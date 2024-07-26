import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';


export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userrole');

  if (token) {
    if (route.url.toString() === 'register' && userRole !== '1') {
      router.navigateByUrl('/unauthorized'); 
      return false;
    }
    return true;
  } else {
    router.navigateByUrl('/login');
    return false;
  }
};
