import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardTitle, MatCardSubtitle } from '@angular/material/card';
import { NgIf } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HttpClientModule } from '@angular/common/http';

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
    MatFormFieldModule,
    CommonModule,
    MatIconModule,
    MatProgressBarModule,
    HttpClientModule
  ]
})
export class UserRegisterComponent {
  personalDetailsForm: FormGroup;
  serviceDetailsForm: FormGroup;
  bankDetailsForm: FormGroup;
  familyDetailsForm: FormGroup;
  additionalDetailsForm: FormGroup; 
  currentCard = 1;
  totalCards = 5;
  showDateWhenExpired = false;

  commissionOptions: { value: number, label: string }[] = [
    { value: 1, label: 'Commissioned Officer (CO)' },
    { value: 2, label: 'Junior-Commissioned Officer (JCO)' },
    { value: 3, label: 'Non-Commissioned Officer (NCO)' }
  ];
  
  corpsOptions: { value: number, label: string }[] = [
    { value: 1, label: 'Indian Army Corps' },
    { value: 2, label: 'Indian Navy Corps' },
    { value: 3, label: 'Indian Air Force Corps' }
  ];

  districtChoices = [
    { value: 1, label: 'Gangtok' },
    { value: 2, label: 'Gyalshing' },
    { value: 3, label: 'Namchi' }
  ];

  accountTypes: string[] = [
    'joint', 'single'
  ];

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.personalDetailsForm = this.fb.group({
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      uniqueId: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]],
      contactNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      aadharNumber: ['', [Validators.required, Validators.pattern('^[0-9]{4} [0-9]{4} [0-9]{4}$')]],
      email: ['', Validators.email],
      dateOfBirth: ['', [Validators.required, Validators.pattern('^\\d{4}-\\d{2}-\\d{2}$')]],
      aliveStatus: ['', Validators.required],
      dateWhenExpired: [''],
      district:['',Validators.required],
      address: this.fb.group({
        address: ['']
      })
    });

    this.serviceDetailsForm = this.fb.group({
      commission: ['', Validators.required],
      corps: ['', Validators.required],
      dateOfEnrollment: ['', [Validators.required, Validators.pattern('^\\d{4}-\\d{2}-\\d{2}$')]],
      dateOfRetirement: ['', [Validators.required, Validators.pattern('^\\d{4}-\\d{2}-\\d{2}$')]]
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
      dependents: this.fb.array([])
    });

    this.additionalDetailsForm = this.fb.group({
      canteenSmartCard: ['', Validators.required],
      echs: ['', Validators.required],
      coi: ['', Validators.required],
      residentCertificate: ['', Validators.required],
      serviceCertifications: this.fb.array([]),
      civilCertifications: this.fb.array([]),
      serviceAwards: this.fb.array([]),
      civilAwards: this.fb.array([]),
      remarks: ['']
    });

    this.onAliveStatusChange();
  }

