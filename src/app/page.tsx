"use client";

import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { Project } from "@/data/portfolioData";
import { sound } from "@/lib/SoundManager";
import { OpeningLoader } from "@/components/ui/OpeningLoader";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { Navigation } from "@/components/ui/Navigation";
import { ScrollNarrative } from "@/components/ui/ScrollNarrative";
import { ProjectModal } from "@/components/ui/ProjectModal";
import Lenis from "lenis";

// Dynamically import 3D Canvas with SSR disabled to ensure WebGL context runs strictly on client
const StudioCanvas = dynamic(
  () => import("@/components/3d/StudioCanvas").then((mod) => mod.StudioCanvas),
  { ssr: false }
);

export default function Home() {
  const [isOpening, setIsOpening] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activePreset, setActivePreset] = useState<
    "master" | "work" | "about" | "stack" | "experiments" | "contact" | null
  >(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hoverLabel, setHoverLabel] = useState<string | null>(null);
  const [is3DMode, setIs3DMode] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>("work");

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 2.0
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const handleSelectSection = useCallback(
    (section: "work" | "about" | "stack" | "experiments" | "contact" | null) => {
      if (!section) return;
      setActiveSection(section);
      setActivePreset(section);
      const targetElement = document.getElementById(section);
      if (targetElement) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = targetElement.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
      // Reset preset after animation completes so scroll resumes control
      setTimeout(() => setActivePreset(null), 1400);
    },
    []
  );

  const handleOpeningComplete = useCallback(() => {
    setIsOpening(false);
  }, []);

  const handleSelectProject = useCallback((project: Project) => {
    setSelectedProject(project);
  }, []);

  const handleCloseProject = useCallback(() => {
    setSelectedProject(null);
  }, []);

  const handleToggle3DMode = useCallback(() => {
    sound.playClick();
    setIs3DMode((prev) => !prev);
  }, []);

  return (
    <main className="relative min-h-screen bg-[#060709] text-[#f3f4f6]">
      {/* Dynamic Cursor */}
      <CustomCursor hoverText={hoverLabel} />

      {/* Cinematic Opening Film Sequence */}
      <OpeningLoader onComplete={handleOpeningComplete} />

      {/* Luxury Navigation Header */}
      <Navigation
        onSelectSection={handleSelectSection}
        activeSection={activeSection}
        is3DMode={is3DMode}
        onToggle3DMode={handleToggle3DMode}
      />

      {/* 3D Studio Canvas Backdrop */}
      {is3DMode && (
        <StudioCanvas
          scrollProgress={scrollProgress}
          activePreset={activePreset}
          isOpening={isOpening}
          onSelectProject={handleSelectProject}
          onHoverObject={setHoverLabel}
          onFocusSection={handleSelectSection}
        />
      )}

      {/* Scroll Narrative Overlays & Content Sections */}
      <ScrollNarrative
        onSelectProject={handleSelectProject}
        onHoverObject={setHoverLabel}
        onScrollProgressChange={setScrollProgress}
        onActiveSectionChange={setActiveSection}
        is3DMode={is3DMode}
      />

      {/* Fullscreen Case Study Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={handleCloseProject}
        onNavigateProject={setSelectedProject}
      />
    </main>
  );
}
