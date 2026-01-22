import {Component, inject} from '@angular/core';
import {combineLatest, filter, map, Observable, of, shareReplay, switchMap, take} from 'rxjs';
import {UserService} from '../../core/services/user.service';
import {AuthService} from '../../core/services/auth.service';
import {AsyncPipe} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TripService} from '../../core/services/trip.service';
import {ITrip} from '../../../interfaces/ITrip';
import {ModalType} from '../../../enums/ModalType';
import {ICreateChatSession} from '../../../interfaces/ICreateChatSession';
import {ChatSessionService} from '../../core/services/chat-session.service';
import {ModalService} from '../../core/services/modal.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-user-trips-page',
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './user-trips-page.component.html',
  styleUrl: './user-trips-page.component.scss'
})
export class UserTripsPageComponent {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private tripsService = inject(TripService);
  private chatSessionService = inject(ChatSessionService);
  private modalService = inject(ModalService);
  private router = inject(Router);

  isLoggedIn$ = this.authService.authStatus$.pipe(
    map(status => status === true),
    shareReplay(1)
  );
  user$ = this.userService.currentUser$;
  userTrips$ = combineLatest([
    this.user$,
    this.isLoggedIn$
  ]).pipe(
    switchMap(([user, isLoggedIn]) => {
      if (!isLoggedIn || !user?.userId) {
        return [];
      }
      return this.tripsService.getMyTrips();
    }),
    shareReplay(1)
  );

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
            queryParams: {tripId: trip.id}
          });
        }
      });
  }
}
