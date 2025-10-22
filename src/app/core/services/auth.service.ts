import {inject, Injectable} from '@angular/core';
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
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  constructor(private router: Router) {}

  register(userData: RegistrationData) {
    return this.http.post(`/api/auth/registration`, userData).pipe(
      tap(() => this.router.navigate(['/chat']))
    );
  }

  login(credentials: LoginData) {
    return this.http.post(`/api/auth/login`, credentials).pipe(
      tap(() => {
        this.isLoggedInSubject.next(true);
        this.router.navigate(['/chat']).then(()=>console.log("Logged in"))
      })
    );
  }

  forgotPassword(email: string): Observable<string> {
    return this.http.post<{ message: string }>(`/api/auth/forgot-password`, { email })
      .pipe(map(response => response.message));
  }

  verifyResetCode(email: string, code: string): Observable<any> {
    return this.http.post(`/api/auth/verify-reset-code`, { email, code });
  }

  resetPassword(email: string, code: string, newPassword: string): Observable<any> {
    return this.http.post(`/api/auth/reset-password`, {
      email,
      code,
      newPassword
    });
  }

  logout() {
    this.http.post(`/api/auth/logout`, {}).subscribe(() => {
      this.isLoggedInSubject.next(false);
      this.router.navigate(['/']).then(()=>console.log("Logged out"));
    });
  }

  isLoggedIn(): Observable<boolean> {
    return this.http.get(`/api/user/me`).pipe(
      tap(() => this.isLoggedInSubject.next(true)),
      map(() => true),
      catchError(() => {
        this.isLoggedInSubject.next(false);
        return of(false);
      })
    );
  }
}
