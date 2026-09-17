"use client";

import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export default function ArchivesSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
          <div className="space-y-1.5">
            <Skeleton className="w-48 h-6 rounded-lg" />
            <Skeleton className="w-64 h-3.5 rounded" />
          </div>
        </div>
        <Skeleton className="w-44 h-10 rounded-xl" />
      </div>

      {/* Module Tabs Skeleton */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <Skeleton className="w-36 h-10 rounded-xl" />
        <Skeleton className="w-36 h-10 rounded-xl" />
        <Skeleton className="w-36 h-10 rounded-xl" />
        <Skeleton className="w-36 h-10 rounded-xl" />
      </div>

      {/* Filter & View Controls Bar Skeleton */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs">
        <Skeleton className="w-60 h-9 rounded-xl" />
        <div className="flex items-center gap-2">
          <Skeleton className="w-28 h-9 rounded-xl" />
          <Skeleton className="w-32 h-9 rounded-xl" />
          <Skeleton className="w-20 h-9 rounded-xl" />
        </div>
      </div>

      {/* Card Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs space-y-3"
          >
            <div className="flex justify-between items-center">
              <Skeleton className="w-20 h-5 rounded-full" />
              <Skeleton className="w-16 h-5 rounded-full" />
            </div>
            <Skeleton className="w-3/4 h-5 rounded-lg" />
            <Skeleton className="w-full h-12 rounded-xl" />
            <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <Skeleton className="w-24 h-3 rounded" />
              <Skeleton className="w-20 h-3 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
