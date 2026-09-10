"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { StudioRoom } from "./StudioRoom";
import { CameraRig } from "./CameraRig";
import { Project } from "@/data/portfolioData";

interface StudioCanvasProps {
  scrollProgress: number;
  activePreset: "master" | "work" | "about" | "stack" | "experiments" | "contact" | null;
  isOpening: boolean;
  onSelectProject: (project: Project) => void;
  onHoverObject: (label: string | null) => void;
  onFocusSection: (section: "work" | "about" | "stack" | "experiments" | "contact" | null) => void;
}

export function StudioCanvas({
  scrollProgress,
  activePreset,
  isOpening,
  onSelectProject,
  onHoverObject,
  onFocusSection
}: StudioCanvasProps) {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-auto z-0">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15
        }}
        camera={{
          fov: 48,
          near: 0.1,
          far: 50,
          position: [0, 6.0, 7.5]
        }}
      >
        <Suspense fallback={null}>
          <CameraRig
            scrollProgress={scrollProgress}
            activePreset={activePreset}
            isOpening={isOpening}
          />
          <StudioRoom
            onSelectProject={onSelectProject}
            onHoverObject={onHoverObject}
            onFocusSection={onFocusSection}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
