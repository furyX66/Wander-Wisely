import {Component, OnInit} from '@angular/core';
import {LoginButtonComponent} from '../../shared/login-button/login-button.component';
import {SignUpButtonComponent} from '../../shared/sign-up-button/sign-up-button.component';
import {ColorSchemeSwitchComponent} from '../../shared/color-scheme-switch/color-scheme-switch.component';
import {LogoComponent} from '../../shared/logo/logo.component';
import {LoginModalComponent} from '../../modals/login-modal/login-modal.component';
import {RegisterModalComponent} from '../../modals/register-modal/register-modal.component';
import {AuthService} from '../../../services/auth.service';
import {Observable} from 'rxjs';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-side-bar',
  imports: [
    LoginButtonComponent,
    SignUpButtonComponent,
    ColorSchemeSwitchComponent,
    LogoComponent,
    LoginModalComponent,
    RegisterModalComponent,
    AsyncPipe
  ],
  templateUrl: './side-bar.component.html',
  standalone: true,
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent implements OnInit {
  userData: any;
  showRegistrationModal = false;
  showLoginModal = false;
  isLoggedIn$: Observable<boolean>;
  constructor(public authService: AuthService) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  ngOnInit() {
    this.checkUserAuth();
    console.log(this.userData);
  }

  private checkUserAuth() {
    if (this.authService.isLoggedIn()) {
      this.authService.getCurrentUser().subscribe({
        next: (user: any) => {
          this.userData = user;
        },
        error: (err) => {
          console.error('Failed to fetch user:', err);
          this.authService.logout();
        }
      });
    }
  }

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
