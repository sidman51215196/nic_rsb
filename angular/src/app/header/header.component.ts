
import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule,CommonModule,MatIcon],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent {
  activeLink = '';
  userRole: number = 0;
  username: string = '';
  userdistrict: number = 0;
  isLoggedIn: boolean = false;
  isMenuOpen: boolean = false;

  constructor(private localStorageService: LocalStorageService, private router: Router) {}

  ngOnInit(): void {
    this.userRole = this.localStorageService.getUserRole();
    this.username = this.localStorageService.getUsername();
    this.userdistrict = this.localStorageService.getUserDistrict();
    this.isLoggedIn = !!this.localStorageService.getToken();
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  setActive(link: string) {
    this.activeLink = link;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(event: Event) {
    // event.preventDefault();
    console.log('logged out successfully');
    localStorage.clear();
    this.localStorageService.clearUserData();
    this.localStorageService.remove('token');
    this.isLoggedIn = false;
    this.closeMenu();
    this.router.navigate(['/']); // Explicitly navigate to home after logout
  }
}