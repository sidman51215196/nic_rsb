import { Component, SecurityContext } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
  AbstractControl,
} from "@angular/forms";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { Router } from "@angular/router";
import { MatCardTitle, MatCardSubtitle } from "@angular/material/card";
import { NgIf } from "@angular/common";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { HttpClientModule } from "@angular/common/http";
import { Header3Component } from "../header3/header.component";
import { MatStepper } from "@angular/material/stepper";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTableModule } from "@angular/material/table";
import { MatTableDataSource } from "@angular/material/table";
import { FooterComponent } from "../footer/footer.component";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { LocalStorageService } from "../services/local-storage.service";

interface ImagePreview {
  image: string | ArrayBuffer | null;
  date: string;
  remarks: string;
}
interface ServicePreview {
  image: string | ArrayBuffer | null;
  date: string;
  remarks: string;
}
interface CivilPreview {
  image: string | ArrayBuffer | null;
  date: string;
  remarks: string;
}
@Component({
  selector: "app-user-register",
  templateUrl: "./user-register.component.html",
  styleUrls: ["./user-register.component.css"],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatStepperModule,
    MatTableModule,
    MatStepper,
    MatInputModule,
    MatButtonModule,
    MatCardTitle,
    Header3Component,
    MatCardSubtitle,
    NgIf,
    MatSelectModule,
    MatFormFieldModule,
    CommonModule,
    MatIconModule,
    MatProgressBarModule,
    HttpClientModule,
    FooterComponent,
  ],
})
export class UserRegisterComponent {
 
  
  awarddetails: FormGroup;
  certificationForm: FormGroup;
  civilcertificationForm:FormGroup
  personalDetailsForm: FormGroup;
  serviceDetailsForm: FormGroup;
  bankDetailsForm: FormGroup;
  familyDetailsForm: FormGroup;
  additionalDetailsForm: FormGroup;
  currentCard = 1;
  totalCards = 5;
  showDateWhenExpired = false;
  showResCert = false;
  selectedFiles: { file: File, awardIndex: number }[] = [];
  imagePreviews: { image: string, date: string, remarks: string }[] = [];
  serviceImagePreviews: { image: string, date: string, remarks: string }[] = [];
  civilImagePreviews: { image: string, date: string, remarks: string }[] = [];
  uniqueId: number = 0;

 

  isPreviewVisible = false;
  isServicePreviewVisible = false;
  isCivilPreviewVisible = false;

  commissionOptions: { value: number; label: string }[] = [
    { value: 1, label: "Commissioned Officer (CO)" },
    { value: 2, label: "Junior-Commissioned Officer (JCO)" },
    { value: 3, label: "Non-Commissioned Officer (NCO)" },
  ];

  corpsOptions: { value: number; label: string }[] = [
    { value: 1, label: "Indian Army" },
    { value: 2, label: "Indian Navy" },
    { value: 3, label: "Indian Air Force" },
  ];

  districtChoices = [
    { value: 1, label: "Gangtok" },
    { value: 2, label: "Gyalshing" },
    { value: 3, label: "Namchi" },
  ];

  accountTypes: string[] = ["Single", "Joint"];

  relationOptions: { value: number; label: string }[] = [
    { value: 1, label: "Father" },
    { value: 2, label: "Mother" },
    { value: 3, label: "Son" },
    { value: 4, label: "Daughter" },
    { value: 5, label: "Wife" },
    { value: 6, label: "Husband" },
    { value: 7, label: "Brother" },
    { value: 8, label: "Sister" },
  ];

  dataSource!: MatTableDataSource<any>;
  columnsToDisplay = ["field", "value"];
  stepper: any;
  cert: any;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
    this.personalDetailsForm = this.fb.group({
      firstName: ["", Validators.required],
      middleName: [""],
      lastName: ["", Validators.required],
      uniqueId: [
        "",
         ,
      ],
      contactNumber: [
        "",
        [],
      ],
      aadharNumber: [
        "",
        [
          
        ],
      ],
      email: ["",],
      dateOfBirth: [
        "",
        [],
      ],
      aliveStatus: ["",],
      dateWhenExpired: [""],
      district: ["",],
      address: this.fb.group({
        address: [""],
      }),
    });

