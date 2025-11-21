// Mock data for testing members functionality
export interface Member {
  id: string;
  name: string;
  username: string;
  avatar_url?: string;
  role?: 'admin' | 'moderator' | 'member';
  joinedAt: string;
  isFollowing?: boolean;
  badge?: string;
}

export const mockMembers: Member[] = [
  {
    id: '1',
    name: 'John Doe',
    username: 'johndoe',
    avatar_url: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200',
    role: 'admin',
    joinedAt: '2024-01-15',
    isFollowing: true,
    badge: 'verified',
  },
  {
    id: '2',
    name: 'Jane Smith',
    username: 'janesmith',
    avatar_url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
    role: 'moderator',
    joinedAt: '2024-02-20',
    isFollowing: false,
  },
  {
    id: '3',
    name: 'Alex Johnson',
    username: 'alexj',
    avatar_url: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=200',
    role: 'member',
    joinedAt: '2024-03-10',
    isFollowing: true,
    badge: 'verified',
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    username: 'sarahw',
    role: 'member',
    joinedAt: '2024-03-25',
    isFollowing: false,
  },
  {
    id: '5',
    name: 'Michael Brown',
    username: 'mikeb',
    avatar_url: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
    role: 'member',
    joinedAt: '2024-04-05',
    isFollowing: true,
  },
  {
    id: '6',
    name: 'Emily Davis',
    username: 'emilyd',
    avatar_url: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
    role: 'member',
    joinedAt: '2024-04-18',
    isFollowing: false,
  },
  {
    id: '7',
    name: 'David Martinez',
    username: 'davidm',
    role: 'member',
    joinedAt: '2024-05-01',
    isFollowing: true,
  },
  {
    id: '8',
    name: 'Lisa Anderson',
    username: 'lisaa',
    avatar_url: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=200',
    role: 'member',
    joinedAt: '2024-05-15',
    isFollowing: false,
    badge: 'verified',
  },
];
