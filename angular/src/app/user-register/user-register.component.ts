import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardTitle, MatCardSubtitle } from '@angular/material/card';
import { NgIf } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatCardTitle,
    MatCardSubtitle,
    NgIf,
    MatSelectModule,
    MatFormFieldModule
  ]
})
export class UserRegisterComponent {
  personalDetailsForm: FormGroup;
  serviceDetailsForm: FormGroup;
  bankDetailsForm: FormGroup;
  familyDetailsForm: FormGroup;
  additionalDetailsForm: FormGroup;

  currentCard: number = 1;
  showDateWhenExpired: boolean = false;
  educationOptions: string[] = [
    'No Formal Education', 'Secondary', 'Senior Secondary', 'Diploma', 'Graduate', 'Post-Graduate', 'Doctorate'
  ];
  
  constructor(private fb: FormBuilder) {
    this.personalDetailsForm = this.fb.group({
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      uniqueId: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]],
      contactNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      highestEducation: ['', Validators.required],
      universityName: ['', Validators.pattern('^[a-zA-Z ]+$')],
      esmCardNumber: ['', Validators.pattern('^[0-9]+$')],
      aadharNumber: ['', [Validators.required, Validators.pattern('^[0-9]{4} [0-9]{4} [0-9]{4}$')]],
      email: ['', [Validators.required, Validators.email]],
      dateOfBirth: ['', [Validators.required, Validators.pattern('^\\d{2}/\\d{2}/\\d{4}$')]],
      aliveStatus: ['', Validators.required],
      dateWhenExpired: [''],
      address: this.fb.group({
        co: [''],
        village: [''],
        po: [''],
        ps: [''],
        district: ['', Validators.required],
        pin: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]]
      })
    });

    this.serviceDetailsForm = this.fb.group({
      serviceId: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]],
      commission: ['', Validators.required],
      corps: ['', Validators.required],
      rank: ['', Validators.required],
      unit: [''],
      dateOfEnrollment: ['', [Validators.required, Validators.pattern('^\\d{2}/\\d{2}/\\d{4}$')]],
      dateOfRetirement: ['', [Validators.required, Validators.pattern('^\\d{2}/\\d{2}/\\d{4}$')]]
    });

    this.bankDetailsForm = this.fb.group({
      panNumber: ['', [Validators.required, Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}$')]],
      bankName: [''],
      ifscCode: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]],
      accountType: ['', Validators.required],
      accountNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      ppoNumber: ['', [Validators.required, Validators.pattern('^[0-9]{12}$')]]
    });

    this.familyDetailsForm = this.fb.group({
      nextOfKin: this.fb.group({
        firstName: [''],
        lastName: [''],
        relation: ['', Validators.required]
      }),
      dependents: this.fb.array([
        this.createDependentForm(),
        this.createDependentForm(),
        this.createDependentForm()
      ])
    });

    this.additionalDetailsForm = this.fb.group({
      canteenSmartCard: ['', Validators.required],
      echs: ['', Validators.required],
      coi: ['', Validators.required],
      residentCertificate: ['', Validators.required],
      serviceCertifications: [''],
      civilCertifications: [''],
      remarks: ['']
    });

    this.onAliveStatusChange();
  }

  createDependentForm() {
    return this.fb.group({
      firstName: [''],
      lastName: [''],
      relation: ['', Validators.required]
    });
  }

  formatAadharNumber() {
    let aadharControl = this.personalDetailsForm.get('aadharNumber');
    if (aadharControl) {
      let value = aadharControl.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      aadharControl.setValue(value, { emitEvent: false });
    }
  }

  onAliveStatusChange() {
    this.personalDetailsForm.get('aliveStatus')?.valueChanges.subscribe(status => {
      if (status === 'Expired') {
        this.showDateWhenExpired = true;
        this.personalDetailsForm.get('dateWhenExpired')?.setValidators([Validators.required, Validators.pattern('^\\d{2}/\\d{2}/\\d{4}$')]);
      } else {
        this.showDateWhenExpired = false;
        this.personalDetailsForm.get('dateWhenExpired')?.clearValidators();
        this.personalDetailsForm.get('dateWhenExpired')?.reset();
      }
      this.personalDetailsForm.get('dateWhenExpired')?.updateValueAndValidity();
    });
  }

  submitCard(cardNumber: number) {
    switch (cardNumber) {
      case 1:
        if (this.personalDetailsForm.valid) this.currentCard++;
        break;
      case 2:
        if (this.serviceDetailsForm.valid) this.currentCard++;
        break;
      case 3:
        if (this.bankDetailsForm.valid) this.currentCard++;
        break;
      case 4:
        if (this.familyDetailsForm.valid) this.currentCard++;
        break;
      case 5:
        if (this.additionalDetailsForm.valid) this.currentCard++;
        break;
    }
  }
}