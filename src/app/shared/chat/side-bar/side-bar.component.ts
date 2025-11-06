import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ColorSchemeSwitchComponent} from '../../common-ui/color-scheme-switch/color-scheme-switch.component';
import {LogoComponent} from '../../common-ui/logo/logo.component';
import {AuthService} from '../../../core/services/auth.service';
import {map, shareReplay, Subject, takeUntil} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {ProfileIconComponent} from '../../../../../public/assets/icons/profile-icon.component';
import {UserMenuComponent} from '../../modals/user-menu/user-menu.component';
import {UserService} from '../../../core/services/user.service';
import {NewChatIconComponent} from '../../../../../public/assets/icons/new-chat-icon';
import {ModalService} from '../../../core/services/modal.service';
import {ModalType} from '../../../enums/ModalType';
import {SearchIconComponent} from '../../../../../public/assets/icons/search-icon.component';
import {ButtonComponent} from '../../common-ui/button/button.component';
import {CrossIconComponent} from '../../../../../public/assets/icons/cross-icon.component';
import {GuestChatSessionService} from '../../../core/services/guest-chat-session.service';
import {ChatSessionService} from '../../../core/services/chat-session.service';
import {CreateChatSession} from '../../../../interfaces/CreateChatSession';
import {Router} from '@angular/router';

@Component({
  selector: 'app-side-bar',
  imports: [
    ColorSchemeSwitchComponent,
    LogoComponent,
    AsyncPipe,
    ProfileIconComponent,
    UserMenuComponent,
    NewChatIconComponent,
    SearchIconComponent,
    ButtonComponent,
    CrossIconComponent,
  ],
  templateUrl: './side-bar.component.html',
  standalone: true,
  styleUrl: './side-bar.component.scss'
})

export class SideBarComponent implements OnInit, OnDestroy {
  private modalService = inject(ModalService);
  private userService = inject(UserService);
  private guestChatSessionService = inject(GuestChatSessionService);
  private chatSessionService = inject(ChatSessionService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private destroy$ = new Subject<void>();
  showUserMenu = false;

  isLoggedIn$ = this.authService.authStatus$.pipe(
    map(status => status === true),
    shareReplay(1)
  );
  user$ = this.userService.getCurrentUser().pipe(shareReplay(1));

  ngOnInit() {
    if (this.authService.isInitializing()) {
      this.authService.initializeAuth()
        .pipe(takeUntil(this.destroy$))
        .subscribe();
    }
  }

  openLoginModal(): void {
    this.modalService.openModal(ModalType.LOGIN);
  }

  openRegistrationModal(): void {
    this.modalService.openModal(ModalType.REGISTER);
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  createNewChat(): void {
    this.user$
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(user => {
        const dto: CreateChatSession = {
          userId: user.userId,
          sessionName: 'New Chat',
          context: undefined
        };
        this.chatSessionService.create(dto)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (newSession) => {
              console.log('Chat session created:', newSession);
              this.router.navigate(['/chat', newSession.id]);
              this.showUserMenu = false;
            },
            error: (error) => {
              console.error('Failed to create chat:', error);
            }
          });
      });
    console.log('Create new chat');
  }

  clearChat(): void {
    this.guestChatSessionService.clearChatSession()
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
