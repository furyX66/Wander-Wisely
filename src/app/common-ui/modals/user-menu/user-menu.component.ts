import {Component, EventEmitter, Output} from '@angular/core';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-user-menu',
  imports: [],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.scss'
})
export class UserMenuComponent {
  @Output() closeMenu = new EventEmitter<void>();
  constructor(private authService: AuthService) {}
  logout() {
    this.authService.logout();
    this.closeMenu.emit();
  }
}
