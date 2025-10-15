import {Component, input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProfileIconComponent} from '../../../../../public/assets/icons/profile-icon.component';

@Component({
  selector: 'app-user-message',
  imports: [CommonModule, ProfileIconComponent],
  templateUrl: './user-message.component.html',
  standalone: true,
  styleUrl: './user-message.component.scss'
})
export class UserMessageComponent {
  text = input<string>('');
}