    this.serviceDetailsForm = this.fb.group({
      commission: ["",],
      corps: ["",],
      dateOfEnrollment: [
        "",
        [],
      ],
      dateOfRetirement: [
        "",
        [],
      ],
    });

    this.bankDetailsForm = this.fb.group({
      panNumber: [
        "",
        [],
      ],
      bankName: [""],
      ifscCode: [
        "",
        [],
      ],
      accountType: ["",],
      accountNumber: [
        "",
        [],
      ],
      ppoNumber: ["", []],
    });

    this.familyDetailsForm = this.fb.group({
      nextOfKin: this.fb.group({
        firstName: [""],
        lastName: [""],
        relation: ["", ],
      }),
      dependents: this.fb.array([]),
    });
     
    this.awarddetails = this.fb.group({
      awards: this.fb.array([])
    });

    this.certificationForm = this.fb.group({
      serviceCertifications: this.fb.array([])
    });
    
    this.civilcertificationForm = this.fb.group({
      civilCertifications: this.fb.array([])
    });
  

    this.additionalDetailsForm = this.fb.group({
      canteenSmartCard: ["",],
      echs: ["",],
      coi: ["",],
      residentCertificate: [""],
      date: ["",],
      serviceCertifications: this.certificationForm,  
      civilCertifications: this.civilcertificationForm,  
      awards: this.awarddetails,
      remarks: [""],
    });

