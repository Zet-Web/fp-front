// D3.js force-directed network graph visualization with interactive nodes and zoom

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { NetworkData, NetworkNode, D3Node, D3Edge } from '../types/network';
import { getConnectionTypeColor, getNodeRadius, getNodeStrokeWidth } from '../lib/network-utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { useTheme } from 'next-themes';

interface D3NetworkGraphProps {
  data: NetworkData;
  onNodeClick: (node: NetworkNode) => void;
  width?: number;
  height?: number;
}

export function D3NetworkGraph({ data, onNodeClick, width = 800, height = 600 }: D3NetworkGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme, resolvedTheme } = useTheme();
  const [dimensions, setDimensions] = useState({ width, height });

  const currentTheme = (resolvedTheme || theme || 'light') as 'light' | 'dark';

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
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const { width: w, height: h } = dimensions;

    const g = svg.append('g');

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    const nodes: D3Node[] = data.nodes.map(node => ({ ...node }));
    const edges: D3Edge[] = data.edges.map(edge => ({ ...edge }));

    const simulation = d3.forceSimulation<D3Node>(nodes)
      .force('link', d3.forceLink<D3Node, D3Edge>(edges)
        .id(d => d.id)
        .distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(w / 2, h / 2))
      .force('collision', d3.forceCollide().radius(d => getNodeRadius(d as NetworkNode) + 30));

    const link = g.append('g')
      .selectAll('line')
      .data(edges)
      .join('line')
      .attr('stroke', d => getConnectionTypeColor(d.connectionType, currentTheme))
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', d => d.mutualConnections ? 2 : 1)
      .attr('stroke-dasharray', d => d.connectionType === 'community' ? '5,5' : '0');

    const node = g.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .style('cursor', 'pointer')
      .call(d3.drag<SVGGElement, D3Node>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    node.each(function(d) {
      const nodeGroup = d3.select(this);
      const nodeRadius = getNodeRadius(d);

      if (d.avatarUrl) {
        nodeGroup.append('defs')
          .append('pattern')
          .attr('id', `avatar-${d.id}`)
          .attr('width', 1)
          .attr('height', 1)
          .attr('patternContentUnits', 'objectBoundingBox')
          .append('image')
          .attr('href', d.avatarUrl)
          .attr('width', 1)
          .attr('height', 1)
          .attr('preserveAspectRatio', 'xMidYMid slice');

        nodeGroup.append('circle')
          .attr('r', nodeRadius)
          .attr('fill', `url(#avatar-${d.id})`)
          .attr('stroke', d.isCurrentUser
            ? (currentTheme === 'dark' ? '#93c5fd' : '#2563eb')
            : (currentTheme === 'dark' ? '#6b7280' : '#9ca3af'))
          .attr('stroke-width', getNodeStrokeWidth(d));
      } else {
        nodeGroup.append('circle')
          .attr('r', nodeRadius)
          .attr('fill', d.isCurrentUser
            ? (currentTheme === 'dark' ? '#60a5fa' : '#3b82f6')
            : (d.role === 'Сообщество'
              ? (currentTheme === 'dark' ? '#a78bfa' : '#8b5cf6')
              : (currentTheme === 'dark' ? '#4b5563' : '#d1d5db')))
          .attr('stroke', d.isCurrentUser
            ? (currentTheme === 'dark' ? '#93c5fd' : '#2563eb')
            : (currentTheme === 'dark' ? '#6b7280' : '#9ca3af'))
          .attr('stroke-width', getNodeStrokeWidth(d));

        nodeGroup.append('text')
          .text(d.name.split(' ').map(n => n[0]).join('').slice(0, 2))
          .attr('text-anchor', 'middle')
          .attr('dy', '0.35em')
          .attr('font-size', d.isCurrentUser ? '12px' : d.level === 1 ? '10px' : '8px')
          .attr('font-weight', d.isCurrentUser ? 'bold' : 'normal')
          .attr('fill', d.isCurrentUser || d.role === 'Сообщество'
            ? '#ffffff'
            : (currentTheme === 'dark' ? '#e5e7eb' : '#374151'))
          .attr('pointer-events', 'none');
      }


      const labelFontSize = d.isCurrentUser ? 12 : d.level === 1 ? 10 : 8;
const labelY = nodeRadius + labelFontSize + 4;





      const padding = 4;

      const tempText = nodeGroup.append('text')
        .text(d.name)
        .attr('font-size', `${labelFontSize}px`)
        .attr('visibility', 'hidden');

      const bbox = tempText.node()?.getBBox();
      const textWidth = bbox?.width || 0;
      tempText.remove();

      nodeGroup.append('rect')
        .attr('x', -textWidth / 2 - padding)
        .attr('y', labelY - labelFontSize - padding / 2)
        .attr('width', textWidth + padding * 2)
        .attr('height', labelFontSize + padding)
        .attr('fill', currentTheme === 'dark' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.75)')
        .attr('rx', 3)
        .attr('pointer-events', 'none');

      nodeGroup.append('text')
        .text(d.name)
        .attr('text-anchor', 'middle')
        .attr('y', labelY)

.attr('font-size', `${labelFontSize}px`)
.attr('font-weight', '400')
.attr('fill', currentTheme === 'dark' ? 'rgba(156, 163, 175, 0.7)' : 'rgba(107, 114, 128, 0.7)')
.attr('pointer-events', 'none');

    });

    node.append('title')
      .text(d => `${d.name}\n${d.role || ''}\n${d.connectionType.join(', ')}`);

    node.on('click', (event, d) => {
      event.stopPropagation();
      onNodeClick(d);
    });

    node.on('mouseenter', function(event, d) {
      d3.select(this).select('circle')
        .transition()
        .duration(200)
        .attr('r', getNodeRadius(d) * 1.2)
        .attr('stroke-width', getNodeStrokeWidth(d) + 1);

      link
        .transition()
        .duration(200)
        .attr('stroke-opacity', edge => {
          return (edge.source as D3Node).id === d.id || (edge.target as D3Node).id === d.id ? 1 : 0.1;
        });
    });

    node.on('mouseleave', function(event, d) {
      d3.select(this).select('circle')
        .transition()
        .duration(200)
        .attr('r', getNodeRadius(d))
        .attr('stroke-width', getNodeStrokeWidth(d));

      link
        .transition()
        .duration(200)
        .attr('stroke-opacity', 0.6);
    });

    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as D3Node).x || 0)
        .attr('y1', d => (d.source as D3Node).y || 0)
        .attr('x2', d => (d.target as D3Node).x || 0)
        .attr('y2', d => (d.target as D3Node).y || 0);

      node.attr('transform', d => `translate(${d.x || 0},${d.y || 0})`);
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
      const translate = [fullWidth / 2 - scale * midX, fullHeight / 2 - scale * midY];

      svg.transition()
        .duration(750)
        .call(zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
    };

    setTimeout(zoomToFit, 500);

    return () => {
      simulation.stop();
    };
  }, [data, dimensions, currentTheme, onNodeClick]);

  const handleZoomIn = () => {
    const svg = d3.select(svgRef.current);
    svg.transition().duration(300).call(
      d3.zoom<SVGSVGElement, unknown>().scaleBy as any,
      1.3
    );
  };

  const handleZoomOut = () => {
    const svg = d3.select(svgRef.current);
    svg.transition().duration(300).call(
      d3.zoom<SVGSVGElement, unknown>().scaleBy as any,
      0.7
    );
  };

  const handleResetZoom = () => {
    const svg = d3.select(svgRef.current);
    svg.transition().duration(300).call(
      d3.zoom<SVGSVGElement, unknown>().transform as any,
      d3.zoomIdentity
    );
  };

  return (
    <Card className="relative shadow-sm hover:shadow-md transition-shadow">
      <div ref={containerRef} className="relative">
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="bg-background/50"
        />

        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomIn}
            className="shadow-md bg-background/95 hover:bg-accent"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomOut}
            className="shadow-md bg-background/95 hover:bg-accent"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleResetZoom}
            className="shadow-md bg-background/95 hover:bg-accent"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
