import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {MainTitleComponent} from '../../shared/main-screen/main-title/main-title.component';
import {HeaderComponent} from '../../shared/main-screen/header/header.component';
import {ChatSessionService} from '../../core/services/chat-session.service';
import {Router} from '@angular/router';
import {UserService} from '../../core/services/user.service';
import {Observable, Subject, takeUntil} from 'rxjs';
import {ICreateChatSession} from '../../../interfaces/ICreateChatSession';
import {AuthService} from '../../core/services/auth.service';

@Component({
  selector: 'app-main-page',
  imports: [MainTitleComponent, HeaderComponent],
  templateUrl: './main-page.component.html',
  standalone: true,
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private authService = inject(AuthService);
  private chatSessionService = inject(ChatSessionService);
  private userService = inject(UserService);
  private destroy$ = new Subject<void>();

  authStatus$!: Observable<boolean | null>;

  ngOnInit() {
    this.authStatus$ = this.authService.authStatus$;
  }

  startChatting(): void {
    this.authService.isLoggedIn()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isLoggedIn => {
        if (!isLoggedIn) {
          this.router.navigate(['/chat']);
          return;
        }

        this.userService.getCurrentUser()
          .pipe(takeUntil(this.destroy$))
          .subscribe(user => {
            const dto: ICreateChatSession = {
              userId: user.userId,
              sessionName: 'New Chat',
              context: undefined
            };

            this.chatSessionService.create(dto)
              .pipe(takeUntil(this.destroy$))
              .subscribe(session => {
                this.router.navigate(['/chat', session.id]);
              });
          });
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

