import {AfterViewChecked, Component, ElementRef, ViewChild} from '@angular/core';
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
export class ChatPageComponent implements AfterViewChecked {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  messages: ChatMessage[] = [];
  private nextId = 0;
  private shouldScrollToBottom = false;

  constructor(private http: HttpClient) {}

  handleChatInput(value: string) {
    if (value.trim()) {
      const userMessage: ChatMessage = {
        id: this.nextId++,
        text: value,
        author: 'user'
      };
      this.messages.push(userMessage);
      this.shouldScrollToBottom = true;

      this.http.post<{ reply: string }>('/api/chat', { message: value }).subscribe({
        next: res => {
          const assistantMessage: ChatMessage = {
            id: this.nextId++,
            text: res.reply,
            author: 'assistant'
          };
          const userIndex = this.messages.findIndex(msg => msg === userMessage);
          this.messages.splice(userIndex + 1, 0, assistantMessage);
          this.shouldScrollToBottom = true;
          console.log(res);
        },
        error: err => {
          const errorMessage: ChatMessage = {
            id: this.nextId++,
            text: 'Wystąpił błąd po stronie serwera',
            author: 'assistant'
          };
          const userIndex = this.messages.findIndex(msg => msg === userMessage);
          this.messages.splice(userIndex + 1, 0, errorMessage);
          this.shouldScrollToBottom = true;
          console.error("Server error:", err.message);
        }
      });
    }
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom && this.chatContainer) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  private scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch(err) {
      console.error('Scroll error', err);
    }
  }
}
