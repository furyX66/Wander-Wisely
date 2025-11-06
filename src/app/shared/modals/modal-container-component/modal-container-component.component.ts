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
import {CloseModalComponent} from '../close-modal/close-modal.component';
import {ClearChatComponent} from '../clear-chat/clear-chat.component';
import {GuestChatSessionService} from '../../../core/services/guest-chat-session.service';

@Component({
  selector: 'app-modal-container-component',
  imports: [
    AsyncPipe,
    EmailInputModalComponent,
    LoginModalComponent,
    RegisterModalComponent,
    SettingsWindowComponent,
    VerificationCodeInputComponent,
    NewPasswordComponent,
    CloseModalComponent,
    ClearChatComponent
  ],
  templateUrl: './modal-container-component.component.html',
  styleUrl: './modal-container-component.component.scss'
})
export class ModalContainerComponentComponent {
  protected modalService = inject(ModalService);
  private guestChatSessionService = inject(GuestChatSessionService);
  protected readonly ModalType = ModalType;

  switchToRegister() {
    this.modalService.closeAllModals();
    this.modalService.openModal(ModalType.REGISTER);
  }

  switchToLogin() {
    this.modalService.closeAllModals();
    this.modalService.openModal(ModalType.LOGIN);
  }

  switchToEmailInput() {
    this.modalService.closeAllModals();
    this.modalService.openModal(ModalType.FORGOT_PASSWORD);
  }

  switchToVerificationCodeInput(data: { email: string, code: string }) {
    this.modalService.closeAllModals();
    this.modalService.openModal(ModalType.CODE_INPUT, data);
  }

  switchToNewPasswordInput(data: { email: string, code: string }) {
    this.modalService.closeAllModals();
    this.modalService.openModal(ModalType.NEW_PASSWORD_INPUT, data);
  }

  handleClearChat(): void {
    this.guestChatSessionService.clearChatSession();
    this.modalService.closeModal(ModalType.CLEAR_CHAT);
  }
}
