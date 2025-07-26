import {Component} from '@angular/core';
import {SideBarComponent} from '../../shared/chat/side-bar/side-bar.component';
import {ChatInputComponent} from '../../shared/common-ui/chat-input/chat-input.component';
import {MapComponent} from '../../shared/common-ui/map/map.component';
import {UserMessageComponent} from '../../shared/chat/user-message/user-message.component';
import {HttpClient} from '@angular/common/http';
import {AssistantMessageComponent} from '../../shared/chat/assistant-message/assistant-message.component';
import {ChatMessage} from '../../../types/ChatMessageType';

@Component({
  selector: 'app-chat-page',
  imports: [
    SideBarComponent,
    ChatInputComponent,
    MapComponent,
    UserMessageComponent,
    AssistantMessageComponent
  ],
  templateUrl: './chat-page.component.html',
  standalone: true,
  styleUrl: './chat-page.component.scss'
})
export class ChatPageComponent  {
  messages: ChatMessage[] = [];
  private nextId = 0;

  constructor(private http: HttpClient) {}

  get reversedMessages(): ChatMessage[] {
    return this.messages.slice().reverse();
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
}
