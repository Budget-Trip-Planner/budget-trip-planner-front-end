import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../auth/auth-service';
import { ChatMessage, Conversation, ConversationListItem, Participant } from '../../models/message';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  private http = inject(HttpClient);
  private authService = inject(AuthService);

  // 🔥 TRUE = MOCK | FALSE = API
  private useMock = true;

  // ===== mock user =====
  readonly me: Participant = {
    id: 'me',
    name: 'Moi',
    imageUrl: '/profile-icon.png'
  };

  // ================= MOCK DATA =================
  // ✅ IMPORTANT : chaque conversation de groupe DOIT avoir groupId cohérent avec GroupsService
  private mockConversations: Conversation[] = [
    {
      id: 'c1',
      title: 'Jacques Chirac',
      isGroup: false,
      participants: [
        this.me,
        { id: 'chirac', name: 'Jacques Chirac', imageUrl: '/profile-icon.png' }
      ]
    },
    {
      id: 'c2',
      title: 'Nicolas Sarkozy',
      isGroup: false,
      participants: [
        this.me,
        { id: 'sarko', name: 'Nicolas Sarkozy', imageUrl: '/profile-icon.png' }
      ]
    },

    // ✅ Correspond à mockInvites group.id = 1 (Présidents)
    {
      id: 'c3',
      title: 'Groupe : Présidents',
      isGroup: true,
      groupId: '1', // ✅ FIX : AVANT tu avais '10' => ça pointait sur ESIEE !
      participants: [
        this.me,
        { id: 'chirac', name: 'Jacques Chirac', imageUrl: '/profile-icon.png' },
        { id: 'sarko', name: 'Nicolas Sarkozy', imageUrl: '/profile-icon.png' },
        { id: 'mit', name: 'François Mitterrand', imageUrl: '/profile-icon.png' }
      ]
    }
  ];

  private mockMessages: ChatMessage[] = [
    { id: 'm1', conversationId: 'c1', senderId: 'chirac', text: 'On va pas se laisser marcher dessus par Attila.', createdAt: '2024-12-01T09:10:00.000Z', isRead: false },
    { id: 'm2', conversationId: 'c1', senderId: 'me',     text: 'C’est une référence ou tu le penses vraiment ?', createdAt: '2024-12-01T09:12:00.000Z', isRead: true },
    { id: 'm3', conversationId: 'c1', senderId: 'chirac', text: 'C’est une image. Mais l’idée est la même : tenir bon.', createdAt: '2024-12-01T09:13:30.000Z', isRead: false },

    { id: 'm4', conversationId: 'c2', senderId: 'sarko', text: 'Je veux un truc simple : efficace, rapide, propre.', createdAt: '2025-01-10T18:20:00.000Z', isRead: false },
    { id: 'm5', conversationId: 'c2', senderId: 'me',    text: 'On peut faire ça. Tu veux un plan en 3 points ?', createdAt: '2025-01-10T18:21:30.000Z', isRead: true },

    { id: 'm6', conversationId: 'c3', senderId: 'mit',    text: 'La nuance, c’est ce qui sauve des décisions irréversibles.', createdAt: '2025-02-04T08:05:00.000Z', isRead: true },
    { id: 'm7', conversationId: 'c3', senderId: 'chirac', text: 'La nuance oui, mais pas l’immobilisme.', createdAt: '2025-02-04T08:06:30.000Z', isRead: false },
    { id: 'm8', conversationId: 'c3', senderId: 'sarko',  text: 'On tranche. Ensuite on ajuste.', createdAt: '2025-02-04T08:07:10.000Z', isRead: false }
  ];

  // ================= REFRESH (centralisé) =================
  private refreshSubject = new BehaviorSubject<void>(undefined);
  refresh$ = this.refreshSubject.asObservable();

  triggerRefresh() {
    this.refreshSubject.next();
  }

  // ================= CONVERSATIONS =================
  getConversations(): Observable<ConversationListItem[]> {
    if (this.useMock) {
      const items = this.buildConversationList(this.mockConversations, this.mockMessages);
      return of(items).pipe(delay(250));
    }

    const userId = this.authService.userId;
    if (!userId) return of([]);

    const url = `${environment.apiUrl}/users/${userId}/conversations`;
    return this.http.get<ConversationListItem[]>(url);
  }

  // ================= MESSAGES =================
  getMessages(conversationId: string): Observable<ChatMessage[]> {
    if (this.useMock) {
      const msgs = this.mockMessages
        .filter(m => m.conversationId === conversationId)
        .slice()
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      return of(msgs).pipe(delay(250));
    }

    const userId = this.authService.userId;
    if (!userId) return of([]);

    const url = `${environment.apiUrl}/users/${userId}/conversations/${conversationId}/messages`;
    return this.http.get<ChatMessage[]>(url);
  }

  markAsRead(conversationId: string): Observable<void> {
    if (this.useMock) {
      this.mockMessages = this.mockMessages.map(m => {
        if (m.conversationId !== conversationId) return m;
        if (m.senderId === this.me.id) return m;
        return { ...m, isRead: true };
      });
      this.triggerRefresh();
      return of(void 0).pipe(delay(120));
    }

    const userId = this.authService.userId;
    if (!userId) return of(void 0);

    const url = `${environment.apiUrl}/users/${userId}/conversations/${conversationId}/read`;
    return this.http.post<void>(url, {});
  }

  sendMessage(conversationId: string, text: string): Observable<ChatMessage> {
    if (this.useMock) {
      const newMessage: ChatMessage = {
        id: 'm' + Date.now(),
        conversationId,
        senderId: this.me.id,
        text,
        createdAt: new Date().toISOString(),
        isRead: true
      };

      this.mockMessages.push(newMessage);
      this.triggerRefresh();
      return of(newMessage).pipe(delay(150));
    }

    const userId = this.authService.userId;
    if (!userId) return of(null as any);

    const url = `${environment.apiUrl}/users/${userId}/conversations/${conversationId}/messages`;
    return this.http.post<ChatMessage>(url, { text });
  }

  // ===== helper =====
  private buildConversationList(convs: Conversation[], msgs: ChatMessage[]): ConversationListItem[] {
    const items: ConversationListItem[] = convs.map(c => {
      const convMsgs = msgs
        .filter(m => m.conversationId === c.id)
        .slice()
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

      const last = convMsgs[convMsgs.length - 1];
      const unreadCount = convMsgs.filter(m => m.senderId !== this.me.id && !m.isRead).length;

      const imageUrl = c.isGroup
        ? undefined
        : c.participants.find(p => p.id !== this.me.id)?.imageUrl;

      return {
        id: c.id,
        title: c.title,
        isGroup: c.isGroup,
        imageUrl,
        lastText: last ? last.text : 'Aucun message',
        lastAt: last ? last.createdAt : '1970-01-01T00:00:00.000Z',
        unreadCount
      };
    });

    return items.sort((a, b) => b.lastAt.localeCompare(a.lastAt));
  }

  senderNameFromConversation(conversation: Conversation | null, senderId: string): string {
    if (!conversation) return '';
    return conversation.participants.find(p => p.id === senderId)?.name ?? 'Inconnu';
  }

  getConversationDetails(conversationId: string): Observable<Conversation | null> {
    if (this.useMock) {
      const conv = this.mockConversations.find(c => c.id === conversationId) ?? null;
      return of(conv).pipe(delay(150));
    }

    const userId = this.authService.userId;
    if (!userId) return of(null);

    const url = `${environment.apiUrl}/users/${userId}/conversations/${conversationId}`;
    return this.http.get<Conversation>(url);
  }

  // ================= CREATE CONVERSATION =================

  createDirectConversation(friend: Participant): Observable<Conversation> {
    if (this.useMock) {
      const existing = this.mockConversations.find(c =>
        !c.isGroup &&
        c.participants.some(p => p.id === friend.id) &&
        c.participants.some(p => p.id === this.me.id)
      );
      if (existing) return of(existing).pipe(delay(150));

      const newConv: Conversation = {
        id: 'c' + Date.now(),
        title: `${friend.name}`,
        isGroup: false,
        participants: [this.me, friend]
      };

      this.mockConversations = [newConv, ...this.mockConversations];
      this.triggerRefresh();
      return of(newConv).pipe(delay(150));
    }

    const userId = this.authService.userId;
    if (!userId) return of(null as any);

    const url = `${environment.apiUrl}/users/${userId}/conversations/direct`;
    return this.http.post<Conversation>(url, { friendId: friend.id });
  }

  // ✅ IMPORTANT : doublon basé sur groupId (PAS sur le nom)
  createGroupConversation(group: { id: string; name: string }): Observable<Conversation> {
    if (this.useMock) {

      const existing = this.mockConversations.find(c =>
        c.isGroup && String((c as any).groupId) === String(group.id)
      );

      if (existing) {
        return of(existing).pipe(delay(150));
      }

      const newConv: Conversation = {
        id: 'c' + Date.now(),
        title: group.name,
        isGroup: true,
        groupId: String(group.id),
        participants: [this.me]
      };

      this.mockMessages.push({
        id: 'm' + Date.now(),
        conversationId: newConv.id,
        senderId: this.me.id,
        text: `Conversation créée pour ${group.name}`,
        createdAt: new Date().toISOString(),
        isRead: true
      });

      this.mockConversations = [newConv, ...this.mockConversations];
      this.triggerRefresh();
      return of(newConv).pipe(delay(150));
    }

    const userId = this.authService.userId;
    if (!userId) return of(null as any);

    const url = `${environment.apiUrl}/users/${userId}/conversations/group`;
    return this.http.post<Conversation>(url, { groupId: group.id });
  }

  // ================= REMOVE CONVERSATION BY GROUP =================
  // ✅ supprime conv liée au groupId + ses messages, puis refresh
  removeConversationByGroupId(groupId: number | string): string | null {
    const gid = String(groupId);

    const conv = this.mockConversations.find(c =>
      c.isGroup && String((c as any).groupId) === gid
    );

    if (!conv) return null;

    const removedConvId = conv.id;

    this.mockConversations = this.mockConversations.filter(c => c.id !== removedConvId);
    this.mockMessages = this.mockMessages.filter(m => m.conversationId !== removedConvId);

    this.triggerRefresh();
    return removedConvId;
  }
}
