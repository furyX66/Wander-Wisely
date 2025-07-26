import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {SideBarComponent} from '../../shared/chat/side-bar/side-bar.component';
import {ChatInputComponent} from '../../shared/common-ui/chat-input/chat-input.component';
import {MapComponent} from '../../shared/common-ui/map/map.component';
import {UserMessageComponent} from '../../shared/chat/user-message/user-message.component';
import {HttpClient} from '@angular/common/http';
import {SettingsWindowComponent} from '../../shared/modals/settings-window/settings-window.component';
import {ModalService} from '../../core/services/modal.service';
import {Subscription} from 'rxjs';
import {AssistantMessageComponent} from '../../shared/chat/assistant-message/assistant-message.component';
import {ChatMessage} from '../../../types/ChatMessageType';
import {ModalType} from '../../enums/ModalType';
import {AsyncPipe} from '@angular/common';
import {LoginModalComponent} from '../../shared/modals/login-modal/login-modal.component';
import {RegisterModalComponent} from '../../shared/modals/register-modal/register-modal.component';
import {
  EmailInputModalComponent
} from '../../shared/modals/forgot-password/email-input-modal/email-input-modal.component';

@Component({
  selector: 'app-chat-page',
  imports: [
    SideBarComponent,
    ChatInputComponent,
    MapComponent,
    UserMessageComponent,
    SettingsWindowComponent,
    AssistantMessageComponent,
    AsyncPipe,
    LoginModalComponent,
    RegisterModalComponent,
    EmailInputModalComponent
  ],
  templateUrl: './chat-page.component.html',
  standalone: true,
  styleUrl: './chat-page.component.scss'
})
export class ChatPageComponent implements OnInit, OnDestroy  {
  protected modalService = inject(ModalService);
  messages: ChatMessage[] = [];
  private modalSub = new Subscription();
  private nextId = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.modalSub.add(
      this.modalService.getModalState$(ModalType.EDIT_PROFILE)
        .subscribe(isOpen => {
          console.log('Edit profile modal is:', isOpen ? 'open' : 'closed');
        })
    );
  }

  ngOnDestroy() {
    this.modalSub.unsubscribe();
  }

  openEmailInputModal(): void {
    this.modalService.closeAllModals()
    this.modalService.openModal(ModalType.FORGOT_PASSWORD);
  }

  get reversedMessages(): ChatMessage[] {
    return this.messages.slice().reverse();
  }

  openLoginModal(): void {
    this.modalService.openModal(ModalType.LOGIN);
  }

  openRegistrationModal(): void {
    this.modalService.openModal(ModalType.REGISTER);
  }

  handleSwitchToEmailInput() {
    this.openEmailInputModal();
  }

  handleSwitchToLogin() {
    this.modalService.closeAllModals()
    this.openLoginModal();
  }

  handleSwitchToRegister() {
    this.modalService.closeAllModals()
    this.openRegistrationModal();
  }

  handleChatInput(value: string) {
    if (value.trim()) {
      this.messages.push({ id: this.nextId++, text: `${value}`, author: 'user' });
      this.http.post<{ reply: string }>('/api/chat', { message: value }).subscribe({
        next: res => {
          this.messages.push({
            id: this.nextId++,
            text: res.reply,
            author: 'assistant'
          });
          console.log(res)
        },
        error: err => {
          this.messages.push({id: this.nextId++, text: `Wystąpił błąd po stronie serwera`, author: 'assistant' });
          console.error("Server error:",err.message);
        }
      });

    }
  }

  protected readonly ModalType = ModalType;
}
