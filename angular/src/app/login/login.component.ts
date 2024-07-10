import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { UserInterface } from '../user.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private http: HttpClient,
    // Correct injection of AuthService
  ) {
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
  
      this.http.post(url, body, { headers,}).subscribe(
        (response: any) => {
          console.log('Login successful', response);
  
          const authenticatedUser = response.authenticatedUser;
          if (authenticatedUser) {
            const username = authenticatedUser.email;
            const role = authenticatedUser.role;
            const district = authenticatedUser.district;
            const token = authenticatedUser.access;
            const refreshtoken = authenticatedUser.refresh;
  
            // Store user details and token in localStorage
            localStorage.setItem('username', username);
            localStorage.setItem('userrole', role);
            localStorage.setItem('district', district);
            localStorage.setItem('token', token);
            localStorage.setItem('refresh',refreshtoken)
  
            // Navigate to the dashboard on successful login
            this.router.navigate(['/dashboard']);
          } else {
            console.error('Invalid response structure:', response);
            alert('Login response did not contain the expected data');
          }
        },
        error => {
          console.error('Login failed', error);
          alert('Invalid login credentials');
        }
      );
    } else {
      console.log('Form is invalid');
      console.log('Email errors:', this.loginForm.get('email')?.errors);
      console.log('Password errors:', this.loginForm.get('password')?.errors);
    }
  }
}
