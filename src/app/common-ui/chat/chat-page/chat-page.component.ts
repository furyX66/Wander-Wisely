import { Component } from '@angular/core';
import {SideBarComponent} from '../side-bar/side-bar.component';
import {ChatInputComponent} from '../../shared/chat-input/chat-input.component';
import {MapComponent} from '../../shared/map/map.component';
import {UserMessageComponent} from '../user-message/user-message.component';
import {NgForOf} from '@angular/common';

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

  handleChatInput(value: string) {
    console.log('User input', value);
    if (value.trim()) {
      this.messages.push(value);
    }
  }
}
