import {Component, inject, OnInit} from '@angular/core';
import {ColorSchemeSwitchComponent} from '../../common-ui/color-scheme-switch/color-scheme-switch.component';
import {LogoComponent} from '../../common-ui/logo/logo.component';
import {Observable} from 'rxjs';
import {IUser} from '../../../../interfaces/IUser';
import {AuthService} from '../../../core/services/auth.service';
import {AsyncPipe} from '@angular/common';
import {ProfileIconComponent} from '../../../../../public/assets/icons/profile-icon.component';
import {UserService} from '../../../core/services/user.service';
import {ModalType} from '../../../enums/ModalType';
import {ModalService} from '../../../core/services/modal.service';
import {UserMenuComponent} from '../../modals/user-menu/user-menu.component';
import {ButtonComponent} from '../../common-ui/button/button.component';


@Component({
  selector: 'app-header',
  imports: [
    ColorSchemeSwitchComponent,
    LogoComponent,
    AsyncPipe,
    ProfileIconComponent,
    UserMenuComponent,
    ButtonComponent,
  ],
  templateUrl: './header.component.html',
  standalone: true,
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  private modalService = inject(ModalService);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  authStatus$ = this.authService.authStatus$;

  showUserMenu = false;
  user$!: Observable<IUser | null>;

  ngOnInit() {
    this.userService.getCurrentUser().subscribe();
    if (this.authService.isInitializing()) {
      this.authService.initializeAuth().subscribe();
    }
    this.user$ = this.userService.currentUser$;
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
