import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor() {}

  getUserRole(): number {
    const role = localStorage.getItem('userrole');
    return role ? +role : 0; // Convert role to a number, default to 0 if not found
  }

  getUsername(): string {
    return localStorage.getItem('username') || ''; // Default to an empty string if not found
  }
}