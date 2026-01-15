import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, map, Observable, of, shareReplay, switchMap, tap} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {UserService} from './user.service';

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
  private userService = inject(UserService);
  private authStatusSubject = new BehaviorSubject<boolean | null>(null);
  authStatus$: Observable<boolean | null> = this.authStatusSubject.asObservable();

  private isInitialized = false;

  initializeAuth(): Observable<boolean> {
    if (this.isInitialized) {
      return of(this.authStatusSubject.value !== null ? this.authStatusSubject.value : false);
    }
    return this.http.get<{ authenticated: boolean }>(`/api/user/me`).pipe(
      tap(() => {
        this.authStatusSubject.next(true);
        this.isInitialized = true;
      }),
      map(() => true),
      catchError(() => {
        this.authStatusSubject.next(false);
        this.isInitialized = true;
        return of(false);
      }),
      shareReplay(1)
    );
  }

  isLoggedIn(): Observable<boolean> {
    if (!this.isInitialized) {
      this.initializeAuth().subscribe();
    }

    return this.authStatusSubject.pipe(
      map(status => status === true)
    );
  }

  isInitializing(): boolean {
    return !this.isInitialized;
  }

  register(userData: RegistrationData): Observable<any> {
    return this.http.post(`/api/auth/registration`, userData).pipe(
      tap(() => {
        this.authStatusSubject.next(true);
        this.isInitialized = true;
      }),
      catchError(error => {
        console.error('Registration error:', error);
        this.authStatusSubject.next(false);
        throw error;
      })
    );
  }

  login(credentials: LoginData): Observable<any> {
    return this.http.post(`/api/auth/login`, credentials).pipe(
      switchMap(() => {
        this.isInitialized = false;
        this.authStatusSubject.next(null);

        return this.initializeAuth();
      }),
      catchError(error => {
        console.error('Login error:', error);
        this.authStatusSubject.next(false);
        this.isInitialized = false;
        throw error;
      })
    );
  }

  forgotPassword(email: string): Observable<string> {
    return this.http.post<{ message: string }>(`/api/auth/forgot-password`, { email })
      .pipe(
        map(response => response.message),
        catchError(error => {
          console.error('Forgot password error:', error);
          throw error;
        })
      );
  }

  verifyResetCode(email: string, code: string): Observable<any> {
    return this.http.post(`/api/auth/verify-reset-code`, { email, code })
      .pipe(
        catchError(error => {
          console.error('Verify reset code error:', error);
          throw error;
        })
      );
  }

  resetPassword(email: string, code: string, newPassword: string): Observable<any> {
    return this.http.post(`/api/auth/reset-password`, {
      email,
      code,
      newPassword
    }).pipe(
      catchError(error => {
        console.error('Reset password error:', error);
        throw error;
      })
    );
  }

  logout(): Observable<void> {


    return this.http.post<void>(`/api/auth/logout`, {}).pipe(
      tap(() => {
        this.userService.clearCache();
        this.authStatusSubject.next(false);
        this.isInitialized = false;
        console.log('Successfully logged out');
      }),
      catchError(error => {
        console.warn('Server logout failed, but local state is cleared:', error);
        this.userService.clearCache();
        this.authStatusSubject.next(false);
        this.isInitialized = false;
        return of(void 0);
      })
    );
  }
}
