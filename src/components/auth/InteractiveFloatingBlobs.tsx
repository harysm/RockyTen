"use client";

import React, { useEffect, useRef } from "react";

interface Blob {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  speed: number;
  angle: number;
}

export const InteractiveFloatingBlobs: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const mouse = {
      x: -1000,
      y: -1000,
      active: false,
    };

    let isDark = document.documentElement.classList.contains("dark");
    const observer = new MutationObserver(() => {
      isDark = document.documentElement.classList.contains("dark");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    let blobs: Blob[] = [];

    const initBlobs = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      // 4 Luminous blobs with organic color harmonies
      blobs = [
        {
          x: width * 0.35,
          y: height * 0.4,
          baseX: width * 0.35,
          baseY: height * 0.4,
          vx: 0,
          vy: 0,
          radius: Math.min(width, height) * 0.32,
          color: "225, 29, 72", // Ruby red
          speed: 0.0008,
          angle: 0,
        },
        {
          x: width * 0.65,
          y: height * 0.45,
          baseX: width * 0.65,
          baseY: height * 0.45,
          vx: 0,
          vy: 0,
          radius: Math.min(width, height) * 0.28,
          color: "99, 102, 241", // Indigo
          speed: 0.0011,
          angle: Math.PI / 2,
        },
        {
          x: width * 0.5,
          y: height * 0.7,
          baseX: width * 0.5,
          baseY: height * 0.7,
          vx: 0,
          vy: 0,
          radius: Math.min(width, height) * 0.26,
          color: "245, 158, 11", // Amber
          speed: 0.0009,
          angle: Math.PI,
        },
        {
          x: width * 0.5,
          y: height * 0.25,
          baseX: width * 0.5,
          baseY: height * 0.25,
          vx: 0,
          vy: 0,
          radius: Math.min(width, height) * 0.24,
          color: "16, 185, 129", // Emerald
          speed: 0.0013,
          angle: Math.PI * 1.5,
        },
      ];
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Update and draw each blob
      for (let i = 0; i < blobs.length; i++) {
        const b = blobs[i];
        b.angle += b.speed;

        // Organic orbital drift
        const orbitX = b.baseX + Math.cos(b.angle) * 70;
        const orbitY = b.baseY + Math.sin(b.angle * 1.3) * 60;

        let targetX = orbitX;
        let targetY = orbitY;

        // Gentle mouse repulsion/attraction
        if (mouse.active) {
          const dx = b.x - mouse.x;
          const dy = b.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 350;

          if (dist < maxDist && dist > 0) {
            const force = (1 - dist / maxDist) * 60;
            targetX += (dx / dist) * force;
            targetY += (dy / dist) * force;
          }
        }

        // Smooth easing towards target
        b.x += (targetX - b.x) * 0.04;
        b.y += (targetY - b.y) * 0.04;

        // Render soft radial glow blob
        const radGrad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
        const opacity = isDark ? 0.28 : 0.18;
        radGrad.addColorStop(0, `rgba(${b.color}, ${opacity})`);
        radGrad.addColorStop(0.5, `rgba(${b.color}, ${opacity * 0.4})`);
        radGrad.addColorStop(1, `rgba(${b.color}, 0)`);

        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
        mouse.active = true;
      }
    };

    const handleTouchEnd = () => {
      mouse.active = false;
    };

    const handleResize = () => {
      initBlobs();
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("resize", handleResize);

    initBlobs();
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-0 overflow-hidden select-none bg-slate-50 dark:bg-zinc-950 transition-colors duration-300">
      {/* Heavy blur backdrop to merge the metaball blobs like liquid aurora */}
      <canvas ref={canvasRef} className="block w-full h-full filter blur-2xl" />
      {/* Subtle overlay vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(248,250,252,0.5)_85%,rgba(248,250,252,1)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_40%,rgba(9,9,11,0.5)_85%,rgba(9,9,11,1)_100%)] pointer-events-none" />
    </div>
  );
};
