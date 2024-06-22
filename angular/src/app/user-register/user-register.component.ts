import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {
  MAT_DATE_FORMATS,
  DateAdapter,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatStepper } from '@angular/material/stepper';
import { MatStepperModule } from '@angular/material/stepper';
import { Header3Component } from '../header3/header.component';

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
    Header3Component,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardTitle,
    MatCardSubtitle,
    NgIf,
    MatSelectModule,
    MatStepperModule,
    MatFormFieldModule,
    CommonModule,
    MatIconModule,
    MatStepper,
    MatProgressBarModule,
  ],
})
export class UserRegisterComponent {
  personalDetailsForm: FormGroup;
  serviceDetailsForm: FormGroup;
  bankDetailsForm: FormGroup;
  familyDetailsForm: FormGroup;
  additionalDetailsForm: FormGroup;

  currentCard = 1;
  totalCards = 5;
  showDateWhenExpired: boolean = false;
  formGroup!: FormGroup<any>;
  formArray: any;
  firstFormGroup = this.fb.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this.fb.group({
    secondCtrl: ['', Validators.required],
  });

  educationOptions: string[] = [
    'No Formal Education',
    'Secondary',
    'Senior Secondary',
    'Diploma',
    'Graduate',
    'Post-Graduate',
    'Doctorate',
  ];

  districtOptions: string[] = [
    'Gangtok',
    'Gyalshing',
    'Mangan',
    'Namchi',
    'Pakyong',
    'Soreng',
  ];

  commissionOptions: string[] = [
    'Commissioned Officer (CO)',
    'Junior-Commissioned Officer (JCO)',
    'Non-Commissioned Officer (NCO)',
  ];

  armyRanks: string[] = [
    'Field Marshal',
    'General',
    'Lieutenant General',
    'Brigadier',
    'Colonel',
    'Lieutenant Colonel',
    'Major',
    'Captain',
    'Lieutenant',
    'Subedar Major',
    'Subedar',
    'Naib Subedar',
    'Havildar',
    'Naik',
    'Lance Naik',
    'Sepoy',
  ];

  navyRanks: string[] = [
    'Admiral of the Fleet',
    'Admiral',
    'Vice Admiral',
    'Captain',
    'Commander',
    'Lieutenant Commander',
    'Lieutenant',
    'Sub Lieutenant',
    'Master Chief Petty Officer 1st Class',
    'Master Chief Petty Officer 2nd Class',
    'Chief Petty Officer',
    'Petty Officer',
    'Able Seaman',
    'Leading Seaman',
    'Seaman',
  ];

  airForceRanks: string[] = [
    'Marshal of the Indian Air Force',
    'Air Chief Marshal',
    'Air Marshal',
    'Air Vice Marshal',
    'Air Commodore',
    'Group Captain',
    'Wing Commander',
    'Squadron Leader',
    'Flight Lieutenant',
    'Flying Officer',
    'Master Warrant Officer',
    'Warrant Officer',
    'Junior Warrant Officer',
    'Sergeant',
    'Corporal',
    'Leading Aircraftsman',
    'Aircraftsman',
  ];

  accountTypes: string[] = ['Joint', 'Single'];

  relationOptions: string[] = ['Daughter', 'Father', 'Mother', 'Son', 'Wife'];

