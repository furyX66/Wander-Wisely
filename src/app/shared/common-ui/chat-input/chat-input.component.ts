import {Component, input, output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {SendIconComponent} from '../../../../../public/assets/icons/send-icon';

@Component({
  selector: 'app-chat-input',
  imports: [CommonModule, FormsModule, SendIconComponent],
  templateUrl: './chat-input.component.html',
  standalone: true,
  styleUrl: './chat-input.component.scss'
})
export class ChatInputComponent {
  disabled = input<boolean>(false);
  placeholder = input<string>('Enter your wishes for the trip');

  onClick = output<string>();

  inputValue: string = '';

  onSendClick() {
     if (this.disabled()){
      return;
    } else {
      this.onClick.emit(this.inputValue);
    }
    this.inputValue = '';
  }
}
