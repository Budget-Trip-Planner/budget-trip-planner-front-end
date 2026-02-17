import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../auth/auth-service';
import { FriendRequest, FriendUser } from '../../models/friend';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {

  private http = inject(HttpClient);
  private authService = inject(AuthService);

  // 🔥 TRUE = MOCK | FALSE = API
  private useMock = true;

  // ================= MOCK DATA =================
  private mockRequests: FriendRequest[] = [
    { id: 101, requester: { id: 101, firstName: 'Lina', lastName: 'Martin', imageUrl: '/profile-icon.png' } },
    { id: 102, requester: { id: 102, firstName: 'Nassim', lastName: 'Diallo', imageUrl: '/profile-icon.png' } },
    { id: 103, requester: { id: 103, firstName: 'Chloé', lastName: 'Bernard', imageUrl: '/profile-icon.png' } },
    { id: 104, requester: { id: 104, firstName: 'Hugo', lastName: 'Petit', imageUrl: '/profile-icon.png' } },
    { id: 105, requester: { id: 105, firstName: 'Sara', lastName: 'Durand', imageUrl: '/profile-icon.png' } },
    { id: 106, requester: { id: 106, firstName: 'Yanis', lastName: 'Morel', imageUrl: '/profile-icon.png' } },
  ];

  private mockFriends: FriendUser[] = [
    { id: 1, firstName: 'John', lastName: 'Doe', imageUrl: '/profile-icon.png' },
    { id: 2, firstName: 'Emma', lastName: 'Leroy', imageUrl: '/profile-icon.png' },
    { id: 3, firstName: 'Lucas', lastName: 'Roux', imageUrl: '/profile-icon.png' },
    { id: 4, firstName: 'Inès', lastName: 'Fournier', imageUrl: '/profile-icon.png' },
    { id: 5, firstName: 'Noah', lastName: 'Garcia', imageUrl: '/profile-icon.png' },
    { id: 6, firstName: 'Mia', lastName: 'Robert', imageUrl: '/profile-icon.png' },
  ];

  // ================= REQUESTS =================
  getPendingRequests(): Observable<FriendRequest[]> {
    console.log('✅ getPendingRequests called - useMock=', this.useMock);

    if (this.useMock) {
      console.log('🧪 RETURN MOCK REQUESTS:', this.mockRequests.length);
      return of(this.mockRequests).pipe(delay(300));
    }

    const userId = this.authService.userId;
    if (!userId) return of([]);

    const url = `${environment.apiUrl}/users/${userId}/friend-requests/pending`;
    console.log('🌐 REAL API CALL:', url);

    return this.http.get<FriendRequest[]>(url);
  }
  /* Json
  [
    {
      "id": 101,
      "requester": {
        "id": 5,
        "firstName": "Lina",
        "lastName": "Martin",
        "imageUrl": "/profile-icon.png"
      }
    }
  ]
*/
  acceptRequest(requestId: number): Observable<void> {
    console.log('✅ acceptRequest called - useMock=', this.useMock, 'id=', requestId);

    if (this.useMock) {
      const idx = this.mockRequests.findIndex(r => r.id === requestId);
      if (idx !== -1) {
        const req = this.mockRequests[idx];
        this.mockFriends.unshift(req.requester);
        this.mockRequests.splice(idx, 1);
      }
      return of(void 0).pipe(delay(200));
    }

    const userId = this.authService.userId;
    if (!userId) return of(void 0);

    const url = `${environment.apiUrl}/users/${userId}/friend-requests/${requestId}/accept`;
    console.log('🌐 REAL API CALL:', url);

    return this.http.post<void>(url, {});
  }

  refuseRequest(requestId: number): Observable<void> {
    console.log('✅ refuseRequest called - useMock=', this.useMock, 'id=', requestId);

    if (this.useMock) {
      this.mockRequests = this.mockRequests.filter(r => r.id !== requestId);
      return of(void 0).pipe(delay(200));
    }

    const userId = this.authService.userId;
    if (!userId) return of(void 0);

    const url = `${environment.apiUrl}/users/${userId}/friend-requests/${requestId}/refuse`;
    console.log('🌐 REAL API CALL:', url);

    return this.http.post<void>(url, {});
  }

  // ================= FRIENDS =================
  getFriends(): Observable<FriendUser[]> {
    console.log('✅ getFriends called - useMock=', this.useMock);

    if (this.useMock) {
      console.log('🧪 RETURN MOCK FRIENDS:', this.mockFriends.length);
      return of(this.mockFriends).pipe(delay(300));
    }

    const userId = this.authService.userId;
    if (!userId) return of([]);

    const url = `${environment.apiUrl}/users/${userId}/friends`;
    console.log('🌐 REAL API CALL:', url);

    return this.http.get<FriendUser[]>(url);
  }

  /*
  [
    {
      "id": 2,
      "firstName": "Emma",
      "lastName": "Leroy",
      "imageUrl": "/profile-icon.png"
    }
  ]
   */

  deleteFriend(friendId: number): Observable<void> {
    console.log('✅ deleteFriend called - useMock=', this.useMock, 'id=', friendId);

    if (this.useMock) {
      this.mockFriends = this.mockFriends.filter(f => f.id !== friendId);
      return of(void 0).pipe(delay(200));
    }

    const userId = this.authService.userId;
    if (!userId) return of(void 0);

    const url = `${environment.apiUrl}/users/${userId}/friends/${friendId}`;
    console.log('🌐 REAL API CALL:', url);

    return this.http.delete<void>(url);
  }
}
