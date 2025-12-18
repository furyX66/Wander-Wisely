import {Component, inject, OnInit} from '@angular/core';
import {MainTitleComponent} from '../../shared/main-screen/main-title/main-title.component';
import {HeaderComponent} from '../../shared/main-screen/header/header.component';
import {Router} from '@angular/router';
import {TripService} from '../../core/services/trip.service';
import {Observable} from 'rxjs';
import {ITrip} from '../../../interfaces/ITrip';
import {AsyncPipe, ViewportScroller} from '@angular/common';

@Component({
  selector: 'app-main-page',
  imports: [MainTitleComponent, HeaderComponent, AsyncPipe],
  templateUrl: './main-page.component.html',
  standalone: true,
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent implements OnInit {
  private router = inject(Router);
  private tripService = inject(TripService);
  private scroller = inject(ViewportScroller);

  tripList!: Observable<ITrip[]>;

  ngOnInit() {
    this.tripList = this.tripService.getTripList();
    this.tripList.subscribe(console.log)
  }

  startChatting(): void {
    this.router.navigate(['/chat']);
  }

  scrollToTrips(): void {
    this.scroller.scrollToPosition([0, document.getElementById('trips')?.offsetTop || 0]);
  }
}

