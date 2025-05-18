import {Component} from '@angular/core';
import {LoginButtonComponent} from '../../shared/login-button/login-button.component';
import {SignUpButtonComponent} from '../../shared/sign-up-button/sign-up-button.component';
import {ColorSchemeSwitchComponent} from '../../shared/color-scheme-switch/color-scheme-switch.component';
import {LogoComponent} from '../../shared/logo/logo.component';
import {LoginModalComponent} from '../../modals/login-modal/login-modal.component';
import {RegisterModalComponent} from '../../modals/register-modal/register-modal.component';

@Component({
  selector: 'app-side-bar',
  imports: [
    LoginButtonComponent,
    SignUpButtonComponent,
    ColorSchemeSwitchComponent,
    LogoComponent,
    LoginModalComponent,
    RegisterModalComponent
  ],
  templateUrl: './side-bar.component.html',
  standalone: true,
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent {
  selectedItem: string | null = null;
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

  selectItem(text: string) {
    if (this.selectedItem === text) {
      this.selectedItem = null;
    } else {
      this.selectedItem = text;
    }
  }
  timelineData = [
    {
      label: 'Today',
      items: [{ text: '7 days euro tour', bold: false }]
    },
    {
      label: 'Yesterday',
      items: [
        { text: 'Katowice to Paris', bold: false },
        { text: 'Gothic architecture in Chor...', bold: false }
      ]
    },
    {
      label: 'Week ago',
      items: [
        { text: 'Polish museums', bold: false },
        { text: 'Chorzów ruch tour', bold: true }
      ]
    }
  ];
}
