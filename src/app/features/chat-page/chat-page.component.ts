import {AfterViewChecked, ChangeDetectorRef, Component, ElementRef, ViewChild} from '@angular/core';
import {SideBarComponent} from '../../shared/chat/side-bar/side-bar.component';
import {ChatInputComponent} from '../../shared/common-ui/chat-input/chat-input.component';
import {MapComponent} from '../../shared/common-ui/map/map.component';
import {UserMessageComponent} from '../../shared/chat/user-message/user-message.component';
import {HttpClient} from '@angular/common/http';
import {AssistantMessageComponent} from '../../shared/chat/assistant-message/assistant-message.component';
import {ChatMessage} from '../../../types/ChatMessageType';
import {ProfileIcon} from '../../../../public/assets/icons/arrow-icon';
import {exhaustMap, filter, finalize, of, Subject, tap} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {
  LoadingAnimationComponent
} from '../../../../public/assets/animations/loading-animation/loading-animation.component';
import {AssesstantIconComponent} from '../../../../public/assets/icons/assistant-icon';

@Component({
  selector: 'app-chat-page',
  imports: [
    SideBarComponent,
    ChatInputComponent,
    MapComponent,
    UserMessageComponent,
    AssistantMessageComponent,
    ProfileIcon,
    LoadingAnimationComponent,
    AssesstantIconComponent
  ],
  templateUrl: './chat-page.component.html',
  standalone: true,
  styleUrl: './chat-page.component.scss'
})
export class ChatPageComponent implements AfterViewChecked {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  messages: ChatMessage[] = [];
  nextId = 0;
  showScrollButton = false;
  shouldScrollToBottom = false;
  isUserScrolledUp = false;

  private messageSend$ = new Subject<string>();
  isLoading = false;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {
    this.messageSend$.pipe(
      filter(msg => !!msg.trim()),
      tap(() => this.isLoading = true),
      exhaustMap(message =>
        this.http.post<{ reply: string }>('/api/chat', { message }).pipe(
          tap(res => this.addAssistantMessage(res.reply)),
          catchError(() => {
            this.addAssistantMessage('Server error');
            return of(null);
          }),
          finalize(() => this.isLoading = false)
        )
      )
    ).subscribe();
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
