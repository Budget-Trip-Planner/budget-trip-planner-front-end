export interface FriendUser {
  id: number;
  firstName: string;
  lastName: string;
  imageUrl?: string | null;
}

export interface FriendRequest {
  id: number;
  requester: FriendUser;
}
