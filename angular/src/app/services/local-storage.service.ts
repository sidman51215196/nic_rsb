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

  getUserDistrict(): number {
    const userDistrict = localStorage.getItem('district');
    return userDistrict ? +userDistrict : 0; // Convert userDistrict to a number, default to 0 if not found
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
  
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }
  remove(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  }
  setServiceCertificateImage(imageUrl: string, index: number): void {
    localStorage.setItem(`service_certificate_image_${index}`, imageUrl);
  }
 
  getServiceCertificateImage(index: number): string | null {
    return localStorage.getItem(`service_certificate_image_${index}`);
  }
  removeServiceCertificateImage(index: number): void {
    localStorage.removeItem(`service_certificate_image_${index}`);
  }
  clearUserData() {
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    localStorage.removeItem('userdistrict');
    // Clear other user-related data if needed
  }
  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }
}