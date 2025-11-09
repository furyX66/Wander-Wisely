import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {IUser} from '../../../interfaces/IUser';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  currentUserSubject = new BehaviorSubject<IUser | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  getCurrentUser(): Observable<IUser> {
    return this.http.get<IUser>(`/api/user/me`, {withCredentials: true}).pipe(
      tap(user => {
        this.currentUserSubject.next(user)
      }),
    );
  }

  updateUser(id: number, patch: any[]) {
    return this.http.patch<IUser>(`/api/user/${id}`, patch, {
      headers: { 'Content-Type': 'application/json-patch+json' }
    });
  }

  changePassword(data: { currentPassword: string; newPassword: string }) {
    return this.http.post(`/api/user/change-password`, data);
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(`/api/user/${id}`);
  }
}
