import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

interface Detail {
  field: string;
  value: string;
}

@Component({
  selector: 'app-userdetails',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    MatCardModule,
    MatTableModule,
    MatGridListModule,
    MatInputModule,
    MatSelectModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  templateUrl: './userdetails.component.html',
  styleUrls: ['./userdetails.component.css']
})
export class UserdetailsComponent implements OnInit {

  personalDetailsForm: FormGroup;
  serviceDetailsForm: FormGroup;
  bankDetailsForm: FormGroup;

  displayedColumns: string[] = ['field', 'value'];

  personalDetails: Detail[] = [
    { field: 'First Name', value: '' },
    { field: 'Middle Name', value: '' },
    { field: 'Last Name', value: '' },
    { field: 'UID', value: '' },
    { field: 'Contact Number', value: '' },
    { field: 'Aadhar Number', value: '' },
    { field: 'Email', value: '' },
    { field: 'Address', value: '' },
    { field: 'District', value: '' },
    { field: 'Date Of Birth(YYYY-MM-DD)', value: '' },
    { field: 'Alive/Expired', value: '' },
    { field: 'Date When Expired(YYYY-MM-DD)', value: '' },
  ];

  serviceDetails: Detail[] = [
    { field: 'Commission', value: '' },
    { field: 'Corps', value: '' },
    { field: 'Date of Enrollment(YYYY-MM-DD)', value: '' },
    { field: 'Date of Retirement(YYYY-MM-DD)', value: '' },
  ];

  bankDetails: Detail[] = [
    { field: 'PAN Number', value: '' },
    { field: 'Bank Name', value: '' },
    { field: 'IFSC Code', value: '' },
    { field: 'Account Type', value: '' },
    { field: 'Account Number', value: '' },
    { field: 'PPO Number', value: '' },
  ];

  constructor(private fb: FormBuilder) {
    this.personalDetailsForm = this.fb.group({
      firstName: [''],
      middleName: [''],
      lastName: [''],
      uid: [''],
      contactNumber: [''],
      aadharNumber: [''],
      email: [''],
      address: [''],
      district: [''],
      dateOfBirth: [''],
      aliveExpired: [''],
      dateWhenExpired: ['']
    });

    this.serviceDetailsForm = this.fb.group({
      commission: [''],
      corps: [''],
      dateOfEnrollment: [''],
      dateOfRetirement: ['']
    });

    this.bankDetailsForm = this.fb.group({
      panNumber: [''],
      bankName: [''],
      ifscCode: [''],
      accountType: [''],
      accountNumber: [''],
      ppoNumber: ['']
    });
  }

  ngOnInit() {
    this.loadPersonalDetails();
    this.loadServiceDetails();
    this.loadBankDetails();
  }

  loadPersonalDetails() {
    // Replace with actual data fetching logic
    const personalData = {
      firstName: 'John',
      middleName: '',
      lastName: 'Doe',
      uid: '123456',
      contactNumber: '9876543210',
      aadharNumber: '1234 5678 9101',
      email: 'john.doe@example.com',
      address: '123 Main St',
      district: 1,
      dateOfBirth: '1980-01-01',
      aliveExpired: 'Alive',
      dateWhenExpired: null
    };

    this.updateDetails(this.personalDetails, personalData);

    const districtMap: { [key: number]: string } = {
      1: 'Gangtok',
      2: 'Gyalshing',
      3: 'Namchi'
    };

    const districtField = this.personalDetails.find(detail => detail.field === 'District');
    if (districtField) {
      districtField.value = districtMap[personalData.district] || 'Unknown';
    }

    const middleNameField = this.personalDetails.find(detail => detail.field === 'Middle Name');
    if (middleNameField) {
      middleNameField.value = personalData.middleName?.trim() !== '' ? personalData.middleName : '---';
    }

    const dateWhenExpiredField = this.personalDetails.find(detail => detail.field === 'Date When Expired(YYYY-MM-DD)');
    if (dateWhenExpiredField) {
      dateWhenExpiredField.value = personalData.dateWhenExpired ? personalData.dateWhenExpired : '---';
    }
  }

  loadServiceDetails() {
    // Replace with actual data fetching logic
    const serviceData = {
      commission: 1,
      corps: 1,
      dateOfEnrollment: '2000-01-01',
      dateOfRetirement: '2020-01-01'
    };

    this.updateDetails(this.serviceDetails, serviceData);

    const commissionMap: { [key: number]: string } = {
      1: 'Commissioned Officer(CO)',
      2: 'Junior-Commissioned Officer(JCO)',
      3: 'Non-Commissioned Officer(NCO)'
    };

    const commissionField = this.serviceDetails.find(detail => detail.field === 'Commission');
    if (commissionField) {
      commissionField.value = commissionMap[serviceData.commission] || 'Unknown';
    }

    const corpsMap: { [key: number]: string } = {
      1: 'Indian Army',
      2: 'Indian Navy',
      3: 'Indian Air Force'
    };

    const corpsField = this.serviceDetails.find(detail => detail.field === 'Corps');
    if (corpsField) {
      corpsField.value = corpsMap[serviceData.corps] || 'Unknown';
    }
  }

  loadBankDetails() {
    // Replace with actual data fetching logic
    const bankData = {
      panNumber: 'ABCDE1234F',
      bankName: 'State Bank of India',
      ifscCode: 'SBIN0001234',
      accountType: 'Savings',
      accountNumber: '1234567890',
      ppoNumber: 'PPO123456'
    };

    this.updateDetails(this.bankDetails, bankData);
  }

  private updateDetails(details: Detail[], data: { [key: string]: any }) {
    details.forEach(detail => {
      const key = this.camelCase(detail.field) as keyof typeof data;
      detail.value = data[key] !== undefined ? String(data[key]) : '';
    });
  }

  private camelCase(str: string): string {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
      index === 0 ? word.toLowerCase() : word.toUpperCase()
    ).replace(/\s+/g, '');
  }
}
