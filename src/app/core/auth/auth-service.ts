import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap, delay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, RegisterRequest, AuthResponse } from '../models/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private _tokenKey = 'bp_token';
  private _isLoggedIn$ = new BehaviorSubject<boolean>(!!localStorage.getItem(this._tokenKey));
  isLoggedIn$ = this._isLoggedIn$.asObservable();

  get token(): string | null {
    return localStorage.getItem(this._tokenKey);
  }

  // ✅ Ajout de la méthode LOGIN (pour corriger ton erreur TS2339)
  login(body: LoginRequest): Observable<AuthResponse> {
    // 👉 Version réelle (si ton backend est prêt)
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/signin`, body).pipe(
       tap(res => {
         localStorage.setItem(this._tokenKey, res.token);
         this._isLoggedIn$.next(true);
       })
     );

    // 👉 Version mock (utile si ton backend n’est pas encore lancé)
    return of(this.mockResp(body.email)).pipe(
      delay(400),
      tap(res => {
        localStorage.setItem(this._tokenKey, res.token);
        this._isLoggedIn$.next(true);
      })
    );
  }

  // ✅ Méthode REGISTER
  register(body: RegisterRequest): Observable<AuthResponse> {
    // 👉 Version réelle
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/signup`, body).pipe(
      tap(res => {
         localStorage.setItem(this._tokenKey, res.token);
         this._isLoggedIn$.next(true);
       })
     );

    // 👉 Version mock (supprime ce bloc si tu utilises ton backend)
    /*return of(this.mockResp(body.email)).pipe(
      delay(500),
      tap(res => {
        localStorage.setItem(this._tokenKey, res.token);
        this._isLoggedIn$.next(true);
      })
    );*/
  }

  // ✅ Fonction interne pour simuler une réponse backend
  private mockResp(email: string): AuthResponse {
    return { token: 'MOCK.' + btoa(email) + '.JWT', userId: 1, email };
  }

  // ✅ Déconnexion
  logout(): void {
    localStorage.removeItem(this._tokenKey);
    this._isLoggedIn$.next(false);
  }
}
