

export type MemberRole = 'owner' | 'admin' | 'moderator' | 'member';
export type MemberStatus = 'member' | 'pending' | 'declined' | 'can_join' | 'submit_join';

export interface Member {
  id: number; 
  event_id: number;
  profile_id: string;
  status: MemberStatus;
  created_at?: string;
  profile: {
    id: string;
    username: string;
    name: string;
    avatar_url: string;
    job_title?: string;
    is_verified?: boolean;
  }
}