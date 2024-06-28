import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordDialogueComponent } from '../change-password-dialogue/change-password-dialogue.component';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardTitle, MatCardSubtitle } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { NgFor,NgIf } from '@angular/common';
import { LocalStorageService } from '../services/local-storage.service';


@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports:[
    
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatCardTitle,
    MatCardSubtitle,
    MatIconModule,
    MatListModule,
    MatTableModule,
    NgFor,
    NgIf

  ]
})
export class ProfileComponent implements OnInit {
  userRole: number = 0;
  username: string = '';
  userdistrict: number = 0;
  dataSource = new MatTableDataSource<{ email: string; role: number ,district:number}>();
  displayedColumns: string[] = ['email', 'role','userdistrict'];
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
  constructor(public dialog: MatDialog, private localStorageService: LocalStorageService,
    ) {}

    

  ngOnInit(): void {

    this.userRole = this.localStorageService.getUserRole();
    this.username = this.localStorageService.getUsername();
    this.userdistrict = this.localStorageService.getUserDistrict();
    
    this.dataSource.data = [
      { email: this.username, role: this.userRole, district: this.userdistrict },
      // Add more data as needed
    ];
  }
  getRoleName(role: number): string {
    return this.roleMapping[role] || 'Unknown';
  }

  getDistrictName(district: number): string {
    return this.districtMapping[district] || 'Unknown';
  }


  openChangePasswordDialog(): void {
    const dialogRef = this.dialog.open(ChangePasswordDialogueComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle dialog close if needed
    });
  }
}
