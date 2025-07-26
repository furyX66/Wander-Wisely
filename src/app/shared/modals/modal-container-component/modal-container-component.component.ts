import {Component, inject} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {EmailInputModalComponent} from '../forgot-password/email-input-modal/email-input-modal.component';
import {LoginModalComponent} from '../login-modal/login-modal.component';
import {RegisterModalComponent} from '../register-modal/register-modal.component';
import {SettingsWindowComponent} from '../settings-window/settings-window.component';
import {ModalType} from '../../../enums/ModalType';
import {ModalService} from '../../../core/services/modal.service';

@Component({
  selector: 'app-modal-container-component',
  imports: [
    AsyncPipe,
    EmailInputModalComponent,
    LoginModalComponent,
    RegisterModalComponent,
    SettingsWindowComponent
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
}
