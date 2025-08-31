import {Component, inject, OnInit} from '@angular/core';
import {ColorSchemeSwitchComponent} from '../../common-ui/color-scheme-switch/color-scheme-switch.component';
import {SignUpButtonComponent} from '../../common-ui/sign-up-button/sign-up-button.component';
import {LoginButtonComponent} from '../../common-ui/login-button/login-button.component';
import {LogoComponent} from '../../common-ui/logo/logo.component';
import {Observable} from 'rxjs';
import {UserType} from '../../../../types/UserType';
import {AuthService} from '../../../core/services/auth.service';
import {AsyncPipe} from '@angular/common';
import {ProfileIcon} from '../../../../../public/assets/icons/profile-icon';
import {UserService} from '../../../core/services/user.service';
import {ModalType} from '../../../enums/ModalType';
import {ModalService} from '../../../core/services/modal.service';
import {UserMenuComponent} from '../../modals/user-menu/user-menu.component';


@Component({
  selector: 'app-header',
  imports: [
    ColorSchemeSwitchComponent,
    SignUpButtonComponent,
    LoginButtonComponent,
    LogoComponent,
    AsyncPipe,
    ProfileIcon,
    UserMenuComponent,
  ],
  templateUrl: './header.component.html',
  standalone: true,
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  private modalService = inject(ModalService);
  showUserMenu = false;

  constructor(public authService: AuthService, private userService: UserService) {
    this.user$ = this.userService.currentUser$;
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  user$: Observable<UserType | null>;
  isLoggedIn$: Observable<boolean>;

  ngOnInit() {
    this.userService.getCurrentUser().subscribe();
  }

  openLoginModal(): void {
    this.modalService.openModal(ModalType.LOGIN);
  }

  openRegistrationModal(): void {
    this.modalService.openModal(ModalType.REGISTER);
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }
}
