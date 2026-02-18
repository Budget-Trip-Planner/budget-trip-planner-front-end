import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../auth/auth-service';
import { GroupInvite, GroupMember, GroupSummary } from '../../models/group';

@Injectable({ providedIn: 'root' })
export class GroupsService {

  private http = inject(HttpClient);
  private authService = inject(AuthService);

  // 🔥 TRUE = MOCK | FALSE = API
  private useMock = true;

  // ================= MOCK DATA =================
  private mockInvites: GroupInvite[] = [
    {
      id: 201,
      group: { id: 1, name: 'Groupe : Présidents', imageUrl: null, membersCount: 4 },
      inviter: { id: 101, firstName: 'Lina', lastName: 'Martin', imageUrl: '/profile-icon.png' }
    },
    {
      id: 202,
      group: { id: 2, name: 'Groupe : DevOps', imageUrl: null, membersCount: 6 },
      inviter: { id: 102, firstName: 'Nassim', lastName: 'Diallo', imageUrl: '/profile-icon.png' }
    }
  ];

  private mockGroups: GroupSummary[] = [
    { id: 10, name: 'Groupe : ESIEE', imageUrl: null, membersCount: 3 },
    { id: 11, name: 'Groupe : Thales', imageUrl: null, membersCount: 2 },
  ];

  private mockMembersByGroupId: Record<number, GroupMember[]> = {
    10: [
      { id: 1, firstName: 'John', lastName: 'Doe', imageUrl: '/profile-icon.png' },
      { id: 2, firstName: 'Emma', lastName: 'Leroy', imageUrl: '/profile-icon.png' },
      { id: 3, firstName: 'Lucas', lastName: 'Roux', imageUrl: '/profile-icon.png' },
    ],
    11: [
      { id: 4, firstName: 'Inès', lastName: 'Fournier', imageUrl: '/profile-icon.png' },
      { id: 5, firstName: 'Noah', lastName: 'Garcia', imageUrl: '/profile-icon.png' },
    ]
  };

  // ================= INVITES =================
  getPendingInvites(): Observable<GroupInvite[]> {
    if (this.useMock) return of(this.mockInvites).pipe(delay(250));

    const userId = this.authService.userId;
    if (!userId) return of([]);

    return this.http.get<GroupInvite[]>(
      `${environment.apiUrl}/users/${userId}/group-invites/pending`
    );
  }

  acceptInvite(inviteId: number): Observable<void> {
    if (this.useMock) {
      const idx = this.mockInvites.findIndex(i => i.id === inviteId);
      if (idx !== -1) {
        const invite = this.mockInvites[idx];
        const group = invite.group;

        // Ajout dans mes groupes (si pas déjà là)
        if (!this.mockGroups.some(g => g.id === group.id)) {
          this.mockGroups.unshift(group);
        }

        // ensure members list exists
        if (!this.mockMembersByGroupId[group.id]) {
          this.mockMembersByGroupId[group.id] = [];
        }

        this.mockInvites.splice(idx, 1);
      }
      return of(void 0).pipe(delay(150));
    }

    const userId = this.authService.userId;
    if (!userId) return of(void 0);

    return this.http.post<void>(
      `${environment.apiUrl}/users/${userId}/group-invites/${inviteId}/accept`,
      {}
    );
  }

  declineInvite(inviteId: number): Observable<void> {
    if (this.useMock) {
      this.mockInvites = this.mockInvites.filter(i => i.id !== inviteId);
      return of(void 0).pipe(delay(150));
    }

    const userId = this.authService.userId;
    if (!userId) return of(void 0);

    return this.http.post<void>(
      `${environment.apiUrl}/users/${userId}/group-invites/${inviteId}/decline`,
      {}
    );
  }

  // ================= GROUPS =================
  getMyGroups(): Observable<GroupSummary[]> {
    if (this.useMock) return of(this.mockGroups).pipe(delay(250));

    const userId = this.authService.userId;
    if (!userId) return of([]);

    return this.http.get<GroupSummary[]>(
      `${environment.apiUrl}/users/${userId}/groups`
    );
  }

  leaveGroup(groupId: number): Observable<void> {
    if (this.useMock) {
      this.mockGroups = this.mockGroups.filter(g => g.id !== groupId);
      delete this.mockMembersByGroupId[groupId];
      return of(void 0).pipe(delay(150));
    }

    const userId = this.authService.userId;
    if (!userId) return of(void 0);

    return this.http.post<void>(
      `${environment.apiUrl}/users/${userId}/groups/${groupId}/leave`,
      {}
    );
  }

  // ================= MEMBERS =================
  getGroupMembers(groupId: number): Observable<GroupMember[]> {
    if (this.useMock) {
      return of(this.mockMembersByGroupId[groupId] ?? []).pipe(delay(250));
    }

    const userId = this.authService.userId;
    if (!userId) return of([]);

    return this.http.get<GroupMember[]>(
      `${environment.apiUrl}/users/${userId}/groups/${groupId}/members`
    );
  }

  addFriendToGroup(groupId: number, friend: GroupMember): Observable<void> {
    if (this.useMock) {
      const arr = this.mockMembersByGroupId[groupId] ?? [];
      const already = arr.some(m => m.id === friend.id);
      if (!already) {
        this.mockMembersByGroupId[groupId] = [...arr, friend];
        // maj compteur
        const g = this.mockGroups.find(x => x.id === groupId);
        if (g) g.membersCount = (this.mockMembersByGroupId[groupId]?.length ?? g.membersCount);
      }
      return of(void 0).pipe(delay(150));
    }

    const userId = this.authService.userId;
    if (!userId) return of(void 0);

    return this.http.post<void>(
      `${environment.apiUrl}/users/${userId}/groups/${groupId}/members`,
      { friendId: friend.id }
    );
  }
}
