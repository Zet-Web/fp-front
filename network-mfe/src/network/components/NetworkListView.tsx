// List view component displaying network connections as cards with sorting and pagination

import { useState, useMemo } from "react";
import { NetworkData, NetworkNode } from "../types/network";
import { ConnectionCard } from "./ConnectionCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface NetworkListViewProps {
  data: NetworkData;
  onNodeClick: (node: NetworkNode) => void;
  emptyMessage?: string;
}

type SortOption = "name-asc" | "name-desc" | "level-asc" | "connections-desc";

export function NetworkListView({
  data,
  onNodeClick,
  emptyMessage,
}: NetworkListViewProps) {
  const [sortBy] = useState<SortOption>("name-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getMutualConnections = (nodeId: string): number => {
    return data.edges
      .filter(
        (edge) =>
          (edge.source === nodeId || edge.target === nodeId) &&
          edge.mutualConnections
      )
      .reduce((sum, edge) => sum + (edge.mutualConnections || 0), 0);
  };

  const sortedNodes = useMemo(() => {
    const nodes = data.nodes.filter((node) => !node.isCurrentUser);

    const sorted = [...nodes].sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name, "ru");
        case "name-desc":
          return b.name.localeCompare(a.name, "ru");
        case "level-asc":
          return a.level - b.level;
        case "connections-desc":
          return getMutualConnections(b.id) - getMutualConnections(a.id);
        default:
          return 0;
      }
    });

    return sorted;
  }, [data.nodes, sortBy]);

  const totalPages = Math.ceil(sortedNodes.length / itemsPerPage);
  const paginatedNodes = sortedNodes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (sortedNodes.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardContent className="py-12">
          <div className="text-center">
            <p className="text-muted-foreground">
              {emptyMessage || "Нет соединений для отображения"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {paginatedNodes.map((node) => (
          <ConnectionCard
            key={node.id}
            node={node}
            onClick={() => onNodeClick(node)}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <Card className="shadow-sm">
          <CardContent className="py-4">
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Назад
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let page: number;
                  if (totalPages <= 5) {
                    page = i + 1;
                  } else if (currentPage <= 3) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i;
                  } else {
                    page = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      className={
                        currentPage === page
                          ? "bg-blue-500 hover:bg-blue-600"
                          : ""
                      }
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Вперёд
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-2">
              Страница {currentPage} из {totalPages}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


