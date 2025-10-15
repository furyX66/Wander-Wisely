import {inject, Injectable} from '@angular/core';
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
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  constructor(private router: Router) {}

  register(userData: RegistrationData) {
    return this.http.post(`${this.apiUrl}/auth/registration`, userData).pipe(
      tap(() => this.router.navigate(['/chat']))
    );
  }

  login(credentials: LoginData) {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(() => {
        this.isLoggedInSubject.next(true);
        this.router.navigate(['/chat']).then(()=>console.log("Logged in"))
      })
    );
  }

  forgotPassword(email: string): Observable<string> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/auth/forgot-password`, { email })
      .pipe(map(response => response.message));
  }

  verifyResetCode(email: string, code: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/verify-reset-code`, { email, code });
  }

  resetPassword(email: string, code: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/reset-password`, {
      email,
      code,
      newPassword
    });
  }

  logout() {
    this.http.post(`${this.apiUrl}/auth/logout`, {}).subscribe(() => {
      this.isLoggedInSubject.next(false);
      this.router.navigate(['/']).then(()=>console.log("Logged out"));
    });
  }

  checkAuthStatus(): Observable<boolean> {
    return this.http.get(`${this.apiUrl}/user/me`).pipe(
      tap(() => this.isLoggedInSubject.next(true)),
      map(() => true),
      catchError(() => {
        this.isLoggedInSubject.next(false);
        return of(false);
      })
    );
  }
}
