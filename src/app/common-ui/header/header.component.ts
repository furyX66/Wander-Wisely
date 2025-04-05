import { Component } from '@angular/core';
import { ColorSchemeSwitchComponent } from '../color-scheme-switch/color-scheme-switch.component';


@Component({
  selector: 'app-header',
  imports: [
    ColorSchemeSwitchComponent
  ],
  templateUrl: './header.component.html',
  standalone: true,
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}
