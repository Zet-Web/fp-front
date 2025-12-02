// Utility functions for network data processing and filtering

import {
  NetworkData,
  NetworkNode,
  NetworkFiltersState,
  ConnectionType,
  NetworkStats,
} from "../types/network";

export function applyNetworkFilters(
  data: NetworkData,
  filters: NetworkFiltersState
): NetworkData {
  let filteredNodes = [...data.nodes];
  let filteredEdges = [...data.edges];

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    const matchingNodeIds = new Set(
      filteredNodes
        .filter(
          (node) => {
            // Search by name for all nodes
            if (node.name.toLowerCase().includes(searchLower)) return true;
            
            // For user nodes, also search by username, role, and about
            if (node.nodeType === "user") {
              return (
                node.username?.toLowerCase().includes(searchLower) ||
                node.role?.toLowerCase().includes(searchLower) ||
                node.about?.toLowerCase().includes(searchLower)
              );
            }
            
            // For event nodes, search by category
            if (node.nodeType === "event") {
              return node.category?.toLowerCase().includes(searchLower);
            }
            
            // For community nodes, search by name (already covered)
            if (node.nodeType === "community") {
              return true; // Name check is already done above
            }
            
            return false;
          }
        )
        .map((node) => node.id)
    );

    // Strict filtering: Only show nodes that match the search
    filteredNodes = filteredNodes.filter(
      (node) => matchingNodeIds.has(node.id) || node.isCurrentUser
    );
    
    // Strict filtering: Only show edges where BOTH ends are in the matching set
    filteredEdges = filteredEdges.filter(
      (edge) =>
        (matchingNodeIds.has(edge.source) || edge.source === data.nodes.find(n => n.isCurrentUser)?.id) && 
        (matchingNodeIds.has(edge.target) || edge.target === data.nodes.find(n => n.isCurrentUser)?.id)
    );
  }

  if (filters.connectionTypes.length > 0) {
    filteredNodes = filteredNodes.filter((node) => {
      if (node.isCurrentUser) return true;
      return node.connectionType.some((type) =>
        filters.connectionTypes.includes(type)
      );
    });

    const allowedNodeIds = new Set(filteredNodes.map((n) => n.id));
    filteredEdges = filteredEdges.filter(
      (edge) =>
        allowedNodeIds.has(edge.source) && allowedNodeIds.has(edge.target)
    );
  }

  if (filters.communities.length > 0) {
    filteredNodes = filteredNodes.filter((node) => {
      if (node.isCurrentUser) return true;
      
      // For community nodes, check if the node itself is one of the selected communities
      if (node.nodeType === "community") {
        return filters.communities.includes(node.name);
      }

      // Only filter user nodes by communities (events don't have communities)
      if (node.nodeType === "user") {
        return node.communities?.some((comm) =>
          filters.communities.includes(comm)
        );
      }
      return false;
    });

    const allowedNodeIds = new Set(filteredNodes.map((n) => n.id));
    filteredEdges = filteredEdges.filter(
      (edge) =>
        allowedNodeIds.has(edge.source) && allowedNodeIds.has(edge.target)
    );
  }

  if (filters.connectionLevel !== "all") {
    const level = parseInt(filters.connectionLevel) as 1 | 2 | 3;
    filteredNodes = filteredNodes.filter(
      (node) => node.isCurrentUser || node.level === level
    );

    const allowedNodeIds = new Set(filteredNodes.map((n) => n.id));
    filteredEdges = filteredEdges.filter(
      (edge) =>
        allowedNodeIds.has(edge.source) && allowedNodeIds.has(edge.target)
    );
  }

  if (filters.showMutualOnly) {
    filteredEdges = filteredEdges.filter(
      (edge) => edge.mutualConnections && edge.mutualConnections > 0
    );

    const connectedNodeIds = new Set<string>();
    filteredEdges.forEach((edge) => {
      connectedNodeIds.add(edge.source);
      connectedNodeIds.add(edge.target);
    });

    filteredNodes = filteredNodes.filter(
      (node) => node.isCurrentUser || connectedNodeIds.has(node.id)
    );
  }

  // FINAL SAFETY CHECK: Remove any edges that point to non-existent nodes
  // This prevents D3 from crashing if any previous filter logic left dangling edges
  const finalNodeIds = new Set(filteredNodes.map(n => n.id));
  filteredEdges = filteredEdges.filter(edge => 
    finalNodeIds.has(edge.source) && finalNodeIds.has(edge.target)
  );

  return {
    nodes: filteredNodes,
    edges: filteredEdges,
  };
}

