import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {BehaviorSubject, map, Observable, of} from 'rxjs';
import {tap} from 'rxjs';
import {catchError} from 'rxjs/operators';

interface RegistrationData {
  username: string;
  email: string;
  password: string;
}

interface LoginData {
  emailOrUsername: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient, private router: Router,) {}

  register(userData: RegistrationData) {
    return this.http.post(`${this.apiUrl}/auth/registration`, userData).pipe(
      tap(() => this.router.navigate(['/chat']))
    );
  }

  login(credentials: LoginData) {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials, { withCredentials: true }).pipe(
      tap(() => {
        this.isLoggedInSubject.next(true);
        this.router.navigate(['/chat']);
      })
    );
  }

  forgotPassword(email: string): Observable<string> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/auth/forgot-password`, { email })
      .pipe(
        map(response => response.message)
      );
  }

  logout() {
    this.http.post(`${this.apiUrl}/auth/logout`, {}, { withCredentials: true }).subscribe(() => {
      this.isLoggedInSubject.next(false);
      this.router.navigate(['/']);
    });
  }

  checkAuthStatus(): Observable<boolean> {
    return this.http.get(`${this.apiUrl}/user/me`, { withCredentials: true }).pipe(
      tap(() => this.isLoggedInSubject.next(true)),
      map(() => true),
      catchError(() => {
        this.isLoggedInSubject.next(false);
        return of(false);
      })
    );
  }
}