  constructor(private fb: FormBuilder) {
    this.personalDetailsForm = this.fb.group({
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      uniqueId: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')],
      ],
      contactNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{10}$')],
      ],
      aadharNumber: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{4} [0-9]{4} [0-9]{4}$'),
        ],
      ],
      email: ['', [Validators.email]],
      dateOfBirth: [
        '',
        [Validators.required, Validators.pattern('^\\d{4}-\\d{2}-\\d{2}$')],
      ],
      aliveStatus: ['', Validators.required],
      dateWhenExpired: [''],
      address: this.fb.group({
        address: ['', Validators.required],
      }),
      district: ['', Validators.required]
    });

    this.serviceDetailsForm = this.fb.group({
      commission: ['', Validators.required],
      corps: ['', Validators.required],
      rank: ['', Validators.required],
      dateOfEnrollment: [
        '',
        [Validators.required, Validators.pattern('^\\d{4}-\\d{2}-\\d{2}$')],
      ],
      dateOfRetirement: [
        '',
        [Validators.required, Validators.pattern('^\\d{4}-\\d{2}-\\d{2}$')],
      ],
    });

    this.bankDetailsForm = this.fb.group({
      panNumber: [
        '',
        [Validators.required, Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}$')],
      ],
      bankName: [''],
      ifscCode: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')],
      ],
      accountType: ['', Validators.required],
      accountNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9]+$')],
      ],
      ppoNumber: ['', [Validators.required, Validators.pattern('^[0-9]{12}$')]],
    });

    this.familyDetailsForm = this.fb.group({
      nextOfKin: this.fb.group({
        firstName: [''],
        lastName: [''],
        relation: ['', Validators.required],
      }),
      dependents: this.fb.array([]),
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
      remarks: [''],
    });

    this.onAliveStatusChange();
  }

  updateRanks(corps: string) {
    const rankControl = this.serviceDetailsForm.get('rank');
    let availableRanks: string[] = [];

    switch (corps) {
      case 'Indian Army':
        availableRanks = this.armyRanks;
        break;
      case 'Indian Navy':
        availableRanks = this.navyRanks;
        break;
      case 'Indian Air Force':
        availableRanks = this.airForceRanks;
        break;
      default:
        availableRanks = [];
        break;
    }

    rankControl?.setValue(null);
    // Optionally, you can update rank options in the template based on availableRanks
  }

  calculateProgress(): number {
    return (this.currentCard - 1) * (100 / this.totalCards);
  }

  createDependentForm(): FormGroup {
    return this.fb.group({
      firstName: [''],
      lastName: [''],
      relation: ['', Validators.required],
    });
  }

  get dependents(): FormArray {
    return this.familyDetailsForm.get('dependents') as FormArray;
  }

  addDependent() {
    this.dependents.push(this.createDependentForm());
  }

  removeDependent(index: number) {
    this.dependents.removeAt(index);
  }

  dependentsValid(): boolean {
    return this.dependents.controls.every(
      (dependent) => dependent.get('relation')?.valid
    );
  }

  formatAadharNumber() {
    const aadharControl = this.personalDetailsForm.get('aadharNumber');
    if (aadharControl) {
      const value = aadharControl.value
        .replace(/\s/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim();
      aadharControl.setValue(value, { emitEvent: false });
    }
  }

  onAliveStatusChange() {
    this.personalDetailsForm
      .get('aliveStatus')
      ?.valueChanges.subscribe((status) => {
        const dateWhenExpiredControl =
          this.personalDetailsForm.get('dateWhenExpired');
        if (status === 'Expired') {
          this.showDateWhenExpired = true;
          dateWhenExpiredControl?.setValidators([
            Validators.required,
            Validators.pattern('^\\d{4}-\\d{2}-\\d{2}$'),
          ]);
        } else {
          this.showDateWhenExpired = false;
          dateWhenExpiredControl?.clearValidators();
          dateWhenExpiredControl?.reset();
        }
        dateWhenExpiredControl?.updateValueAndValidity();
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
    this.serviceCertifications.push(
      this.fb.group({
        name: [''],
        place: [''],
        date: [''],
      })
    );
  }

  get serviceCertifications(): FormArray {
    return this.additionalDetailsForm.get('serviceCertifications') as FormArray;
  }

  removeServiceCertification(index: number) {
    this.serviceCertifications.removeAt(index);
  }

  addCivilCertification() {
    this.civilCertifications.push(
      this.fb.group({
        name: [''],
        place: [''],
        date: [''],
      })
    );
  }

  get civilCertifications(): FormArray {
    return this.additionalDetailsForm.get('civilCertifications') as FormArray;
  }

  removeCivilCertification(index: number) {
    this.civilCertifications.removeAt(index);
  }

  addServiceAward() {
    this.serviceAwards.push(
      this.fb.group({
        name: [''],
        date: [''],
      })
    );
  }

  get serviceAwards(): FormArray {
    return this.additionalDetailsForm.get('serviceAwards') as FormArray;
  }

  removeServiceAward(index: number) {
    this.serviceAwards.removeAt(index);
  }

  addCivilAward() {
    this.civilAwards.push(
      this.fb.group({
        name: [''],
        date: [''],
      })
    );
  }

  get civilAwards(): FormArray {
    return this.additionalDetailsForm.get('civilAwards') as FormArray;
  }

  removeCivilAward(index: number) {
    this.civilAwards.removeAt(index);
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
        if (this.familyDetailsForm.valid && this.dependentsValid())
          this.moveToNextCard();
        break;
      case 5:
        if (this.additionalDetailsForm.valid) this.moveToNextCard();
        break;
    }
  }
}