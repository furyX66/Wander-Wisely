import { Component } from '@angular/core';
import { SideBarComponent } from '../../shared/chat/side-bar/side-bar.component';
import { ChatInputComponent } from '../../shared/common-ui/chat-input/chat-input.component';
import { MapComponent } from '../../shared/common-ui/map/map.component';
import { UserMessageComponent } from '../../shared/chat/user-message/user-message.component';
import { NgForOf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {SettingsWindowComponent} from '../../shared/modals/settings-window/settings-window.component';
import {ModalService} from '../../core/services/modal.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-chat-page',
  imports: [
    SideBarComponent,
    ChatInputComponent,
    MapComponent,
    UserMessageComponent,
    NgForOf,
    SettingsWindowComponent
  ],
  templateUrl: './chat-page.component.html',
  standalone: true,
  styleUrl: './chat-page.component.scss'
})
export class ChatPageComponent {
  showEditProfileModal = false;
  messages: string[] = [];
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
      this.messages.push(`Ty: ${value}`);

      this.http.post<{ reply: string }>('/api/chat', { message: value }).subscribe({
        next: res => {
          this.messages.push(`AI: ${res.reply}`);
        },
        error: err => {
          this.messages.push('AI: Wystąpił błąd po stronie serwera');
        }
      });

    }
  }
}
