import {Component, inject, OnInit} from '@angular/core';
import {LoginButtonComponent} from '../../common-ui/login-button/login-button.component';
import {SignUpButtonComponent} from '../../common-ui/sign-up-button/sign-up-button.component';
import {ColorSchemeSwitchComponent} from '../../common-ui/color-scheme-switch/color-scheme-switch.component';
import {LogoComponent} from '../../common-ui/logo/logo.component';
import {AuthService} from '../../../core/services/auth.service';
import {Observable} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {User} from '../../../../interfaces/User';
import {ProfileIconComponent} from '../../../../../public/assets/icons/profile-icon.component';
import {UserMenuComponent} from '../../modals/user-menu/user-menu.component';
import {UserService} from '../../../core/services/user.service';
import {ChatIconComponent} from '../../../../../public/assets/icons/chat-icon';
import {NewChatIconComponent} from '../../../../../public/assets/icons/new-chat-icon';
import {ModalService} from '../../../core/services/modal.service';
import {ModalType} from '../../../enums/ModalType';

@Component({
  selector: 'app-side-bar',
  imports: [
    LoginButtonComponent,
    SignUpButtonComponent,
    ColorSchemeSwitchComponent,
    LogoComponent,
    AsyncPipe,
    ProfileIconComponent,
    UserMenuComponent,
    ChatIconComponent,
    NewChatIconComponent,

  ],
  templateUrl: './side-bar.component.html',
  standalone: true,
  styleUrl: './side-bar.component.scss'
})

export class SideBarComponent implements OnInit {
  private modalService = inject(ModalService);
  private userService = inject(UserService);
  private authService = inject(AuthService);

  showUserMenu = false;
  user$: Observable<User | null>;
  isLoggedIn$: Observable<boolean>;

  constructor() {
    this.user$ = this.userService.currentUser$;
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

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
