import {Component, inject, OnInit} from '@angular/core';
import {ColorSchemeSwitchComponent} from '../../common-ui/color-scheme-switch/color-scheme-switch.component';
import {LogoComponent} from '../../common-ui/logo/logo.component';
import {AuthService} from '../../../core/services/auth.service';
import {map, Observable, shareReplay} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {User} from '../../../../interfaces/User';
import {ProfileIconComponent} from '../../../../../public/assets/icons/profile-icon.component';
import {UserMenuComponent} from '../../modals/user-menu/user-menu.component';
import {UserService} from '../../../core/services/user.service';
import {NewChatIconComponent} from '../../../../../public/assets/icons/new-chat-icon';
import {ModalService} from '../../../core/services/modal.service';
import {ModalType} from '../../../enums/ModalType';
import {SearchIconComponent} from '../../../../../public/assets/icons/search-icon.component';
import {ButtonComponent} from '../../common-ui/button/button.component';

@Component({
  selector: 'app-side-bar',
  imports: [
    ColorSchemeSwitchComponent,
    LogoComponent,
    AsyncPipe,
    ProfileIconComponent,
    UserMenuComponent,
    NewChatIconComponent,
    SearchIconComponent,
    ButtonComponent,
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
  user$!: Observable<User | null>;

  isLoggedIn$ = this.authService.authStatus$.pipe(
    map(status => status === true),
    shareReplay(1)
  );

  ngOnInit() {
    if (this.authService.isInitializing()) {
      this.authService.initializeAuth().subscribe();
    }
    this.userService.getCurrentUser().subscribe();
    this.user$ = this.userService.getCurrentUser().pipe(shareReplay(1));
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
