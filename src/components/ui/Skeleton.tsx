"use client";

import React from "react";

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className = "", style }: SkeletonProps) {
  return (
    <div
      style={style}
      className={`bg-slate-200/80 dark:bg-zinc-800/80 rounded-xl animate-wave-shine ${className}`}
    />
  );
}
