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
  personalDetailsForm: FormGroup;
  serviceDetailsForm: FormGroup;
  bankDetailsForm: FormGroup;
  familyDetailsForm: FormGroup;
  additionalDetailsForm: FormGroup;
  currentCard = 1;
  totalCards = 5;
  showDateWhenExpired = false;
  showResCert = false;
  serviceImagePreviews: { [key: number]: string | ArrayBuffer | null } = {};
  civilImagePreviews: { [key: number]: string | ArrayBuffer | null } = {};
  draggingService: number | null = null;
  draggingCivil: number | null = null;
  uniqueId: number = 0;

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
    private sanitizer: DomSanitizer,
    private localStorageService: LocalStorageService
  ) {
    this.personalDetailsForm = this.fb.group({
      firstName: ["", Validators.required],
      middleName: [""],
      lastName: ["", Validators.required],
      uniqueId: [
        "",
        [Validators.required, Validators.pattern("^[a-zA-Z0-9]+$")],
      ],
      contactNumber: [
        "",
        [Validators.required, Validators.pattern("^[0-9]{10}$")],
      ],
      aadharNumber: [
        "",
        [
          Validators.required,
          Validators.pattern("^[0-9]{4} [0-9]{4} [0-9]{4}$"),
        ],
      ],
      email: ["", Validators.email],
      dateOfBirth: [
        "",
        [Validators.required, Validators.pattern("^\\d{4}-\\d{2}-\\d{2}$")],
      ],
      aliveStatus: ["", Validators.required],
      dateWhenExpired: [""],
      district: ["", Validators.required],
      address: this.fb.group({
        address: [""],
      }),
    });

    this.serviceDetailsForm = this.fb.group({
      commission: ["", Validators.required],
      corps: ["", Validators.required],
      dateOfEnrollment: [
        "",
        [Validators.required, Validators.pattern("^\\d{4}-\\d{2}-\\d{2}$")],
      ],
      dateOfRetirement: [
        "",
        [Validators.required, Validators.pattern("^\\d{4}-\\d{2}-\\d{2}$")],
      ],
    });

    this.bankDetailsForm = this.fb.group({
      panNumber: [
        "",
        [Validators.required, Validators.pattern("^[A-Z]{5}[0-9]{4}[A-Z]{1}$")],
      ],
      bankName: [""],
      ifscCode: [
        "",
        [Validators.required, Validators.pattern("^[a-zA-Z0-9]+$")],
      ],
      accountType: ["", Validators.required],
      accountNumber: [
        "",
        [Validators.required, Validators.pattern("^[0-9]+$")],
      ],
      ppoNumber: ["", [Validators.required, Validators.pattern("^[0-9]{12}$")]],
    });

    this.familyDetailsForm = this.fb.group({
      nextOfKin: this.fb.group({
        firstName: [""],
        lastName: [""],
        relation: ["", Validators.required],
      }),
      dependents: this.fb.array([]),
    });

    this.additionalDetailsForm = this.fb.group({
      canteenSmartCard: ["", Validators.required],
      echs: ["", Validators.required],
      coi: ["", Validators.required],
      residentCertificate: [""],
      date: ["", Validators.pattern("^\\d{4}-\\d{2}-\\d{2}$")],
      serviceCertifications: this.fb.array([]),
      civilCertifications: this.fb.array([]),
      Awards: this.fb.array([]),
      remarks: [""],
    });

    this.onAliveStatusChange(), this.COIstatusChange();
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.getSummaryData());
  }

  getSummaryData() {
    const dependentsSummary = this.familyDetailsForm.get('dependents')?.value.map((dependent: any, index: number) => ([
      { field: `Dependent ${index + 1}`, value: dependent.firstName+" "+dependent.lastName+" "+
                                               " ("+this.getRelationLabel(dependent.relation)+")" },

    ])).flat() || [];

    const serviceCertificationsSummary = this.additionalDetailsForm.get('serviceCertifications')?.value.map((cert: any, index: number) => ([
      {
        field: `Service Certificate ${index + 1} Image`,
        value: this.sanitizer.bypassSecurityTrustUrl(this.getServiceCertificateImage(index)!) // Ensure cert.service_certificate_image is properly sanitized
      },
      {
        field: `Service Certificate ${index + 1} Received Date`,
        value: cert.date
      },
      {
        field: `Service Certificate ${index + 1} Remarks`,
        value: cert.remarks
      }
    ])).flat() || [];

  
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
        field: "Next of kin",
        value: this.familyDetailsForm.get("nextOfKin.firstName")?.value+" "+this.familyDetailsForm.get("nextOfKin.lastName")?.value
              +" ("+this.getRelationLabel(this.familyDetailsForm.get("nextOfKin.relation")?.value)+")",
      },
      ...dependentsSummary,
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
      ...serviceCertificationsSummary
    ];
  }
  getRelationLabel(value: number): string {
    const relation = this.relationOptions.find(option => option.value === value);
    return relation ? relation.label : value.toString();
  }

  getServiceCertificateImage(index: number): string | null {
    return localStorage.getItem(`service_certificate_image_${index}`);
  }

  viewImage(imageUrl: any) {
    const url = imageUrl.changingThisBreaksApplicationSecurity; // Extract the sanitized URL
    window.open(url, '_blank'); // Open the sanitized URL in a new tab
  }

  onSubmit() {
    if (
      this.personalDetailsForm.valid &&
       this.serviceDetailsForm.valid &&
       this.bankDetailsForm.valid &&
        this.familyDetailsForm.valid && // Ensure familyDetailsForm is also valid
       this.additionalDetailsForm.valid
    ) {
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
        }))
        
          


          
      };
      console.log(formData);

      const url = "http://127.0.0.1:8000/sainikregistration";
      const headers = new HttpHeaders({ "Content-Type": "application/json" });

      this.http.post(url, formData, { headers }).subscribe(
        (response) => {
          console.log("Registration successful", response);
          alert("user registration successful");
          this.router.navigate(["/dashboard"]);
          // Optionally, reset the forms after successful submission
          // this.personalDetailsForm.reset();
          // this.serviceDetailsForm.reset();
          // this.bankDetailsForm.reset();
        },
        (error) => {
          console.error("Registration failed", error);
          alert("registration failed");
          // Handle error scenarios, such as displaying an error message
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

  markAllAsTouchedAndLogDependents() {
    this.logDependentsData();
  }

  logDependentsData() {
    console.log('demodtatatatatta:',this.familyDetailsForm.get('dependents.firstName')?.value)
    const dependentsData = this.familyDetailsForm.get("dependents")?.value;
      if (dependentsData) {
      dependentsData.forEach((dependent: any) => {
        const fullName = `${dependent.firstName} ${dependent.lastName} ${this.getRelationLabel(dependent.relation)}`;
        console.log(fullName);
      });
    }
  }


  logAddDetails() {
    console.log(this.additionalDetailsForm.get("canteenSmartCard")?.value);
    console.log(this.additionalDetailsForm.get("echs")?.value);
    console.log(this.additionalDetailsForm.get("coi")?.value);
    console.log(this.additionalDetailsForm.get("residentCertificate")?.value);
  }

  addServiceCertification() {
    const serviceCertificationsArray = this.additionalDetailsForm.get(
      "serviceCertifications"
    ) as FormArray;
    serviceCertificationsArray.push(
      this.fb.group({
        service_certificate_date: [""],
        service_certificate_image: [null],
        service_certificate_remarks: [""],
        uniqueId: this.uniqueId,
      })
    );
    this.uniqueId++;
  }

  removeServiceCertification(index: number) {
    const serviceCertificationsArray = this.additionalDetailsForm.get(
      "serviceCertifications"
    ) as FormArray;
    serviceCertificationsArray.removeAt(index);
  }

  get serviceCertifications(): FormArray {
    return this.additionalDetailsForm.get("serviceCertifications") as FormArray;
  }

  addCivilCertification() {
    const civilCertificationsArray = this.additionalDetailsForm.get(
      "civilCertifications"
    ) as FormArray;
    civilCertificationsArray.push(
      this.fb.group({
        civil_certificate_date: [""],
        civil_certificate_image: [null],
        civil_certificate_remarks: [""],
        uniqueId: this.uniqueId,
      })
    );
    this.uniqueId++;
  }

  get civilCertifications(): FormArray {
    return this.additionalDetailsForm.get("civilCertifications") as FormArray;
  }

  removeCivilCertification(index: number) {
    const civilCertificationsArray = this.additionalDetailsForm.get(
      "civilCertifications"
    ) as FormArray;
    civilCertificationsArray.removeAt(index);
  }

  addAwards() {
    this.Awards.push(
      this.fb.group({
        name: [""],
        date: [""],
      })
    );
  }

  get Awards(): FormArray {
    return this.additionalDetailsForm.get("Awards") as FormArray;
  }

  removeAward(index: number) {
    this.Awards.removeAt(index);
  }

  onDragOver(event: DragEvent, type: "service" | "civil", index: number) {
    event.preventDefault();
    event.stopPropagation();
    if (type === "service") {
      this.draggingService = index;
    } else {
      this.draggingCivil = index;
    }
  }

  onDragLeave(event: DragEvent, type: "service" | "civil") {
    event.preventDefault();
    event.stopPropagation();
    if (type === "service") {
      this.draggingService = null;
    } else {
      this.draggingCivil = null;
    }
  }

  onDrop(event: DragEvent, type: "service" | "civil", index: number) {
    event.preventDefault();
    event.stopPropagation();
    if (type === "service") {
      this.draggingService = null;
    } else {
      this.draggingCivil = null;
    }
    const files = event.dataTransfer!.files;
    if (files.length > 0) {
      if (type === "service") {
        this.additionalDetailsForm
          .get(["serviceCertifications", index, "service_certificate_image"])
          ?.setValue(files[0]);
        this.previewFile(files[0], type, index);
      } else {
        this.additionalDetailsForm
          .get(["civilCertifications", index, "civil_certificate_image"])
          ?.setValue(files[0]);
        this.previewFile(files[0], type, index);
      }
    }
  }

  onFileChange(event: Event, type: "service" | "civil", index: number) {
    const input = event.target as HTMLInputElement;
    if (input.files!.length > 0) {
      const file = input.files![0];
      if (type === "service") {
        this.additionalDetailsForm
          .get(["serviceCertifications", index, "service_certificate_image"])
          ?.setValue(file);
        this.previewFile(file, type, index);
      } else {
        this.additionalDetailsForm
          .get(["civilCertifications", index, "civil_certificate_image"])
          ?.setValue(file);
        this.previewFile(file, type, index);
      }
    }
  }
  addbutton(){
    const imageUrls = Object.values(this.serviceImagePreviews)
      .filter(value => typeof value === 'string') as string[];
    localStorage.setItem('serviceImageUrls', JSON.stringify(imageUrls));
    alert('Images saved to local storage');
  }

  previewFile(file: File, type: "service" | "civil", index: number) {
    const reader = new FileReader();
    reader.onload = () => {
      if (type === "service") {
        this.serviceImagePreviews[index] = reader.result;
      } else {
        this.civilImagePreviews[index] = reader.result;
      }
    };
    reader.readAsDataURL(file);
  }

  // submitCard(cardNumber: number) {
  //   switch (cardNumber) {
  //     case 1:
  //       if (this.personalDetailsForm.valid)this.moveToNextCard();
  //       break;
  //     case 2:
  //       if (this.serviceDetailsForm.valid) this.moveToNextCard();
  //       break;
  //     case 3:
  //       if (this.bankDetailsForm.valid)this.moveToNextCard();
  //       break;
  //       case 4:
  //         if (this.familyDetailsForm.valid) {
  //           console.log('Family Details Form is valid');
  //           this.moveToNextCard();
  //         } else {
  //           console.log('Family Details Form is invalid');
  //         }
  //         break;
  //     case 5:
  //       if (this.additionalDetailsForm.valid) this.onSubmit();
  //       break;
  //     default:
  //       break;
  //   }
  // }
}