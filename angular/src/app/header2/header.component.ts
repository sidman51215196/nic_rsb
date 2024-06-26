import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header2',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class Header2Component {

constructor(private localStorageService: LocalStorageService,private router:Router) {}

 menuValue:boolean=false;
 menu_icon :string ='bi bi-list';
 openMenu(){
    this.menuValue =! this.menuValue ;
    this.menu_icon = this.menuValue ? 'bi bi-x' : 'bi bi-list';
  }
  closeMenu() {
    
    
    
    this.menuValue = false;
    this.menu_icon = 'bi bi-list';
  }
  logout(){
    console.log('zzzzzzzzzzzzzzz')
    localStorage.clear();
    this.router.navigate(['/login']);
     
  }
}
