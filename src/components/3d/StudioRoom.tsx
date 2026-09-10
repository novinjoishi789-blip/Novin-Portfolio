"use client";

import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ScreenShaderMaterial, LaptopTerminalShader } from "./ScreenShader";
import { PROJECTS, Project } from "@/data/portfolioData";
import { sound } from "@/lib/SoundManager";

interface StudioRoomProps {
  onSelectProject: (project: Project) => void;
  onHoverObject: (label: string | null) => void;
  onFocusSection: (section: "work" | "about" | "stack" | "experiments" | "contact" | null) => void;
}

export function StudioRoom({
  onSelectProject,
  onHoverObject,
  onFocusSection
}: StudioRoomProps) {
  const [hoveredPoster, setHoveredPoster] = useState<string | null>(null);
  const [monitorHovered, setMonitorHovered] = useState(false);
  const [laptopHovered, setLaptopHovered] = useState(false);
  const [shelfHovered, setShelfHovered] = useState(false);
  const [deskHovered, setDeskHovered] = useState(false);

  // Gentle animation on holographic core / particles
  const holoRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  useFrame((state, delta) => {
    if (holoRef.current) {
      holoRef.current.rotation.y += delta * 0.8;
      holoRef.current.rotation.x += delta * 0.4;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group position={[0, -1, 0]}>
      {/* ----------------- LIGHTING SETUP ----------------- */}
      <ambientLight intensity={0.4} color="#a0b0d0" />

      {/* Main warm desk spotlight */}
      <spotLight
        position={[0, 4.5, 0.5]}
        target-position={[0, 1.2, 0.2]}
        angle={0.7}
        penumbra={0.8}
        intensity={3.5}
        color="#ffe2b0"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0001}
      />

      {/* Cool ambient window moonlight / twilight fill */}
      <directionalLight
        position={[8, 4, 3]}
        intensity={1.2}
        color="#7090c0"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Accent shelf under-glow */}
      <pointLight position={[3.2, 2.8, -1.8]} intensity={1.8} distance={4} color="#ffb766" />
      
      {/* Gallery wall track spotlight */}
      <spotLight
        position={[-3.5, 4.5, 0]}
        target-position={[-4.8, 2, 0]}
        angle={0.8}
        penumbra={0.6}
        intensity={2.8}
        color="#ffffff"
      />

      {/* Monitor screen dynamic bounce light */}
      <pointLight position={[0, 1.8, 0.4]} intensity={monitorHovered ? 2.5 : 1.2} distance={2.5} color="#e89e47" />

      {/* ----------------- ROOM ARCHITECTURE ----------------- */}
      {/* Floor: Dark polished walnut / acoustic concrete */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[16, 16]} />
        <meshStandardMaterial
          color="#0c0e12"
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>

      {/* Back Wall: Charcoal acoustic paneling */}
      <mesh position={[0, 3.5, -3.5]} receiveShadow>
        <boxGeometry args={[16, 7, 0.2]} />
        <meshStandardMaterial color="#12151c" roughness={0.7} />
      </mesh>

      {/* Acoustic wood vertical slats on back wall accent */}
      {Array.from({ length: 18 }).map((_, i) => (
        <mesh key={`slat-${i}`} position={[-2.5 + i * 0.3, 3.5, -3.38]}>
          <boxGeometry args={[0.08, 6.8, 0.04]} />
          <meshStandardMaterial color="#1f1812" roughness={0.5} />
        </mesh>
      ))}

      {/* Left Wall: Gallery wall with posters */}
      <mesh position={[-5, 3.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[12, 7, 0.2]} />
        <meshStandardMaterial color="#141720" roughness={0.8} />
      </mesh>

      {/* Right Wall: Floor-to-ceiling panoramic window frame overlooking twilight city */}
      <group position={[5, 3.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        {/* Exterior backdrop city skyline */}
        <mesh position={[0, 0, -2.5]}>
          <planeGeometry args={[14, 8]} />
          <meshBasicMaterial color="#050711" />
        </mesh>
        
        {/* Distant skyscraper blocks with glowing windows */}
        {[-3, -1.8, -0.6, 0.8, 2.2, 3.6].map((x, i) => (
          <mesh key={`bldg-${i}`} position={[x, -0.5 + (i % 3) * 0.4, -2.2]}>
            <boxGeometry args={[0.8 + (i % 2) * 0.3, 3 + (i % 3) * 1.2, 0.2]} />
            <meshStandardMaterial color="#090d18" roughness={0.9} emissive="#162038" emissiveIntensity={0.3} />
          </mesh>
        ))}

        {/* Window glass pane */}
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[11, 6.8]} />
          <meshPhysicalMaterial
            color="#99badd"
            transparent
            opacity={0.15}
            roughness={0.1}
            metalness={0.1}
            transmission={0.8}
            reflectivity={0.9}
          />
        </mesh>

        {/* Window mullions (black architectural frames) */}
        <mesh position={[0, 0, 0.02]}>
          <boxGeometry args={[11.2, 0.08, 0.08]} />
          <meshStandardMaterial color="#090a0d" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 1.8, 0.02]}>
          <boxGeometry args={[11.2, 0.06, 0.08]} />
          <meshStandardMaterial color="#090a0d" metalness={0.8} roughness={0.2} />
        </mesh>
        {[-3, 0, 3].map((mx, idx) => (
          <mesh key={`mullion-${idx}`} position={[mx, 0, 0.02]}>
            <boxGeometry args={[0.08, 6.8, 0.08]} />
            <meshStandardMaterial color="#090a0d" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
      </group>

      {/* Ceiling with recessed linear light channel */}
      <mesh position={[0, 7, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16, 16]} />
        <meshStandardMaterial color="#0e1014" roughness={0.9} />
      </mesh>
      <mesh position={[0, 6.95, -1]}>
        <boxGeometry args={[6, 0.06, 0.2]} />
        <meshStandardMaterial color="#ffffff" emissive="#e89e47" emissiveIntensity={1.2} />
      </mesh>

      {/* ----------------- WORKSTATION DESK ----------------- */}
      <group
        position={[0, 0, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setDeskHovered(true);
          onHoverObject("WORKSTATION // CREATIVE STUDIO");
        }}
        onPointerOut={() => {
          setDeskHovered(false);
          onHoverObject(null);
        }}
      >
        {/* Solid Dark Walnut Desktop */}
        <mesh position={[0, 1.15, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 0.08, 1.4]} />
          <meshStandardMaterial
            color={deskHovered ? "#2a1e16" : "#221710"}
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>

        {/* Minimalist matte black anodized aluminum desk legs */}
        <mesh position={[-1.4, 0.55, -0.5]} castShadow>
          <boxGeometry args={[0.08, 1.1, 0.08]} />
          <meshStandardMaterial color="#111317" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[-1.4, 0.55, 0.5]} castShadow>
          <boxGeometry args={[0.08, 1.1, 0.08]} />
          <meshStandardMaterial color="#111317" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[1.4, 0.55, -0.5]} castShadow>
          <boxGeometry args={[0.08, 1.1, 0.08]} />
          <meshStandardMaterial color="#111317" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[1.4, 0.55, 0.5]} castShadow>
          <boxGeometry args={[0.08, 1.1, 0.08]} />
          <meshStandardMaterial color="#111317" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Crossbar */}
        <mesh position={[0, 0.3, -0.5]}>
          <boxGeometry args={[2.8, 0.04, 0.04]} />
          <meshStandardMaterial color="#111317" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Large Desk Mat */}
        <mesh position={[0, 1.195, 0.05]} receiveShadow>
          <boxGeometry args={[2.2, 0.008, 0.9]} />
          <meshStandardMaterial color="#171920" roughness={0.9} />
        </mesh>

        {/* ----------------- PRO DISPLAY MONITOR (INTERACTIVE) ----------------- */}
        <group
          position={[0, 1.75, -0.25]}
          onPointerOver={(e) => {
            e.stopPropagation();
            setMonitorHovered(true);
            onHoverObject("EXPLORE WORK // 01 PROJECTS");
            sound.playHover();
          }}
          onPointerOut={() => {
            setMonitorHovered(false);
            onHoverObject(null);
          }}
          onClick={(e) => {
            e.stopPropagation();
            sound.playClick();
            onFocusSection("work");
          }}
        >
          {/* Monitor Aluminum Bezel & Body */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.8, 0.95, 0.06]} />
            <meshStandardMaterial
              color={monitorHovered ? "#333842" : "#1a1d24"}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>

          {/* Monitor Screen Surface with Custom Dynamic WebGL Shader */}
          <mesh position={[0, 0, 0.035]}>
            <planeGeometry args={[1.74, 0.89]} />
            <ScreenShaderMaterial isHovered={monitorHovered} />
          </mesh>

          {/* Monitor Stand & Articulated Arm */}
          <mesh position={[0, -0.4, -0.1]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.5, 16]} />
            <meshStandardMaterial color="#111317" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, -0.6, -0.1]} receiveShadow>
            <cylinderGeometry args={[0.18, 0.2, 0.02, 32]} />
            <meshStandardMaterial color="#111317" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>

        {/* ----------------- MACBOOK PRO ON STAND (INTERACTIVE ABOUT) ----------------- */}
        <group
          position={[0.95, 1.35, 0.05]}
          rotation={[0, -0.35, 0]}
          onPointerOver={(e) => {
            e.stopPropagation();
            setLaptopHovered(true);
            onHoverObject("ABOUT NOVIN // ARCHITECTURE");
            sound.playHover();
          }}
          onPointerOut={() => {
            setLaptopHovered(false);
            onHoverObject(null);
          }}
          onClick={(e) => {
            e.stopPropagation();
            sound.playClick();
            onFocusSection("about");
          }}
        >
          {/* Laptop Base */}
          <mesh castShadow>
            <boxGeometry args={[0.48, 0.015, 0.34]} />
            <meshStandardMaterial color={laptopHovered ? "#3c404b" : "#23262e"} metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Trackpad */}
          <mesh position={[0, 0.01, 0.08]}>
            <planeGeometry args={[0.16, 0.1]} />
            <meshStandardMaterial color="#1d2027" roughness={0.4} />
          </mesh>
          {/* Backlit Keyboard */}
          <mesh position={[0, 0.01, -0.05]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.42, 0.16]} />
            <meshStandardMaterial color="#111317" emissive="#e89e47" emissiveIntensity={0.2} />
          </mesh>
          {/* Laptop Screen Lid */}
          <group position={[0, 0.01, -0.16]} rotation={[0.4, 0, 0]}>
            <mesh position={[0, 0.16, 0]} castShadow>
              <boxGeometry args={[0.48, 0.32, 0.01]} />
              <meshStandardMaterial color="#23262e" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.16, 0.007]}>
              <planeGeometry args={[0.45, 0.29]} />
              <LaptopTerminalShader />
            </mesh>
          </group>
        </group>

        {/* ----------------- MECHANICAL KEYBOARD & MOUSE ----------------- */}
        {/* Custom 75% Custom Mechanical Keyboard */}
        <mesh position={[-0.1, 1.21, 0.22]} castShadow>
          <boxGeometry args={[0.48, 0.025, 0.18]} />
          <meshStandardMaterial color="#181a20" metalness={0.5} roughness={0.4} />
        </mesh>
        {/* Keycaps matrix */}
        <mesh position={[-0.1, 1.226, 0.22]}>
          <boxGeometry args={[0.45, 0.01, 0.15]} />
          <meshStandardMaterial color="#262933" roughness={0.6} />
        </mesh>
        {/* Minimal Wireless Mouse */}
        <mesh position={[0.42, 1.215, 0.22]} castShadow>
          <boxGeometry args={[0.09, 0.025, 0.14]} />
          <meshStandardMaterial color="#20232b" metalness={0.3} roughness={0.3} />
        </mesh>

        {/* ----------------- ARCHITECTURAL TASK LAMP ----------------- */}
        <group position={[-1.15, 1.2, -0.3]}>
          {/* Base */}
          <mesh castShadow>
            <cylinderGeometry args={[0.12, 0.13, 0.03, 32]} />
            <meshStandardMaterial color="#181b22" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Articulated arm lower */}
          <mesh position={[0.08, 0.3, 0]} rotation={[0, 0, -0.25]} castShadow>
            <cylinderGeometry args={[0.012, 0.012, 0.6, 12]} />
            <meshStandardMaterial color="#262a35" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Joint */}
          <mesh position={[0.16, 0.58, 0]}>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshStandardMaterial color="#e89e47" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Upper arm */}
          <mesh position={[0.32, 0.68, 0.1]} rotation={[0, 0.3, -0.9]} castShadow>
            <cylinderGeometry args={[0.012, 0.012, 0.5, 12]} />
            <meshStandardMaterial color="#262a35" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Conical Lamp Shade */}
          <group position={[0.55, 0.72, 0.22]} rotation={[0.4, 0.3, -1.2]}>
            <mesh castShadow>
              <coneGeometry args={[0.11, 0.18, 24, 1, true]} />
              <meshStandardMaterial color="#1a1d24" metalness={0.8} roughness={0.3} side={THREE.DoubleSide} />
            </mesh>
            {/* Glowing Bulb */}
            <mesh position={[0, -0.04, 0]}>
              <sphereGeometry args={[0.035, 16, 16]} />
              <meshBasicMaterial color="#ffe3a8" />
            </mesh>
          </group>
        </group>

        {/* Ceramic Coffee Mug & Design Journal */}
        <mesh position={[-0.85, 1.21, 0.25]} castShadow>
          <cylinderGeometry args={[0.05, 0.045, 0.11, 24]} />
          <meshStandardMaterial color="#d4c9b8" roughness={0.6} />
        </mesh>
        <mesh position={[-0.65, 1.205, -0.2]} rotation={[0, 0.15, 0]} castShadow>
          <boxGeometry args={[0.25, 0.018, 0.34]} />
          <meshStandardMaterial color="#1f232b" roughness={0.8} />
        </mesh>
      </group>

      {/* ----------------- STUDIO TASK CHAIR ----------------- */}
      <group position={[0, 0, 1.3]} rotation={[0, Math.PI, 0]}>
        {/* Star Base */}
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.35, 0.38, 0.06, 5]} />
          <meshStandardMaterial color="#111317" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Gas lift cylinder */}
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.5, 16]} />
          <meshStandardMaterial color="#2d323e" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Ergonomic Mesh Seat Cushion */}
        <mesh position={[0, 0.62, 0]} castShadow>
          <boxGeometry args={[0.65, 0.08, 0.6]} />
          <meshStandardMaterial color="#171a21" roughness={0.8} />
        </mesh>
        {/* Curved Mesh Backrest */}
        <mesh position={[0, 1.05, -0.28]} rotation={[-0.08, 0, 0]} castShadow>
          <boxGeometry args={[0.58, 0.75, 0.05]} />
          <meshStandardMaterial color="#15171e" roughness={0.7} />
        </mesh>
        {/* Spine support */}
        <mesh position={[0, 0.95, -0.32]} castShadow>
          <boxGeometry args={[0.08, 0.7, 0.04]} />
          <meshStandardMaterial color="#2d323e" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* ----------------- GALLERY WALL (PROJECT POSTERS) ----------------- */}
      <group position={[-4.88, 2.4, 0]} rotation={[0, Math.PI / 2, 0]}>
        {PROJECTS.map((project, index) => {
          // Layout posters evenly along gallery wall
          const posX = (index - 2) * 1.5;
          const isHovered = hoveredPoster === project.id;

          return (
            <group
              key={project.id}
              position={[posX, 0, isHovered ? 0.08 : 0]}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredPoster(project.id);
                onHoverObject(`VIEW CASE // ${project.number} ${project.title}`);
                sound.playHover();
              }}
              onPointerOut={() => {
                setHoveredPoster(null);
                onHoverObject(null);
              }}
              onClick={(e) => {
                e.stopPropagation();
                sound.playClick();
                onSelectProject(project);
              }}
            >
              {/* Outer Black Architectural Frame */}
              <mesh castShadow>
                <boxGeometry args={[1.15, 1.55, 0.04]} />
                <meshStandardMaterial
                  color={isHovered ? "#2a2e39" : "#0d0f14"}
                  metalness={0.7}
                  roughness={0.3}
                />
              </mesh>

              {/* Poster White/Matte Passepartout */}
              <mesh position={[0, 0, 0.022]}>
                <planeGeometry args={[1.05, 1.45]} />
                <meshStandardMaterial color="#151821" roughness={0.9} />
              </mesh>

              {/* Inner Poster Artwork Canvas with Accent Highlight */}
              <mesh position={[0, 0.12, 0.025]}>
                <planeGeometry args={[0.92, 1.05]} />
                <meshStandardMaterial
                  color={project.accentColor}
                  emissive={project.accentColor}
                  emissiveIntensity={isHovered ? 0.45 : 0.15}
                  roughness={0.5}
                />
              </mesh>

              {/* Minimal Project Title Bar on Poster */}
              <mesh position={[0, -0.52, 0.025]}>
                <planeGeometry args={[0.92, 0.18]} />
                <meshStandardMaterial color="#0b0d12" />
              </mesh>

              {/* Frame Accent Spotlight */}
              {isHovered && (
                <pointLight position={[0, 0, 0.4]} intensity={2.2} distance={1.8} color={project.accentColor} />
              )}
            </group>
          );
        })}
      </group>

      {/* ----------------- ARCHITECTURAL BOOKSHELF & TECH ARCHIVE ----------------- */}
      <group
        position={[3.2, 0, -2.5]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setShelfHovered(true);
          onHoverObject("TECH MATRIX // STACK CONSTELLATION");
          sound.playHover();
        }}
        onPointerOut={() => {
          setShelfHovered(false);
          onHoverObject(null);
        }}
        onClick={(e) => {
          e.stopPropagation();
          sound.playClick();
          onFocusSection("stack");
        }}
      >
        {/* Blackened Steel Shelf Frame */}
        <mesh position={[0, 2.2, 0]} castShadow>
          <boxGeometry args={[2.2, 4.4, 0.45]} />
          <meshStandardMaterial color="#101217" metalness={0.8} roughness={0.3} wireframe={false} />
        </mesh>

        {/* Shelves (Oak) */}
        {[0.6, 1.4, 2.2, 3.0, 3.8].map((sy, sidx) => (
          <mesh key={`shelf-tier-${sidx}`} position={[0, sy, 0]} receiveShadow>
            <boxGeometry args={[2.1, 0.04, 0.42]} />
            <meshStandardMaterial color="#1f1812" roughness={0.5} />
          </mesh>
        ))}

        {/* Hardcover Design Monograph Books on Shelves */}
        <group position={[-0.6, 0.85, 0]}>
          {[-0.2, -0.12, -0.04, 0.04, 0.12, 0.2].map((bx, bidx) => (
            <mesh key={`book-a-${bidx}`} position={[bx, 0, 0]} castShadow>
              <boxGeometry args={[0.06, 0.42 + (bidx % 3) * 0.04, 0.32]} />
              <meshStandardMaterial color={["#2c3240", "#1e222a", "#8b5cf6", "#e89e47", "#10b981", "#3b82f6"][bidx]} />
            </mesh>
          ))}
        </group>

        {/* Holographic Glowing Tech Orb Core on Shelf Tier 3 */}
        <group position={[0, 2.55, 0]}>
          <mesh ref={holoRef}>
            <icosahedronGeometry args={[0.22, 1]} />
            <meshStandardMaterial
              color="#e89e47"
              emissive="#e89e47"
              emissiveIntensity={shelfHovered ? 2.5 : 1.4}
              wireframe
            />
          </mesh>
          <pointLight intensity={shelfHovered ? 3.0 : 1.5} distance={2.5} color="#e89e47" />
        </group>
      </group>

      {/* ----------------- MODERN DESIGNER LOUNGE & COFFEE TABLE ----------------- */}
      <group position={[1.8, 0, 2.2]} rotation={[0, -0.6, 0]}>
        {/* Charcoal Lounge Sofa Base */}
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.2, 0.45, 0.95]} />
          <meshStandardMaterial color="#13161e" roughness={0.9} />
        </mesh>
        {/* Sofa Backrest */}
        <mesh position={[0, 0.8, -0.38]} castShadow>
          <boxGeometry args={[2.2, 0.5, 0.22]} />
          <meshStandardMaterial color="#11141a" roughness={0.9} />
        </mesh>
        {/* Throw Pillows */}
        <mesh position={[-0.7, 0.7, -0.22]} rotation={[0.2, 0.3, 0]} castShadow>
          <boxGeometry args={[0.38, 0.38, 0.12]} />
          <meshStandardMaterial color="#e89e47" roughness={0.7} />
        </mesh>
        <mesh position={[0.7, 0.7, -0.22]} rotation={[0.2, -0.2, 0]} castShadow>
          <boxGeometry args={[0.38, 0.38, 0.12]} />
          <meshStandardMaterial color="#262d3d" roughness={0.7} />
        </mesh>

        {/* Low Minimal Glass Coffee Table */}
        <group position={[0, 0, 0.9]}>
          <mesh position={[0, 0.25, 0]} castShadow>
            <boxGeometry args={[1.2, 0.02, 0.6]} />
            <meshPhysicalMaterial
              color="#222836"
              transparent
              opacity={0.6}
              roughness={0.1}
              metalness={0.2}
              transmission={0.7}
            />
          </mesh>
          {/* Table Legs */}
          <mesh position={[-0.5, 0.12, -0.2]}>
            <boxGeometry args={[0.03, 0.24, 0.03]} />
            <meshStandardMaterial color="#0c0e12" metalness={0.8} />
          </mesh>
          <mesh position={[0.5, 0.12, 0.2]}>
            <boxGeometry args={[0.03, 0.24, 0.03]} />
            <meshStandardMaterial color="#0c0e12" metalness={0.8} />
          </mesh>
          {/* Design Journal on Table */}
          <mesh position={[-0.15, 0.27, 0]} rotation={[0, 0.2, 0]} castShadow>
            <boxGeometry args={[0.28, 0.02, 0.38]} />
            <meshStandardMaterial color="#e5e7eb" roughness={0.6} />
          </mesh>
        </group>
      </group>

      {/* ----------------- ARCHITECTURAL PLANT IN FLUTED CONCRETE PLANTER ----------------- */}
      <group position={[-2.8, 0, -2.5]}>
        {/* Fluted Concrete Pot */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.22, 1.0, 32]} />
          <meshStandardMaterial color="#282d38" roughness={0.9} />
        </mesh>
        {/* Soil */}
        <mesh position={[0, 0.96, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 0.08, 16]} />
          <meshStandardMaterial color="#120e0a" roughness={1.0} />
        </mesh>
        {/* Fiddle-leaf Fig Stems & Leaves */}
        {[-0.2, 0, 0.2].map((lx, idx) => (
          <group key={`leaf-group-${idx}`} position={[lx, 1.2 + idx * 0.3, 0]} rotation={[0.2, idx * 1.5, 0]}>
            <mesh position={[0, 0.2, 0]} rotation={[0.4, 0, 0]} castShadow>
              <sphereGeometry args={[0.25, 12, 12]} />
              <meshStandardMaterial color="#1a3d24" roughness={0.4} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ----------------- ATMOSPHERIC DUST PARTICLES ----------------- */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array(
                Array.from({ length: 180 }, () => [
                  (Math.random() - 0.5) * 6,
                  Math.random() * 4 + 0.5,
                  (Math.random() - 0.5) * 6
                ]).flat()
              ),
              3
            ]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          color="#ffeed0"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
