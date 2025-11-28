// TypeScript interfaces for network visualization and connection management

export type ConnectionType = 'direct' | 'following' | 'follower' | 'community' | 'mutual' | 'colleague' | 'client' | 'partner';

export type ConnectionLevel = 1 | 2 | 3;

export interface NetworkNode {
  id: string;
  name: string;
  username: string;
  about: string | null;
  avatarUrl: string | null;
  role: string | null;
  company: string | null;
  level: ConnectionLevel;
  connectionType: ConnectionType[];
  communities: string[];
  isCurrentUser?: boolean;
}

export interface NetworkEdge {
  source: string;
  target: string;
  connectionType: ConnectionType;
  relationship: string;
  mutualConnections?: number;
}

export interface NetworkData {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
}

export interface NetworkFiltersState {
  search: string;
  connectionTypes: ConnectionType[];
  communities: string[];
  connectionLevel: 'all' | '1' | '2' | '3';
  showMutualOnly: boolean;
}

export interface NetworkStats {
  totalConnections: number;
  directConnections: number;
  followers: number;
  following: number;
  mutualConnections: number;
  communities: number;
  newThisMonth: number;
  connectionsByType: Record<ConnectionType, number>;
  topCommunities: Array<{ name: string; count: number }>;
}

export interface D3Node extends NetworkNode {
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  vx?: number;
  vy?: number;
}

export interface D3Edge extends NetworkEdge {
  source: D3Node | string;
  target: D3Node | string;
}
