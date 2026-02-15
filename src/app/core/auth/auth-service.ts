import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, RegisterRequest, AuthResponse } from '../models/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private readonly _tokenKey = 'bp_token';
  private readonly _userIdKey = 'bp_user_id';

  private _isLoggedIn$ = new BehaviorSubject<boolean>(!!localStorage.getItem(this._tokenKey));
  isLoggedIn$ = this._isLoggedIn$.asObservable();

  get token(): string | null {
    return localStorage.getItem(this._tokenKey);
  }

  get userId(): number | null {
    const rawUserId = localStorage.getItem(this._userIdKey);
    if (!rawUserId) {
      return null;
    }

    const parsed = Number(rawUserId);
    return Number.isNaN(parsed) ? null : parsed;
  }

  login(body: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/signin`, body)
      .pipe(
        tap(res => {
          localStorage.setItem(this._tokenKey, res.token);
          if (res.userId !== undefined && res.userId !== null) {
            localStorage.setItem(this._userIdKey, String(res.userId));
          }
          this._isLoggedIn$.next(true);
        })
      );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this._tokenKey);
  }

  register(body: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/signup`, body)
      .pipe(
        tap(res => {
          localStorage.setItem(this._tokenKey, res.token);
          if (res.userId !== undefined && res.userId !== null) {
            localStorage.setItem(this._userIdKey, String(res.userId));
          }
          this._isLoggedIn$.next(true);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this._tokenKey);
    localStorage.removeItem(this._userIdKey);
    this._isLoggedIn$.next(false);
  }
}

