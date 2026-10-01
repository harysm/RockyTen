"use client";

import React, { useEffect, useRef } from "react";

interface Dot {
  originX: number;
  originY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

export const InteractiveDotGrid: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let dots: Dot[] = [];
    let width = 0;
    let height = 0;
    const gap = 30; // Grid spacing in px
    const baseRadius = 1.6;
    const proximity = 130; // Cursor reaction radius

    const mouse = {
      x: -1000,
      y: -1000,
      active: false,
    };

    let isDark = document.documentElement.classList.contains("dark");

    // Watch for dark/light mode class changes on <html>
    const observer = new MutationObserver(() => {
      isDark = document.documentElement.classList.contains("dark");
      wakeUp();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const initDots = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      dots = [];
      const cols = Math.ceil(width / gap) + 1;
      const rows = Math.ceil(height / gap) + 1;
      const offsetX = (width - (cols - 1) * gap) / 2;
      const offsetY = (height - (rows - 1) * gap) / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const originX = offsetX + c * gap;
          const originY = offsetY + r * gap;
          dots.push({
            originX,
            originY,
            x: originX,
            y: originY,
            vx: 0,
            vy: 0,
            size: baseRadius,
            alpha: isDark ? 0.18 : 0.22,
          });
        }
      }
    };

    let isRunning = false;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      let totalEnergy = 0;
      const baseAlpha = isDark ? 0.18 : 0.22;
      const defaultDotColor = isDark
        ? "148, 163, 184" // slate-400
        : "100, 116, 139"; // slate-500
      const highlightColor = isDark
        ? "244, 63, 94" // rose-500 glow
        : "225, 29, 72"; // ruby-600

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];

        let targetX = dot.originX;
        let targetY = dot.originY;
        let targetSize = baseRadius;
        let targetAlpha = baseAlpha;
        let isExcited = false;

        if (mouse.active) {
          const dx = dot.x - mouse.x;
          const dy = dot.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < proximity && dist > 0) {
            isExcited = true;
            const ratio = (proximity - dist) / proximity;
            const force = ratio * 24; // Push away from cursor

            targetX = dot.originX + (dx / dist) * force;
            targetY = dot.originY + (dy / dist) * force;
            targetSize = baseRadius + ratio * 2.8;
            targetAlpha = Math.min(1, baseAlpha + ratio * 0.78);
          }
        }

        // Spring physics easing
        const spring = 0.08;
        const friction = 0.84;

        dot.vx += (targetX - dot.x) * spring;
        dot.vy += (targetY - dot.y) * spring;
        dot.vx *= friction;
        dot.vy *= friction;

        dot.x += dot.vx;
        dot.y += dot.vy;
        dot.size += (targetSize - dot.size) * 0.15;
        dot.alpha += (targetAlpha - dot.alpha) * 0.15;

        totalEnergy += Math.abs(dot.vx) + Math.abs(dot.vy) + Math.abs(dot.x - dot.originX) + Math.abs(dot.y - dot.originY);

        // Render dot
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, Math.max(0.5, dot.size), 0, Math.PI * 2);

        if (isExcited && isDark) {
          ctx.shadowBlur = 6;
          ctx.shadowColor = `rgba(${highlightColor}, ${dot.alpha * 0.8})`;
          ctx.fillStyle = `rgba(${highlightColor}, ${dot.alpha})`;
        } else if (isExcited) {
          ctx.shadowBlur = 4;
          ctx.shadowColor = `rgba(${highlightColor}, ${dot.alpha * 0.5})`;
          ctx.fillStyle = `rgba(${highlightColor}, ${dot.alpha})`;
        } else {
          ctx.shadowBlur = 0;
          ctx.fillStyle = `rgba(${defaultDotColor}, ${dot.alpha})`;
        }

        ctx.fill();
      }

      // If mouse is idle/off-screen and dots have settled back to their origin, pause animation to save 100% CPU
      if (!mouse.active && totalEnergy < 0.05) {
        isRunning = false;
        // Snap directly to resting points
        for (let i = 0; i < dots.length; i++) {
          dots[i].x = dots[i].originX;
          dots[i].y = dots[i].originY;
          dots[i].vx = 0;
          dots[i].vy = 0;
          dots[i].size = baseRadius;
          dots[i].alpha = baseAlpha;
        }
        return;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    const wakeUp = () => {
      if (!isRunning) {
        isRunning = true;
        animationFrameId = requestAnimationFrame(render);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
      wakeUp();
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      wakeUp();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
        mouse.active = true;
        wakeUp();
      }
    };

    const handleTouchEnd = () => {
      mouse.active = false;
      wakeUp();
    };

    const handleResize = () => {
      initDots();
      wakeUp();
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("resize", handleResize);

    initDots();
    wakeUp();

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-0 overflow-hidden select-none">
      {/* Interactive Canvas */}
      <canvas ref={canvasRef} className="block w-full h-full" />
      {/* Subtle vignette radial mask to fade edges softly */}
      <div 
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(248,250,252,0.6)_85%,rgba(248,250,252,1)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_40%,rgba(9,9,11,0.6)_85%,rgba(9,9,11,1)_100%)] transition-colors duration-300"
      />
    </div>
  );
};
