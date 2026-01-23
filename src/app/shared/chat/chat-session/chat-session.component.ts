import {AfterViewChecked, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ArrowIconComponent} from "../../../../../public/assets/icons/arrow-icon.component";
import {AssistantIconComponent} from "../../../../../public/assets/icons/assistant-icon.component";
import {AssistantMessageComponent} from "../assistant-message/assistant-message.component";
import {AsyncPipe} from "@angular/common";
import {ChatInputComponent} from "../../common-ui/chat-input/chat-input.component";
import {
    LoadingAnimationComponent
} from "../../../../../public/assets/animations/loading-animation/loading-animation.component";
import {OptionsBarComponent} from "../options-bar/options-bar.component";
import {UserMessageComponent} from "../user-message/user-message.component";
import {NotificationService} from '../../../core/services/notification.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ChatService} from '../../../core/services/chat.service';
import {ChatSessionService} from '../../../core/services/chat-session.service';
import {GuestChatSessionService} from '../../../core/services/guest-chat-session.service';
import {AttractionService} from '../../../core/services/attraction.service';
import {TripService} from '../../../core/services/trip.service';
import {UserService} from '../../../core/services/user.service';
import {AuthService} from '../../../core/services/auth.service';
import {
  exhaustMap,
  filter,
  finalize,
  forkJoin,
  Observable,
  of,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap,
  throwError
} from 'rxjs';
import {IChatMessage} from '../../../../interfaces/IChatMessage';
import {ITrip} from '../../../../interfaces/ITrip';
import {IChatSession} from '../../../../interfaces/IChatSession';
import {catchError} from 'rxjs/operators';
import {ICreateChatSession} from '../../../../interfaces/ICreateChatSession';
import {ICreateTrip} from '../../../../interfaces/ICreateTrip';
import {ChatResponse} from '../../../features/chat-page/chat-page.component';
import {MapComponent} from '../map/map.component';

