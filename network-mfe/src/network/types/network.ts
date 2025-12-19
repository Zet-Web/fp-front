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
  | "member";

export type ConnectionLevel = 1 | 2 | 3;

export type ViewMode = "all" | "subscriptions" | "profiles" | "events";

export interface NetworkNode {
  id: string;
  nodeType: NodeType;
  name: string;
  level: ConnectionLevel;
  connectionType: ConnectionType[];
  username?: string;
  about?: string | null;
  avatarUrl?: string | null;
  role?: string | null;
  company?: string | null;
  communities?: string[];
  isCurrentUser?: boolean;
  isCommunity?: boolean;
  isVerified?: boolean;
  // Optional category from backend: 'subscription' (мои подписки),
  // 'profile' (общие профили), 'event' (общие мероприятия)
  connectionCategory?: "subscription" | "profile" | "event";
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
  connectionLevel: "all" | "1" | "2" | "3";
  showMutualOnly: boolean;
  viewMode: ViewMode;
}


