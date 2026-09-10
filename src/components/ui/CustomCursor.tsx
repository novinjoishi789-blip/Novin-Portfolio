"use client";

import React, { useEffect, useState, useRef } from "react";

interface CustomCursorProps {
  hoverText: string | null;
}

export function CustomCursor({ hoverText }: CustomCursorProps) {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [targetPos, setTargetPos] = useState({ x: -100, y: -100 });
  const [isPointerFine, setIsPointerFine] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const animFrame = useRef<number | null>(null);

  useEffect(() => {
    // Check if device supports hover/fine pointer
    if (window.matchMedia("(pointer: fine)").matches) {
      setIsPointerFine(true);
    }

    const handleMouseMove = (e: MouseEvent) => {
      setTargetPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    // Smooth lerp loop
    const updateLoop = () => {
      setPos((prev) => ({
        x: prev.x + (targetPos.x - prev.x) * 0.22,
        y: prev.y + (targetPos.y - prev.y) * 0.22
      }));
      animFrame.current = requestAnimationFrame(updateLoop);
    };

    animFrame.current = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
    };
  }, [targetPos.x, targetPos.y]);

  if (!isPointerFine) return null;

  const isExpanded = !!hoverText;

  return (
    <div
      className="fixed top-0 left-0 pointer-events-none z-[999] transition-transform duration-75 ease-out"
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`
      }}
    >
      {/* Outer Dynamic Ring / Badge */}
      <div
        className={`relative -top-1/2 -left-1/2 flex items-center justify-center rounded-full transition-all duration-300 ease-out backdrop-blur-sm ${
          isExpanded
            ? "px-4 py-2 bg-[#0c0e12]/90 border border-[#e89e47]/60 text-neutral-100 shadow-[0_0_20px_rgba(232,158,71,0.25)]"
            : isClicking
            ? "w-8 h-8 bg-[#e89e47]/30 border border-[#e89e47]"
            : "w-5 h-5 border border-white/40 bg-white/10"
        }`}
      >
        {isExpanded ? (
          <span className="font-mono-tech text-[10px] tracking-wider uppercase whitespace-nowrap text-[#e89e47] font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e89e47] animate-pulse" />
            {hoverText}
          </span>
        ) : (
          <span className="w-1.5 h-1.5 rounded-full bg-[#e89e47]" />
        )}
      </div>
    </div>
  );
}
