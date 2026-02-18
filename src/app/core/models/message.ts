export interface Participant {
  id: string;
  name: string;
  imageUrl?: string;
}

export interface Conversation {
  id: string;
  title: string;
  isGroup: boolean;
  groupId?: string;
  participants: Participant[];
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string;
  isRead: boolean;
}

export interface ConversationListItem {
  id: string;
  title: string;
  isGroup: boolean;
  imageUrl?: string;
  lastText: string;
  lastAt: string;
  unreadCount: number;
}
