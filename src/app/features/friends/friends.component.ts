import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { forkJoin, Subject } from 'rxjs';
import { map, shareReplay, switchMap, startWith } from 'rxjs/operators';

import { FriendsService } from '../../core/services/friend/friend.service';
import { FriendRequest, FriendUser } from '../../core/models/friend';

type PersonCard = {
  id: number;
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
};

@Component({
  selector: 'app-friends',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.css'
})
export class FriendsComponent {

  private router = inject(Router);
  private friendsService = inject(FriendsService);

  defaultAvatar = '/profile-icon.png';
  readonly pageSize = 5;

  // ✅ pagination demandes
  reqPage = 1;

  // ✅ trigger refresh (au lieu de location.reload)
  private refresh$ = new Subject<void>();

  // 🔥 DATA STREAM (recharge quand refresh$.next() est appelé)
  readonly data$ = this.refresh$.pipe(
    startWith(void 0),
    switchMap(() =>
      forkJoin({
        requests: this.friendsService.getPendingRequests(),
        friends: this.friendsService.getFriends()
      })
    ),
    map(({ requests, friends }) => {
      const friendRequests = requests.map(r => this.mapRequestToCard(r));
      const friendsCards = friends.map(f => this.mapUserToCard(f));

      const reqTotalPages = Math.max(1, Math.ceil(friendRequests.length / this.pageSize));

      // si la page actuelle dépasse le max (ex: on supprime/valide)
      if (this.reqPage > reqTotalPages) this.reqPage = reqTotalPages;

      return {
        friendRequests,
        friends: friendsCards,
        reqTotalPages
      };
    }),
    shareReplay(1)
  );

  // ===== mapping =====
  private mapRequestToCard(r: FriendRequest): PersonCard {
    return {
      id: r.id,
      firstName: r.requester.firstName,
      lastName: r.requester.lastName,
      avatarUrl: r.requester.imageUrl ?? this.defaultAvatar
    };
  }

  private mapUserToCard(u: FriendUser): PersonCard {
    return {
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      avatarUrl: u.imageUrl ?? this.defaultAvatar
    };
  }

  // ===== pagination (Demandes) =====
  prevReqPage() {
    if (this.reqPage > 1) this.reqPage--;
  }

  nextReqPage(totalLength: number) {
    const totalPages = Math.max(1, Math.ceil(totalLength / this.pageSize));
    if (this.reqPage < totalPages) this.reqPage++;
  }

  // ===== actions =====
  goToFriendProfile(friendId: number) {
    this.router.navigate(['/userProfile', friendId]);
  }

  removeFriend(friendId: number) {
    this.friendsService.deleteFriend(friendId).subscribe({
      next: () => this.refresh$.next(),
      error: (e) => console.error(e)
    });
  }

  acceptRequest(requestId: number) {
    this.friendsService.acceptRequest(requestId).subscribe({
      next: () => this.refresh$.next(),
      error: (e) => console.error(e)
    });
  }

  declineRequest(requestId: number) {
    this.friendsService.refuseRequest(requestId).subscribe({
      next: () => this.refresh$.next(),
      error: (e) => console.error(e)
    });
  }
}
