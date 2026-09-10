"use client";

import React, { useState } from "react";
import { PERSONAL_INFO } from "@/data/portfolioData";
import { sound } from "@/lib/SoundManager";
import { Terminal, Shield, Sparkles, Binary, Check } from "lucide-react";

export function AboutTerminal() {
  const [activeTab, setActiveTab] = useState<"philosophy" | "systems" | "rigor">("philosophy");
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    sound.playClick();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-16 px-6 space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 font-mono-tech text-xs text-[#e89e47] tracking-widest uppercase">
          <Terminal size={14} />
          <span>[ 02 // DOSSIER & ARCHITECTURAL ETHOS ]</span>
        </div>
        <h2 className="font-display text-4xl sm:text-6xl font-bold uppercase tracking-tight text-gradient-silver">
          ENGINEERING MEETS DESIGN
        </h2>
        <p className="font-mono-tech text-base sm:text-lg text-neutral-300 max-w-2xl leading-relaxed">
          {PERSONAL_INFO.tagline}
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Terminal Tabs */}
        <div className="lg:col-span-8 rounded-2xl studio-glass border border-white/10 overflow-hidden">
          {/* Terminal Title Bar */}
          <div className="px-6 py-3.5 border-b border-white/10 bg-black/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
              <span className="font-mono-tech text-xs text-neutral-400 pl-3">
                novin@studio: ~/core-philosophy.sh
              </span>
            </div>
            <div className="flex items-center gap-1 font-mono-tech text-xs">
              {(["philosophy", "systems", "rigor"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    sound.playClick();
                    setActiveTab(tab);
                  }}
                  className={`px-3 py-1 rounded capitalize transition-all ${
                    activeTab === tab
                      ? "bg-[#e89e47]/20 text-[#e89e47] border border-[#e89e47]/40 font-semibold"
                      : "text-neutral-400 hover:text-neutral-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Terminal Content Body */}
          <div className="p-8 font-mono-tech text-sm leading-relaxed space-y-6">
            {activeTab === "philosophy" && (
              <div className="space-y-4">
                <p className="text-neutral-300">
                  <span className="text-[#e89e47] font-bold">&gt; const ETHOS =</span> &ldquo;{PERSONAL_INFO.bio[0]}&rdquo;
                </p>
                <p className="text-neutral-300">
                  <span className="text-[#e89e47] font-bold">&gt; const APPROACH =</span> &ldquo;{PERSONAL_INFO.bio[1]}&rdquo;
                </p>
                <p className="text-neutral-400 text-xs pl-4 border-l border-[#e89e47]/40">
                  {PERSONAL_INFO.bio[2]}
                </p>
              </div>
            )}

            {activeTab === "systems" && (
              <div className="space-y-4 text-xs sm:text-sm">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                  <span className="text-[#e89e47] font-bold">[ 01. FULL-STACK RESILIENCE ]</span>
                  <p className="text-neutral-300">
                    Architecting distributed, type-safe backends (Node.js, PostgreSQL, Redis, gRPC) designed to sustain high burst throughput with zero memory leaks.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                  <span className="text-[#e89e47] font-bold">[ 02. GRAPHICS & SHADERS ]</span>
                  <p className="text-neutral-300">
                    Direct GPU programming with Three.js and custom GLSL vertex/fragment shaders for real-time spatial calculations and responsive 3D environments.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                  <span className="text-[#e89e47] font-bold">[ 03. INTERACTIVE CHOREOGRAPHY ]</span>
                  <p className="text-neutral-300">
                    Sub-pixel inertial animation with GSAP and Lenis, turning mundane web interfaces into memorable cinematic narratives.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "rigor" && (
              <div className="space-y-4 text-xs sm:text-sm">
                <p className="text-neutral-300">
                  Every project adheres to a strict 16.6ms frame budget (60-120 FPS), rigorous TypeScript static guarantees, and responsive accessible fallbacks.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded bg-white/5 border border-white/10 text-center">
                    <span className="text-neutral-400 block text-[10px]">FRAME BUDGET</span>
                    <span className="text-lg font-bold text-[#e89e47]">16.6ms Target</span>
                  </div>
                  <div className="p-3 rounded bg-white/5 border border-white/10 text-center">
                    <span className="text-neutral-400 block text-[10px]">TYPE RIGOR</span>
                    <span className="text-lg font-bold text-[#e89e47]">100% Strict TS</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Key Stats & Quick Contact Dossier */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl studio-glass border border-white/10 space-y-6">
            <h3 className="font-display text-lg font-bold uppercase tracking-tight text-neutral-200">
              Operational Telemetry
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {PERSONAL_INFO.stats.map((stat, idx) => (
                <div key={idx} className="space-y-1">
                  <span className="font-mono-tech text-[10px] text-neutral-400 uppercase tracking-wider block">
                    {stat.label}
                  </span>
                  <span className="font-display text-2xl font-bold text-[#e89e47]">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 space-y-3">
              <span className="font-mono-tech text-[10px] text-neutral-400 uppercase tracking-wider block">
                DIRECT TRANSMISSION
              </span>
              <button
                onClick={handleCopyEmail}
                className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-[#e89e47] hover:text-[#060709] border border-white/10 font-mono-tech text-xs tracking-wider transition-all duration-200 flex items-center justify-between group"
              >
                <span>{PERSONAL_INFO.email}</span>
                {copied ? <Check size={14} className="text-emerald-400" /> : <span className="text-[10px] opacity-60 group-hover:opacity-100">COPY</span>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
