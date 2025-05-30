import { Component } from '@angular/core';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { ChatInputComponent } from '../../shared/chat-input/chat-input.component';
import { MapComponent } from '../../shared/map/map.component';
import { UserMessageComponent } from '../user-message/user-message.component';
import { NgForOf } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chat-page',
  imports: [
    SideBarComponent,
    ChatInputComponent,
    MapComponent,
    UserMessageComponent,
    NgForOf
  ],
  templateUrl: './chat-page.component.html',
  standalone: true,
  styleUrl: './chat-page.component.scss'
})
export class ChatPageComponent {
  messages: string[] = [];

  constructor(private http: HttpClient) { }

  handleChatInput(value: string) {
    if (value.trim()) {
      this.messages.push(`Ty: ${value}`);

      this.http.post<{ reply: string }>('http://localhost:3000/chat', { message: value }).subscribe({
        next: res => {
          this.messages.push(`AI: ${res.reply}`);
        },
        error: err => {
          this.messages.push('AI: Wystąpił błąd');
        }
      });
    }
  }
}