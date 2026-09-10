"use client";

import React, { useState, useEffect, useRef } from "react";
import { EXPERIMENTS_LIST, Experiment } from "@/data/portfolioData";
import { sound } from "@/lib/SoundManager";
import { Sparkles, Play, Sliders } from "lucide-react";

export function ExperimentsDrawer() {
  const [selectedExp, setSelectedExp] = useState<Experiment>(EXPERIMENTS_LIST[0]);
  const [speed, setSpeed] = useState(1.0);
  const [frequency, setFrequency] = useState(2.5);
  const [colorMode, setColorMode] = useState<"gold" | "cyber" | "neon">("gold");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const render = () => {
      time += 0.015 * speed;
      const width = (canvas.width = canvas.parentElement?.clientWidth || 600);
      const height = (canvas.height = canvas.parentElement?.clientHeight || 400);

      ctx.fillStyle = "#060709";
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Color scheme selector
      const getPaletteColor = (i: number, total: number) => {
        const ratio = i / total;
        if (colorMode === "gold") {
          return `rgba(232, 158, 71, ${0.3 + 0.6 * Math.sin(time + ratio * Math.PI)})`;
        } else if (colorMode === "cyber") {
          return `rgba(59, 130, 246, ${0.3 + 0.6 * Math.cos(time + ratio * Math.PI)})`;
        } else {
          return `rgba(236, 72, 153, ${0.3 + 0.6 * Math.sin(time * 1.5 + ratio * Math.PI)})`;
        }
      };

      if (selectedExp.shaderType === "raymarching" || selectedExp.shaderType === "mesh-distortion") {
        // Generative Wave / Metasphere Lattice
        const rings = 12;
        for (let r = 0; r < rings; r++) {
          ctx.beginPath();
          const baseRadius = 30 + r * 14;
          const points = 60;
          for (let p = 0; p <= points; p++) {
            const angle = (p / points) * Math.PI * 2;
            const distortion = Math.sin(angle * frequency + time + r * 0.4) * (15 + r * 2);
            const rad = baseRadius + distortion;
            const x = cx + Math.cos(angle) * rad;
            const y = cy + Math.sin(angle) * (rad * 0.7);
            if (p === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.strokeStyle = getPaletteColor(r, rings);
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      } else if (selectedExp.shaderType === "particles") {
        // 200 kinetic vortex particles
        const count = 180;
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2 + time * 0.3;
          const rad = (Math.sin(time * 0.5 + i * 0.1) * 0.5 + 0.5) * (width * 0.35);
          const px = cx + Math.cos(angle * frequency * 0.5) * rad;
          const py = cy + Math.sin(angle * 1.2) * (rad * 0.65);

          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = getPaletteColor(i, count);
          ctx.fill();
        }
      } else {
        // Fluid noise grid
        const cols = 24;
        const rows = 16;
        const cellW = width / cols;
        const cellH = height / rows;
        for (let c = 0; c < cols; c++) {
          for (let r = 0; r < rows; r++) {
            const val = Math.sin(c * 0.3 * frequency + time) * Math.cos(r * 0.3 * frequency - time);
            const lineLen = cellW * 0.6 * Math.abs(val);
            const px = c * cellW + cellW / 2;
            const py = r * cellH + cellH / 2;
            ctx.beginPath();
            ctx.moveTo(px - lineLen, py);
            ctx.lineTo(px + lineLen, py);
            ctx.strokeStyle = getPaletteColor(c + r, cols + rows);
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [selectedExp, speed, frequency, colorMode]);

  return (
    <div className="w-full max-w-6xl mx-auto py-16 px-6 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 font-mono-tech text-xs text-[#e89e47] tracking-widest uppercase mb-1">
            <Sparkles size={14} />
            <span>[ 04 // WEBGL & INTERACTION LAB ]</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold uppercase tracking-tight text-gradient-silver">
            EXPERIMENTAL SHADER LAB
          </h2>
        </div>
        <div className="flex items-center gap-2 font-mono-tech text-xs text-neutral-400">
          <Sliders size={14} className="text-[#e89e47]" />
          <span>GPU SHADER ACCELERATED // 60 FPS</span>
        </div>
      </div>

      {/* Main Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Visual Canvas Output */}
        <div className="lg:col-span-8 relative h-[380px] sm:h-[460px] rounded-2xl studio-glass border border-white/10 overflow-hidden">
          <canvas ref={canvasRef} className="w-full h-full" />
          <div className="absolute top-4 left-4 flex items-center gap-2 font-mono-tech text-xs bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-neutral-300 uppercase">{selectedExp.title}</span>
          </div>
        </div>

        {/* Controls & Experiment Selector */}
        <div className="lg:col-span-4 space-y-6">
          {/* Experiment Switcher */}
          <div className="space-y-2">
            <span className="font-mono-tech text-[10px] text-neutral-400 uppercase tracking-widest block">
              SELECT PROTOTYPE
            </span>
            <div className="space-y-2">
              {EXPERIMENTS_LIST.map((exp) => (
                <button
                  key={exp.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedExp(exp);
                  }}
                  className={`w-full text-left p-3.5 rounded-xl font-mono-tech text-xs transition-all flex items-center justify-between ${
                    selectedExp.id === exp.id
                      ? "bg-[#e89e47]/20 border border-[#e89e47] text-neutral-100"
                      : "studio-glass text-neutral-400 hover:text-neutral-200"
                  }`}
                >
                  <div>
                    <span className="font-bold block text-sm font-display uppercase">{exp.title}</span>
                    <span className="text-[10px] text-neutral-400">{exp.category} • {exp.date}</span>
                  </div>
                  <Play size={14} className={selectedExp.id === exp.id ? "text-[#e89e47]" : "opacity-30"} />
                </button>
              ))}
            </div>
          </div>

          {/* Realtime Shader Uniform Sliders */}
          <div className="p-5 rounded-2xl studio-glass border border-white/10 space-y-4 font-mono-tech text-xs">
            <span className="text-[10px] text-[#e89e47] uppercase tracking-widest block font-bold">
              REAL-TIME UNIFORM PARAMETERS
            </span>

            {/* Speed */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-neutral-400">
                <span>TIME VELOCITY</span>
                <span className="text-neutral-200">{speed.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full accent-[#e89e47] cursor-pointer"
              />
            </div>

            {/* Frequency */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-neutral-400">
                <span>HARMONIC FREQUENCY</span>
                <span className="text-neutral-200">{frequency.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="8.0"
                step="0.5"
                value={frequency}
                onChange={(e) => setFrequency(parseFloat(e.target.value))}
                className="w-full accent-[#e89e47] cursor-pointer"
              />
            </div>

            {/* Color Palette */}
            <div className="space-y-1.5 pt-2">
              <span className="text-neutral-400 block text-[10px] uppercase">CHROMATIC SPECTRUM</span>
              <div className="flex gap-2">
                {(["gold", "cyber", "neon"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => {
                      sound.playClick();
                      setColorMode(mode);
                    }}
                    className={`flex-1 py-1.5 rounded uppercase text-[10px] font-bold transition-all ${
                      colorMode === mode
                        ? "bg-[#e89e47] text-[#060709]"
                        : "bg-white/5 text-neutral-400 hover:text-neutral-200"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
