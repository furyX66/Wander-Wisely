import {Component, output} from '@angular/core';
import {AuthService} from '../../../core/services/auth.service';
import {ModalService} from '../../../core/services/modal.service';

@Component({
  selector: 'app-user-menu',
  imports: [],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.scss'
})
export class UserMenuComponent {
  closeMenu = output<void>();

  constructor(private authService: AuthService, protected modalService: ModalService) {}

  logout() {
    this.authService.logout();
    this.closeMenu.emit();
  }

  openUserSettingsModal() {
    this.modalService.openEditProfileModal();
  }
}
