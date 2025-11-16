import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ColorSchemeSwitchComponent} from '../../common-ui/color-scheme-switch/color-scheme-switch.component';
import {LogoComponent} from '../../common-ui/logo/logo.component';
import {AuthService} from '../../../core/services/auth.service';
import {filter, map, Observable, shareReplay, Subject, switchMap, takeUntil} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {ProfileIconComponent} from '../../../../../public/assets/icons/profile-icon.component';
import {UserMenuComponent} from '../../modals/user-menu/user-menu.component';
import {UserService} from '../../../core/services/user.service';
import {NewChatIconComponent} from '../../../../../public/assets/icons/new-chat-icon.component';
import {ModalService} from '../../../core/services/modal.service';
import {ModalType} from '../../../enums/ModalType';
import {SearchIconComponent} from '../../../../../public/assets/icons/search-icon.component';
import {ButtonComponent} from '../../common-ui/button/button.component';
import {CrossIconComponent} from '../../../../../public/assets/icons/cross-icon.component';
import {GuestChatSessionService} from '../../../core/services/guest-chat-session.service';
import {ChatSessionService} from '../../../core/services/chat-session.service';
import {ICreateChatSession} from '../../../../interfaces/ICreateChatSession';
import {ActivatedRoute, Router} from '@angular/router';
import {IChatSession} from '../../../../interfaces/IChatSession';

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
  private activatedRoute = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private destroy$ = new Subject<void>();
  showUserMenu = false;
  chatSessions : IChatSession[] = [];

  isLoggedIn$ = this.authService.authStatus$.pipe(
    map(status => status === true),
    shareReplay(1)
  );
  user$ = this.userService.currentUser$;
  currentSessionId$ = this.activatedRoute.params.pipe(
    map(params => Number(params['id']) || null),
    shareReplay(1)
  );

  ngOnInit() {
    if (this.authService.isInitializing()) {
      this.authService.initializeAuth()
        .pipe(takeUntil(this.destroy$))
        .subscribe();
    }
    this.isLoggedIn$
      .pipe(
        switchMap(isLoggedIn => {
          if (!isLoggedIn) {
            this.chatSessions = [];
            return [];
          }
          return this.user$.pipe(
            filter(user => !!user),
            switchMap(user => {
              return this.chatSessionService.getUserSessions(user.userId);
            })
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (sessions) => {
          this.chatSessions = sessions;
        },
        error: (error) => {
          console.error('Failed to load sessions:', error);
          this.chatSessions = [];
        }
      })
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
        filter(user => !!user),
        takeUntil(this.destroy$)
      )
      .subscribe(user => {
        const dto: ICreateChatSession = {
          userId: user.userId,
          sessionName: `Chat ${new Date().toLocaleString('pl-PL')}`,
          context: undefined
        };
        this.chatSessionService.create(dto)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (newSession) => {
              this.router.navigate(['/chat', newSession.id]);
              this.showUserMenu = false;
              this.chatSessions.unshift(newSession);
            },
            error: (error) => {
              console.error('Failed to create chat:', error);
            }
          });
      });
  }

  deleteChat(sessionId: number): void {
    this.chatSessionService.delete(sessionId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.chatSessions = this.chatSessions.filter(s => s.id !== sessionId);
        },
        error: (error) => {
          console.error('Failed to delete:', error);
        }
      });
  }

  navigateToChat(id : number): void {
    this.router.navigate(['/chat', id]);
  }

  clearChat(): void {
    if (this.guestChatSessionService.hasMessages()) {
      this.modalService.openModal(ModalType.CLEAR_CHAT);
    } else{
      this.guestChatSessionService.clearChatSession();
    }
  }

  isActiveChat(sessionId: number): Observable<boolean> {
    return this.currentSessionId$.pipe(
      map(id => id === sessionId)
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
