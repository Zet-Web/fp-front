// Profile member types
export type ProfileMemberRole = "owner" | "admin" | "member";
export type ProfileMemberStatus = "active" | "pending" | "declined";

export interface ProfileMember {
  member_profile_id: string;
  profile: {
    id: string;
    username: string;
    name: string;
    avatar_url: string;
    job_title?: string;
    is_verified?: boolean;
  };
  role: ProfileMemberRole;
  status: ProfileMemberStatus;
  created_at: string;
}

export interface CreatePublicProfileDto {
  name: string;
  about?: string;
  avatar_url?: string;
  cover_url?: string;
}

export interface UpdatePublicProfileDto {
  name?: string;
  about?: string;
  avatar_url?: string;
  cover_url?: string;
}

export interface MembershipStatusResponse {
  isMember: boolean;
  role: ProfileMemberRole | null;
  status: ProfileMemberStatus | null;
}