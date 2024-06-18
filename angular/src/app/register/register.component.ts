import { Component } from '@angular/core';
import {NgFor } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators ,ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [NgFor,HttpClientModule,ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registrationForm: FormGroup;

  districtChoices = [
    { value: 1, label: 'Gangtok' },
    { value: 2, label: 'Gyalshing' },
    { value: 3, label: 'Namchi' }
  ];

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.registrationForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      district: ['', Validators.required]
    });
  }

  onSubmit(){
      if (this.registrationForm.valid) {
      const formData = this.registrationForm.value;
      console.log(formData);

      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      this.http.post('http://127.0.0.1:8000/register', formData, { headers })
        .subscribe(
          response => {
            console.log('Registration successful', response);
          },
          error => {
            console.error('Registration failed', error);
          }
        );

}

}
}
