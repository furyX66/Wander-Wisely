import {AfterViewChecked, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SideBarComponent} from '../../shared/chat/side-bar/side-bar.component';
import {ChatInputComponent} from '../../shared/common-ui/chat-input/chat-input.component';
import {MapComponent} from '../../shared/common-ui/map/map.component';
import {UserMessageComponent} from '../../shared/chat/user-message/user-message.component';
import {AssistantMessageComponent} from '../../shared/chat/assistant-message/assistant-message.component';
import {ArrowIconComponent} from '../../../../public/assets/icons/arrow-icon.component';
import {exhaustMap, filter, finalize, Observable, of, Subject, switchMap, take, takeUntil, tap, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {
  LoadingAnimationComponent
} from '../../../../public/assets/animations/loading-animation/loading-animation.component';
import {AssistantIconComponent} from '../../../../public/assets/icons/assistant-icon';
import {ChatService} from '../../core/services/chat.service';
import {IAttraction} from '../../../interfaces/IAttraction';
import {ActivatedRoute, Router} from '@angular/router';
import {ChatSessionService} from '../../core/services/chat-session.service';
import {IChatSession} from '../../../interfaces/IChatSession';
import {GuestChatSessionService} from '../../core/services/guest-chat-session.service';
import {AsyncPipe} from '@angular/common';
import {IChatMessage} from '../../../interfaces/IChatMessage';
import {ICreateChatSession} from '../../../interfaces/ICreateChatSession';
import {UserService} from '../../core/services/user.service';
import {AuthService} from '../../core/services/auth.service';

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
    AsyncPipe
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
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  private messageStreamDestroy$ = new Subject<void>();

  messages$!: Observable<IChatMessage[]>;

  sessionId!: number;
  session!: IChatSession;
  contextObj?: any;
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
        this.messageStreamDestroy$.next();
        this.loadSession();
      });
    this.authService.authStatus$
      .pipe(
        takeUntil(this.destroy$),
        filter(status => status === true),
      )
      .subscribe(() => {
        this.guestChatSessionService.clearChatSession();
        if (!this.sessionId) {
          this.messages$ = this.guestChatSessionService.messages$;
        }
      });
    this.chatSessionService.attractions$
      .pipe(takeUntil(this.destroy$))
      .subscribe();
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
    this.messageStreamDestroy$.next();
    this.messageStreamDestroy$.complete();
  }

  private loadSession(): void {
    if (!this.sessionId) {
      this.messages$ = this.guestChatSessionService.messages$;
      if (!this.guestChatSessionService.isWelcomeShown()) {
        this.sendWelcomeMessage();
        this.guestChatSessionService.setWelcomeShown();
      }
      this.setupMessageStream();
    } else {
      this.messages$ = this.chatSessionService.messages$;

      this.chatSessionService.getSessionById(this.sessionId)
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
        exhaustMap(message => this.processMessage(message)),
        takeUntil(this.messageStreamDestroy$)
      )
      .subscribe();
  }

  private processMessage(message: string): Observable<ChatResponse | null> {
    if (!this.sessionId) {
      return this.processGuestOrNewAuthorizedChat(message);
    }
    return this.processAuthorizedChat(message);
  }

  private processGuestOrNewAuthorizedChat(message: string): Observable<ChatResponse | null> {
    return this.authService.isLoggedIn().pipe(
      take(1),
      switchMap(isLoggedIn => {
        if (isLoggedIn) {
          return this.createAndSendAuthorizedChat(message);
        } else {
          return this.sendGuestMessage(message);
        }
      }),
      tap(res => this.handleResponse(res)),
      catchError(error => this.handleError(error)),
      finalize(() => this.isLoading = false)
    );
  }

  private processAuthorizedChat(message: string): Observable<ChatResponse | null> {
    this.saveUserMessage(this.sessionId, message);

    return this.chatService.chatAsk(this.sessionId, message).pipe(
      tap(res => this.handleResponse(res)),
      catchError(error => this.handleError(error)),
      finalize(() => this.isLoading = false)
    );
  }

  private createAndSendAuthorizedChat(message: string): Observable<ChatResponse | null> {
    localStorage.removeItem('guestChat');

    return this.createChatAndSendMessage(message).pipe(
      tap(() => {
        console.log('Chat created with ID:', this.sessionId);
        this.messages$ = this.chatSessionService.messages$;
      }),
      switchMap(() => {
        this.saveUserMessage(this.sessionId, message);
        return this.chatService.chatAsk(this.sessionId, message);
      })
    );
  }

  private sendGuestMessage(message: string): Observable<ChatResponse | null> {
    this.guestChatSessionService.addMessage('user', message);
    return this.chatService.guestChatAsk(message);
  }

  private handleResponse(res: ChatResponse | null): void {
    if (!res?.reply) return;
    this.saveAssistantMessage(res.reply, this.sessionId);
    if (res.places) {
      this.chatSessionService.setAttractions(res.places);
    }
    this.scheduleScroll();
    if (this.sessionId && this.router.url !== `/chat/${this.sessionId}`) {
      this.router.navigate(['/chat', this.sessionId],
        { replaceUrl: true ,});
    }
  }

  private handleError(error: any, sessionId? : number): Observable<null> {
    console.error('Error:', error);
    this.saveAssistantMessage('Server error', sessionId);
    this.scheduleScroll();
    return of(null);
  }

  private saveUserMessage(sessionId: number, content: string): void {
    if (!sessionId) {
      this.guestChatSessionService.addMessage('user', content);
    } else {
      this.chatSessionService
        .addMessage(sessionId, { role: 'user', content })
        .pipe(takeUntil(this.messageStreamDestroy$))
        .subscribe({
          error: (err) => console.error('Error:', err)
        });
    }
  }

  private saveAssistantMessage(content: string, sessionId?: number): void {
    if(!sessionId) {
      this.guestChatSessionService.addMessage('assistant', content);
    } else {
      this.chatSessionService
        .addMessage(this.sessionId, { role: 'assistant', content })
        .pipe(takeUntil(this.messageStreamDestroy$))
        .subscribe({
          error: (err) => console.error('Error:', err)
        });
    }
  }

  private createChatAndSendMessage(message: string) {
    return this.userService.currentUser$.pipe(
      switchMap(user => {
        if (!user) {
          return throwError(() => new Error('User not loaded'));
        }
        const dto: ICreateChatSession = {
          userId: user.userId,
          sessionName: message.substring(0, 50),
          context: undefined
        };

        return this.chatSessionService.create(dto).pipe(
          tap(newSession => {
            this.sessionId = newSession.id;
            this.guestChatSessionService.clearChatSession();
            this.messages$ = this.chatSessionService.messages$;
          })
        );
      })
    );
  }

  private sendWelcomeMessage(): void {
    const welcomeMessage = 'Hello! 👋 I am your guide to interesting places. Ask me about attractions in your city!';

    this.guestChatSessionService.addMessage('assistant', welcomeMessage);
    this.scheduleScroll();
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

