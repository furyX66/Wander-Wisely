import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ICreateTrip} from '../../../interfaces/ICreateTrip';
import {ITrip} from '../../../interfaces/ITrip';
import {ITripAttraction} from '../../../interfaces/ITripAttraction';
import {IAttraction} from '../../../interfaces/IAttraction';

@Injectable({ providedIn: 'root' })
export class TripService {
  private http = inject(HttpClient);
  private base = '/api/trip';

  createTrip(dto: ICreateTrip): Observable<ITrip> {
    return this.http.post<ITrip>(this.base, dto);
  }

  addPlace(tripId: number, dto: IAttraction): Observable<ITripAttraction> {
    return this.http.post<ITripAttraction>(`${this.base}/${tripId}/attractions`, dto);
  }

  getTripById(tripId: number): Observable<ITrip> {
    return this.http.get<ITrip>(`${this.base}/${tripId}`);
  }

  getTripList(): Observable<ITrip[]> {
    return this.http.get<ITrip[]>(`${this.base}`);
  }
}
