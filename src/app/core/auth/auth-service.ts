import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, RegisterRequest, AuthResponse } from '../models/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private readonly _tokenKey = 'bp_token';

  private _isLoggedIn$ = new BehaviorSubject<boolean>(!!localStorage.getItem(this._tokenKey));
  isLoggedIn$ = this._isLoggedIn$.asObservable();

  get token(): string | null {
    return localStorage.getItem(this._tokenKey);
  }

  // LOGIN → appelle le backend
  login(body: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/signin`, body)
      .pipe(
        tap(res => {
          localStorage.setItem(this._tokenKey, res.token);
          this._isLoggedIn$.next(true);
        })
      );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('bp_token'); // ou ta clé réelle
  }


  // REGISTER → appelle le backend
  register(body: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/signup`, body)
      .pipe(
        tap(res => {
          localStorage.setItem(this._tokenKey, res.token);
          this._isLoggedIn$.next(true);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this._tokenKey);
    this._isLoggedIn$.next(false);
  }
}
