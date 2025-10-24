import {Component, inject, output} from '@angular/core';
import {AuthService} from '../../../core/services/auth.service';
import {ModalService} from '../../../core/services/modal.service';
import {ModalType} from '../../../enums/ModalType';
import {LogoutIconComponent} from '../../../../../public/assets/icons/logout-icon.component';
import {SettingsIconComponent} from '../../../../../public/assets/icons/settings-icon.component';
import {UserIconComponent} from '../../../../../public/assets/icons/user-icon.component';

@Component({
  selector: 'app-user-menu',
  imports: [
    LogoutIconComponent,
    SettingsIconComponent,
    UserIconComponent
  ],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.scss'
})
export class UserMenuComponent {
  private authService = inject(AuthService);
  private modalService =  inject(ModalService);

  closeMenu = output<void>();

  logout() {
    this.authService.logout().subscribe();
    this.closeMenu.emit();
  }

  openUserSettingsModal() {
    this.modalService.openModal(ModalType.EDIT_PROFILE);
    this.closeMenu.emit();
  }
}
