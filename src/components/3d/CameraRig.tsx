"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface CameraRigProps {
  scrollProgress: number; // 0.0 to 1.0
  activePreset: "master" | "work" | "about" | "stack" | "experiments" | "contact" | null;
  isOpening: boolean;
}

// Keyframe waypoints along the scroll narrative (0.0 to 1.0)
const SCROLL_WAYPOINTS = [
  {
    progress: 0.0, // Initial hero overview
    pos: new THREE.Vector3(0, 1.8, 4.8),
    target: new THREE.Vector3(0, 1.4, 0)
  },
  {
    progress: 0.25, // Zoom into workstation / Pro Display
    pos: new THREE.Vector3(0, 1.6, 1.8),
    target: new THREE.Vector3(0, 1.6, -0.2)
  },
  {
    progress: 0.55, // Pan to gallery wall (Project posters)
    pos: new THREE.Vector3(-2.2, 2.3, 1.4),
    target: new THREE.Vector3(-4.8, 2.3, 0)
  },
  {
    progress: 0.8, // Shift to Bookshelf & Tech matrix
    pos: new THREE.Vector3(1.8, 2.2, 0.4),
    target: new THREE.Vector3(3.2, 2.2, -2.2)
  },
  {
    progress: 1.0, // Pull back to minimalist wide view for contact
    pos: new THREE.Vector3(0, 2.4, 5.8),
    target: new THREE.Vector3(0, 1.2, 0)
  }
];

// Click-driven presets
const FOCUS_PRESETS = {
  master: {
    pos: new THREE.Vector3(0, 1.8, 4.8),
    target: new THREE.Vector3(0, 1.4, 0)
  },
  work: {
    pos: new THREE.Vector3(0, 1.62, 1.4),
    target: new THREE.Vector3(0, 1.65, -0.25)
  },
  about: {
    pos: new THREE.Vector3(0.85, 1.48, 0.85),
    target: new THREE.Vector3(0.95, 1.35, 0.05)
  },
  stack: {
    pos: new THREE.Vector3(1.9, 2.2, 0.2),
    target: new THREE.Vector3(3.2, 2.4, -2.4)
  },
  experiments: {
    pos: new THREE.Vector3(-0.8, 1.5, 1.5),
    target: new THREE.Vector3(0, 1.2, 0)
  },
  contact: {
    pos: new THREE.Vector3(0, 2.6, 6.2),
    target: new THREE.Vector3(0, 1.0, 0)
  }
};

export function CameraRig({
  scrollProgress,
  activePreset,
  isOpening
}: CameraRigProps) {
  const { camera, pointer } = useThree();
  const currentLookAt = useRef(new THREE.Vector3(0, 1.4, 0));
  const targetPos = useRef(new THREE.Vector3(0, 1.8, 4.8));
  const targetLookAt = useRef(new THREE.Vector3(0, 1.4, 0));

  // Compute target position from scroll progress by interpolating between waypoints
  const computeScrollCamera = (p: number) => {
    const clamped = Math.max(0, Math.min(1, p));
    for (let i = 0; i < SCROLL_WAYPOINTS.length - 1; i++) {
      const current = SCROLL_WAYPOINTS[i];
      const next = SCROLL_WAYPOINTS[i + 1];
      if (clamped >= current.progress && clamped <= next.progress) {
        const factor = (clamped - current.progress) / (next.progress - current.progress);
        const smoothFactor = THREE.MathUtils.smoothstep(factor, 0, 1);
        
        const pos = new THREE.Vector3().lerpVectors(current.pos, next.pos, smoothFactor);
        const look = new THREE.Vector3().lerpVectors(current.target, next.target, smoothFactor);
        return { pos, look };
      }
    }
    return {
      pos: SCROLL_WAYPOINTS[0].pos.clone(),
      look: SCROLL_WAYPOINTS[0].target.clone()
    };
  };

  useEffect(() => {
    if (isOpening) {
      // High cinematic overhead starting position
      camera.position.set(0, 6.0, 7.5);
      currentLookAt.current.set(0, 1.0, 0);
    }
  }, [isOpening, camera]);

  useFrame((_, delta) => {
    // Determine base position and lookAt
    if (activePreset && FOCUS_PRESETS[activePreset]) {
      const preset = FOCUS_PRESETS[activePreset];
      targetPos.current.copy(preset.pos);
      targetLookAt.current.copy(preset.target);
    } else {
      const computed = computeScrollCamera(scrollProgress);
      targetPos.current.copy(computed.pos);
      targetLookAt.current.copy(computed.look);
    }

    // Subtle, luxurious mouse parallax offset
    const parallaxX = pointer.x * 0.22;
    const parallaxY = pointer.y * 0.14;

    const desiredPos = targetPos.current.clone();
    desiredPos.x += parallaxX;
    desiredPos.y += parallaxY;

    // Smooth damping / lerp
    const lerpSpeed = isOpening ? 2.0 * delta : 4.0 * delta;
    camera.position.lerp(desiredPos, THREE.MathUtils.clamp(lerpSpeed, 0, 0.15));

    currentLookAt.current.lerp(targetLookAt.current, THREE.MathUtils.clamp(lerpSpeed, 0, 0.15));
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
