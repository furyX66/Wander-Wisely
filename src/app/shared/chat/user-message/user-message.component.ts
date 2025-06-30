import {Component, input} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-message',
  imports: [CommonModule],
  templateUrl: './user-message.component.html',
  standalone: true,
  styleUrl: './user-message.component.scss'
})
export class UserMessageComponent {
  text = input<string>('');
}
