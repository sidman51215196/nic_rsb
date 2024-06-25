import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { ContactComponent } from './contact/contact.component';
import { SuperadminDashboardComponent } from './superadmin-dashboard/superadmin-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {ProfileComponent} from './profile/profile.component';
import {UserdetailsComponent} from './userdetails/userdetails.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
            CommonModule, 
            RouterOutlet,
            HeaderComponent,
            HomeComponent,
            FooterComponent,
            ContactComponent,
            SuperadminDashboardComponent,
            AdminDashboardComponent,
            UserRegisterComponent,
            DashboardComponent,
            ProfileComponent,
            UserdetailsComponent
            
          ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

}
