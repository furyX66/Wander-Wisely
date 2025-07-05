import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {UserType} from '../../../types/UserType';
import {environment} from '../../../environments/environment';

export interface RegistrationUserDto {
  username: string;
  email: string;
  password: string;
}

export interface LoginUserDto {
  emailOrUsername: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<UserType | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getCurrentUser(): Observable<UserType> {
    return this.http.get<UserType>(`${this.apiUrl}/user/me`).pipe(
      tap(user => this.currentUserSubject.next(user))
    );
  }

  updateUser(id: number, patch: any[]) {
    return this.http.patch(`${this.apiUrl}/user/${id}`, patch, {
      headers: { 'Content-Type': 'application/json-patch+json' }
    });
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
}
