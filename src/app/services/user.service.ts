// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private apiUrl = 'http://localhost:5000/api/user';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  registerUser(dto: RegistrationUserDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/registration`, dto);
  }

  loginUser(dto: LoginUserDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, dto);
  }
}
