import {Component} from '@angular/core';
import {ColorSchemeSwitchComponent} from '../../shared/color-scheme-switch/color-scheme-switch.component';
import {SignUpButtonComponent} from '../../shared/sign-up-button/sign-up-button.component';
import {LoginButtonComponent} from '../../shared/login-button/login-button.component';
import {LogoComponent} from '../../shared/logo/logo.component';
import {RegisterModalComponent} from '../../modals/register-modal/register-modal.component';
import {LoginModalComponent} from '../../modals/login-modal/login-modal.component';


@Component({
  selector: 'app-header',
  imports: [
    ColorSchemeSwitchComponent,
    SignUpButtonComponent,
    LoginButtonComponent,
    LogoComponent,
    RegisterModalComponent,
    LoginModalComponent,
  ],
  templateUrl: './header.component.html',
  standalone: true,
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  showRegistrationModal = false;
  showLoginModal = false;

  openRegistrationModal() {
    this.showLoginModal = false;
    this.showRegistrationModal = true;
  }

  openLoginModal() {
    this.showRegistrationModal = false;
    this.showLoginModal = true;
  }

  handleSwitchToLogin() {
    this.openLoginModal();
  }

  handleSwitchToRegister() {
    this.openRegistrationModal();
  }

  closeModals() {
    this.showRegistrationModal = false;
    this.showLoginModal = false;
  }
}
