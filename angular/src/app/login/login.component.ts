

// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { AuthService } from '../guards/auth.service';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css'],
//   imports: [
//     CommonModule,
//     ReactiveFormsModule  // Import ReactiveFormsModule here
//   ]
// })
// export class LoginComponent {
//   loginForm: FormGroup;

//   constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
//     this.loginForm = this.fb.group({
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', [Validators.required]]
//     });
//   }

//   onSubmit() {
//     if (this.loginForm.valid) {
//       const { email, password } = this.loginForm.value;
//       if (this.authService.login(email, password)) {
//         this.router.navigate(['/superadmin-dashboard']);
//       } else {
//         alert('Invalid credentials');
//       }
//     }
//   }
// }

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { AuthService } from '../guards/auth.service';
import { CommonModule } from '@angular/common'; // Import CommonModule for common directives

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // Include ReactiveFormsModule and CommonModule here
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      if (this.authService.login(email, password)) {
        const userRole = this.authService.getUserRole();
        if (userRole === 'superadmin') {
          this.router.navigate(['/superadmin-dashboard']);
        } else if (userRole === 'admin') {
          this.router.navigate(['/admin-dashboard']);
        }
      } else {
        alert('Invalid email or password');
      }
    }
  }
}

// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css']
// })
// export class LoginComponent {
//   loginForm: FormGroup;

//   constructor(private fb: FormBuilder, private router: Router) {
//     this.loginForm = this.fb.group({
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', Validators.required]
//     });
//   }

//   onSubmit(event: Event) {
//     event.preventDefault(); // Prevent default form submission

//     if (this.loginForm.valid) {
//       const { email, password } = this.loginForm.value;
//       console.log('Email:', email);
//       console.log('Password:', password);

//       if (email === 'superadmin@email.com' && password === 'superadmin123') {
//         this.router.navigate(['/superadmin-dashboard']);
//       } else {
//         alert('Invalid credentials');
//       }
//     }
//   }
// }