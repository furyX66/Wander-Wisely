import {Component, inject} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {EmailInputModalComponent} from '../forgot-password/email-input-modal/email-input-modal.component';
import {LoginModalComponent} from '../login-modal/login-modal.component';
import {RegisterModalComponent} from '../register-modal/register-modal.component';
import {SettingsWindowComponent} from '../settings-window/settings-window.component';
import {ModalType} from '../../../enums/ModalType';
import {ModalService} from '../../../core/services/modal.service';
import {
  VerificationCodeInputComponent
} from '../forgot-password/verification-code-input/verification-code-input.component';
import {NewPasswordComponent} from '../forgot-password/new-password/new-password.component';

@Component({
  selector: 'app-modal-container-component',
  imports: [
    AsyncPipe,
    EmailInputModalComponent,
    LoginModalComponent,
    RegisterModalComponent,
    SettingsWindowComponent,
    VerificationCodeInputComponent,
    NewPasswordComponent
  ],
  templateUrl: './modal-container-component.component.html',
  styleUrl: './modal-container-component.component.scss'
})
export class ModalContainerComponentComponent {
  protected modalService = inject(ModalService);
  protected readonly ModalType = ModalType;

  switchToRegister() {
    this.modalService.closeModal(ModalType.LOGIN);
    this.modalService.openModal(ModalType.REGISTER);
  }

  switchToLogin() {
    this.modalService.closeModal(ModalType.REGISTER);
    this.modalService.openModal(ModalType.LOGIN);
  }

  switchToEmailInput() {
    this.modalService.closeModal(ModalType.LOGIN);
    this.modalService.openModal(ModalType.FORGOT_PASSWORD);
  }

  switchToVerificationCodeInput(data: { email: string, code: string }) {
    this.modalService.closeModal(ModalType.FORGOT_PASSWORD);
    this.modalService.openModal(ModalType.CODE_INPUT, data);
  }

  switchToNewPasswordInput(data: { email: string, code: string }) {
    this.modalService.closeModal(ModalType.CODE_INPUT);
    this.modalService.openModal(ModalType.NEW_PASSWORD_INPUT, data);
  }
}
