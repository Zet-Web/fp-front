// D3.js force-directed network graph visualization with interactive nodes and zoom

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { NetworkData, NetworkNode } from "../types/network";
import {
  getConnectionTypeColor,
  getNodeRadius,
  getNodeStrokeWidth,
} from "../lib/network-utils";
import { Card } from "@/components/ui/card";
import { getStorageUrl } from "@/utils/getStorageUrl";

interface D3NetworkGraphProps {
  data: NetworkData;
  onNodeClick: (node: NetworkNode) => void;
  width?: number;
  height?: number;
}

type D3Node = NetworkNode & {
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  vx?: number;
  vy?: number;
};

type D3Edge = {
  source: string | D3Node;
  target: string | D3Node;
  connectionType: NetworkNode["connectionType"][number];
  mutualConnections?: number;
};

export function D3NetworkGraph({
  data,
  onNodeClick,
  width = 800,
  height = 600,
}: D3NetworkGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width, height });

  const currentTheme: "light" | "dark" = "light";

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: rect.width,
          height: Math.max(600, window.innerHeight - 300),
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { width: w, height: h } = dimensions;

    const g = svg.append("g");

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    const nodes: D3Node[] = data.nodes.map((node) => ({ ...node }));
    const edges: D3Edge[] = data.edges.map((edge) => ({ ...edge }));

    const simulation = d3
      .forceSimulation<D3Node>(nodes)
      .force(
        "link",
        d3
          .forceLink<D3Node, D3Edge>(edges)
          .id((d) => d.id)
          .distance(100)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(w / 2, h / 2))
      .force(
        "collision",
        d3.forceCollide().radius((d) => getNodeRadius(d as NetworkNode) + 30)
      );

    const link = g
      .append("g")
      .selectAll("line")
      .data(edges)
      .join("line")
      .attr("stroke", (d) =>
        getConnectionTypeColor(d.connectionType, currentTheme)
      )
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", (d) => (d.mutualConnections ? 2 : 1))
      .attr("stroke-dasharray", (d) => {
        if (d.connectionType === "member") {
          const sourceNode = nodes.find((n) => n.id === (d.source as D3Node).id);
          const targetNode = nodes.find((n) => n.id === (d.target as D3Node).id);
          const isCurrentUserInvolved =
            sourceNode?.isCurrentUser || targetNode?.isCurrentUser;

          return isCurrentUserInvolved ? "0" : "5,5";
        }
        return "0";
      });

    const node = g
      .append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .style("cursor", "pointer")
      .call(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        d3.drag<any, D3Node>()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    node.each(function (d) {
      const nodeGroup = d3.select(this);
      const nodeRadius = getNodeRadius(d);
      const isEvent = d.nodeType === "event";
      const isCommunity = d.nodeType === "community";

      if (isEvent && d.coverImage) {
        nodeGroup
          .append("defs")
          .append("pattern")
          .attr("id", `cover-${d.id}`)
          .attr("width", 1)
          .attr("height", 1)
          .attr("patternContentUnits", "objectBoundingBox")
          .append("image")
          .attr("href", getStorageUrl(d.coverImage))
          .attr("width", 1)
          .attr("height", 1)
          .attr("preserveAspectRatio", "xMidYMid slice");

        nodeGroup
          .append("circle")
          .attr("r", nodeRadius)
          .attr("fill", `url(#cover-${d.id})`)
          .attr("stroke", "#a855f7")
          .attr("stroke-width", getNodeStrokeWidth(d));
      } else if (!isEvent && d.avatarUrl) {
        nodeGroup
          .append("defs")
          .append("pattern")
          .attr("id", `avatar-${d.id}`)
          .attr("width", 1)
          .attr("height", 1)
          .attr("patternContentUnits", "objectBoundingBox")
          .append("image")
          .attr("href", getStorageUrl(d.avatarUrl))
          .attr("width", 1)
          .attr("height", 1)
          .attr("preserveAspectRatio", "xMidYMid slice");

        nodeGroup
          .append("circle")
          .attr("r", nodeRadius)
          .attr("fill", `url(#avatar-${d.id})`)
          .attr("stroke", d.isCurrentUser ? "#2563eb" : "#9ca3af")
          .attr("stroke-width", getNodeStrokeWidth(d));
      } else {
        let fillColor;
        let strokeColor;

        if (isCommunity) {
          fillColor = "#8b5cf6";
          strokeColor = "#7c3aed";
        } else if (isEvent) {
          fillColor = "#9333ea";
          strokeColor = "#a855f7";
        } else if (d.isCurrentUser) {
          fillColor = "#3b82f6";
          strokeColor = "#2563eb";
        } else {
          fillColor = "#d1d5db";
          strokeColor = "#9ca3af";
        }

        nodeGroup
          .append("circle")
          .attr("r", nodeRadius)
          .attr("fill", fillColor)
          .attr("stroke", strokeColor)
          .attr("stroke-width", getNodeStrokeWidth(d));

        nodeGroup
          .append("text")
          .text(
            d.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
          )
          .attr("text-anchor", "middle")
          .attr("dy", "0.35em")
          .attr(
            "font-size",
            d.isCurrentUser ? "12px" : d.level === 1 ? "10px" : "8px"
          )
          .attr("font-weight", d.isCurrentUser ? "bold" : "normal")
          .attr("fill", "#374151")
          .attr("pointer-events", "none");
      }

      const labelFontSize = d.isCurrentUser ? 12 : d.level === 1 ? 10 : 8;
      const labelY = nodeRadius + labelFontSize + 4;

      const padding = 4;

      const tempText = nodeGroup
        .append("text")
        .text(d.name)
        .attr("font-size", `${labelFontSize}px`)
        .attr("visibility", "hidden");

      const bbox = tempText.node()?.getBBox();
      const textWidth = bbox?.width || 0;
      tempText.remove();

      nodeGroup
        .append("rect")
        .attr("x", -textWidth / 2 - padding)
        .attr("y", labelY - labelFontSize - padding / 2)
        .attr("width", textWidth + padding * 2)
        .attr("height", labelFontSize + padding)
        .attr("fill", "rgba(255, 255, 255, 0.75)")
        .attr("rx", 3)
        .attr("pointer-events", "none");

      nodeGroup
        .append("text")
        .text(d.name)
        .attr("text-anchor", "middle")
        .attr("y", labelY)
        .attr("font-size", `${labelFontSize}px`)
        .attr("font-weight", d.isCurrentUser ? "500" : "400")
        .attr("fill", "rgba(0, 0, 0, 0.55)")
        .attr("pointer-events", "none");
    });

    node
      .append("title")
      .text((d) => `${d.name}\n${d.role || ""}\n${d.connectionType.join(", ")}`);

    node.on("click", (event, d) => {
      event.stopPropagation();
      onNodeClick(d);
    });

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => ((d.source as D3Node).x as number) || 0)
        .attr("y1", (d) => ((d.source as D3Node).y as number) || 0)
        .attr("x2", (d) => ((d.target as D3Node).x as number) || 0)
        .attr("y2", (d) => ((d.target as D3Node).y as number) || 0);

      node.attr(
        "transform",
        (d) => `translate(${(d.x as number) || 0},${(d.y as number) || 0})`
      );
    });

    const zoomToFit = () => {
      const bounds = g.node()?.getBBox();
      if (!bounds) return;

      const fullWidth = w;
      const fullHeight = h;
      const width = bounds.width;
      const height = bounds.height;
      const midX = bounds.x + width / 2;
      const midY = bounds.y + height / 2;

      if (width === 0 || height === 0) return;

      const scale = 0.8 / Math.max(width / fullWidth, height / fullHeight);
      const translate = [
        fullWidth / 2 - scale * midX,
        fullHeight / 2 - scale * midY,
      ];

      svg
        .transition()
        .duration(750)
        .call(
          zoom.transform,
          d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
        );
    };

    setTimeout(zoomToFit, 500);

    return () => {
      simulation.stop();
    };
  }, [data, dimensions, currentTheme, onNodeClick]);

  return (
    <Card className="relative shadow-sm hover:shadow-md transition-shadow">
      <div ref={containerRef} className="relative">
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="bg-background/50"
        />
      </div>
    </Card>
  );
}


