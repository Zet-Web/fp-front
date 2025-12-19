import {
  NetworkData,
  NetworkNode,
  NetworkFiltersState,
  ConnectionType,
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
        .filter((node) => {
          if (node.name.toLowerCase().includes(searchLower)) return true;

          if (node.nodeType === "user") {
            return (
              node.username?.toLowerCase().includes(searchLower) ||
              node.role?.toLowerCase().includes(searchLower) ||
              node.about?.toLowerCase().includes(searchLower)
            );
          }

          if (node.nodeType === "event") {
            return node.category?.toLowerCase().includes(searchLower);
          }

          if (node.nodeType === "community") {
            return true;
          }

          return false;
        })
        .map((node) => node.id)
    );

    filteredNodes = filteredNodes.filter(
      (node) => matchingNodeIds.has(node.id) || node.isCurrentUser
    );

    const currentUser = data.nodes.find((n) => n.isCurrentUser);

    filteredEdges = filteredEdges.filter(
      (edge) =>
        (matchingNodeIds.has(edge.source) ||
          edge.source === currentUser?.id) &&
        (matchingNodeIds.has(edge.target) || edge.target === currentUser?.id)
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

      if (node.nodeType === "community") {
        return filters.communities.includes(node.name);
      }

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

  const finalNodeIds = new Set(filteredNodes.map((n) => n.id));
  filteredEdges = filteredEdges.filter(
    (edge) => finalNodeIds.has(edge.source) && finalNodeIds.has(edge.target)
  );

  // View mode: subscriptions / profiles / events
  if (filters.viewMode !== "all") {
    filteredNodes = filteredNodes.filter((node) => {
      if (node.isCurrentUser) return true;

      const category = node.connectionCategory;

      if (filters.viewMode === "subscriptions") {
        return (
          category === "subscription" || node.connectionType.includes("following")
        );
      }

      if (filters.viewMode === "profiles") {
        return (
          category === "profile" ||
          node.connectionType.includes("community")
        );
      }

      if (filters.viewMode === "events") {
        return (
          category === "event" ||
          node.connectionType.includes("event") ||
          node.connectionType.includes("member")
        );
      }

      return true;
    });

    const allowedNodeIds = new Set(filteredNodes.map((n) => n.id));
    filteredEdges = filteredEdges.filter(
      (edge) =>
        allowedNodeIds.has(edge.source) && allowedNodeIds.has(edge.target)
    );
  }

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