@Component({
  selector: 'app-chat-session',
  imports: [
    ArrowIconComponent,
    AssistantIconComponent,
    AssistantMessageComponent,
    AsyncPipe,
    ChatInputComponent,
    LoadingAnimationComponent,
    OptionsBarComponent,
    UserMessageComponent,
    MapComponent
  ],
  templateUrl: './chat-session.component.html',
  styleUrl: './chat-session.component.scss'
})
export class ChatSessionComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  private notificationService = inject(NotificationService);
  private route = inject(ActivatedRoute);
  private chatService = inject(ChatService);
  private chatSessionService = inject(ChatSessionService);
  private guestChatSessionService = inject(GuestChatSessionService);
  private attractionService = inject(AttractionService);
  private tripService = inject(TripService);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();
  private messageStreamDestroy$ = new Subject<void>();
  private messageSend$ = new Subject<string>();

  messages$!: Observable<IChatMessage[]>;
  sessionId: number | null = null;
  trip?: ITrip | null;
  session!: IChatSession;
  contextObj?: any;
  showScrollButton = false;
  shouldScrollToBottom = false;
  isUserScrolledUp = false;
  isLoading = false;
  selectedAttractions: Set<number> = new Set();

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const idParam = params['id'];
      this.sessionId = idParam ? Number(idParam) : null;
      this.chatSessionService.clearAttractions(null);
      this.messageStreamDestroy$.next();
      this.loadSession();
    });

    this.authService.authStatus$
      .pipe(
        takeUntil(this.destroy$),
        filter((status) => status === true)
      )
      .subscribe(() => {
        if (!this.sessionId) {
          this.chatSessionService.clearAttractions(null);
          this.messages$ = this.guestChatSessionService.messages$;
        }
        this.guestChatSessionService.clearChatSession();
      });

    this.chatSessionService.attractions$
      .pipe(takeUntil(this.destroy$))
      .subscribe();

    this.attractionService.selected$
      .pipe(takeUntil(this.destroy$))
      .subscribe((selected) => {
        this.selectedAttractions = selected;
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
    this.messageStreamDestroy$.next();
    this.messageStreamDestroy$.complete();
  }

  private loadSession(): void {
    if (!this.sessionId) {
      console.log('No sessionId → new/guest session');
      this.messages$ = this.guestChatSessionService.messages$;
      if (!this.guestChatSessionService.isWelcomeShown()) {
        this.sendWelcomeMessage();
        this.guestChatSessionService.setWelcomeShown();
      }
      this.setupMessageStream();
      return;
    }

    console.log(
      'Authorized session - loading from server, sessionId:',
      this.sessionId
    );
    this.messages$ = this.chatSessionService.messages$;

    this.chatSessionService
      .getSessionById(this.sessionId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((dto) => {
        this.session = dto.session;

        this.trip = dto.trip;
        console.log(this.trip);
        if (this.trip && this.trip.route && this.trip.route.length > 0) {
          this.chatSessionService.setAttractions(
            this.sessionId,
            this.trip.route
          );
        }

        if (
          this.trip &&
          this.trip.id &&
          (!dto.messages || dto.messages.length === 0)
        ) {
          this.sendTripWelcomeMessage();
        }

        if (this.session.context) {
          try {
            this.contextObj = JSON.parse(this.session.context);
          } catch {
            console.warn('Invalid JSON context');
          }
        }
      });

    this.chatSessionService.loadAttractionsFromStorage(this.sessionId);
    this.setupMessageStream();
  }

  private setupMessageStream(): void {
    this.messageSend$
      .pipe(
        filter((msg) => !!msg.trim()),
        tap(() => (this.isLoading = true)),
        exhaustMap((message) => this.processMessage(message)),
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

  private processGuestOrNewAuthorizedChat(
    message: string
  ): Observable<ChatResponse | null> {
    return this.authService.isLoggedIn().pipe(
      take(1),
      switchMap((isLoggedIn) => {
        if (isLoggedIn) {
          return this.createAndSendAuthorizedChat(message);
        } else {
          return this.sendGuestMessage(message);
        }
      }),
      tap((res) => this.handleResponse(res)),
      catchError((error) => this.handleError(error)),
      finalize(() => (this.isLoading = false))
    );
  }

  private processAuthorizedChat(
    message: string
  ): Observable<ChatResponse | null> {
    this.saveUserMessage(this.sessionId!, message);

    return this.chatService.chatAsk(this.sessionId!, message).pipe(
      tap((res) => this.handleResponse(res)),
      catchError((error) => this.handleError(error)),
      finalize(() => (this.isLoading = false))
    );
  }

  private createAndSendAuthorizedChat(
    message: string
  ): Observable<ChatResponse | null> {
    localStorage.removeItem('guestChat');

    return this.createChatAndSendMessage(message).pipe(
      tap(() => {
        console.log('Chat created with ID:', this.sessionId);
        this.messages$ = this.chatSessionService.messages$;
      }),
      switchMap(() => {
        this.saveUserMessage(this.sessionId!, message);
        return this.chatService.chatAsk(this.sessionId!, message);
      })
    );
  }

  private sendGuestMessage(message: string): Observable<ChatResponse | null> {
    this.guestChatSessionService.addMessage('user', message);
    return this.chatService.guestChatAsk(message);
  }

  private handleResponse(res: ChatResponse | null): void {
    if (!res?.reply) return;
    console.log('Received response:', res);
    this.saveAssistantMessage(res.reply, this.sessionId!);
    if (res.places) {
      this.chatSessionService.setAttractions(this.sessionId, res.places);
    }
    this.scheduleScroll();
    if (this.sessionId && this.router.url !== `/chat/${this.sessionId}`) {
      this.router.navigate(['/chat', this.sessionId], { replaceUrl: true });
    }
  }

  private handleError(error: any, sessionId?: number): Observable<null> {
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
          error: (err) => console.error('Error:', err),
        });
    }
  }

  private saveAssistantMessage(content: string, sessionId?: number): void {
    if (!sessionId) {
      this.guestChatSessionService.addMessage('assistant', content);
    } else {
      this.chatSessionService
        .addMessage(this.sessionId!, { role: 'assistant', content })
        .pipe(takeUntil(this.messageStreamDestroy$))
        .subscribe({
          error: (err) => console.error('Error:', err),
        });
    }
  }

  private createChatAndSendMessage(message: string) {
    return this.userService.currentUser$.pipe(
      switchMap((user) => {
        if (!user) {
          return throwError(() => new Error('User not loaded'));
        }
        const dto: ICreateChatSession = {
          userId: user.userId,
          sessionName: message.substring(0, 50),
          context: this.trip ? JSON.stringify(this.trip) : undefined,
          tripId: this.trip?.id ?? null,
        };

        return this.chatSessionService.create(dto).pipe(
          tap((newSession) => {
            this.sessionId = newSession.id;
            this.guestChatSessionService.clearChatSession();
            this.messages$ = this.chatSessionService.messages$;
          })
        );
      })
    );
  }

  private sendWelcomeMessage(): void {
    const welcomeMessage =
      'Hello! 👋 I am your guide to interesting places. Ask me about attractions in your city!';

    this.guestChatSessionService.addMessage('assistant', welcomeMessage);
    this.scheduleScroll();
  }

  private sendTripWelcomeMessage(): void {
    const tripWelcome = `Welcome to your trip planning! 🗺️ I see you're interested in ${
      this.trip?.name || 'an amazing trip'
    }. Let me help you discover the best attractions and experiences. Tell me what kind of places interest you, or I can suggest some popular spots!`;
    this.chatSessionService
      .addMessage(this.sessionId!, {
        role: 'assistant',
        content: tripWelcome,
      })
      .pipe(takeUntil(this.messageStreamDestroy$))
      .subscribe({
        error: (err) => console.error('Error sending trip welcome:', err),
      });

    this.scheduleScroll();
  }

  saveTrip(): void {
    this.chatSessionService.attractions$
      .pipe(take(1))
      .subscribe((attractions) => {
        const selectedIds = this.attractionService.getSelected();

        if (!selectedIds || selectedIds.size === 0) {
          console.warn('No attractions selected');
          return;
        }

        const selectedAttractions = attractions.filter((a) =>
          selectedIds.has(a.id ?? -1)
        );

        if (!selectedAttractions || selectedAttractions.length === 0) {
          return;
        }

        const tripDto: ICreateTrip = {
          name: this.session?.sessionName ?? 'My trip',
          startDate: null,
          endDate: null,
          whereFrom: null,
          whereTo: null,
          budget: null,
        };

        this.tripService
          .createTrip(tripDto)
          .pipe(
            switchMap((trip) => {
              const tripId = trip.id;

              return forkJoin(
                selectedAttractions.map((dto) =>
                  this.tripService.addPlace(tripId, dto)
                )
              );
            })
          )
          .subscribe({
            next: () => {
              console.log(
                'Trip saved with',
                selectedAttractions.length,
                'attractions'
              );
              this.notificationService.showSuccess(
                '✅ Trip saved successfully!'
              );
            },
            error: (err) => {
              this.notificationService.showError('❌ Failed to save trip');
              console.error('Save trip error', err);
            },
          });
      });
  }

  handleChatInput(value: string): void {
    if (!value.trim() || this.isLoading) return;
    this.scheduleScroll();
    this.messageSend$.next(value);
  }

  onScroll(): void {
    const el = this.chatContainer.nativeElement;
    const atBottom =
      Math.abs(el.scrollHeight - el.scrollTop - el.clientHeight) < 5;
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
