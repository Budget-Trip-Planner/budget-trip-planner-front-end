import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Subject, combineLatest, of, Observable } from 'rxjs';
import { catchError, map, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { MessagesService } from '../../core/services/message/message.service';
import { ChatMessage, Conversation, ConversationListItem } from '../../core/models/message';
import { FriendsService } from '../../core/services/friend/friend.service';
import { FriendUser } from '../../core/models/friend';
import { GroupsService } from '../../core/services/group/group.service';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessageComponent implements OnInit {

  readonly messagesService = inject(MessagesService);
  readonly friendsService = inject(FriendsService);
  private groupsService = inject(GroupsService);

  readonly me = this.messagesService.me;
  newMessageText = '';

  // ✅ refresh local (messages à droite)
  private refresh$ = new Subject<void>();

  private selectedConversationId$ = new BehaviorSubject<string | null>(null);

  // ===== create panel =====
  isCreateOpen = false;
  createMode: 'friend' | 'group' | null = null;
  selectedFriendId: number | null = null;
  selectedGroupId: string | null = null;

  readonly friends$: Observable<FriendUser[]> = this.friendsService.getFriends();

  // ✅ LEFT : conversations (piloté par MessagesService.refresh$)
  readonly conversations$ = this.messagesService.refresh$.pipe(
    switchMap(() => this.messagesService.getConversations()),
    tap((convs) => {
      const selectedId = this.selectedConversationId$.getValue();
      if (selectedId && !convs.some(c => c.id === selectedId)) {
        this.selectedConversationId$.next(null);
      }
    }),
    catchError(err => {
      console.error('Erreur chargement conversations', err);
      return of([] as ConversationListItem[]);
    }),
    shareReplay(1)
  );

  // ✅ RIGHT : details conv
  readonly selectedConversation$ = this.selectedConversationId$.pipe(
    switchMap(id => (id ? this.messagesService.getConversationDetails(id) : of(null))),
    shareReplay(1)
  );

  // ✅ RIGHT : messages
  readonly messages$ = combineLatest([
    this.selectedConversationId$,
    this.refresh$.pipe(startWith(void 0))
  ]).pipe(
    switchMap(([conversationId]) => {
      if (!conversationId) return of([] as ChatMessage[]);
      return this.messagesService.getMessages(conversationId);
    }),
    catchError(err => {
      console.error('Erreur chargement messages', err);
      return of([] as ChatMessage[]);
    }),
    shareReplay(1)
  );

  // ✅ pour la création de conv groupe
  readonly groups$ = this.groupsService.getMyGroups().pipe(
    map(groups => groups.map(g => ({ id: String(g.id), name: g.name }))),
    shareReplay(1)
  );

  ngOnInit() {
    this.messagesService.triggerRefresh(); // premier chargement
  }

  sendMessage() {
    const conversationId = this.selectedConversationId$.getValue();
    const text = this.newMessageText.trim();
    if (!conversationId || !text) return;

    this.messagesService.sendMessage(conversationId, text).subscribe({
      next: () => {
        this.newMessageText = '';
        this.refresh$.next();                 // reload messages
        this.messagesService.triggerRefresh();// update conv list (last msg)
      },
      error: (e) => console.error(e)
    });
  }

  selectConversation(id: string) {
    this.selectedConversationId$.next(id);

    this.messagesService.markAsRead(id).subscribe({
      next: () => {
        this.refresh$.next();
        this.messagesService.triggerRefresh();
      },
      error: (e) => console.error(e)
    });
  }

  isMine(senderId: string): boolean {
    return senderId === this.me.id;
  }

  formatTime(iso: string): string {
    const d = new Date(iso);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  }

  participantsLabel(conv: Conversation | null): string {
    if (!conv || !conv.isGroup) return '';
    return conv.participants
      .filter(p => p.id !== this.me.id)
      .map(p => p.name)
      .join(', ');
  }

  // ===== create panel =====
  openCreate() {
    this.isCreateOpen = true;
    this.createMode = null;
    this.selectedFriendId = null;
    this.selectedGroupId = null;
  }

  closeCreate() {
    this.isCreateOpen = false;
    this.createMode = null;
    this.selectedFriendId = null;
    this.selectedGroupId = null;
  }

  chooseMode(mode: 'friend' | 'group') {
    this.createMode = mode;
    this.selectedFriendId = null;
    this.selectedGroupId = null;
  }

  createConversationWithFriend(friends: FriendUser[]) {
    if (!this.selectedFriendId) return;
    const f = friends.find(x => x.id === this.selectedFriendId);
    if (!f) return;

    const participant = {
      id: String(f.id),
      name: `${f.firstName} ${f.lastName}`,
      imageUrl: f.imageUrl ?? '/profile-icon.png'
    };

    this.messagesService.createDirectConversation(participant).subscribe({
      next: (conv) => {
        this.closeCreate();
        this.selectConversation(conv.id);
        this.messagesService.triggerRefresh();
      },
      error: (e) => console.error(e)
    });
  }

  createConversationWithGroup(groups: { id: string; name: string }[]) {
    const groupId = this.selectedGroupId;
    if (!groupId) return;

    const g = groups.find(x => x.id === groupId);
    if (!g) return;

    this.messagesService.createGroupConversation({ id: g.id, name: g.name }).subscribe({
      next: (conv) => {
        this.closeCreate();
        this.selectConversation(conv.id);
        this.messagesService.triggerRefresh();
      },
      error: (e) => console.error(e)
    });
  }
}
