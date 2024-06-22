import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header2',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class Header2Component {
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
}
