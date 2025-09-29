import {Component, inject, output} from '@angular/core';
import {AuthService} from '../../../core/services/auth.service';
import {ModalService} from '../../../core/services/modal.service';
import {ModalType} from '../../../enums/ModalType';

@Component({
  selector: 'app-user-menu',
  imports: [],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.scss'
})
export class UserMenuComponent {
  private authService = inject(AuthService);
  private modalService =  inject(ModalService);

  closeMenu = output<void>();

  logout() {
    this.authService.logout();
    this.closeMenu.emit();
  }

  openUserSettingsModal() {
    this.modalService.openModal(ModalType.EDIT_PROFILE);
  }
}
