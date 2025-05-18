import { Injectable } from '@angular/core';
import {environment} from '../../enviroments/environment';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {tap} from 'rxjs';

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

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  register(userData: RegistrationData) {
    return this.http.post(`${this.apiUrl}/user/registration`, userData).pipe(
      tap(() => this.router.navigate(['/chat']))
    );
  }

  login(credentials: LoginData) {
    return this.http.post(`${this.apiUrl}/user/login`, credentials).pipe(
      tap((res: any) => {
        localStorage.setItem('authToken', res.token);
        this.router.navigate(['/profile']);
      })
    );
  }

  logout() {
    localStorage.removeItem('authToken');
    this.router.navigate(['/']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }
}
