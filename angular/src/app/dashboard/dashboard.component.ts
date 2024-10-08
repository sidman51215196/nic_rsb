import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { LocalStorageService } from '../services/local-storage.service';
import { NgIf } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { Header2Component } from '../header2/header.component';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MatCard } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { ChangePasswordDialogueComponent } from '../change-password-dialogue/change-password-dialogue.component';
import { faL } from '@fortawesome/free-solid-svg-icons';


export interface SainikPersonalDetails {
  Id_ic: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  address: string;
  service_details_corps: string | null;
}

export interface SainikServiceDetails {
  corps: number;
  commission: number;
  description: string;
  start_date: string;
  end_date: string;
}

export interface SainikBankDetails {
  account_number: string;
  pan_number: string;
  bank_name: string;
  ifsc_code: string;
  account_type: string;
  ppo_number: string;
}

export interface SainikFamilyDetails {
  first_name: string;
  last_name: string;
  relation: string;
}

export interface SainikAdditionalDetails {
  canteenSmartCard: boolean;
  coi: boolean;
  residentCertificate: boolean;
  echs: boolean;
  esm:string;
  esamissuedate:string;
  esmPlaceOfIssue: number;
  highestqualification:number;
  eductaiondetails:string;
  
}


export interface SainikDetails {
  Id_ic: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  date_of_birth: string;
  district: number;
  address: string;
  pinCode:String
  phone_number: string;
  email: string;
  aadhar_number: string;
  is_alive: boolean;
  expiry_date: string | null;
  services: SainikServiceDetails[];
  bankdetails: SainikBankDetails[];
  familydetails: SainikFamilyDetails[];
  additionaldetails: SainikAdditionalDetails[];  
}



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatTableModule,
    MatGridListModule,
    MatInputModule,
    MatSelectModule,
    MatCard,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    NgIf,
    HeaderComponent,
    FooterComponent,
    Header2Component,
    MatTableModule,
    MatPaginatorModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule
  ],
  providers: [LocalStorageService],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] =  ['slNo', 'name', 'uid', 'address', 'dob', 'corps', 'view'];
  displayedColumnsDetails: string[] = ['field', 'value'];
  dataSource = new MatTableDataSource<SainikPersonalDetails>();
  totalRecords = 0;
  isHeaderVisible: boolean = false;
  dragging=false;
  profileImageForm!: FormGroup;
  imagePreview: string | ArrayBuffer | null=null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  userRole: number = 0;
  username: string = '';
  userdistrict: number = 0;
  pageSizeOptions: number[] = [5, 10];
  pageSize: number = 10;
  token: string | null = null;
  displaydetails:boolean=false;
  showProfileDetails:boolean=false;
  mainContent:boolean=true;
  profileData: { email: string, role: number, district: number } | null = null;


  personalDetailsForm!: FormGroup;
  serviceDetailsForm!: FormGroup;
  bankDetailsForm!: FormGroup;
  familyDetailsForm!: FormGroup;
  additionalDetailsForm!: FormGroup;

  editMode:boolean=false;
  displaydetailsEdit:boolean=false;


  selectedSainikDetails: SainikDetails | null = null;
  personalDetails: { field: string, value: any }[] = [];
  serviceDetails: { field: string, value: any }[] = [];
  bankDetails: { field: string, value: any }[] = [];
  familyDetails: { field: string, value: any }[] = [];
  additionalDetails: { field: string, value: any }[] = [];
  roleMapping: { [key: number]: string } = {
    1: 'Super Admin',
    2: 'Admin'
    // Add more roles as needed
  };

  districtMapping: { [key: number]: string } = {
    1: 'Gangtok',
    2: 'Gyalshing',
    3: 'Namchi'
    // Add more districts as needed
  };



  constructor(
    private localStorageService: LocalStorageService, 
    private http: HttpClient,
    public dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.userRole = this.localStorageService.getUserRole();
    this.username = this.localStorageService.getUsername();
    this.userdistrict = this.localStorageService.getUserDistrict();
    this.token = this.localStorageService.getToken();
    this.fetchData();

    this.personalDetailsForm = this.formBuilder.group({});
    this.serviceDetailsForm = this.formBuilder.group({});
    this.bankDetailsForm = this.formBuilder.group({});
    this.familyDetailsForm = this.formBuilder.group({});
    this.additionalDetailsForm = this.formBuilder.group({});
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  showProfile() {
    this.showProfileDetails = true;
    this.mainContent = false;
    this.displaydetails = false;

    this.profileData = { 
      email: this.username,
      role: this.userRole,
      district: this.userdistrict
    };
  }
  openEditDetails(element: SainikDetails){
    console.log('Data being sent to update-profile:', element);
    //this.router.navigate(['/update-profile'], { state: { data: element } });
    console.log('edit is clicked at dashboard');
  }
  getRoleName(role: number | undefined = 0): string {
    return this.roleMapping[role] || 'Unknown';
  }
  
  getDistrictName(district: number | undefined=0): string{
    return this.districtMapping[district] || 'Unknown';
  }

  openChangePasswordDialog(): void {
    const dialogRef = this.dialog.open(ChangePasswordDialogueComponent, {
      width: '400px'
    });
  }


  fetchData(pageIndex: number = 0, pageSize: number = 10): void {
    let url: string;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    if (this.userRole === 1) {
      url = `http://127.0.0.1:8000/listsainik`;
    } else if (this.userRole === 2) {
      url = `http://127.0.0.1:8000/sainikbydistrict/${this.userdistrict}`;
    } else {
      url = `http://127.0.0.1:8000/`;
    }

    this.http.get<{ total_count: number, sainiks: SainikPersonalDetails[] }>(url,{ headers })
      .pipe(
        catchError(error => {
          console.error('Error fetching data:', error);
          return throwError(error);
        })
      )
      .subscribe(
        response => {
          this.dataSource.data = response.sainiks;
          this.totalRecords = response.total_count;
        }
      );
  }

  pageChanged(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.fetchData(event.pageIndex, event.pageSize);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  viewDetails(element: SainikPersonalDetails): void {
    console.log('view button clicked')
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    const url = `http://127.0.0.1:8000/sainikdetailsbyid/${element.Id_ic}`;
    this.http.get<SainikDetails>(url, { headers })
      .pipe(
        catchError(error =>{
          console.error('Error fetching details:', error);
          return throwError(error);
        })
      )
      .subscribe(
        details => {
          this.displaydetails=true;
          this.mainContent=false;
          console.log(this.displaydetails,'displaydetails')
          console.log('View details for:', details);
          this.selectedSainikDetails = details;
          this.personalDetails = [
            { field: 'ID IC', value: details.Id_ic },
            { field: 'First Name', value: details.first_name },
            { field: 'Middle Name', value: details.middle_name },
            { field: 'Last Name', value: details.last_name },
            { field: 'Date of Birth', value: details.date_of_birth },
            { field: 'District', value: this.getDistrictName2(details.district) },
            { field: 'Address', value: details.address },
            { field:'PinCode',value: details.pinCode},
            { field: 'Phone Number', value: details.phone_number },
            { field: 'Email', value: details.email },
            { field: 'Aadhar Number', value: details.aadhar_number },
            { field: 'Is Alive', value: details.is_alive },
            { field: 'Expiry Date', value: details.expiry_date },
          ];

          this.serviceDetails = details.services.map(service => [
            { field: 'Corps', value: this.getCorpsName(service.corps) },
            { field: 'Description', value: service.description },
            { field: 'Commission', value: this.getCommissionName(service.commission) },
            { field: 'Start Date', value: service.start_date },
            { field: 'End Date', value: service.end_date }
          ]).flat();

          this.bankDetails = details.bankdetails.map(bank => [
            { field: 'Account Number', value: bank.account_number },
            { field: 'PAN Number', value: bank.pan_number },
            { field: 'Bank Name', value: bank.bank_name },
            { field: 'IFSC Code', value: bank.ifsc_code },
            { field: 'Account Type', value: bank.account_type },
            { field: 'PPO Number', value: bank.ppo_number }
          ]).flat();
          this.familyDetails = details.familydetails.map(family => [
            { field: 'First Name', value: family.first_name },
            { field: 'Last Name', value: family.last_name },
            { field: 'Relation', value: family.relation}
          ]).flat();
          this.additionalDetails = details.additionaldetails.map(additional => [
            { field: 'Canteen Smart Card', value: additional.canteenSmartCard ? 'Yes' : 'No' },
            { field: 'COI', value: additional.coi ? 'Yes' : 'No' },
            { field: 'Resident Certificate', value: additional.residentCertificate ? 'Yes' : 'No' },
            { field: 'ECHS', value: additional.echs ? 'Yes' : 'No' },
            { field: 'ESM Number', value: additional.esm},
            { field: 'ESM IssueDate', value: additional.esamissuedate},
            { field: 'ESM PlaceOfIssue', value: this.getEsmIssuePlace(additional.esmPlaceOfIssue)},
            { field: 'Highest Qualification', value: this.getHighestQualification(additional.highestqualification)},
            
          ]).flat();
        }
      );
  }
  getDistrictName2(district: number): string {
    const districtNames: { [key: number]: string } = {
      1: 'Gangtok',
      2: 'Gyalshing',
      3: 'Namchi'
    };
    return districtNames[district] || 'Unknown District';
  }
  getCorpsName(corps: number): string {
    const corpsNames: { [key: number]: string } = {
      1: 'Indian Army Corps',
      2: 'Indian Navy Corps',
      3: 'Indian Air Force Corps'
    };
    return corpsNames[corps] || 'Unknown Corps';
  }
  getEsmIssuePlace(issuePlace: number): string {
    const issuePlaces: { [key: number]: string } = {
      1: 'ZSB(NE)',
      2: 'ZSB(W)',
      3: 'ZSB(S)'
    };
    return issuePlaces[issuePlace] || 'Unknown Issue Place';
  }
  getRelationLabel(relationValue: number): string {
    const relationOptions: { value: number; label: string }[] = [
      { value: 1, label: "Father" },
      { value: 2, label: "Mother" },
      { value: 3, label: "Son" },
      { value: 4, label: "Daughter" },
      { value: 5, label: "Wife" },
      { value: 6, label: "Husband" },
      { value: 7, label: "Brother" },
      { value: 8, label: "Sister" },
    ];
  
    
    const relation = relationOptions.find(option => option.value === relationValue);
    
    return relation ? relation.label : 'Unknown Relation';
  }
  getHighestQualification(qualification: number): string {
    const qualifications: { [key: number]: string } = {
      1: 'below Class 10',
      2: 'Class X',
      3: 'Class XII',
      4: 'Under Graduate',
      5: 'Post Graduate'
    };
    return qualifications[qualification] || 'Unknown Qualification';
  }
  
  
  getCommissionName(commission: number): string{
    const commissionNames: { [key: number]: string } = {
      1: 'Commissioned Officer(CO)',
      2: 'Junior-Commissioned Officer(JCO)',
      3: 'Non-Commissioned Officer(NCO)'
    };
    return commissionNames[commission] || 'Unknown Corps';
  }

  goBack() {
    this.displaydetails = false;
    this.mainContent=true;
    this.showProfileDetails = false;
  }
}