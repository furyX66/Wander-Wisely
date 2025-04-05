import {Component} from '@angular/core';
import {ColorSchemeSwitchComponent} from '../../color-scheme-switch/color-scheme-switch.component';
import {SignUpButtonComponent} from '../../sign-up-button/sign-up-button.component';
import {LoginButtonComponent} from '../../login-button/login-button.component';
import {LogoComponent} from '../../logo/logo.component';


@Component({
  selector: 'app-header',
  imports: [
    ColorSchemeSwitchComponent,
    SignUpButtonComponent,
    LoginButtonComponent,
    LogoComponent,
  ],
  templateUrl: './header.component.html',
  standalone: true,
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}
