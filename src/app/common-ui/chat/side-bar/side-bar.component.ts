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
import {UserType} from '../../../../types/UserType';
import {ProfileIcon} from '../../../../../public/assets/icons/profile-icon';
import {UserMenuComponent} from '../../modals/user-menu/user-menu.component';

@Component({
  selector: 'app-side-bar',
  imports: [
    LoginButtonComponent,
    SignUpButtonComponent,
    ColorSchemeSwitchComponent,
    LogoComponent,
    LoginModalComponent,
    RegisterModalComponent,
    AsyncPipe,
    ProfileIcon,
    UserMenuComponent
  ],
  templateUrl: './side-bar.component.html',
  standalone: true,
  styleUrl: './side-bar.component.scss'
})

export class SideBarComponent implements OnInit {
  showRegistrationModal = false;
  showLoginModal = false;
  showUserMenu = false;

  user$: Observable<UserType | null>;
  isLoggedIn$: Observable<boolean>;

  constructor(public authService: AuthService) {
    this.user$ = this.authService.currentUser$;
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.authService.getCurrentUser().subscribe();
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

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  closeModals() {
    this.showRegistrationModal = false;
    this.showLoginModal = false;
  }
}
