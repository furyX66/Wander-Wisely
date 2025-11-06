import {Component, output} from '@angular/core';
import {ButtonComponent} from '../../common-ui/button/button.component';

@Component({
  selector: 'app-clear-chat',
  imports: [
    ButtonComponent
  ],
  templateUrl: './clear-chat.component.html',
  styleUrl: './clear-chat.component.scss'
})
export class ClearChatComponent {
  close = output<void>();
  confirmClear = output<void>();
  switchToRegister = output<void>();
  switchToLogin = output<void>();

  closeModal() {
    this.close.emit();
  }

  handleClear() {
    this.confirmClear.emit();
  }

  handleCancel() {
    this.close.emit();
  }
}
