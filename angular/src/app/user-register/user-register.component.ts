import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent {
  userForm: FormGroup;
  commissions = ['Commissioned Officer (CO)', 'Junior-Commissioned Officer (JCO)', 'Non-Commissioned Officer (NCO)'];
  corpsOptions = ['Indian Army', 'Indian Navy', 'Indian Air Force'];
  ranksByCorps: { [key: string]: string[] } = {
    'Indian Army': ['Field Marshal', 'General', 'Lieutenant General', 'Brigadier', 'Colonel', 'Lieutenant Colonel', 'Major', 'Captain', 'Lieutenant', 'Subedar Major', 'Subedar', 'Naib Subedar', 'Havildar', 'Naik', 'Lance Naik', 'Sepoy'],
    'Indian Navy': ['Admiral of the Fleet', 'Admiral', 'Vice Admiral', 'Captain', 'Commander', 'Lieutenant Commander', 'Lieutenant', 'Sub Lieutenant', 'Master Chief Petty Officer 1st Class', 'Master Chief Petty Officer 2nd Class', 'Chief Petty Officer', 'Petty Officer', 'Able Seaman', 'Leading Seaman', 'Seaman'],
    'Indian Air Force': ['Marshal of the Indian Air Force', 'Air Chief Marshal', 'Air Marshal', 'Air Vice Marshal', 'Air Commodore', 'Group Captain', 'Wing Commander', 'Squadron Leader', 'Flight Lieutenant', 'Flying Officer', 'Master Warrant Officer', 'Warrant Officer', 'Junior Warrant Officer', 'Sergeant', 'Corporal', 'Leading Aircraftsman', 'Aircraftsman']
  };

  constructor(private fb: FormBuilder, private router: Router) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      commission: ['', Validators.required],
      corps: ['', Validators.required],
      rank: ['', Validators.required],
      unit: ['', Validators.pattern(/^[a-zA-Z0-9\/]*$/)],
      uniqueId: ['', Validators.pattern(/^[a-zA-Z0-9]*$/)],
      contactNumber: ['', [Validators.pattern(/^[0-9]{10}$/)]],
      dateOfBirth: ['', Validators.pattern(/^\d{2}\/\d{2}\/\d{4}$/)],
      dateOfEnrollment: ['', Validators.pattern(/^\d{2}\/\d{2}\/\d{4}$/)],
      dateOfRetirement: ['', Validators.pattern(/^\d{2}\/\d{2}\/\d{4}$/)],
      aliveStatus: ['', Validators.required]
    });
  }

  onCorpsChange() {
    this.userForm.get('rank')?.reset();
  }

  onSubmit() {
    if (this.userForm.valid) {
      // Handle form submission
      console.log('Form Submitted', this.userForm.value);
    }
  }
}
