import {Component, inject} from '@angular/core';
import {MainTitleComponent} from '../../shared/main-screen/main-title/main-title.component';
import {HeaderComponent} from '../../shared/main-screen/header/header.component';
import {ChatInputComponent} from "../../shared/common-ui/chat-input/chat-input.component";
import {ChatSessionService} from '../../core/services/chat-session.service';
import {Router} from '@angular/router';
import {UserService} from '../../core/services/user.service';
import {take} from 'rxjs';
import {CreateChatSession} from '../../../interfaces/CreateChatSession';

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

  handleChatInput(value: string) {
    console.log("Clicked");
    this.userService.getCurrentUser().pipe(take(1)).subscribe(user => {
      const trimmed = value.trim();
      const sessionName = trimmed || 'New session';
      console.log("Clicked", sessionName);

      const context = trimmed
        ? JSON.stringify({
          initialMessage: trimmed,
          userName: user.username,
          timestamp: new Date().toISOString()
        })
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
  }
}