    this.onAliveStatusChange(), this.COIstatusChange();
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.getSummaryData());
  }
 
  getSummaryData() {
    return [
      {
        field: "Name",
        value: this.personalDetailsForm.get("firstName")?.value+" "+this.personalDetailsForm.get("middleName")?.value+" "
              +this.personalDetailsForm.get("lastName")?.value,
      },
      {
        field: "Unique ID",
        value: this.personalDetailsForm.get("uniqueId")?.value,
      },
      {
        field: "Contact Number",
        value: this.personalDetailsForm.get("contactNumber")?.value,
      },
      {
        field: "Aadhar Number",
        value: this.personalDetailsForm.get("aadharNumber")?.value,
      },
      { field: "Email", value: this.personalDetailsForm.get("email")?.value },
      {
        field: "Address",
        value: this.personalDetailsForm.get("address.address")?.value,
      },
      {
        field: "District",
        value:
          this.personalDetailsForm.get("district")?.value === 1
            ? "Gangtok"
            : this.personalDetailsForm.get("district")?.value === 2
            ? "Gyalshing"
            : this.personalDetailsForm.get("district")?.value === 3
            ? "Namchi"
            : this.personalDetailsForm.get("district")?.value,
      },
      {
        field: "Date of Birth",
        value: this.personalDetailsForm.get("dateOfBirth")?.value,
      },
      {
        field: "Alive/Expired",
        value: this.personalDetailsForm.get("aliveStatus")?.value,
      },
      {
        field: "Date When Expired",
        value:
          this.personalDetailsForm.get("dateWhenExpired")?.value !== null
            ? this.personalDetailsForm.get("dateWhenExpired")?.value
            : "---",
      },
      {
        field: "Commission",
        value:
          this.serviceDetailsForm.get("commission")?.value === 1
            ? "Commissioned Officer(CO)"
            : this.serviceDetailsForm.get("commission")?.value === 2
            ? "Junior-Commissioned Officer(JCO)"
            : this.serviceDetailsForm.get("commission")?.value === 3
            ? "Non-Commissioned Officer(NCO)"
            : this.serviceDetailsForm.get("commission")?.value,
      },
      {
        field: "Corps",
        value:
          this.serviceDetailsForm.get("corps")?.value === 1
            ? "Indian Army"
            : this.serviceDetailsForm.get("corps")?.value === 2
            ? "Indian Navy"
            : this.serviceDetailsForm.get("corps")?.value === 3
            ? "Indian Air Force"
            : this.serviceDetailsForm.get("corps")?.value,
      },
      {
        field: "Date of Enrollment",
        value: this.serviceDetailsForm.get("dateOfEnrollment")?.value,
      },
      {
        field: "Date of Retirement",
        value: this.serviceDetailsForm.get("dateOfRetirement")?.value,
      },
      {
        field: "PAN Number",
        value: this.bankDetailsForm.get("panNumber")?.value,
      },
      {
        field: "Bank Name",
        value: this.bankDetailsForm.get("bankName")?.value,
      },
      {
        field: "IFSC Code",
        value: this.bankDetailsForm.get("ifscCode")?.value,
      },
      {
        field: "Account Type",
        value: this.bankDetailsForm.get("accountType")?.value,
      },
      {
        field: "Account Number",
        value: this.bankDetailsForm.get("accountNumber")?.value,
      },
      {
        field: "PPO Number",
        value: this.bankDetailsForm.get("ppoNumber")?.value,
      },
      {
        field: "Next of Kin",
        value: this.familyDetailsForm.get("nextOfKin.firstName")?.value+" "+this.familyDetailsForm.get("nextOfKin.lastName")?.value+" ("+ this.getRelationLabel(
          this.familyDetailsForm.get("nextOfKin.relation")?.value
        )+")",
      },
      
      {
        field: "Canteen Smart Card",
        value: this.additionalDetailsForm.get("canteenSmartCard")?.value,
      },
      { field: "ECHS", value: this.additionalDetailsForm.get("echs")?.value },
      { field: "COI", value: this.additionalDetailsForm.get("coi")?.value },
      {
        field: "Resident Certificate",
        value: this.additionalDetailsForm.get("coi")?.value === "No"
          ? (this.additionalDetailsForm.get("residentCertificate")?.value ? this.additionalDetailsForm.get("residentCertificate")?.value : "---") : "---"
      },
      
      
    ];
  }
  getPersonalDetails() {
    const personalDetails = this.getSummaryData().filter(item => {
      return ['Name', 'Unique ID', 'Contact Number', 'Aadhar Number', 'Email', 'Address', 'District', 'Date of Birth', 'Alive/Expired', 'Date When Expired'].includes(item.field);
    });
    return personalDetails;
  }

  getServiceDetails(){
    const serviceDetails = this.getSummaryData().filter(item => {
      return ['Commission', 'Corps', 'Date of Enrollment', 'Date of Retirement'].includes(item.field);
    });
    return serviceDetails;
  }

  getBankDetails(){
    const bankDetails = this.getSummaryData().filter(item => {
      return ['PAN Number', 'Bank Name', 'IFSC Code', 'Account Type', 'Account Number', 'PPO Number'].includes(item.field);
    });
    return bankDetails;
  }
  getFamilyDetails(){
    const familyDetails = this.getSummaryData().filter(item => {
      return ['Next of Kin'].includes(item.field);
    });
    const dependentsSummary =
      this.familyDetailsForm
        .get("dependents")
        ?.value.map((dependent: any, index: number) => [
          {
            field: `Dependent ${index + 1}`,
            value: dependent.firstName+" "+dependent.lastName+" ("+this.getRelationLabel(dependent.relation)+")"
          }
        ])
        .flat() || [];
    return [...familyDetails, ...dependentsSummary];
  }
  getRelationLabel(value: number): string {
    const relation = this.relationOptions.find(option => option.value === value);
    return relation ? relation.label : value.toString();
  }

  getAdditionalDetails() {
    const additionalDetails = [];
  
    if (this.additionalDetailsForm) {
      const additionalData = this.additionalDetailsForm.value;
      
      additionalDetails.push({ field: 'Canteen Smart Card', value: additionalData.canteenSmartCard });
      additionalDetails.push({ field: 'ECHS', value: additionalData.echs });
      additionalDetails.push({ field: 'COI', value: additionalData.coi });
      
      if (this.showResCert) {
        additionalDetails.push({ field: 'Resident Certificate', value: additionalData.residentCertificate });
      }
       this.civilcertificationForm.value.civilCertifications.forEach((civilcert: { date: any; remarks: any; }, index: number) => {
        additionalDetails.push({ field: `civil Certification ${index + 1} Image`, value: this.civilImagePreviews[index]?.image});
        additionalDetails.push({ field: `civil Certification ${index + 1} Date`, value: civilcert.date });
        additionalDetails.push({ field: `civil Certification ${index + 1} Remarks`, value: civilcert.remarks });
      });
      this.certificationForm.value.serviceCertifications.forEach((cert: { date: any; remarks: any; }, index: number) => {
        additionalDetails.push({ field: `Service Certification ${index + 1} Image`, value: this.serviceImagePreviews[index]?.image });
        additionalDetails.push({ field: `Service Certification ${index + 1} Date`, value: cert.date });
        additionalDetails.push({ field: `Service Certification ${index + 1} Remarks`, value: cert.remarks });
    });
      this.awarddetails.value.awards.forEach((award: { date: any; remarks: any; }, index: number) => {
        additionalDetails.push({ field: `Award ${index + 1} Image`, value: this.imagePreviews[index]?.image });
        additionalDetails.push({ field: `Award ${index + 1} Date`, value:award.date });
        additionalDetails.push({ field: `Award ${index + 1} Remarks`, value:award.remarks });
      });  
      additionalDetails.push({ field: 'Remarks', value: additionalData.remarks });
    }
    return additionalDetails;
  }
  
