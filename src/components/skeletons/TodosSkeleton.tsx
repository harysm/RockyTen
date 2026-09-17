"use client";

import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export default function TodosSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2">
          <Skeleton className="w-24 h-9 rounded-2xl" />
          <Skeleton className="w-24 h-9 rounded-2xl" />
          <Skeleton className="w-24 h-9 rounded-2xl" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="w-48 h-9 rounded-2xl" />
          <Skeleton className="w-32 h-9 rounded-2xl" />
        </div>
      </div>

      {/* Todo Cards List Skeleton */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4 flex-1">
              <Skeleton className="w-6 h-6 rounded-lg" />
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-16 h-5 rounded-full" />
                  <Skeleton className="w-48 h-4" />
                </div>
                <Skeleton className="w-72 h-3" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="w-24 h-6 rounded-full" />
              <Skeleton className="w-8 h-8 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
