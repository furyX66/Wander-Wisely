import {Component, inject, OnInit} from '@angular/core';
import {MainTitleComponent} from '../../shared/main-screen/main-title/main-title.component';
import {HeaderComponent} from '../../shared/main-screen/header/header.component';
import {Router} from '@angular/router';
import {TripService} from '../../core/services/trip.service';
import {filter, Observable, of, switchMap, take} from 'rxjs';
import {ITrip} from '../../../interfaces/ITrip';
import {AsyncPipe, ViewportScroller} from '@angular/common';
import {AuthService} from '../../core/services/auth.service';
import {ICreateChatSession} from '../../../interfaces/ICreateChatSession';
import {UserService} from '../../core/services/user.service';
import {ChatSessionService} from '../../core/services/chat-session.service';
import {ModalType} from '../../enums/ModalType';
import {ModalService} from '../../core/services/modal.service';

@Component({
  selector: 'app-main-page',
  imports: [MainTitleComponent, HeaderComponent, AsyncPipe],
  templateUrl: './main-page.component.html',
  standalone: true,
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private tripService = inject(TripService);
  private modalService = inject(ModalService);
  private chatSessionService = inject(ChatSessionService);
  private scroller = inject(ViewportScroller);

  tripList!: Observable<ITrip[]>;

  ngOnInit() {
    this.tripList = this.tripService.getTripList();
  }

  startChatting(): void {
    this.router.navigate(['/chat']);
  }

  openTripInChat(trip: ITrip): void {
    this.authService.isLoggedIn()
      .pipe(
        take(1),
        switchMap(isLogged => {
          if (!isLogged) {
            this.modalService.openModal(ModalType.LOGIN);
            return of(null);
          }

          return this.userService.currentUser$.pipe(
            filter(user => !!user),
            take(1),
            switchMap(user => {
              const dto: ICreateChatSession = {
                userId: user.userId,
                sessionName: trip.name,
                context: JSON.stringify(trip),
                tripId: trip.id
              };
              return this.chatSessionService.create(dto);
            })
          );
        })
      )
      .subscribe({
        next: (session: any) => {
          if (session && session.id) {
            this.router.navigate(['/chat', session.id]);
          }
        },
        error: (err) => {
          console.error('Failed to create session:', err);
          this.router.navigate(['/chat'], {
            queryParams: { tripId: trip.id }
          });
        }
      });
  }

  scrollToTrips(): void {
    this.scroller.scrollToPosition([0, document.getElementById('trips')?.offsetTop || 0]);
  }
}