onSubmit() {
  if (this.personalDetailsForm.valid && this.serviceDetailsForm.valid && this.bankDetailsForm.valid) {
    const formData = {
      Id_ic: this.personalDetailsForm.value.uniqueId,
      first_name: this.personalDetailsForm.value.firstName,
      middle_name: this.personalDetailsForm.value.middleName,
      last_name: this.personalDetailsForm.value.lastName,
      date_of_birth: this.personalDetailsForm.value.dateOfBirth,
      district:this.personalDetailsForm.value.district,
      address: this.personalDetailsForm.value.address.address,
      phone_number: this.personalDetailsForm.value.contactNumber,
      email: this.personalDetailsForm.value.email,
      aadhar_number: this.personalDetailsForm.value.aadharNumber,
      is_alive: this.personalDetailsForm.value.aliveStatus === 'Alive',
      expiry_date: this.personalDetailsForm.value.dateWhenExpired || null,
      services: [
        {
          corps: this.serviceDetailsForm.value.corps,
          commission: this.serviceDetailsForm.value.commission,
          description: 'Description of service',  // Replace with actual description if available
          start_date: this.serviceDetailsForm.value.dateOfEnrollment,
          end_date: this.serviceDetailsForm.value.dateOfRetirement
        }
      ],
      bankdetails: [
        {
          account_number: this.bankDetailsForm.value.accountNumber,
          pan_number: this.bankDetailsForm.value.panNumber,
          bank_name: this.bankDetailsForm.value.bankName,
          ifsc_code: this.bankDetailsForm.value.ifscCode,
          account_type: this.bankDetailsForm.value.accountType,
          ppo_number: this.bankDetailsForm.value.ppoNumber
        }
      ]
    };

    const url = 'http://127.0.0.1:8000/sainikregistration';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post(url, formData, { headers })
      .subscribe(
        response => {
          console.log('Registration successful', response);
          // Optionally, reset the forms after successful submission
          // this.personalDetailsForm.reset();
          // this.serviceDetailsForm.reset();
          // this.bankDetailsForm.reset();
        },
        error => {
          console.error('Registration failed', error);
          // Handle error scenarios, such as displaying an error message
        }
      );
  } else {
    console.log('Form is invalid. Cannot submit.');
  }
}

  

  updateRanks(corps: string) {
    switch (corps) {
      case 'Indian Army':
      case 'Indian Navy':
      case 'Indian Air Force':
        this.serviceDetailsForm.get('rank')?.setValue(null);
        break;
      default:
        break;
    }
  }

  calculateProgress(): number {
    return (this.currentCard - 1) * (100 / this.totalCards);
  }

  formatAadharNumber() {
    const aadharControl = this.personalDetailsForm.get('aadharNumber');
    if (aadharControl) {
      const value = aadharControl.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      aadharControl.setValue(value, { emitEvent: false });
    }
  }

  onAliveStatusChange() {
    this.personalDetailsForm.get('aliveStatus')?.valueChanges.subscribe(status => {
      if (status === 'Expired') {
        this.showDateWhenExpired = true;
        this.personalDetailsForm.get('dateWhenExpired')?.setValidators([Validators.required, Validators.pattern('^\\d{4}-\\d{2}-\\d{2}$')]);
      } else {
        this.showDateWhenExpired = false;
        this.personalDetailsForm.get('dateWhenExpired')?.clearValidators();
        this.personalDetailsForm.get('dateWhenExpired')?.reset();
      }
      this.personalDetailsForm.get('dateWhenExpired')?.updateValueAndValidity();
    });
  }

  moveToNextCard() {
    if (this.currentCard < this.totalCards) {
      this.currentCard++;
    }
  }

  moveToPreviousCard() {
    if (this.currentCard > 1) {
      this.currentCard--;
    }
  }

  addServiceCertification() {
    const serviceCertificationsArray = this.additionalDetailsForm.get('serviceCertifications') as FormArray;
    serviceCertificationsArray.push(this.fb.group({
      name: [''],
      place: [''],
      date: ['']
    }));
  }

  get serviceCertifications(): FormArray {
    return this.additionalDetailsForm.get('serviceCertifications') as FormArray;
  }

  removeServiceCertification(index: number) {
    const serviceCertificationsArray = this.additionalDetailsForm.get('serviceCertifications') as FormArray;
    serviceCertificationsArray.removeAt(index);
  }

  submitCard(cardNumber: number) {
    switch (cardNumber) {
      case 1:
        if (this.personalDetailsForm.valid) this.moveToNextCard();
        break;
      case 2:
        if (this.serviceDetailsForm.valid) this.moveToNextCard();
        break;
      case 3:
        if (this.bankDetailsForm.valid) this.moveToNextCard();
        break;
      case 4:
        if (this.familyDetailsForm.valid) this.moveToNextCard();
        break;
      case 5:
        if (this.additionalDetailsForm.valid) this.onSubmit();
        break;
      default:
        break;
    }
  }
}