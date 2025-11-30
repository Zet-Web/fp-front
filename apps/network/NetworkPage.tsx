// Network visualization page with interactive D3 graph and list view with filtering

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Network, List, Loader2 } from "lucide-react";
import { NetworkData, NetworkFiltersState, NetworkNode } from "./types/network";
import { D3NetworkGraph } from "./components/D3NetworkGraph";
import { NetworkListView } from "./components/NetworkListView";
import { NetworkFilters } from "./components/NetworkFilters";
import { NodeDetailModal } from "./components/NodeDetailModal";
import { MOCK_NETWORK_DATA } from "./lib/mock-network-data";
import { applyNetworkFilters, getEmptyStateMessage } from "./lib/network-utils";
import { FPApi } from "@/lib/api";

const DEFAULT_FILTERS: NetworkFiltersState = {
  search: "",
  connectionTypes: [],
  communities: [],
  connectionLevel: "all",
  showMutualOnly: false,
};

export function NetworkPage() {
  const [filters, setFilters] = useState<NetworkFiltersState>(DEFAULT_FILTERS);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<"graph" | "list">("graph");
  const [networkData, setNetworkData] = useState<NetworkData | null>(null);
  const [isLoading, setLoading] = useState(false);

  const filteredData = useMemo(() => {
    return applyNetworkFilters(networkData || MOCK_NETWORK_DATA, filters);
  }, [filters, networkData]);

  const emptyMessage = getEmptyStateMessage(filters);

  const handleNodeClick = (node: NetworkNode) => {
    setSelectedNode(node);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedNode(null), 200);
  };

  const loadNetworkData = async () => {
    setLoading(true);
    try {
      const res = await FPApi.axios.get("/network");
      if (res.data) {
        setNetworkData(res.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNetworkData();
  }, []);

  return (
    <div className="h-full w-full flex flex-col">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Контакты</h1>
          <p className="text-muted-foreground">
            Профессиональные связи и нетворк
          </p>
        </div>

        {/* Temporarily commented for test mode */}
        {/* <NetworkStats stats={stats} /> */}

        {isLoading && (
          <div className="flex items-center justify-center h-full w-full">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}

        {!isLoading && (
          <>
            <div className="mb-6">
              <NetworkFilters filters={filters} onFiltersChange={setFilters} />
            </div>

            <Tabs
              value={activeView}
              onValueChange={(value) =>
                setActiveView(value as "graph" | "list")
              }
            >
              <Card className="shadow-sm mb-4">
                <CardContent className="p-3">
                  <TabsList className="grid w-full md:w-[400px] grid-cols-2">
                    <TabsTrigger
                      value="graph"
                      className="flex items-center gap-2"
                    >
                      <Network className="h-4 w-4" />
                      <span className="hidden md:inline">Карта</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="list"
                      className="flex items-center gap-2"
                    >
                      <List className="h-4 w-4" />
                      <span className="hidden md:inline">Список</span>
                    </TabsTrigger>
                  </TabsList>
                </CardContent>
              </Card>

              <AnimatePresence mode="wait">
                <TabsContent value="graph" className="mt-0">
                  <motion.div
                    key="graph"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {filteredData.nodes.length === 0 ? (
                      <Card className="shadow-sm">
                        <CardContent className="py-12">
                          <div className="text-center">
                            <Network className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground mb-4">
                              {emptyMessage}
                            </p>
                            {filters.search ||
                            filters.connectionTypes.length > 0 ||
                            filters.communities.length > 0 ||
                            filters.showMutualOnly ? (
                              <Button
                                variant="outline"
                                onClick={() => setFilters(DEFAULT_FILTERS)}
                              >
                                Сбросить фильтры
                              </Button>
                            ) : null}
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <D3NetworkGraph
                        data={filteredData}
                        onNodeClick={handleNodeClick}
                      />
                    )}
                  </motion.div>
                </TabsContent>

                <TabsContent value="list" className="mt-0">
                  <motion.div
                    key="list"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <NetworkListView
                      data={filteredData}
                      onNodeClick={handleNodeClick}
                      emptyMessage={emptyMessage}
                    />
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
            </Tabs>

            <NodeDetailModal
              node={selectedNode}
              open={isModalOpen}
              onOpenChange={handleModalClose}
            />
          </>
        )}
      </div>
    </div>
  );
}
