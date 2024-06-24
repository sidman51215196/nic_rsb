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
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
export interface UserData {
  slNo: number;
  name: string;
  uid: string;
  address: string;
  dob: string;
  corps: string;
}

const ELEMENT_DATA: UserData[] = [
  { slNo: 1, name: 'Alice Johnson', uid: 'UID125', address: '789 Oak St', dob: '1985-03-03', corps:'Army' },
  { slNo: 2, name: 'Bob Brown', uid: 'UID126', address: '101 Pine St', dob: '1979-04-04', corps:'Army' },
  { slNo: 3, name: 'Charlie Davis', uid: 'UID127', address: '202 Maple St', dob: '1995-05-05', corps:'Army'},
  { slNo: 4, name: 'Dana Evans', uid: 'UID128', address: '303 Cedar St', dob: '1988-06-06', corps:'Army' },
  { slNo: 5, name: 'Eve Foster', uid: 'UID129', address: '404 Birch St', dob: '1991-07-07',  corps:'Navy'},
  { slNo: 6, name: 'Frank Green', uid: 'UID130', address: '505 Walnut St', dob: '1983-08-08', corps:'Navy' },
  { slNo: 7, name: 'Grace Hall', uid: 'UID131', address: '606 Chestnut St', dob: '1996-09-09', corps:'Navy' },
  { slNo: 8, name: 'Henry Allen', uid: 'UID132', address: '707 Aspen St', dob: '1987-10-10', corps:'Navy' },
  { slNo: 9, name: 'Ivy King', uid: 'UID133', address: '808 Redwood St', dob: '1993-11-11', corps:'Navy' },
  { slNo: 10, name: 'Jack Lee', uid: 'UID134', address: '909 Sycamore St', dob: '1990-12-12', corps:'Air Force' },
  { slNo: 11, name: 'Karen White', uid: 'UID135', address: '1010 Poplar St', dob: '1982-01-13', corps:'Air Force' },
  { slNo: 12, name: 'John Doe', uid: 'UID123', address: '123 Main St', dob: '1990-01-01', corps:'Air Force' },
  { slNo: 13, name: 'Jane Smith', uid: 'UID124', address: '456 Elm St', dob: '1992-02-02', corps:'Air Force' },
];

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
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
    MatInputModule
  ],
  providers: [LocalStorageService],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['slNo', 'name', 'uid', 'address', 'dob', 'corps'];
  dataSource = new MatTableDataSource<UserData>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  userRole: number = 0;
  username: string = '';
  pageSizeOptions: number[] = [5, 10]; // Define your page size options here
  pageSize: number = 10; // Set default page size

  constructor(private localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    this.userRole = this.localStorageService.getUserRole();
    this.username = this.localStorageService.getUsername();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngDoCheck(): void {
    this.applyScrollStyle();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  private applyScrollStyle(): void {
    const mainContent = document.querySelector('.main-content') as HTMLElement;
    if (mainContent) {
      if (this.paginator && this.paginator.pageSize === 10) {
        mainContent.style.marginBottom = '40vh';
      } else {
        mainContent.style.marginBottom = '0';
      }
    }
  }
  
}














<div class="additional-content">
<div class="search-container">
  <mat-form-field appearance="fill">
    <mat-label>Search</mat-label>
    <input matInput (keyup)="applyFilter($event)" placeholder="Search...">
  </mat-form-field>
</div>
<div class="count-container">
  <p>No of users registered: </p>
</div>
</div>
</div>