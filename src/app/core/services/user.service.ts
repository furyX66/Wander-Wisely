import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, shareReplay, tap} from 'rxjs';
import {IUser} from '../../../interfaces/IUser';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  currentUserSubject = new BehaviorSubject<IUser | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private getCurrentUserCached$: Observable<IUser> | null = null;
  private hasRequestedUser = false;

  getCurrentUser(): Observable<IUser> {
    if (!this.getCurrentUserCached$) {
      this.getCurrentUserCached$ = this.http
        .get<IUser>(`/api/user/me`, {withCredentials: true})
        .pipe(
          tap(user => {
            this.currentUserSubject.next(user);
          }),
          shareReplay(1)
        );
    }
    if (!this.hasRequestedUser) {
      this.hasRequestedUser = true;
    }
    return this.getCurrentUserCached$;
  }

  updateUser(id: number, patch: any[]) {
    return this.http.patch<IUser>(`/api/user/${id}`, patch, {
      headers: { 'Content-Type': 'application/json-patch+json' }
    }).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
      }),
    )
  }

  changePassword(data: { currentPassword: string; newPassword: string }) {
    return this.http.post(`/api/user/change-password`, data);
  }
}
