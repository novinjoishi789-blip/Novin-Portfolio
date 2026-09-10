"use client";

import React, { useEffect, useState } from "react";
import { sound } from "@/lib/SoundManager";

interface OpeningLoaderProps {
  onComplete: () => void;
}

export function OpeningLoader({ onComplete }: OpeningLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "reveal" | "done">("loading");

  useEffect(() => {
    // High-speed counter simulation with micro-audio ticks
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 4) + 2;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setProgress(100);
        sound.playChime();
        
        // Sequence phases
        setTimeout(() => {
          setPhase("reveal");
          setTimeout(() => {
            setPhase("done");
            onComplete();
          }, 1400);
        }, 300);
      } else {
        setProgress(current);
      }
    }, 28);

    return () => clearInterval(interval);
  }, [onComplete]);

  if (phase === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col justify-between p-8 md:p-14 bg-[#060709] transition-opacity duration-1000 ${
        phase === "reveal" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Top Header info */}
      <div className="flex items-center justify-between font-mono-tech text-xs text-neutral-400 tracking-wider">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#e89e47] animate-ping inline-block" />
          SYSTEM.INIT // NOVIN JOISHI STUDIO
        </span>
        <span>LAT: 27.20°N // LON: 77.49°E</span>
      </div>

      {/* Center Cinematic Typography */}
      <div className="my-auto max-w-4xl">
        <p className="font-mono-tech text-xs md:text-sm text-[#e89e47] uppercase tracking-widest mb-3">
          [ 001 // DIGITAL WORKSPACE ]
        </p>
        <h1 className="font-display text-4xl sm:text-6xl md:text-8xl font-bold uppercase tracking-tight text-gradient-silver mb-4 leading-none">
          NOVIN JOISHI
        </h1>
        <div className="h-px w-32 bg-[#e89e47]/60 mb-5" />
        <p className="font-mono-tech text-xs sm:text-sm text-neutral-300 max-w-xl leading-relaxed">
          Digital systems, interactive interfaces and experiences built at the intersection of code and design.
        </p>
      </div>

      {/* Bottom Progress Bar & Counter */}
      <div className="flex flex-col gap-3">
        <div className="flex items-end justify-between font-mono-tech">
          <span className="text-xs text-neutral-400">INITIALIZING 3D ENVIRONMENT</span>
          <span className="text-xl sm:text-2xl font-bold text-[#e89e47]">
            {progress.toString().padStart(3, "0")}%
          </span>
        </div>
        <div className="w-full h-1 bg-neutral-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#d97706] to-[#fbbf24] transition-all duration-75 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
