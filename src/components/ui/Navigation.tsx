"use client";

import React, { useEffect, useState } from "react";
import { sound } from "@/lib/SoundManager";
import { Volume2, VolumeX, Sparkles, LayoutGrid } from "lucide-react";

interface NavigationProps {
  onSelectSection: (section: "work" | "about" | "stack" | "experiments" | "contact") => void;
  activeSection: string | null;
  is3DMode: boolean;
  onToggle3DMode: () => void;
}

export function Navigation({
  onSelectSection,
  activeSection,
  is3DMode,
  onToggle3DMode
}: NavigationProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const d = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      };
      setTimeStr(`${d.toLocaleTimeString("en-GB", options)} IST`);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSoundToggle = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const navItems: { id: "work" | "about" | "stack" | "experiments" | "contact"; label: string; num: string }[] = [
    { id: "work", label: "WORK", num: "01" },
    { id: "about", label: "ABOUT", num: "02" },
    { id: "stack", label: "STACK", num: "03" },
    { id: "experiments", label: "LAB", num: "04" },
    { id: "contact", label: "CONTACT", num: "05" }
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 px-4 py-4 sm:px-8 md:px-12 flex items-center justify-between pointer-events-none">
        {/* Brand Logotype */}
        <div
          className="pointer-events-auto flex flex-col group cursor-pointer"
          onClick={() => onSelectSection("work")}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#f59e0b] shadow-[0_0_8px_#f59e0b]" />
            <span className="font-display text-sm md:text-base font-bold tracking-tight text-neutral-100 group-hover:text-[#f59e0b] transition-colors">
              NOVIN JOISHI
            </span>
          </div>
          <span className="font-mono-tech text-[10px] text-neutral-400 tracking-wider pl-4">
            CREATIVE DEVELOPER
          </span>
        </div>

        {/* Center Nav Links (Desktop & Tablet) */}
        <nav className="hidden md:flex items-center gap-1.5 studio-glass px-3 py-1.5 rounded-full pointer-events-auto shadow-2xl border border-white/10 backdrop-blur-xl">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sound.playClick();
                  onSelectSection(item.id);
                }}
                onMouseEnter={() => sound.playHover()}
                className={`relative px-3.5 py-1.5 rounded-full font-mono-tech text-xs tracking-wider transition-all duration-300 flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[#f59e0b] text-[#060709] font-bold shadow-[0_0_16px_rgba(245,158,11,0.6)] scale-[1.03]"
                    : "text-neutral-400 hover:text-neutral-100 hover:bg-white/5"
                }`}
              >
                <span className={`text-[10px] ${isActive ? "text-[#060709]/70 font-semibold" : "opacity-40"}`}>
                  {item.num}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Controls: Clock, Sound Toggle, 2D/3D Mode Switch */}
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
          {/* Live Clock */}
          <div className="hidden lg:flex items-center gap-2 studio-glass px-3 py-1.5 rounded-full font-mono-tech text-[11px] text-neutral-300 border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{timeStr || "LOCAL TIME"}</span>
          </div>

          {/* 3D / 2D View Switch */}
          <button
            onClick={onToggle3DMode}
            title={is3DMode ? "Switch to Architectural 2D View" : "Switch to Immersive 3D Studio"}
            className="studio-glass studio-glass-hover p-2.5 rounded-full text-neutral-300 hover:text-[#f59e0b] border border-white/10 transition-colors"
          >
            {is3DMode ? <Sparkles size={16} /> : <LayoutGrid size={16} />}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={handleSoundToggle}
            title={isMuted ? "Enable Sound Experience" : "Mute Sound"}
            className={`studio-glass studio-glass-hover p-2.5 rounded-full transition-colors border ${
              !isMuted
                ? "text-[#f59e0b] border-[#f59e0b]/60 shadow-[0_0_12px_rgba(245,158,11,0.4)]"
                : "text-neutral-400 border-white/10"
            }`}
          >
            {!isMuted ? (
              <div className="flex items-center gap-1">
                <Volume2 size={16} />
                <div className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 h-full bg-[#f59e0b] animate-pulse" />
                  <span className="w-0.5 h-2/3 bg-[#f59e0b] animate-pulse" style={{ animationDelay: "150ms" }} />
                  <span className="w-0.5 h-4/5 bg-[#f59e0b] animate-pulse" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            ) : (
              <VolumeX size={16} />
            )}
          </button>
        </div>
      </header>

      {/* Floating Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
        <nav className="flex items-center gap-1 studio-glass px-3 py-1.5 rounded-full border border-white/15 shadow-2xl backdrop-blur-2xl">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sound.playClick();
                  onSelectSection(item.id);
                }}
                className={`px-3 py-1.5 rounded-full font-mono-tech text-[11px] tracking-wider transition-all ${
                  isActive
                    ? "bg-[#f59e0b] text-[#060709] font-bold shadow-[0_0_12px_rgba(245,158,11,0.5)]"
                    : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}
