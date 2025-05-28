import { Injectable } from '@angular/core';
import {environment} from '../../enviroments/environment';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import {tap} from 'rxjs';
import {UserType} from '../../types/UserType';

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
  private currentUserSubject = new BehaviorSubject<UserType | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {this.isLoggedInSubject.next(this.isLoggedIn());}

  register(userData: RegistrationData) {
    return this.http.post(`${this.apiUrl}/user/registration`, userData).pipe(
      tap(() => this.router.navigate(['/chat']))
    );
  }

  login(credentials: LoginData) {
    return this.http.post(`${this.apiUrl}/user/login`, credentials).pipe(
      tap((res: any) => {
        localStorage.setItem('authToken', res.value.token);
        this.isLoggedInSubject.next(true);
        this.router.navigate(['/chat']);
      })
    );
  }

  getCurrentUser(): Observable<UserType> {
    return this.http.get<UserType>(`${this.apiUrl}/user/me`).pipe(
      tap(user => this.currentUserSubject.next(user))
    );
  }

  logout() {
    localStorage.removeItem('authToken');
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }
}