isImage(value: any): value is SafeUrl {
  return typeof value === 'string' && (value.startsWith('data:image/') || /\.(jpeg|jpg|gif|png)$/i.test(value));
}
fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

  onSubmit() {
    if (
      this.personalDetailsForm.valid &&
       this.serviceDetailsForm.valid &&
       this.bankDetailsForm.valid &&
        this.familyDetailsForm.valid && 
       this.additionalDetailsForm.valid &&
       this.civilcertificationForm.valid &&
       this.certificationForm.valid &&
       this.awarddetails.valid
    ) {
 

const civildetails = this.civilcertificationForm.value.civilCertifications.map((civilcert: any,index: number) => ({
  
      award_image: this.civilImagePreviews[index]?.image,
      received_date: civilcert.date,
      remarks: civilcert.remarks,
  })) || [];
 
const servicedetails = this.certificationForm.value.serviceCertifications.map((service: any, index: number) => ({
  award_image: this.serviceImagePreviews[index]?.image,
  received_date: service.date,
  remarks: service.remarks,
})) || [];

const awarddetails = this.awarddetails.value.awards.map((award: any, index: number) =>
({
  award_image: this.imagePreviews[index]?.image,
  recieved_date:award.date,
  remarks: award.remarks
}))

  

console.log(servicedetails, 'Service Details');



      const formData = {
        Id_ic: this.personalDetailsForm.value.uniqueId,
        first_name: this.personalDetailsForm.value.firstName,
        middle_name: this.personalDetailsForm.value.middleName,
        last_name: this.personalDetailsForm.value.lastName,
        date_of_birth: this.personalDetailsForm.value.dateOfBirth,
        district: this.personalDetailsForm.value.district,
        address: this.personalDetailsForm.value.address.address,
        phone_number: this.personalDetailsForm.value.contactNumber,
        email: this.personalDetailsForm.value.email,
        aadhar_number: this.personalDetailsForm.value.aadharNumber,
        is_alive: this.personalDetailsForm.value.aliveStatus === "Alive",
        expiry_date: this.personalDetailsForm.value.dateWhenExpired || null,
        services: [
          {
            corps: this.serviceDetailsForm.value.corps,
            commission: this.serviceDetailsForm.value.commission,
            description: "Description of service", // Replace with actual description if available
            start_date: this.serviceDetailsForm.value.dateOfEnrollment,
            end_date: this.serviceDetailsForm.value.dateOfRetirement,
          },
        ],
        bankdetails: [
          {
            account_number: this.bankDetailsForm.value.accountNumber,
            pan_number: this.bankDetailsForm.value.panNumber,
            bank_name: this.bankDetailsForm.value.bankName,
            ifsc_code: this.bankDetailsForm.value.ifscCode,
            account_type: this.bankDetailsForm.value.accountType,
            ppo_number: this.bankDetailsForm.value.ppoNumber,
          },
        ],
        familydetails:[
          {
            first_name: this.familyDetailsForm.get("nextOfKin.firstName")?.value,
            last_name: this.familyDetailsForm.get("nextOfKin.lastName")?.value,
            relation: this.familyDetailsForm.get("nextOfKin.relation")?.value,
            
          }
        ],
        additionaldetails:[
          {
            canteen_smart_card: this.additionalDetailsForm.get("canteenSmartCard")?.value,
            echs: this.additionalDetailsForm.get("echs")?.value,
            coi: this.additionalDetailsForm.get("coi")?.value,
            resident_certificate: this.additionalDetailsForm.get("residentCertificate")?.value,
          },
        ],

        dependentdetails: this.familyDetailsForm.get('dependents')?.value.map((dependent: any) => ({
          first_name: dependent.firstName,
          last_name: dependent.lastName,
          relation: dependent.relation
        })) ,

        civildetails: civildetails,

        awarddetails:awarddetails,

        servicedetails:servicedetails,
        
      };
      console.log(formData);

      const url = "http://127.0.0.1:8000/sainikregistration";
      const headers = new HttpHeaders({ "Content-Type": "application/json" });

      this.http.post(url, formData, { headers }).subscribe(
      
        (response) => {
          console.log(formData,'form demo')
          console.log("Registration successful", response);
          alert("user registration successful");
          this.router.navigate(["/dashboard"]);
          
        },
        (error) => {
          console.log(formData,'form demo')
          console.error("Registration failed", error);
          alert("registration failed");
          
        }
      );
    } else {
      console.log("Form is invalid. Cannot submit.");
    }
  }

  updateRanks(corps: string) {
    switch (corps) {
      case "Indian Army":
      case "Indian Navy":
      case "Indian Air Force":
        this.serviceDetailsForm.get("rank")?.setValue(null);
        break;
      default:
        break;
    }
  }

  calculateProgress(): number {
    return (this.currentCard - 1) * (100 / this.totalCards);
  }

  formatAadharNumber() {
    const aadharControl = this.personalDetailsForm.get("aadharNumber");
    if (aadharControl) {
      const value = aadharControl.value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim();
      aadharControl.setValue(value, { emitEvent: false });
    }
  }

  onAliveStatusChange() {
    this.personalDetailsForm
      .get("aliveStatus")
      ?.valueChanges.subscribe((status) => {
        if (status === "Expired") {
          this.showDateWhenExpired = true;
          this.personalDetailsForm
            .get("dateWhenExpired")
            ?.setValidators([
              Validators.required,
              Validators.pattern("^\\d{4}-\\d{2}-\\d{2}$"),
            ]);
        } else {
          this.showDateWhenExpired = false;
          this.personalDetailsForm.get("dateWhenExpired")?.clearValidators();
          this.personalDetailsForm.get("dateWhenExpired")?.reset();
        }
        this.personalDetailsForm
          .get("dateWhenExpired")
          ?.updateValueAndValidity();
      });
  }

  COIstatusChange() {
    this.additionalDetailsForm.get("coi")?.valueChanges.subscribe((status) => {
      if (status === "No") {
        this.showResCert = true;
        this.additionalDetailsForm
          .get("residentCertificate")
          ?.setValidators([Validators.required]);
      } else {
        this.showResCert = false;
        this.personalDetailsForm.get("residentCertificate")?.clearValidators();
        this.personalDetailsForm.get("residentCertificate")?.reset();
      }
    });
  }

  moveToNextCard() {
    if (this.currentCard < this.totalCards) {
      this.currentCard++;
    }
  }

  createDependentForm(): FormGroup {
    return this.fb.group({
      firstName: [""],
      lastName: [""],
      relation: ["", Validators.required],
    });
  }

  get dependents(): FormArray {
    return this.familyDetailsForm.get("dependents") as FormArray;
  }

  addDependent() {
    const dependentForm = this.fb.group({
      firstName: [""],
      lastName: [""],
      relation: ["", Validators.required],
    });
    this.dependents.push(dependentForm);
  }

  removeDependent(index: number) {
    this.dependents.removeAt(index);
  }

  moveToPreviousCard() {
    if (this.currentCard > 1) {
      this.currentCard--;
    }
  }
  addServiceCertification() {
    this.serviceCertifications.push(
      this.fb.group({
        date: [''],
        remarks: [''],
        image: ['']    
      })
    );
  }
