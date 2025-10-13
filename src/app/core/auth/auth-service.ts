// src/app/core/auth/auth.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap, delay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, RegisterRequest, AuthResponse } from '../models/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private _tokenKey = 'bp_token';

  // état de connexion (vrai si un token est présent en localStorage)
  private _isLoggedIn$ = new BehaviorSubject<boolean>(!!localStorage.getItem(this._tokenKey));
  isLoggedIn$ = this._isLoggedIn$.asObservable();

  get token(): string | null {
    return localStorage.getItem(this._tokenKey);
  }

  // ------- MOCK (pour dev sans back). À remplacer par de vrais POST plus tard -------
  private mockResp(email: string): AuthResponse {
    return { token: 'MOCK.' + btoa(email) + '.JWT', userId: 1, email };
  }

  login(body: LoginRequest): Observable<AuthResponse> {
    // Version réelle (quand le back sera prêt) :
    // return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, body)
    return of(this.mockResp(body.email)).pipe(
      delay(400),
      tap(res => {
        localStorage.setItem(this._tokenKey, res.token);
        this._isLoggedIn$.next(true);
      })
    );
  }

  register(body: RegisterRequest): Observable<AuthResponse> {
    // Version réelle (quand le back sera prêt) :
    // return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, body)
    return of(this.mockResp(body.email)).pipe(
      delay(500),
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
