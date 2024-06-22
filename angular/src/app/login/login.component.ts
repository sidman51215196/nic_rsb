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
      password: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  onSubmit(): void {
    console.log('Form Submission Attempted');
    if (this.loginForm.valid) {
      const url = 'http://127.0.0.1:8000/login';
      const body = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value
      };
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

      this.http.post(url, body, { headers }).subscribe(
        (response: any) => {
          console.log('Login successful', response);

          const authenticatedUser = response.authenticatedUser;
          if (authenticatedUser) {
            const username = authenticatedUser.email;
            const role = authenticatedUser.role;
            const district = authenticatedUser.district;

            localStorage.setItem('username', username);
            localStorage.setItem('userrole', role);
            localStorage.setItem('district', district);

            console.log('User role:', role);
            console.log('User district:', district);
            console.log('district:', district);
          }

          // Navigate to the dashboard on successful login
          this.router.navigate(['/dashboard']);
        },
        error => {
          console.error('Login failed', error);
        }
      );
    } else {
      console.log('Form is invalid');
      console.log('Email errors:', this.loginForm.get('email')?.errors);
      console.log('Password errors:', this.loginForm.get('password')?.errors);
    }
  }
}
