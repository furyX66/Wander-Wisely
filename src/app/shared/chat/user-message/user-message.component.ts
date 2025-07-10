import {Component, input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProfileIcon} from '../../../../../public/assets/icons/profile-icon';

@Component({
  selector: 'app-user-message',
  imports: [CommonModule, ProfileIcon],
  templateUrl: './user-message.component.html',
  standalone: true,
  styleUrl: './user-message.component.scss'
})
export class UserMessageComponent {
  text = input<string>('');
}
