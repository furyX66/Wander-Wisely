import {Component, output} from '@angular/core';
import {ProfileIcon} from '../../../../../public/assets/icons/profile-icon';
import {ReactiveFormsModule} from '@angular/forms';
import {PersonalInfoFormPartComponent} from '../../forms/personal-info-form-part/personal-info-form-part.component';
import {PasswordFormPartComponent} from '../../forms/password-form-part/password-form-part.component';

@Component({
  selector: 'app-settings-window',
  imports: [
    ProfileIcon,
    ReactiveFormsModule,
    PersonalInfoFormPartComponent,
    PasswordFormPartComponent
  ],
  templateUrl: './settings-window.component.html',
  styleUrl: './settings-window.component.scss',
  standalone: true,
})
export class SettingsWindowComponent {
  close = output<void>();

  closeModal() {
    this.close.emit();
  }
}
