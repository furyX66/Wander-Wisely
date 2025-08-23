import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {UserType} from '../../../types/UserType';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;
  currentUserSubject = new BehaviorSubject<UserType | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<UserType> {
    return this.http.get<UserType>(`${this.apiUrl}/user/me`, {withCredentials: true}).pipe(
      tap(user => this.currentUserSubject.next(user))
    );
  }

  updateUser(id: number, patch: any[]) {
    return this.http.patch<UserType>(`${this.apiUrl}/user/${id}`, patch, {
      headers: { 'Content-Type': 'application/json-patch+json' }
    });
  }

  changePassword(data: { currentPassword: string; newPassword: string }) {
    return this.http.post(`${this.apiUrl}/user/change-password`, data);
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${id}`);
  }
}
