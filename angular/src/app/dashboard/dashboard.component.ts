import {Component,OnInit} from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import { LocalStorageService } from '../services/local-storage.service';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    NgIf

  
  ],
  providers: [LocalStorageService], 
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  userRole: number = 0; 
  username: string = '';

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.userRole = this.localStorageService.getUserRole();






    
    this.username = this.localStorageService.getUsername();
  }
}
