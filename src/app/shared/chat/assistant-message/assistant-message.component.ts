import {Component, input} from '@angular/core';
import {AssistantIconComponent} from '../../../../../public/assets/icons/assistant-icon';

@Component({
  selector: 'app-assistant-message',
  imports: [
    AssistantIconComponent
  ],
  templateUrl: './assistant-message.component.html',
  styleUrl: './assistant-message.component.scss'
})
export class AssistantMessageComponent {
  text = input<string>('');
}
