import {Component, EventEmitter, Output} from '@angular/core';
import {ButtonComponent} from "../../shared/button/button.component";
import {InputComponent} from "../../shared/input/input.component";

@Component({
  selector: 'app-login-modal',
  imports: [
    ButtonComponent,
    InputComponent,
  ],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.scss'
})
export class LoginModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() switchToRegister = new EventEmitter<void>();
  closeModal() {
    this.close.emit();
  }
}
