import {Component} from '@angular/core';
import {ColorSchemeSwitchComponent} from '../../shared/color-scheme-switch/color-scheme-switch.component';
import {SignUpButtonComponent} from '../../shared/sign-up-button/sign-up-button.component';
import {LoginButtonComponent} from '../../shared/login-button/login-button.component';
import {LogoComponent} from '../../shared/logo/logo.component';


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
