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
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export interface SainikPersonalDetails {
  Id_ic: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  address: string;
  service_details_corps: string | null;
}

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
    MatInputModule,
    HttpClientModule
  ],
  providers: [LocalStorageService],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['slNo', 'name', 'uid', 'address', 'dob', 'corps'];
  dataSource = new MatTableDataSource<SainikPersonalDetails>();
  totalRecords = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  userRole: number = 0;
  username: string = '';
  pageSizeOptions: number[] = [5, 10];
  pageSize: number = 10;

  constructor(private localStorageService: LocalStorageService, private http: HttpClient) { }

  ngOnInit(): void {
    this.userRole = this.localStorageService.getUserRole();
    this.username = this.localStorageService.getUsername();
    this.fetchData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  fetchData(pageIndex: number = 0, pageSize: number = 10): void {
    const url = `http://127.0.0.1:8000/listsainik`;

    this.http.get<{ total_count: number, sainiks: SainikPersonalDetails[] }>(url)
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
}
