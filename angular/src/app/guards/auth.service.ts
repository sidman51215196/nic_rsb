// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private isSuperAdminLoggedIn = false;

//   login(email: string, password: string): boolean {
//     if (email === 'superadmin@email.com' && password === 'superadmin123') {
//       this.isSuperAdminLoggedIn = true;
//       return true;
//     } else {
//       return false;
//     }
//   }

//   logout(): void {
//     this.isSuperAdminLoggedIn = false;
//   }

//   isLoggedIn(): boolean {
//     return this.isSuperAdminLoggedIn;
//   }
// }

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = false;
  private userRole: 'superadmin' | 'admin' | null = null;

  login(email: string, password: string): boolean {
    // Replace this with real authentication logic
    if (email === 'superadmin@email.com' && password === 'superadmin123') {
      this.loggedIn = true;
      this.userRole = 'superadmin';
      return true;
    } else if (email === 'admin@email.com' && password === 'admin123') {
      this.loggedIn = true;
      this.userRole = 'admin';
      return true;
    }
    return false;
  }

  logout(): void {
    this.loggedIn = false;
    this.userRole = null;
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  getUserRole(): 'superadmin' | 'admin' | null {
    return this.userRole;
  }
}

