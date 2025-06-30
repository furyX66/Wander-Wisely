import {Component, input} from '@angular/core';

@Component({
  selector: 'app-assistant-message',
  imports: [],
  templateUrl: './assistant-message.component.html',
  styleUrl: './assistant-message.component.scss'
})
export class AssistantMessageComponent {
  text = input<string>('');
}
