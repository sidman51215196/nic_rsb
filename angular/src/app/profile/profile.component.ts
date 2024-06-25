import { Component } from '@angular/core';
import { Header2Component } from '../header2/header.component';
import { FooterComponent } from '../footer/footer.component';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgIf } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    Header2Component,
    FooterComponent,
    MatFormFieldModule,
    NgIf,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule 
    
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(public dialogRef: MatDialogRef<ProfileComponent>) {}

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onChangePassword(): void {
    // Implement your logic to change password here
    // For demo, simply close the dialog
    this.dialogRef.close();
  }

  isFormValid(): boolean {
    return !!this.currentPassword && !!this.newPassword && !!this.confirmPassword && this.newPassword === this.confirmPassword;
  }

}
