import {AfterViewChecked, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SideBarComponent} from '../../shared/chat/side-bar/side-bar.component';
import {ChatInputComponent} from '../../shared/common-ui/chat-input/chat-input.component';
import {MapComponent} from '../../shared/common-ui/map/map.component';
import {UserMessageComponent} from '../../shared/chat/user-message/user-message.component';
import {AssistantMessageComponent} from '../../shared/chat/assistant-message/assistant-message.component';
import {ChatMessage} from '../../../interfaces/ChatMessage';
import {ArrowIconComponent} from '../../../../public/assets/icons/arrow-icon.component';
import {exhaustMap, filter, finalize, of, Subject, takeUntil, tap} from 'rxjs';
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
export class ChatPageComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  private chatService = inject(ChatService);
  private destroy$ = new Subject<void>();

  messages: ChatMessage[] = [];
  attractions: Attraction[] = [];
  nextId = 0;
  showScrollButton = false;
  shouldScrollToBottom = false;
  isUserScrolledUp = false;
  isLoading = false;

  private messageSend$ = new Subject<string>();

  ngOnInit(): void {
    this.setupMessageStream();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom && !this.isUserScrolledUp) {
      this.performScroll();
      this.shouldScrollToBottom = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupMessageStream(): void {
    this.messageSend$
      .pipe(
        filter(msg => !!msg.trim()),
        tap(() => this.isLoading = true),
        exhaustMap(message =>
          this.chatService.chatAsk(message).pipe(
            tap((res: ChatResponse) => {
              if (res?.reply) {
                this.addAssistantMessage(res.reply);
              }
              if (res?.places) {
                this.attractions = res.places;
              }
            }),
            catchError((error) => {
              console.error('Chat service error:', error);
              this.addAssistantMessage('Server error');
              return of(null);
            }),
            finalize(() => this.isLoading = false)
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  handleChatInput(value: string): void {
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

  private performScroll(): void {
    try {
      const el = this.chatContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    } catch (error) {
      console.error('Scroll error:', error);
    }
  }

  private addUserMessage(text: string): void {
    this.messages.push({
      id: this.nextId++,
      text,
      author: 'user'
    });
  }

  private addAssistantMessage(text: string): void {
    this.messages.push({
      id: this.nextId++,
      text,
      author: 'assistant'
    });
    this.scheduleScroll();
  }
}