addCivilCertification(){
    this.civilCertifications.push(
      this.fb.group({
        date: [""],
        remarks: [""],
        image: [""]
    }))
  }
addAwards() {
    this.awards.push(
      this.fb.group({
        date: [""],
        remarks: [""],
        image: [""]
      })
    );
  }

get serviceCertifications(): FormArray {
    return this.certificationForm.get("serviceCertifications") as FormArray;
  }
get civilCertifications(): FormArray {
    return this.civilcertificationForm.get("civilCertifications") as FormArray;
  }
get awards(): FormArray {
    return this.awarddetails.get('awards') as FormArray;
  }
 
  handleFileChange(event: any, index: number, array: FormArray, previewArray: any[]) {
    const file = event.target.files[0];
    console.log(array, 'Form Array'); // Debug log to check array
    console.log(index, 'Index'); // Debug log to check index
    if (!array || !array.at) {
      console.error('Invalid FormArray or FormArray is not defined correctly.');
      return;
    }
    if (file && array.length > index && array.at(index)) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        previewArray[index] = {
          image: e.target.result,
          date: array.at(index).get('date')?.value,
          remarks: array.at(index).get('remarks')?.value
        };
        console.log(previewArray[index], 'Updated Preview');
      };
      reader.readAsDataURL(file);
    } else {
      console.error('Invalid index or array is not properly defined.');
    }
  }
  onFileChange(event: any, index: number) {
    this.handleFileChange(event, index, this.serviceCertifications, this.serviceImagePreviews);
  }

  onCivilFileChange(event: any, index: number) {
    this.handleFileChange(event, index, this.civilCertifications, this.civilImagePreviews);
  }
  
  onFilesSelected(event: any, index: number) {
    this.handleFileChange(event, index, this.awards, this.imagePreviews);
  }
  updatePreviews(formArray: FormArray, previewArray: any[]): any[] {
    return formArray.value.map((item: { date: string; remarks: string; }, index: number) => ({
        image: previewArray[index]?.image || '',
        date: item.date,
        remarks: item.remarks
    }));
}

