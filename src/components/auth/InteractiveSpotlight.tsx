"use client";

import React, { useEffect, useRef, useState } from "react";

export const InteractiveSpotlight: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  useEffect(() => {
    let animationFrameId: number;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let isActive = false;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      isActive = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        targetX = e.touches[0].clientX;
        targetY = e.touches[0].clientY;
        isActive = true;
      }
    };

    const handleMouseLeave = () => {
      isActive = false;
    };

    const loop = () => {
      // Smooth lerp for buttery organic mouse follow
      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;

      setCoords({
        x: Math.round(currentX),
        y: Math.round(currentY),
        active: isActive,
      });

      animationFrameId = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none -z-0 overflow-hidden select-none bg-slate-50 dark:bg-zinc-950 transition-colors duration-300"
    >
      {/* 1. Subtle Geometric Micro-Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.4] dark:opacity-[0.25]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(148, 163, 184, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(148, 163, 184, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
        }}
      />

      {/* 2. Interactive Spotlight Beam */}
      <div
        className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(650px circle at ${coords.x}px ${coords.y}px, rgba(225, 29, 72, 0.16), rgba(99, 102, 241, 0.10) 35%, transparent 70%)`,
        }}
      />

      {/* 3. High-Contrast Ambient Aurora Blobs in background for rich glass refraction */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-rose-500/10 dark:bg-rose-500/15 blur-3xl pointer-events-none animate-pulse duration-1000" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-indigo-500/10 dark:bg-indigo-500/15 blur-3xl pointer-events-none" />

      {/* 4. Vignette border fade */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(248,250,252,0.6)_85%,rgba(248,250,252,1)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_45%,rgba(9,9,11,0.6)_85%,rgba(9,9,11,1)_100%)]" />
    </div>
  );
};
