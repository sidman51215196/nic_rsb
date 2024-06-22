import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SuperadminDashboardComponent } from './superadmin-dashboard/superadmin-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { UserRegisterComponent } from './user-register/user-register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'superadmin-dashboard', component: SuperadminDashboardComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent},
  { path: 'user-register', component: UserRegistrationComponent},
  { path: 'user-registration', component:UserRegistrationComponent },
  { path: 'dashboard', component: DashboardComponent },
];
