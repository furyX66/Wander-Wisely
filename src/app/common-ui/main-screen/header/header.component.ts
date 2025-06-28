import {Component, OnInit} from '@angular/core';
import {ColorSchemeSwitchComponent} from '../../shared/color-scheme-switch/color-scheme-switch.component';
import {SignUpButtonComponent} from '../../shared/sign-up-button/sign-up-button.component';
import {LoginButtonComponent} from '../../shared/login-button/login-button.component';
import {LogoComponent} from '../../shared/logo/logo.component';
import {RegisterModalComponent} from '../../modals/register-modal/register-modal.component';
import {LoginModalComponent} from '../../modals/login-modal/login-modal.component';
import {Observable} from 'rxjs';
import {UserType} from '../../../../types/UserType';
import {AuthService} from '../../../services/auth.service';
import {AsyncPipe} from '@angular/common';
import {ProfileIcon} from '../../../../../public/assets/icons/profile-icon';
import {UserMenuComponent} from '../../modals/user-menu/user-menu.component';
import {UserService} from '../../../services/user.service';


@Component({
  selector: 'app-header',
  imports: [
    ColorSchemeSwitchComponent,
    SignUpButtonComponent,
    LoginButtonComponent,
    LogoComponent,
    RegisterModalComponent,
    LoginModalComponent,
    AsyncPipe,
    ProfileIcon,
    UserMenuComponent,
  ],
  templateUrl: './header.component.html',
  standalone: true,
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{
  showRegistrationModal = false;
  showLoginModal = false;
  showUserMenu = false;

  constructor(public authService: AuthService, private userService: UserService) {
    this.user$ = this.userService.currentUser$;
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  user$: Observable<UserType | null>;
  isLoggedIn$: Observable<boolean>;

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.userService.getCurrentUser().subscribe();
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

  closeUserMenu() {
    this.showUserMenu = false;
  }

  closeModals() {
    this.showRegistrationModal = false;
    this.showLoginModal = false;
  }
}
