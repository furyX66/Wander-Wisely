import {Component, inject, OnInit} from '@angular/core';
import {combineLatest, filter, map, of, shareReplay, switchMap, take} from 'rxjs';
import {UserService} from '../../core/services/user.service';
import {AuthService} from '../../core/services/auth.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TripService} from '../../core/services/trip.service';
import {ITrip} from '../../../interfaces/ITrip';
import {ModalType} from '../../../enums/ModalType';
import {ICreateChatSession} from '../../../interfaces/ICreateChatSession';
import {ChatSessionService} from '../../core/services/chat-session.service';
import {ModalService} from '../../core/services/modal.service';
import {Router} from '@angular/router';
import {CrossIconComponent} from '../../../../public/assets/icons/cross-icon.component';
import {SearchIconComponent} from '../../../../public/assets/icons/search-icon.component';

@Component({
  selector: 'app-user-trips-page',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CrossIconComponent,
    SearchIconComponent
  ],
  templateUrl: './user-trips-page.component.html',
  styleUrl: './user-trips-page.component.scss'
})
export class UserTripsPageComponent implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private tripsService = inject(TripService);
  private chatSessionService = inject(ChatSessionService);
  private modalService = inject(ModalService);
  private router = inject(Router);

  searchQuery: string = '';
  userTrips: ITrip[] = [];
  filteredTrips: ITrip[] = [];

  ngOnInit() {
    this.tripsService.getMyTrips().subscribe(trips => {
      this.userTrips = trips;
      this.filteredTrips = trips;
    });
  }

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

  onSearchChange(query: string): void {
    this.searchQuery = query;
    if (!query.trim()) {
      this.filteredTrips = this.userTrips;
    } else {
      const lowerQuery = query.toLowerCase().trim();
      this.filteredTrips = this.userTrips.filter(trip =>
        trip.name.toLowerCase().includes(lowerQuery)
      );
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.filteredTrips = this.userTrips;
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
            queryParams: {tripId: trip.id}
          });
        }
      });
  }
}
