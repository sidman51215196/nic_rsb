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
import {ProfileComponent} from './profile/profile.component'
import {UserdetailsComponent} from './userdetails/userdetails.component'
import {authGuard} from './services/auth.guard'

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent ,canActivate:[authGuard]},
  { path: 'superadmin-dashboard', component: SuperadminDashboardComponent ,canActivate:[authGuard]},
  { path: 'admin-dashboard', component: AdminDashboardComponent,canActivate:[authGuard]},
  { path: 'user-register', component: UserRegisterComponent,canActivate:[authGuard]},
  { path: 'dashboard', component: DashboardComponent ,canActivate:[authGuard]},
  { path: 'profile', component: ProfileComponent,canActivate:[authGuard]},
  { path:'user-details',component: UserdetailsComponent,canActivate:[authGuard]},
];
