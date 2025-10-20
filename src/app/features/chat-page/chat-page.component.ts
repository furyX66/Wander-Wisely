import {AfterViewChecked, ChangeDetectorRef, Component, ElementRef, inject, ViewChild} from '@angular/core';
import {SideBarComponent} from '../../shared/chat/side-bar/side-bar.component';
import {ChatInputComponent} from '../../shared/common-ui/chat-input/chat-input.component';
import {MapComponent} from '../../shared/common-ui/map/map.component';
import {UserMessageComponent} from '../../shared/chat/user-message/user-message.component';
import {AssistantMessageComponent} from '../../shared/chat/assistant-message/assistant-message.component';
import {ChatMessage} from '../../../interfaces/ChatMessage';
import {ArrowIconComponent} from '../../../../public/assets/icons/arrow-icon.component';
import {exhaustMap, filter, finalize, of, Subject, tap} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {
  LoadingAnimationComponent
} from '../../../../public/assets/animations/loading-animation/loading-animation.component';
import {AssistantIconComponent} from '../../../../public/assets/icons/assistant-icon';
import {ChatService} from '../../core/services/chat.service';
import {Attraction} from '../../../interfaces/Attraction';

export interface ChatResponse {
  reply: string;
  places : Attraction[];
}

@Component({
  selector: 'app-chat-page',
  imports: [
    SideBarComponent,
    ChatInputComponent,
    MapComponent,
    UserMessageComponent,
    AssistantMessageComponent,
    ArrowIconComponent,
    LoadingAnimationComponent,
    AssistantIconComponent
  ],
  templateUrl: './chat-page.component.html',
  standalone: true,
  styleUrl: './chat-page.component.scss'
})
export class ChatPageComponent implements AfterViewChecked {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  private chatService = inject(ChatService);

  messages: ChatMessage[] = [];
  attractions: Attraction[] = [];
  nextId = 0;
  showScrollButton = false;
  shouldScrollToBottom = false;
  isUserScrolledUp = false;

  private messageSend$ = new Subject<string>();
  isLoading = false;

  constructor(private cdr: ChangeDetectorRef) {
    this.messageSend$
      .pipe(
        filter(msg => !!msg.trim()),
        tap(() => {
          this.isLoading = true;
          this.cdr.detectChanges();
        }),
        exhaustMap(message =>
          this.chatService.chatAsk(message).pipe(
            tap((res: ChatResponse) => {
              if (res) this.addAssistantMessage(res.reply);
              this.attractions = res.places;
              this.cdr.detectChanges();
            }),
            catchError(() => {
              this.addAssistantMessage('Server error');
              this.cdr.detectChanges();
              return of(null);
            }),
            finalize(() => {
              this.isLoading = false;
              this.cdr.detectChanges();
            })
          )
        )
      )
      .subscribe();
  }

  handleChatInput(value: string) {
    if (!value.trim() || this.isLoading) return;

    this.addUserMessage(value);
    this.scheduleScroll();
    this.messageSend$.next(value);
  }

  onScroll(): void {
    const el = this.chatContainer.nativeElement;
    const atBottom = Math.abs(el.scrollHeight - el.scrollTop - el.clientHeight) < 5;

    this.isUserScrolledUp = !atBottom;
    this.showScrollButton = this.isUserScrolledUp;
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom && !this.isUserScrolledUp) {
      this.performScroll();
      this.shouldScrollToBottom = false;
    }
    this.cdr.detectChanges();
  }

  scheduleScroll(): void {
    this.isUserScrolledUp = false;
    this.showScrollButton = false;
    this.shouldScrollToBottom = true;
  }

  scrollToBottom(): void {
    this.performScroll();
    this.isUserScrolledUp = false;
    this.showScrollButton = false;
  }

  performScroll(): void {
    try {
      this.chatContainer.nativeElement.scrollTop =
        this.chatContainer.nativeElement.scrollHeight;
    } catch {}
  }

  addUserMessage(text: string) {
    this.messages.push({
      id: this.nextId++,
      text,
      author: 'user'
    });
  }

  addAssistantMessage(text: string) {
    this.messages.push({
      id: this.nextId++,
      text,
      author: 'assistant'
    });
    this.scheduleScroll();
  }
}
