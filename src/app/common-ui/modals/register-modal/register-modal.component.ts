import {Component, EventEmitter, Output} from '@angular/core';
import {InputComponent} from '../../shared/input/input.component';
import {ButtonComponent} from '../../shared/button/button.component';

@Component({
  selector: 'app-register-modal',
  imports: [
    InputComponent,
    ButtonComponent
  ],
  templateUrl: './register-modal.component.html',
  styleUrl: './register-modal.component.scss'
})
export class RegisterModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() switchToLogin = new EventEmitter<void>();
  closeModal() {
    this.close.emit();
  }
}
