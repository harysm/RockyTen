"use client";

import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export default function ScoreboardSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Stat Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="w-24 h-4" />
              <Skeleton className="w-8 h-8 rounded-2xl" />
            </div>
            <Skeleton className="w-32 h-8" />
            <Skeleton className="w-40 h-3" />
          </div>
        ))}
      </div>

      {/* Main Table Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs overflow-hidden">
        {/* Table Header Filter Controls */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-950/30">
          <div className="flex items-center gap-3">
            <Skeleton className="w-36 h-9 rounded-2xl" />
            <Skeleton className="w-28 h-9 rounded-2xl" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="w-32 h-9 rounded-2xl" />
            <Skeleton className="w-28 h-9 rounded-2xl" />
          </div>
        </div>

        {/* Table Body Skeleton */}
        <div className="p-4 sm:p-6 space-y-4">
          {/* Table Column Headers */}
          <div className="grid grid-cols-12 gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <Skeleton className="col-span-3 h-4" />
            <Skeleton className="col-span-1 h-4" />
            <Skeleton className="col-span-1 h-4" />
            <Skeleton className="col-span-1 h-4" />
            <Skeleton className="col-span-1 h-4" />
            <Skeleton className="col-span-1 h-4" />
            <Skeleton className="col-span-1 h-4" />
            <Skeleton className="col-span-2 h-4" />
          </div>

          {/* Table Rows Skeleton */}
          {[1, 2, 3, 4, 5, 6].map((row) => (
            <div
              key={row}
              className="grid grid-cols-12 gap-3 items-center py-3 border-b border-slate-50 dark:border-slate-800/50"
            >
              <div className="col-span-3 space-y-2">
                <Skeleton className="w-44 h-4" />
                <Skeleton className="w-24 h-3" />
              </div>
              <Skeleton className="col-span-1 h-6 rounded-lg" />
              <Skeleton className="col-span-1 h-6 rounded-lg" />
              <Skeleton className="col-span-1 h-6 rounded-lg" />
              <Skeleton className="col-span-1 h-6 rounded-lg" />
              <Skeleton className="col-span-1 h-6 rounded-lg" />
              <Skeleton className="col-span-1 h-6 rounded-lg" />
              <div className="col-span-2 flex items-center justify-end gap-2">
                <Skeleton className="w-16 h-8 rounded-xl" />
                <Skeleton className="w-8 h-8 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
