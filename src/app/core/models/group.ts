export type GroupMember = {
  id: number;
  firstName: string;
  lastName: string;
  imageUrl?: string | null;
};

export type GroupSummary = {
  id: number;
  name: string;
  imageUrl?: string | null;
  membersCount: number;
};

export type GroupInvite = {
  id: number;
  group: GroupSummary;
  inviter?: GroupMember | null;
};
