import {
  AfterViewChecked,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { SideBarComponent } from '../../shared/chat/side-bar/side-bar.component';
import { ChatInputComponent } from '../../shared/common-ui/chat-input/chat-input.component';
import { MapComponent } from '../../shared/common-ui/map/map.component';
import { UserMessageComponent } from '../../shared/chat/user-message/user-message.component';
import { AssistantMessageComponent } from '../../shared/chat/assistant-message/assistant-message.component';
import { ArrowIconComponent } from '../../../../public/assets/icons/arrow-icon.component';
import {exhaustMap, filter, finalize, Observable, of, Subject, takeUntil, tap} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoadingAnimationComponent } from '../../../../public/assets/animations/loading-animation/loading-animation.component';
import { AssistantIconComponent } from '../../../../public/assets/icons/assistant-icon';
import { ChatService } from '../../core/services/chat.service';
import { IAttraction } from '../../../interfaces/IAttraction';
import { ActivatedRoute } from '@angular/router';
import { ChatSessionService } from '../../core/services/chat-session.service';
import { IChatSession } from '../../../interfaces/IChatSession';
import { GuestChatSessionService } from '../../core/services/guest-chat-session.service';
import { AsyncPipe } from '@angular/common';
import {IChatMessage} from '../../../interfaces/IChatMessage'; // ✅ Добавили

export interface ChatResponse {
  reply: string;
  places: IAttraction[];
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
    AssistantIconComponent,
    AsyncPipe // ✅ Добавили
  ],
  templateUrl: './chat-page.component.html',
  standalone: true,
  styleUrl: './chat-page.component.scss'
})
export class ChatPageComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  private route = inject(ActivatedRoute);
  private chatService = inject(ChatService);
  private chatSessionService = inject(ChatSessionService);
  private guestChatSessionService = inject(GuestChatSessionService);
  private destroy$ = new Subject<void>();

  messages$!: Observable<IChatMessage[]>;

  sessionId!: number;
  session!: IChatSession;
  contextObj?: any;
  attractions: IAttraction[] = [];
  showScrollButton = false;
  shouldScrollToBottom = false;
  isUserScrolledUp = false;
  isLoading = false;


  private messageSend$ = new Subject<string>();

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.sessionId = Number(params['id']);
        console.log('Loading session:', this.sessionId);

        this.loadSession();
      });
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

  private loadSession(): void {
    if (!this.sessionId) {
      this.messages$ = this.guestChatSessionService.messages$;
      this.setupMessageStream();
    } else {
      this.messages$ = this.chatSessionService.messages$;

      this.chatSessionService.getSessionWithMessages(this.sessionId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(dto => {
          this.session = dto.session;
          if (this.session.context) {
            try {
              this.contextObj = JSON.parse(this.session.context);
            } catch {
              console.warn('Invalid JSON context');
            }
          }
        });

      this.setupMessageStream();
    }
  }

  private setupMessageStream(): void {
    this.messageSend$
      .pipe(
        filter(msg => !!msg.trim()),
        tap(() => this.isLoading = true),
        exhaustMap(message => {
          if (!this.sessionId) {
            this.guestChatSessionService.addMessage('user', message);
          } else {
            this.chatSessionService
              .addMessage(this.sessionId, { role: 'user', content: message })
              .pipe(takeUntil(this.destroy$))
              .subscribe();
          }

          const chatRequest$ = !this.sessionId
            ? this.chatService.guestChatAsk(message)
            : this.chatService.chatAsk(this.sessionId, message);

          return chatRequest$.pipe(
            tap((res: ChatResponse) => {
              if (res?.reply) {
                if (!this.sessionId) {
                  this.guestChatSessionService.addMessage('assistant', res.reply);
                } else {
                  this.chatSessionService
                    .addMessage(this.sessionId, { role: 'assistant', content: res.reply })
                    .pipe(takeUntil(this.destroy$))
                    .subscribe();
                }
                this.scheduleScroll();
              }
              if (res?.places) {
                this.attractions = res.places;
              }
            }),
            catchError(error => {
              console.error('Chat service error:', error);
              const errorMsg = 'Server error';
              if (!this.sessionId) {
                this.guestChatSessionService.addMessage('assistant', errorMsg);
              } else {
                this.chatSessionService
                  .addMessage(this.sessionId, { role: 'assistant', content: errorMsg })
                  .pipe(takeUntil(this.destroy$))
                  .subscribe();
              }
              this.scheduleScroll();
              return of(null);
            }),
            finalize(() => this.isLoading = false)
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  handleChatInput(value: string): void {
    if (!value.trim() || this.isLoading) return;

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
}
