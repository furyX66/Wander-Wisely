import {Component, OnDestroy, OnInit} from '@angular/core';
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

@Component({
  selector: 'app-chat-page',
  imports: [
    SideBarComponent,
    ChatInputComponent,
    MapComponent,
    UserMessageComponent,
    SettingsWindowComponent,
    AssistantMessageComponent
  ],
  templateUrl: './chat-page.component.html',
  standalone: true,
  styleUrl: './chat-page.component.scss'
})
export class ChatPageComponent implements OnInit, OnDestroy {
  showEditProfileModal = false;
  messages: ChatMessage[] = [];
  private modalSub?: Subscription;

  constructor(private http: HttpClient, protected modalService: ModalService) {}

  ngOnInit() {
    this.modalSub = this.modalService.editProfileModal$.subscribe(open => {
      this.showEditProfileModal = open;
    });
  }

  ngOnDestroy() {
    this.modalSub?.unsubscribe();
  }

  handleChatInput(value: string) {
    if (value.trim()) {
      this.messages.push({ text: `${value}`, author: 'user' });

      this.http.post<{ reply: string }>('/api/chat', { message: value }).subscribe({
        next: res => {
          this.messages.push({ text: `${value}`, author: 'user' });
          console.log(res)
        },
        error: err => {
          this.messages.push({ text: `Wystąpił błąd po stronie serwera`, author: 'assistant' });
          console.log(err);
        }
      });

    }
  }
}