export function getConnectionTypeColor(
  type: ConnectionType,
  theme: "light" | "dark" = "light"
): string {
  const colors = {
    light: {
      direct: "#3b82f6",
      following: "#10b981",
      follower: "#f59e0b",
      community: "#8b5cf6",
      mutual: "#ec4899",
      colleague: "#06b6d4",
      client: "#f97316",
      partner: "#14b8a6",
      event: "#f97316",
      member: "#a855f7",
    },
    dark: {
      direct: "#60a5fa",
      following: "#34d399",
      follower: "#fbbf24",
      community: "#a78bfa",
      mutual: "#f472b6",
      colleague: "#22d3ee",
      client: "#fb923c",
      partner: "#2dd4bf",
      event: "#fb923c",
      member: "#c084fc",
    },
  };

  return colors[theme][type] || colors[theme].direct;
}

export function getConnectionTypeBadgeColor(type: ConnectionType): string {
  const colors: Record<ConnectionType, string> = {
    direct: "bg-blue-500",
    following: "bg-green-500",
    follower: "bg-amber-500",
    community: "bg-purple-500",
    mutual: "bg-pink-500",
    colleague: "bg-cyan-500",
    client: "bg-orange-500",
    partner: "bg-teal-500",
    event: "bg-orange-500",
    member: "bg-purple-500",
  };

  return colors[type] || "bg-blue-500";
}

export function getConnectionTypeLabel(type: ConnectionType): string {
  const labels: Record<ConnectionType, string> = {
    direct: "Прямая связь",
    following: "Подписки",
    follower: "Подписчики",
    community: "Сообщество",
    mutual: "Взаимные",
    colleague: "Коллеги",
    client: "Клиенты",
    partner: "Партнёры",
    event: "Событие",
    member: "Участник",
  };

  return labels[type] || type;
}

export function calculateNetworkStats(
  data: NetworkData,
  currentUserId: string
): NetworkStats {
  const stats: NetworkStats = {
    totalConnections: 0,
    directConnections: 0,
    followers: 0,
    following: 0,
    mutualConnections: 0,
    communities: 0,
    newThisMonth: 0,
    connectionsByType: {
      direct: 0,
      following: 0,
      follower: 0,
      community: 0,
      mutual: 0,
      colleague: 0,
      client: 0,
      partner: 0,
      event: 0,
      member: 0,
    },
    topCommunities: [],
  };

  const allCommunities = new Map<string, number>();

  data.nodes.forEach((node) => {
    if (node.id === currentUserId) return;

    stats.totalConnections++;

    node.connectionType.forEach((type) => {
      stats.connectionsByType[type]++;

      if (type === "direct") stats.directConnections++;
      if (type === "follower") stats.followers++;
      if (type === "following") stats.following++;
      if (type === "mutual") stats.mutualConnections++;
      if (type === "community") stats.communities++;
    });

    // Only count communities for user nodes
    if (node.nodeType === "user" && node.communities) {
      node.communities.forEach((comm) => {
        allCommunities.set(comm, (allCommunities.get(comm) || 0) + 1);
      });
    }
  });

  stats.topCommunities = Array.from(allCommunities.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  stats.newThisMonth = Math.floor(stats.totalConnections * 0.15);

  return stats;
}

export function getEmptyStateMessage(filters: NetworkFiltersState): string {
  if (filters.search) {
    return `Не найдено соединений по запросу "${filters.search}"`;
  }

  if (filters.connectionTypes.length > 0) {
    return "Нет соединений выбранного типа";
  }

  if (filters.communities.length > 0) {
    return "Нет соединений в выбранных сообществах";
  }

  if (filters.showMutualOnly) {
    return "Нет взаимных соединений";
  }

  return "У вас пока нет соединений в сети";
}

export function getNodeRadius(node: NetworkNode): number {
  if (node.isCurrentUser) return 24;
  if (node.nodeType === "community") return 20;
  if (node.level === 1) return 16;
  if (node.level === 2) return 12;
  return 10;
}

export function getNodeStrokeWidth(node: NetworkNode): number {
  if (node.isCurrentUser) return 4;
  if (node.level === 1) return 3;
  return 2;
}
