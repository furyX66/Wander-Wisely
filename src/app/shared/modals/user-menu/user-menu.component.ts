import {Component, inject, output} from '@angular/core';
import {AuthService} from '../../../core/services/auth.service';
import {ModalService} from '../../../core/services/modal.service';
import {ModalType} from '../../../../enums/ModalType';
import {LogoutIconComponent} from '../../../../../public/assets/icons/logout-icon.component';
import {SettingsIconComponent} from '../../../../../public/assets/icons/settings-icon.component';
import {UserIconComponent} from '../../../../../public/assets/icons/user-icon.component';
import {Router} from '@angular/router';
import {ClickOutsideDirective} from '../../../core/helpers/directives/click-outside.directive';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-user-menu',
  imports: [
    LogoutIconComponent,
    SettingsIconComponent,
    UserIconComponent,
    ClickOutsideDirective
  ],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.scss'
})
export class UserMenuComponent {
  private authService = inject(AuthService);
  private modalService =  inject(ModalService);
  private http = inject(HttpClient);
  private router = inject(Router);

  closeMenu = output<void>();

  logout() {
    this.authService.logout().subscribe();
    this.router.navigate(['/']).then(() => {console.log("Logged out")});
    this.closeMenu.emit();
  }

  openUserSettingsModal() {
    this.modalService.openModal(ModalType.EDIT_PROFILE);
    this.closeMenu.emit();
  }

  navigateToTrips() {
    this.router.navigate(['/my-trips']);
    this.closeMenu.emit();
  }

  close(){
    console.log("Closed user menu");
    this.closeMenu.emit();
  }
}
