// TypeScript interfaces for network visualization and connection management

export type NodeType = "user" | "event" | "community";

export type ConnectionType =
  | "direct"
  | "following"
  | "follower"
  | "community"
  | "mutual"
  | "colleague"
  | "client"
  | "partner"
  | "event"
  | "member"; // for user-to-event and event-to-user connections

export type ConnectionLevel = 1 | 2 | 3;

export interface NetworkNode {
  id: string;
  nodeType: NodeType;
  name: string;
  level: ConnectionLevel;
  connectionType: ConnectionType[];

  // User-specific fields (only when nodeType === 'user')
  username?: string;
  about?: string | null;
  avatarUrl?: string | null;
  role?: string | null;
  company?: string | null;
  communities?: string[];
  isCurrentUser?: boolean;
  isCommunity?: boolean;
  
  // Event-specific fields (only when nodeType === 'event')
  eventId?: number;
  postUrl?: string;
  category?: string;
  startDate?: string;
  endDate?: string | null;
  coverImage?: string | null;
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
  source: string;
  target: string;
}