showPreview() {
    this.imagePreviews = this.updatePreviews(this.awarddetails.get('awards') as FormArray, this.imagePreviews);
    this.isPreviewVisible = true;
}
showServicePreview() {
    this.serviceImagePreviews = this.updatePreviews(this.certificationForm.get('serviceCertifications') as FormArray, this.serviceImagePreviews);
    this.isServicePreviewVisible = true;
  }
showCivilPreview() {
    this.civilImagePreviews = this.updatePreviews(this.civilcertificationForm.get('civilCertifications') as FormArray, this.civilImagePreviews);
    this.isCivilPreviewVisible = true;
  }
openPreviewInNewTab(preview: { image: string | ArrayBuffer | null; date: string; remarks: string }): void {
    if (preview.image) {
      const newTab = window.open();
      if (newTab) {
        newTab.document.body.innerHTML = `
          <p>Date: ${preview.date}</p>
          <p>Remarks: ${preview.remarks}</p>
          <img src="${preview.image}" alt="Image Preview" style="width: 100%;">
        `;
      } else {
        console.error('Failed to open new tab');
      }
    }
  }
openInNewTab(preview: ImagePreview): void {
    this.openPreviewInNewTab(preview);
  }
  openService(preview:ServicePreview):void{
    this.openPreviewInNewTab(preview);

  }

openCivilInNewTab(preview: CivilPreview): void {
    this.openPreviewInNewTab(preview);
  } 
removeItem(index: number, formArray: FormArray, previewArray: any[]): void {
    formArray.removeAt(index);
    previewArray.splice(index, 1);
  } 
removeAward(index: number) {
    this.removeItem(index, this.awards, this.imagePreviews);
  }
  
removeService(index: number) {
    this.removeItem(index, this.serviceCertifications, this.serviceImagePreviews);
  }
  
removeCivil(index: number) {
    this.removeItem(index, this.civilCertifications, this.civilImagePreviews);
  }
  

}
