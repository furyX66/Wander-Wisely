import {Component, EventEmitter, Output} from '@angular/core';
import {ProfileIcon} from '../../../../../public/assets/icons/profile-icon';
import {InputComponent} from '../../shared/input/input.component';
import {ButtonComponent} from '../../shared/button/button.component';

@Component({
  selector: 'app-settings-window',
  imports: [
    ProfileIcon,
    InputComponent,
    ButtonComponent
  ],
  templateUrl: './settings-window.component.html',
  styleUrl: './settings-window.component.scss',
  standalone: true,
})
export class SettingsWindowComponent {
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }
}
