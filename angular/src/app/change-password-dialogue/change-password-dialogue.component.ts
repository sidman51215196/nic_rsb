import { Component,OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgIf } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient,HttpHeaders  } from '@angular/common/http'; 
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { LocalStorageService } from '../services/local-storage.service';
@Component({
  selector: 'app-change-password-dialogue',
  standalone: true,
  imports: [
    MatFormFieldModule,
    NgIf,
    ReactiveFormsModule,
    FormsModule  ,
    HttpClientModule,
    MatInputModule

  ],
  templateUrl: './change-password-dialogue.component.html',
  styleUrl: './change-password-dialogue.component.css'
})
export class ChangePasswordDialogueComponent implements OnInit {
  changePasswordForm: FormGroup;
  email: string | null = null;
  token: string | null = null;
  error: string | null = null;

  constructor(
    private localStorageService: LocalStorageService, 
    private fb: FormBuilder,
    private http: HttpClient,
    public dialogRef: MatDialogRef<ChangePasswordDialogueComponent>
  ) {
    this.changePasswordForm = this.fb.group({
      old_password: ['', Validators.required],
      new_password1: ['', [Validators.required, Validators.minLength(6)]],
      new_password2: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.email = this.localStorageService.getUsername();
    this.token = this.localStorageService.getToken();
    console.log(this.email,'maiiiiilllll')
    console.log(this.token,'tokeeeeee')
  }  

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onChangePassword(): void {
    if (this.changePasswordForm.valid && this.passwordsMatch()) {
      const formData = {
        ...this.changePasswordForm.value,
        email: this.email
      };

      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
      console.log('headersss',headers);

      this.http.put('http://127.0.0.1:8000/passwordchangeforadmin', formData, { headers }).subscribe(
        response => {
          console.log('Password reset successful', response);
          this.dialogRef.close();
        },
        error => {
          console.error('Error resetting password', error);
          if (error.status === 401) {
            // Handle unauthorized error, e.g., show a message to the user
            this.error = 'Unauthorized access. Please log in again.';
          } else {
            this.error = 'An error occurred. Please try again later.';
          }
        }
      );
    }
  }

  passwordsMatch(): boolean {
    const newPassword1 = this.changePasswordForm.get('newPassword1')?.value;
    const newPassword2 = this.changePasswordForm.get('newPassword2')?.value;
    return newPassword1 === newPassword2;
  }

  isFormValid(): boolean {
    return this.changePasswordForm.valid && this.passwordsMatch();
  }
}
