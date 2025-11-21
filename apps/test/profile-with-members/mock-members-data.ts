// Mock data for testing members functionality
export interface Member {
  id: string;
  name: string;
  username: string;
  avatar_url?: string;
  role?: 'owner' | 'admin' | 'moderator' | 'member';
  badge?: string;
  jobTitle?: string;
}

export interface JoinRequest {
  id: string;
  name: string;
  username: string;
  avatar_url?: string;
  jobTitle?: string;
  requestedAt: string;
}

export interface SentInvite {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  sentAt: string;
  status: 'pending' | 'accepted' | 'declined';
}

export const mockOwnerAndAdmins: Member[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    username: 'sarahj',
    avatar_url: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200',
    role: 'owner',
    badge: 'verified',
    jobTitle: 'Product Manager',
  },
  {
    id: '2',
    name: 'Michael Chen',
    username: 'michaelc',
    avatar_url: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
    role: 'admin',
    badge: 'verified',
    jobTitle: 'Senior Developer',
  },
];

export const mockMembers: Member[] = [
  {
    id: '3',
    name: 'Emily Rodriguez',
    username: 'emilyr',
    avatar_url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
    role: 'member',
    jobTitle: 'UX Researcher',
  },
  {
    id: '4',
    name: 'David Kim',
    username: 'davidk',
    avatar_url: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=200',
    role: 'member',
    jobTitle: 'Frontend Developer',
  },
  {
    id: '5',
    name: 'Alex Martinez',
    username: 'alexm',
    avatar_url: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
    role: 'member',
    badge: 'verified',
    jobTitle: 'Backend Developer',
  },
  {
    id: '6',
    name: 'Jessica Lee',
    username: 'jessical',
    avatar_url: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=200',
    role: 'member',
    jobTitle: 'Data Scientist',
  },
  {
    id: '7',
    name: 'Ryan Thompson',
    username: 'ryant',
    avatar_url: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=200',
    role: 'member',
    jobTitle: 'DevOps Engineer',
  },
];

export const mockJoinRequests: JoinRequest[] = [
  {
    id: '101',
    name: 'Tom Wilson',
    username: 'tomw',
    avatar_url: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=200',
    jobTitle: 'Mobile Developer',
    requestedAt: '2024-11-20',
  },
  {
    id: '102',
    name: 'Lisa Brown',
    username: 'lisab',
    avatar_url: 'https://images.pexels.com/photos/1239288/pexels-photo-1239288.jpeg?auto=compress&cs=tinysrgb&w=200',
    jobTitle: 'UI Designer',
    requestedAt: '2024-11-19',
  },
  {
    id: '103',
    name: 'Mark Davis',
    username: 'markd',
    avatar_url: 'https://images.pexels.com/photos/1024311/pexels-photo-1024311.jpeg?auto=compress&cs=tinysrgb&w=200',
    jobTitle: 'QA Engineer',
    requestedAt: '2024-11-18',
  },
];

export const mockSentInvites: SentInvite[] = [
  {
    id: '201',
    name: 'Chris Anderson',
    email: 'chris.anderson@email.com',
    avatar_url: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=200',
    sentAt: '2024-11-15',
    status: 'pending',
  },
  {
    id: '202',
    name: 'Nina Patel',
    email: 'nina.patel@email.com',
    avatar_url: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=200',
    sentAt: '2024-11-14',
    status: 'pending',
  },
];
