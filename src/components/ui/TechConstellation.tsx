"use client";

import React, { useState, useEffect, useRef } from "react";
import { TECH_NODES, TechNode } from "@/data/portfolioData";
import { sound } from "@/lib/SoundManager";
import { Cpu, Terminal, X, Code2 } from "lucide-react";

interface TechConstellationProps {
  onClose?: () => void;
}

export function TechConstellation({ onClose }: TechConstellationProps) {
  const [selectedNode, setSelectedNode] = useState<TechNode | null>(TECH_NODES[0]);
  const [hoveredNode, setHoveredNode] = useState<TechNode | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Position coordinates on a 2D canvas with subtle orbital drift
  const nodePositions = useRef<{ [key: string]: { x: number; y: number; vx: number; vy: number; baseAngle: number; dist: number } }>({});

  useEffect(() => {
    // Initialize radial constellation positions around central NOVIN anchor
    const total = TECH_NODES.length;
    TECH_NODES.forEach((node, idx) => {
      const angle = (idx / total) * Math.PI * 2;
      const dist = 140 + (idx % 3) * 70;
      nodePositions.current[node.id] = {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        baseAngle: angle,
        dist
      };
    });

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const render = () => {
      time += 0.008;
      const width = canvas.width = canvas.parentElement?.clientWidth || 800;
      const height = canvas.height = canvas.parentElement?.clientHeight || 600;
      const cx = width / 2;
      const cy = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Central Hub: NOVIN
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, 32, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(232, 158, 71, 0.15)";
      ctx.fill();
      ctx.strokeStyle = "#e89e47";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("NOVIN", cx, cy);
      ctx.restore();

      // Calculate node positions
      TECH_NODES.forEach((node) => {
        const p = nodePositions.current[node.id];
        if (!p) return;
        
        // Orbital drift
        const currentAngle = p.baseAngle + time * 0.15;
        p.x = cx + Math.cos(currentAngle) * p.dist;
        p.y = cy + Math.sin(currentAngle) * (p.dist * 0.85);
      });

      // Draw connection filaments
      TECH_NODES.forEach((node) => {
        const p1 = nodePositions.current[node.id];
        if (!p1) return;

        // Connect to center
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(p1.x, p1.y);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Connect to interrelated nodes
        node.connections.forEach((targetId) => {
          const p2 = nodePositions.current[targetId];
          if (p2) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            const isHighlighted =
              hoveredNode?.id === node.id ||
              hoveredNode?.id === targetId ||
              selectedNode?.id === node.id;
            ctx.strokeStyle = isHighlighted
              ? "rgba(232, 158, 71, 0.45)"
              : "rgba(255, 255, 255, 0.08)";
            ctx.lineWidth = isHighlighted ? 1.5 : 1;
            ctx.stroke();
          }
        });
      });

      // Draw nodes
      TECH_NODES.forEach((node) => {
        const p = nodePositions.current[node.id];
        if (!p) return;

        const isHovered = hoveredNode?.id === node.id;
        const isSelected = selectedNode?.id === node.id;
        const radius = isSelected ? 18 : isHovered ? 15 : 10;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        
        // Fill
        if (isSelected) {
          ctx.fillStyle = "#e89e47";
        } else if (isHovered) {
          ctx.fillStyle = "rgba(232, 158, 71, 0.8)";
        } else {
          ctx.fillStyle = node.category === "graphics" ? "#ec4899" : node.category === "systems" ? "#3b82f6" : "#10b981";
        }
        ctx.fill();

        // Outer glow ring
        if (isSelected || isHovered) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius + 6, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(232, 158, 71, 0.4)";
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Text label
        ctx.fillStyle = isSelected || isHovered ? "#ffffff" : "rgba(255, 255, 255, 0.7)";
        ctx.font = isSelected ? "bold 11px monospace" : "10px monospace";
        ctx.textAlign = "center";
        ctx.fillText(node.name, p.x, p.y + radius + 14);
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [hoveredNode, selectedNode]);

  // Click / Hover interaction with canvas
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    TECH_NODES.forEach((node) => {
      const p = nodePositions.current[node.id];
      if (p) {
        const dist = Math.hypot(clickX - p.x, clickY - p.y);
        if (dist <= 25) {
          sound.playClick();
          setSelectedNode(node);
        }
      }
    });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let found: TechNode | null = null;
    TECH_NODES.forEach((node) => {
      const p = nodePositions.current[node.id];
      if (p) {
        const dist = Math.hypot(mouseX - p.x, mouseY - p.y);
        if (dist <= 25) {
          found = node;
        }
      }
    });

    if (found !== hoveredNode) {
      if (found) sound.playHover();
      setHoveredNode(found);
    }
  };

  const filteredNodes = filterCategory === "all"
    ? TECH_NODES
    : TECH_NODES.filter((n) => n.category === filterCategory);

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 font-mono-tech text-xs text-[#e89e47] tracking-widest uppercase mb-1">
            <Cpu size={14} />
            <span>[ 03 // ARCHITECTURAL STACK MATRIX ]</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold uppercase tracking-tight text-gradient-silver">
            TECHNOLOGY CONSTELLATION
          </h2>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 font-mono-tech text-xs">
          {["all", "graphics", "frontend", "backend", "systems"].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                sound.playClick();
                setFilterCategory(cat);
              }}
              className={`px-3 py-1.5 rounded-full capitalize transition-all ${
                filterCategory === cat
                  ? "bg-[#e89e47] text-[#060709] font-semibold"
                  : "studio-glass text-neutral-400 hover:text-neutral-200"
              }`}
            >
              {cat}
            </button>
          ))}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-full studio-glass text-neutral-400 hover:text-neutral-100 ml-2"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive Visualizer & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Interactive Constellation Canvas */}
        <div className="lg:col-span-8 relative h-[440px] sm:h-[520px] rounded-2xl studio-glass border border-white/10 overflow-hidden flex items-center justify-center">
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
            className="w-full h-full cursor-pointer"
          />
          <div className="absolute bottom-4 left-4 font-mono-tech text-[10px] text-neutral-500">
            [ INTERACTION: HOVER TO HIGHLIGHT // CLICK NODE TO INSPECT ]
          </div>
        </div>

        {/* Node Inspector Panel */}
        <div className="lg:col-span-4 space-y-6">
          {selectedNode ? (
            <div className="p-6 rounded-2xl studio-glass border border-[#e89e47]/30 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono-tech text-[10px] uppercase text-[#e89e47] tracking-wider">
                    {selectedNode.category} DOMAIN
                  </span>
                  <h3 className="font-display text-2xl font-bold text-neutral-100">
                    {selectedNode.name}
                  </h3>
                </div>
                <div className="px-3 py-1 rounded bg-[#e89e47]/10 border border-[#e89e47]/30 font-mono-tech text-xs text-[#e89e47] font-bold">
                  {selectedNode.level}% PROFICIENCY
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#d97706] to-[#fbbf24]"
                  style={{ width: `${selectedNode.level}%` }}
                />
              </div>

              <p className="font-mono-tech text-xs text-neutral-300 leading-relaxed">
                {selectedNode.description}
              </p>

              <div>
                <h4 className="font-mono-tech text-[11px] text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Code2 size={13} className="text-[#e89e47]" />
                  Deployed In Key Projects:
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.projectsUsedIn.map((proj) => (
                    <span
                      key={proj}
                      className="px-2.5 py-1 rounded bg-white/5 border border-white/10 font-mono-tech text-[10px] text-neutral-200"
                    >
                      {proj}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl studio-glass border border-white/10 text-center font-mono-tech text-xs text-neutral-500">
              Select any node in the constellation to view architectural capabilities.
            </div>
          )}

          {/* Quick node pill list */}
          <div className="space-y-2">
            <span className="font-mono-tech text-[10px] text-neutral-500 uppercase tracking-widest block">
              QUICK NODE SELECTION
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1">
              {filteredNodes.map((node) => (
                <button
                  key={node.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedNode(node);
                  }}
                  className={`px-2.5 py-1 rounded font-mono-tech text-[10px] tracking-wider transition-all ${
                    selectedNode?.id === node.id
                      ? "bg-[#e89e47] text-[#060709] font-bold"
                      : "bg-white/5 text-neutral-400 hover:text-neutral-200 hover:bg-white/10"
                  }`}
                >
                  {node.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
