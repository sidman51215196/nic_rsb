import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HeaderComponent } from '../header/header.component';
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, HeaderComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {

}
