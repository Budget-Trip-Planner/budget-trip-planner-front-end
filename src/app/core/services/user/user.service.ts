import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Location {
  city: string;
  country: string;
}

export interface User {
  lastName: string;
  firstName: string;
  username: string;
  mail: string;
  phoneNumber: string;
  birthday: string;
  location: Location;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);
  private _currentUser$ = new BehaviorSubject<User | null>(null);
  public currentUser$ = this._currentUser$.asObservable();

  public defaultAvatar: string = '/profile-icon.png';

  constructor() {}

  // 📌 1. Charger l’utilisateur depuis l’API
  loadUser(userId: number ): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/users/${userId}/profile`)
      .pipe(
        tap(user => {
          // fallback sécurité au cas où l'API renvoie null pour location
          if (!user.location) {
            user.location = { city: '', country: '' };
          }
          this._currentUser$.next(user);
        })
      );
  }

  // 📌 2. Mettre à jour l’utilisateur (PUT)
  updateUser(user: User, userId: number): Observable<User> {
    return this.http.put<User>(`${environment.apiUrl}/users/${userId}/profile`, user)
      .pipe(
        tap(updated => {
          this._currentUser$.next(updated);
        })
      );
  }

  // Accès direct (rarement utile mais ok)
  getCurrentUser(): User | null {
    return this._currentUser$.value;
  }
}
