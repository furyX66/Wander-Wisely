import {Component, input, output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {SendIconComponent} from '../../../../../public/assets/icons/send-icon';

@Component({
  selector: 'app-chat-input',
  imports: [CommonModule, FormsModule, SendIconComponent],
  templateUrl: './chat-input.component.html',
  standalone: true,
  styleUrl: './chat-input.component.scss'
})
export class ChatInputComponent {
  placeholder = input<string>('Enter your wishes for the trip');
  link = input<string | null>(null);

  onClick = output<string>();

  inputValue: string = '';

  constructor(private router: Router) {}

  onSendClick() {
    if (this.link()) {
      this.router.navigate([this.link()]);
      this.onClick.emit(this.inputValue);
    } else {
      this.onClick.emit(this.inputValue);
    }
    this.inputValue = '';
  }
}
