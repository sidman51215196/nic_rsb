import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule, FormsModule } from '@angular/forms';
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
    MatProgressBarModule
  ]
})
export class UserRegisterComponent {
  personalDetailsForm: FormGroup;
  serviceDetailsForm: FormGroup;
  bankDetailsForm: FormGroup;
  familyDetailsForm: FormGroup;
  additionalDetailsForm: FormGroup;

  public i: number;
  currentCard = 1;
  totalCards = 5;
  showDateWhenExpired: boolean = false;

  
  
  commissionOptions: string[] = [
    'Commissioned Officer (CO)', 'Junior-Commissioned Officer (JCO)', 'Non-Commissioned Officer (NCO)'
  ];

  armyRanks: string[] = [
    'Field Marshal', 'General', 'Lieutenant General', 'Brigadier', 'Colonel', 'Lieutenant Colonel',
    'Major', 'Captain', 'Lieutenant', 'Subedar Major', 'Subedar', 'Naib Subedar', 'Havildar',
    'Naik', 'Lance Naik', 'Sepoy'
  ];

  navyRanks: string[] = [
    'Admiral of the Fleet', 'Admiral', 'Vice Admiral', 'Captain', 'Commander', 'Lieutenant Commander',
    'Lieutenant', 'Sub Lieutenant', 'Master Chief Petty Officer 1st Class', 'Master Chief Petty Officer 2nd Class',
    'Chief Petty Officer', 'Petty Officer', 'Able Seaman', 'Leading Seaman', 'Seaman'
  ];

  airForceRanks: string[] = [
    'Marshal of the Indian Air Force', 'Air Chief Marshal', 'Air Marshal', 'Air Vice Marshal', 'Air Commodore',
    'Group Captain', 'Wing Commander', 'Squadron Leader', 'Flight Lieutenant', 'Flying Officer',
    'Master Warrant Officer', 'Warrant Officer', 'Junior Warrant Officer', 'Sergeant', 'Corporal',
    'Leading Aircraftsman', 'Aircraftsman'
  ];

  accountTypes: string[] = [
    'Joint', 'Single'
  ];

  relationOptions: string[] = [
    'Daughter', 'Father', 'Mother', 'Son', 'Wife'
  ];

  constructor(private fb: FormBuilder) {
    this.i=0;
    this.personalDetailsForm = this.fb.group({
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      uniqueId: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]],
      contactNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      
      aadharNumber: ['', [Validators.required, Validators.pattern('^[0-9]{4} [0-9]{4} [0-9]{4}$')]],
      email: ['', [ Validators.email]],
      dateOfBirth: ['', [Validators.required, Validators.pattern('^\\d{2}/\\d{2}/\\d{4}$')]],
      aliveStatus: ['', Validators.required],
      dateWhenExpired: [''],
      address: this.fb.group({
        address:['']
        
      })
    });

    this.serviceDetailsForm = this.fb.group({
      commission: ['', Validators.required],
      corps: ['', Validators.required],
      
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
      dependents: this.fb.array([])
    });

    this.additionalDetailsForm = this.fb.group({
      canteenSmartCard: ['', Validators.required],
      echs: ['', Validators.required],
      coi: ['', Validators.required],
      residentCertificate: ['', Validators.required],
      serviceCertifications: this.fb.array([]), // FormArray for service certifications
      civilCertifications: this.fb.array([]),   // FormArray for civil certifications
      serviceAwards: this.fb.array([]),          // FormArray for service awards
      civilAwards: this.fb.array([]),            // FormArray for civil awards
      remarks: ['']
    });

    this.onAliveStatusChange();
  }

  updateRanks(corps: string) {
    switch (corps) {
    case 'Indian Army':
    this.serviceDetailsForm.get('rank')?.setValue(null); // Reset rank when corps changes
    break;
    case 'Indian Navy':
    this.serviceDetailsForm.get('rank')?.setValue(null); // Reset rank when corps changes
    break;
    case 'Indian Air Force':
    this.serviceDetailsForm.get('rank')?.setValue(null); // Reset rank when corps changes
    break;
    default:
    break;
    }
    }

  calculateProgress(): number {
    return (this.currentCard - 1) * (100 / this.totalCards);
  }

  createDependentForm(): FormGroup {
    return this.fb.group({
      firstName: [''],
      lastName: [''],
      relation: ['', Validators.required]
    });
  }

  get dependents(): FormArray {
    return this.familyDetailsForm.get('dependents') as FormArray;
  }

  // Function to add more dependents
  addDependent() {
    const dependentsArray = this.familyDetailsForm.get('dependents') as FormArray;
    dependentsArray.push(this.createDependentForm());
  }

  // Function to remove dependent by index
  removeDependent(index: number) {
    const dependentsArray = this.familyDetailsForm.get('dependents') as FormArray;
    dependentsArray.removeAt(index);
  }

  private dependentsValid(): boolean {
    const dependentsArray = this.familyDetailsForm.get('dependents') as FormArray;
    // Check if every dependent has a valid relation
    return dependentsArray.controls.every(dependent => dependent.get('relation')?.valid);
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

  addCivilCertification() {
    const civilCertificationsArray = this.additionalDetailsForm.get('civilCertifications') as FormArray;
    civilCertificationsArray.push(this.fb.group({
      name: [''],
      place: [''],
      date: ['']
    }));
  }

  get civilCertifications(): FormArray {
    return this.additionalDetailsForm.get('civilCertifications') as FormArray;
  }

  removeCivilCertification(index: number) {
    const civilCertificationsArray = this.additionalDetailsForm.get('civilCertifications') as FormArray;
    civilCertificationsArray.removeAt(index);
  }

  addServiceAward() {
    const serviceAwardsArray = this.additionalDetailsForm.get('serviceAwards') as FormArray;
    serviceAwardsArray.push(this.fb.group({
      name: [''],
      date: ['']
    }));
  }

  get serviceAwards(): FormArray {
    return this.additionalDetailsForm.get('serviceAwards') as FormArray;
  }

  removeServiceAward(index: number) {
    const serviceAwardsArray = this.additionalDetailsForm.get('serviceAwards') as FormArray;
    serviceAwardsArray.removeAt(index);
  }

  addCivilAward() {
    const civilAwardsArray = this.additionalDetailsForm.get('civilAwards') as FormArray;
    civilAwardsArray.push(this.fb.group({
      name: [''],
      date: ['']
    }));
  }

  get civilAwards(): FormArray {
    return this.additionalDetailsForm.get('civilAwards') as FormArray;
  }

  removeCivilAward(index: number) {
    const civilAwardsArray = this.additionalDetailsForm.get('civilAwards') as FormArray;
    civilAwardsArray.removeAt(index);
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
    if (this.familyDetailsForm.valid && this.dependentsValid()) this.currentCard++;
    break;
    case 5:
    if (this.additionalDetailsForm.valid) this.currentCard++;
    break;
    }
  }


}