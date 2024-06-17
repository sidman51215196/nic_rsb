

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
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const url = 'http://127.0.0.1:8000/login';
      const body = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value
      };
      const headers = new HttpHeaders({'Content-Type': 'application/json'});

      this.http.post(url, body, { headers }).subscribe(
        (response: any) => {
          console.log('Login successful', response);

          const authenticatedUser = response.authenticatedUser;
          if (authenticatedUser) {
            const role = authenticatedUser.role;
            const district = authenticatedUser.district;

            console.log('User role:', role);
            console.log('User district:', district);
          }
        

          //console.log('User role:', response.authenticatedUser.role);
           
          // Navigate to a different page on successful login
          //  this.router.navigate(['/']);
        },
        error => {
          console.error('Login failed', error);
        }
      );
    } else {
      console.log('Form is invalid');
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