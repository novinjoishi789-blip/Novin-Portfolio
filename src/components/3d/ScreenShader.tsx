"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Custom shader for dynamic live monitor display: code terminal matrix + audio reactive visualizer
const MonitorShaderMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(1920, 1080) },
    uAccentColor: { value: new THREE.Color("#e89e47") },
    uHover: { value: 0.0 }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec3 uAccentColor;
    uniform float uHover;
    varying vec2 vUv;

    // Pseudo-random & noise
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    void main() {
      vec2 uv = vUv;
      
      // Dark IDE background
      vec3 bg = vec3(0.05, 0.06, 0.08);
      
      // Sidebar dividing line
      float sidebar = step(0.18, uv.x);
      bg += (1.0 - sidebar) * vec3(0.02, 0.02, 0.03);
      
      // Grid lines / scanlines
      float scanline = sin(uv.y * 300.0 + uTime * 2.0) * 0.03;
      bg += scanline;
      
      // Code lines simulation
      if (uv.x > 0.22 && uv.x < 0.95 && uv.y > 0.1 && uv.y < 0.9) {
        float lineIndex = floor((1.0 - uv.y) * 24.0);
        float lineProg = fract((1.0 - uv.y) * 24.0);
        
        if (lineProg > 0.35) {
          float lineWidth = 0.3 + 0.45 * hash(vec2(lineIndex, 1.0));
          float indent = 0.24 + 0.06 * floor(hash(vec2(lineIndex, 2.0)) * 3.0);
          
          if (uv.x > indent && uv.x < indent + lineWidth) {
            float blink = step(0.5, sin(uTime * 4.0));
            vec3 codeColor = vec3(0.65, 0.72, 0.85);
            
            // Syntax highlight accents
            if (hash(vec2(lineIndex, 3.0)) > 0.7) {
              codeColor = uAccentColor;
            } else if (hash(vec2(lineIndex, 4.0)) > 0.5) {
              codeColor = vec3(0.2, 0.75, 0.65);
            }
            bg = mix(bg, codeColor, 0.85);
          }
        }
      }

      // Live 3D audio-waveform / shader visualizer at the bottom right
      if (uv.x > 0.65 && uv.x < 0.95 && uv.y > 0.12 && uv.y < 0.45) {
        vec2 vizUv = (uv - vec2(0.65, 0.12)) / vec2(0.3, 0.33);
        float wave = sin(vizUv.x * 12.0 + uTime * 3.5) * cos(vizUv.x * 6.0 - uTime * 2.0) * 0.3 + 0.5;
        float dist = abs(vizUv.y - wave);
        float glow = 0.015 / (dist + 0.001);
        bg += uAccentColor * glow * 0.6;
      }
      
      // Top titlebar
      if (uv.y > 0.94) {
        bg = vec3(0.09, 0.10, 0.13);
        // Mac/Unix dots
        if (uv.x > 0.02 && uv.x < 0.07) {
          float dotX = fract(uv.x * 40.0);
          if (dotX > 0.3 && dotX < 0.7) {
            bg = vec3(0.8, 0.3, 0.3);
          }
        }
      }

      // Hover glow boost
      bg += uAccentColor * uHover * 0.2;

      // Vignette on monitor glass
      float vig = uv.x * (1.0 - uv.x) * uv.y * (1.0 - uv.y) * 16.0;
      bg *= clamp(pow(vig, 0.2), 0.5, 1.0);

      gl_FragColor = vec4(bg, 1.0);
    }
  `
};

export function ScreenShaderMaterial({ isHovered = false }: { isHovered?: boolean }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((_, delta) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value += delta;
      matRef.current.uniforms.uHover.value = THREE.MathUtils.lerp(
        matRef.current.uniforms.uHover.value,
        isHovered ? 1.0 : 0.0,
        0.1
      );
    }
  });

  return (
    <shaderMaterial
      ref={matRef}
      args={[MonitorShaderMaterial]}
      toneMapped={false}
    />
  );
}

// Laptop screen shader (Terminal CLI output)
const TerminalShaderMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uAccentColor: { value: new THREE.Color("#10B981") }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uAccentColor;
    varying vec2 vUv;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    void main() {
      vec2 uv = vUv;
      vec3 col = vec3(0.04, 0.05, 0.07);

      // Terminal lines
      if (uv.x > 0.08 && uv.x < 0.92 && uv.y > 0.08 && uv.y < 0.88) {
        float lineIdx = floor((1.0 - uv.y) * 18.0);
        float lineProg = fract((1.0 - uv.y) * 18.0);
        
        if (lineProg > 0.4) {
          float w = 0.25 + 0.5 * hash(vec2(lineIdx, 9.0));
          if (uv.x > 0.1 && uv.x < 0.1 + w) {
            col = (lineIdx < 3.0) ? uAccentColor : vec3(0.8, 0.85, 0.9);
          }
        }
      }

      // Cursor blinking
      if (uv.y > 0.25 && uv.y < 0.31 && uv.x > 0.45 && uv.x < 0.48) {
        if (fract(uTime * 2.0) > 0.5) {
          col = uAccentColor;
        }
      }

      gl_FragColor = vec4(col, 1.0);
    }
  `
};

export function LaptopTerminalShader() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  useFrame((_, delta) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value += delta;
    }
  });

  return (
    <shaderMaterial
      ref={matRef}
      args={[TerminalShaderMaterial]}
      toneMapped={false}
    />
  );
}
