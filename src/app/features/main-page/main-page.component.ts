import {Component, inject} from '@angular/core';
import {MainTitleComponent} from '../../shared/main-screen/main-title/main-title.component';
import {HeaderComponent} from '../../shared/main-screen/header/header.component';
import {ChatInputComponent} from "../../shared/common-ui/chat-input/chat-input.component";
import {ChatSessionService} from '../../core/services/chat-session.service';
import {Router} from '@angular/router';
import {UserService} from '../../core/services/user.service';
import {take} from 'rxjs';
import {CreateChatSession} from '../../../interfaces/CreateChatSession';
import {AuthService} from '../../core/services/auth.service';
import {GuestChatSessionService} from '../../core/services/guest-chat-session.service';

@Component({
  selector: 'app-main-page',
  imports: [MainTitleComponent, HeaderComponent, ChatInputComponent,],
  templateUrl: './main-page.component.html',
  standalone: true,
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {
  private chatSessionService = inject(ChatSessionService);
  private router = inject(Router);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private guestService = inject(GuestChatSessionService);

  handleChatInput(value: string) {
    const trimmed = value.trim();
    const sessionName = trimmed || 'New session';
    const initialContext = trimmed ? { initialMessage: trimmed, timestamp: new Date().toISOString() } : null;

    this.authService.isLoggedIn().pipe(take(1)).subscribe(isLoggedIn => {
      if (!isLoggedIn) {
        this.guestService.initSession({
          sessionName,
          context: initialContext
        });
        this.router.navigate(['/chat']);
        return;
      }

      this.userService.getCurrentUser().pipe(take(1)).subscribe(user => {
        const context = initialContext
          ? JSON.stringify({ ...initialContext, userName: user.username })
          : undefined;

        const dto: CreateChatSession = {
          userId: user.id,
          sessionName,
          context
        };

        this.chatSessionService.create(dto).subscribe(session => {
          this.router.navigate(['/chat', session.id]);
        });
      });
    });
  }
}
