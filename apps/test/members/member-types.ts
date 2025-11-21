// Universal member types for profiles, events, quizzes, chats, etc.

export enum MemberRole {
  owner = "owner",
  admin = "admin",
  moderator = "moderator",
  member = "member",
  pending = "pending",
  invited = "invited"
}

export enum MemberStatus {
  active = "active",
  pending = "pending",
  invited = "invited",
  blocked = "blocked",
  left = "left"
}

export interface Member {
  id: string;
  user_id: string;
  name: string;
  username: string | null;
  avatar_url: string | null;
  role: MemberRole;
  status: MemberStatus;
  joined_at: string;
  badge?: string[];
}

export interface MembersStats {
  total: number;
  active: number;
  pending: number;
  admins: number;
}

export type MemberFilterType = "all" | "active" | "pending" | "admins";
