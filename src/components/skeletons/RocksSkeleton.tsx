"use client";

import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export default function RocksSkeleton() {
  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Top Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div className="flex items-center gap-2.5">
          <Skeleton className="w-9 h-9 rounded-lg flex-shrink-0" />
          <div className="space-y-1.5">
            <Skeleton className="w-56 h-6 rounded-lg" />
            <Skeleton className="w-72 h-3.5 rounded" />
          </div>
        </div>
        <Skeleton className="w-32 h-9 rounded-lg" />
      </div>

      {/* Filter Tabs Bar Skeleton */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xs">
        <div className="flex items-center gap-1.5">
          <Skeleton className="w-16 h-8 rounded-lg" />
          <Skeleton className="w-12 h-8 rounded-lg" />
          <Skeleton className="w-12 h-8 rounded-lg" />
          <Skeleton className="w-12 h-8 rounded-lg" />
          <Skeleton className="w-12 h-8 rounded-lg" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="w-20 h-8 rounded-lg" />
          <Skeleton className="w-36 h-8 rounded-lg" />
        </div>
      </div>

      {/* Rocks Card List Skeleton */}
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 sm:p-5 shadow-xs space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                <Skeleton className="w-7 h-7 rounded-lg flex-shrink-0 mt-0.5 sm:mt-0" />
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Skeleton className="w-12 h-5 rounded-md" />
                    <Skeleton className="w-48 sm:w-64 h-5 rounded-lg" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-24 h-3.5 rounded" />
                    <Skeleton className="w-20 h-3.5 rounded" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 sm:justify-end">
                <div className="space-y-1 w-28 sm:w-36">
                  <div className="flex justify-between items-center">
                    <Skeleton className="w-12 h-3 rounded" />
                    <Skeleton className="w-8 h-3 rounded" />
                  </div>
                  <Skeleton className="w-full h-2 rounded-full" />
                </div>
                <Skeleton className="w-16 h-6 rounded-full flex-shrink-0" />
                <Skeleton className="w-6 h-6 rounded-md flex-shrink-0" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
