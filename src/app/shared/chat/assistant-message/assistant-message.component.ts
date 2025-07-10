import {Component, input} from '@angular/core';
import {ProfileIcon} from '../../../../../public/assets/icons/assistant-icon';

@Component({
  selector: 'app-assistant-message',
  imports: [
    ProfileIcon
  ],
  templateUrl: './assistant-message.component.html',
  styleUrl: './assistant-message.component.scss'
})
export class AssistantMessageComponent {
  text = input<string>('');
}
