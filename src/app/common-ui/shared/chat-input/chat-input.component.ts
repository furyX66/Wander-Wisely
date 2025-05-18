import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-chat-input',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-input.component.html',
  standalone: true,
  styleUrl: './chat-input.component.scss'
})
export class ChatInputComponent {
  @Input() placeholder: string = 'Enter your wishes for the trip';
  @Input() link: string | null = null;

  @Output() onClick = new EventEmitter<string>();

  inputValue: string = '';

  constructor(private router: Router) {}

  onSendClick() {
    if (this.link) {
      this.router.navigate([this.link]);
      this.onClick.emit(this.inputValue);
      console.log(this.inputValue);
    } else {
      this.onClick.emit(this.inputValue);
      console.log(this.inputValue);
    }
  }
}
