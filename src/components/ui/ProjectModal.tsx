"use client";

import React, { useEffect } from "react";
import { Project, PROJECTS } from "@/data/portfolioData";
import { sound } from "@/lib/SoundManager";
import { X, ArrowUpRight, ChevronLeft, ChevronRight, Layers, Cpu, CheckCircle } from "lucide-react";
import { GithubIcon } from "./Icons";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onNavigateProject: (p: Project) => void;
}

export function ProjectModal({
  project,
  onClose,
  onNavigateProject
}: ProjectModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!project) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") {
        const idx = PROJECTS.findIndex((p) => p.id === project.id);
        const nextIdx = (idx + 1) % PROJECTS.length;
        onNavigateProject(PROJECTS[nextIdx]);
      }
      if (e.key === "ArrowLeft") {
        const idx = PROJECTS.findIndex((p) => p.id === project.id);
        const prevIdx = (idx - 1 + PROJECTS.length) % PROJECTS.length;
        onNavigateProject(PROJECTS[prevIdx]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [project, onClose, onNavigateProject]);

  if (!project) return null;

  const currentIdx = PROJECTS.findIndex((p) => p.id === project.id);
  const prevProject = PROJECTS[(currentIdx - 1 + PROJECTS.length) % PROJECTS.length];
  const nextProject = PROJECTS[(currentIdx + 1) % PROJECTS.length];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#060709]/95 backdrop-blur-2xl transition-all duration-500 flex flex-col justify-between">
      {/* Top Action Bar */}
      <div className="sticky top-0 z-20 px-6 py-5 md:px-14 flex items-center justify-between studio-glass border-b border-white/5">
        <div className="flex items-center gap-3 font-mono-tech text-xs text-neutral-400">
          <span className="text-[#e89e47] font-semibold">{project.number}</span>
          <span>// CASE STUDY</span>
          <span className="hidden sm:inline text-neutral-600">•</span>
          <span className="hidden sm:inline text-neutral-400">{project.category}</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick prev/next buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                sound.playClick();
                onNavigateProject(prevProject);
              }}
              title="Previous Project (Left Arrow)"
              className="p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-neutral-100 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onNavigateProject(nextProject);
              }}
              title="Next Project (Right Arrow)"
              className="p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-neutral-100 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Close button */}
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-[#e89e47] hover:text-[#060709] font-mono-tech text-xs transition-all duration-200"
          >
            <span>CLOSE</span>
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto px-6 py-10 md:py-16 w-full space-y-16">
        {/* Title Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono-tech text-neutral-400">
            <span className="px-2.5 py-1 rounded bg-[#e89e47]/10 text-[#e89e47] border border-[#e89e47]/30">
              {project.year}
            </span>
            <span>CLIENT: {project.client}</span>
            <span>•</span>
            <span>ROLE: {project.role}</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight text-gradient-silver">
            {project.title}
          </h1>

          <p className="font-mono-tech text-base sm:text-lg text-neutral-300 max-w-3xl leading-relaxed">
            {project.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#e89e47] text-[#060709] font-mono-tech text-xs font-bold uppercase tracking-wider hover:bg-white transition-all shadow-[0_0_20px_rgba(232,158,71,0.35)]"
              >
                <span>Launch Live System</span>
                <ArrowUpRight size={16} />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full studio-glass studio-glass-hover text-neutral-200 font-mono-tech text-xs tracking-wider transition-all"
              >
                <GithubIcon className="w-4 h-4" />
                <span>Source Code</span>
              </a>
            )}
          </div>
        </div>

        {/* Hero Visual Preview with Accent Border */}
        <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-neutral-900 group">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-[360px] sm:h-[500px] object-cover filter brightness-95 group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060709] via-transparent to-transparent opacity-80" />
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs font-mono-tech text-neutral-400">
            <span>[ HIGH-RESOLUTION PREVIEW ]</span>
            <span>STATUS: ACTIVE ARCHITECTURE</span>
          </div>
        </div>

        {/* Performance Metric Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {project.metrics.map((metric, i) => (
            <div
              key={i}
              className="p-6 rounded-xl studio-glass border border-white/5 space-y-2"
            >
              <span className="font-mono-tech text-xs text-neutral-400 uppercase tracking-wider">
                {metric.label}
              </span>
              <p className="font-display text-3xl sm:text-4xl font-bold text-[#e89e47]">
                {metric.value}
              </p>
            </div>
          ))}
        </div>

        {/* Detailed Narrative & Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-neutral-100 flex items-center gap-2">
              <Layers size={20} className="text-[#e89e47]" />
              Architectural Overview
            </h2>
            <p className="font-mono-tech text-sm text-neutral-300 leading-relaxed">
              {project.longDescription}
            </p>

            <h3 className="font-display text-xl font-bold uppercase tracking-tight text-neutral-100 pt-4">
              Key Engineering Deliverables
            </h3>
            <div className="space-y-3">
              {project.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle size={16} className="text-[#e89e47] shrink-0 mt-1" />
                  <span className="font-mono-tech text-xs sm:text-sm text-neutral-300">
                    {h}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar: Tech Stack & Architecture Notes */}
          <div className="space-y-6 lg:border-l lg:border-white/10 lg:pl-8">
            <div>
              <h3 className="font-display text-lg font-bold uppercase tracking-tight text-neutral-200 mb-3 flex items-center gap-2">
                <Cpu size={18} className="text-[#e89e47]" />
                Technology Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-md bg-white/5 border border-white/10 font-mono-tech text-xs text-neutral-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <h4 className="font-mono-tech text-xs text-[#e89e47] uppercase tracking-wider">
                System Deep-Dive
              </h4>
              <p className="font-mono-tech text-xs text-neutral-400 leading-relaxed">
                {project.architectureNotes}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Project Switcher Footer */}
      <div className="px-6 py-8 md:px-14 border-t border-white/10 flex items-center justify-between">
        <button
          onClick={() => {
            sound.playClick();
            onNavigateProject(prevProject);
          }}
          className="group text-left"
        >
          <span className="font-mono-tech text-[10px] text-neutral-500 uppercase tracking-widest block">
            PREVIOUS PROJECT
          </span>
          <span className="font-display text-base sm:text-xl font-bold text-neutral-300 group-hover:text-[#e89e47] transition-colors">
            ← {prevProject.title}
          </span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onNavigateProject(nextProject);
          }}
          className="group text-right"
        >
          <span className="font-mono-tech text-[10px] text-neutral-500 uppercase tracking-widest block">
            NEXT PROJECT
          </span>
          <span className="font-display text-base sm:text-xl font-bold text-neutral-300 group-hover:text-[#e89e47] transition-colors">
            {nextProject.title} →
          </span>
        </button>
      </div>
    </div>
  );
}
