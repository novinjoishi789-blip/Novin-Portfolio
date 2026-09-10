"use client";

import React, { useRef, useEffect } from "react";
import { Project, PROJECTS, PERSONAL_INFO } from "@/data/portfolioData";
import { sound } from "@/lib/SoundManager";
import { ArrowUpRight, ChevronDown, Layers, Terminal, Sparkles, Cpu } from "lucide-react";
import { TechConstellation } from "./TechConstellation";
import { AboutTerminal } from "./AboutTerminal";
import { ExperimentsDrawer } from "./ExperimentsDrawer";
import { ContactSection } from "./ContactSection";

interface ScrollNarrativeProps {
  onSelectProject: (p: Project) => void;
  onHoverObject: (label: string | null) => void;
  onScrollProgressChange: (prog: number) => void;
  onActiveSectionChange?: (section: string | null) => void;
  is3DMode: boolean;
}

export function ScrollNarrative({
  onSelectProject,
  onHoverObject,
  onScrollProgressChange,
  onActiveSectionChange,
  is3DMode
}: ScrollNarrativeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = window.scrollY / totalScroll;
        onScrollProgressChange(Math.min(1, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [onScrollProgressChange]);

  // Precise IntersectionObserver to track visible section
  useEffect(() => {
    const sectionIds = ["hero", "work", "about", "stack", "experiments", "contact"];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
              if (onActiveSectionChange) {
                onActiveSectionChange(id === "hero" ? "work" : id);
              }
            }
          });
        },
        { threshold: [0.25, 0.5, 0.75] }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, [onActiveSectionChange]);

  return (
    <div ref={containerRef} className="relative z-10 w-full">
      {/* ----------------- SECTION 0: HERO (0% - 15%) ----------------- */}
      <section id="hero" className="min-h-screen flex flex-col justify-between p-6 sm:p-12 md:p-16 pointer-events-none">
        <div /> {/* Spacer */}
        <div className="max-w-5xl space-y-4 pointer-events-auto">
          <div className="inline-flex items-center gap-2 font-mono-tech text-xs text-[#e89e47] tracking-widest uppercase studio-glass px-3 py-1.5 rounded-full border border-[#e89e47]/30">
            <span className="w-2 h-2 rounded-full bg-[#e89e47] animate-pulse" />
            <span>INTERACTIVE 3D STUDIO PORTFOLIO</span>
          </div>

          <h1 className="font-display text-5xl sm:text-7xl md:text-9xl font-extrabold uppercase tracking-tight text-gradient-silver leading-none">
            NOVIN JOISHI
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-neutral-300 font-mono-tech text-sm sm:text-base max-w-2xl pt-2">
            <span className="text-[#e89e47] font-semibold">{PERSONAL_INFO.title}</span>
            <span className="hidden sm:inline text-neutral-600">•</span>
            <span>{PERSONAL_INFO.secondaryPositioning}</span>
          </div>

          <p className="font-mono-tech text-xs sm:text-sm text-neutral-400 max-w-xl leading-relaxed pt-2">
            {PERSONAL_INFO.tagline}
          </p>
        </div>

        {/* Scroll down prompt */}
        <div className="flex items-center justify-between font-mono-tech text-xs text-neutral-400 pt-8 pointer-events-auto">
          <span className="hidden sm:inline">EXPLORE 3D WORKSPACE</span>
          <div className="flex items-center gap-2 animate-bounce">
            <span>SCROLL TO ENTER</span>
            <ChevronDown size={14} className="text-[#e89e47]" />
          </div>
          <span>[ 01 / 05 ]</span>
        </div>
      </section>

      {/* ----------------- SECTION 1: WORK / FEATURED PROJECTS (20% - 50%) ----------------- */}
      <section id="work" className="min-h-screen py-24 px-6 sm:px-12 md:px-16 flex flex-col justify-center">
        <div className="max-w-6xl mx-auto w-full space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="flex items-center gap-2 font-mono-tech text-xs text-[#e89e47] tracking-widest uppercase mb-1">
                <Layers size={14} />
                <span>[ 01 // SELECTED ARCHITECTURES & SYSTEMS ]</span>
              </div>
              <h2 className="font-display text-4xl sm:text-6xl font-bold uppercase tracking-tight text-gradient-silver">
                FEATURED WORK
              </h2>
            </div>
            <p className="font-mono-tech text-xs text-neutral-400 max-w-md">
              Click any project poster or card to launch the comprehensive cinematic case study with architecture telemetry and live links.
            </p>
          </div>

          {/* Project Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROJECTS.map((project) => (
              <div
                key={project.id}
                onClick={() => {
                  sound.playClick();
                  onSelectProject(project);
                }}
                onMouseEnter={() => {
                  sound.playHover();
                  onHoverObject(`VIEW CASE // ${project.number} ${project.title}`);
                }}
                onMouseLeave={() => onHoverObject(null)}
                className="group relative rounded-2xl studio-glass border border-white/10 hover:border-[#e89e47]/60 p-6 transition-all duration-300 flex flex-col justify-between cursor-pointer space-y-6 overflow-hidden shadow-xl"
              >
                {/* Background Accent Glow */}
                <div
                  className="absolute -right-20 -top-20 w-48 h-48 rounded-full blur-3xl opacity-10 group-hover:opacity-30 transition-opacity pointer-events-none"
                  style={{ backgroundColor: project.accentColor }}
                />

                <div className="space-y-3">
                  <div className="flex items-center justify-between font-mono-tech text-xs text-neutral-400">
                    <span className="text-[#e89e47] font-semibold">{project.number}</span>
                    <span>{project.year}</span>
                  </div>

                  <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-neutral-100 group-hover:text-[#e89e47] transition-colors">
                    {project.title}
                  </h3>

                  <p className="font-mono-tech text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded bg-white/5 font-mono-tech text-[10px] text-neutral-300"
                      >
                        {t}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-2 py-0.5 rounded bg-white/5 font-mono-tech text-[10px] text-neutral-500">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between font-mono-tech text-xs text-neutral-300 group-hover:text-[#e89e47] transition-colors">
                    <span>EXPLORE CASE STUDY</span>
                    <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------- SECTION 2: ABOUT & PHILOSOPHY (50% - 65%) ----------------- */}
      <section id="about" className="min-h-screen flex items-center justify-center">
        <AboutTerminal />
      </section>

      {/* ----------------- SECTION 3: TECH CONSTELLATION (65% - 80%) ----------------- */}
      <section id="stack" className="min-h-screen flex items-center justify-center">
        <TechConstellation />
      </section>

      {/* ----------------- SECTION 4: EXPERIMENTS LAB (80% - 90%) ----------------- */}
      <section id="experiments" className="min-h-screen flex items-center justify-center">
        <ExperimentsDrawer />
      </section>

      {/* ----------------- SECTION 5: CONTACT (90% - 100%) ----------------- */}
      <section id="contact" className="min-h-screen flex items-center justify-center">
        <ContactSection />
      </section>
    </div>
  );
}
