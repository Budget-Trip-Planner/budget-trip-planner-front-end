import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, combineLatest, of, Subject } from 'rxjs';
import { catchError, map, shareReplay, startWith, switchMap } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { MessagesService } from '../../core/services/message/message.service';
import { GroupsService } from '../../core/services/group/group.service';
import { FriendsService } from '../../core/services/friend/friend.service';
import { GroupMember } from '../../core/models/group';
import { FriendUser } from '../../core/models/friend';

type GroupCard = {
  id: number;
  name: string;
  avatarUrl?: string | null;
  membersCount: number;
};

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.css'
})
export class GroupsComponent {

  private groupsService = inject(GroupsService);
  private friendsService = inject(FriendsService);
  private messagesService = inject(MessagesService);

  defaultAvatar = '/profile-icon.png';
  readonly pageSize = 5;
  invitePage = 1;

  private refresh$ = new Subject<void>();
  private selectedGroupId$ = new BehaviorSubject<number | null>(null);

  // UI "add friend"
  addPanelOpenForGroupId: number | null = null;
  selectedFriendId: number | null = null;

  // friends list
  readonly friends$ = this.friendsService.getFriends().pipe(
    catchError(() => of([] as FriendUser[])),
    shareReplay(1)
  );

  // LEFT data (invites + groups)
  readonly data$ = this.refresh$.pipe(
    startWith(void 0),
    switchMap(() => combineLatest([
      this.groupsService.getPendingInvites(),
      this.groupsService.getMyGroups()
    ])),
    map(([invites, groups]) => {
      const pendingInvites = invites.map(i => ({
        id: i.id,
        groupId: i.group.id,
        groupName: i.group.name,
        membersCount: i.group.membersCount,
        avatarUrl: i.group.imageUrl ?? null,
        inviterLabel: i.inviter ? `${i.inviter.firstName} ${i.inviter.lastName}` : 'Invitation'
      }));

      const myGroups: GroupCard[] = groups.map(g => ({
        id: g.id,
        name: g.name,
        avatarUrl: g.imageUrl ?? null,
        membersCount: g.membersCount
      }));

      return {
        pendingInvites,
        myGroups,
        inviteTotalPages: Math.max(1, Math.ceil(pendingInvites.length / this.pageSize))
      };
    }),
    catchError(err => {
      console.error('Erreur chargement groups', err);
      return of({ pendingInvites: [], myGroups: [], inviteTotalPages: 1 });
    }),
    shareReplay(1)
  );

  // members (right / bottom section)
  readonly members$ = this.selectedGroupId$.pipe(
    switchMap(id => (id ? this.groupsService.getGroupMembers(id) : of([] as GroupMember[]))),
    catchError(err => {
      console.error('Erreur chargement membres', err);
      return of([] as GroupMember[]);
    }),
    shareReplay(1)
  );

  // pagination helpers
  prevInvitePage() { if (this.invitePage > 1) this.invitePage--; }
  nextInvitePage(total: number) {
    const totalPages = Math.max(1, Math.ceil(total / this.pageSize));
    if (this.invitePage < totalPages) this.invitePage++;
  }

  // actions invites
  acceptInvite(inviteId: number) {
    this.groupsService.acceptInvite(inviteId).subscribe(() => this.loadData());
  }

  declineInvite(inviteId: number) {
    this.groupsService.declineInvite(inviteId).subscribe(() => this.loadData());
  }

  // actions groups
  viewMembers(groupId: number) {
    this.selectedGroupId$.next(groupId);
  }

  private loadData() {
    this.refresh$.next();
  }

  leaveGroup(groupId: number) {
    this.groupsService.leaveGroup(groupId).subscribe({
      next: () => {
        // ✅ supprime conv + messages liés à ce groupe
        this.messagesService.removeConversationByGroupId(groupId);

        // ✅ refresh liste conversations (Messages)
        this.messagesService.triggerRefresh();

        // ✅ refresh page groupes
        this.loadData();

        // ✅ si tu affichais les membres du groupe, vide
        const current = this.selectedGroupId$.getValue();
        if (current === groupId) {
          this.selectedGroupId$.next(null);
        }
      },
      error: (err) => console.error('Erreur lors du départ du groupe', err)
    });
  }


  openAddFriend(groupId: number) {
    this.addPanelOpenForGroupId = groupId;
    this.selectedFriendId = null;
  }

  closeAddFriend() {
    this.addPanelOpenForGroupId = null;
    this.selectedFriendId = null;
  }

  addFriendToGroup(groupId: number, friends: FriendUser[]) {
    if (!this.selectedFriendId) return;

    const f = friends.find(x => x.id === this.selectedFriendId);
    if (!f) return;

    const member: GroupMember = {
      id: f.id,
      firstName: f.firstName,
      lastName: f.lastName,
      imageUrl: f.imageUrl ?? this.defaultAvatar
    };

    this.groupsService.addFriendToGroup(groupId, member).subscribe(() => {
      this.closeAddFriend();
      this.selectedGroupId$.next(groupId);
      this.loadData();
    });
  }
}
