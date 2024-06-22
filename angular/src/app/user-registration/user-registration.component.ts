import { Component } from '@angular/core';
import { UserRegisterComponent } from '../user-register/user-register.component';
import { Header3Component } from '../header3/header.component';
import { FooterComponent } from '../footer/footer.component';
@Component({
  selector: 'app-user-registration',
  standalone: true,
  imports: [UserRegisterComponent, Header3Component,FooterComponent],
  templateUrl: './user-registration.component.html',
  styleUrl: './user-registration.component.css'
})
export class UserRegistrationComponent {

}
