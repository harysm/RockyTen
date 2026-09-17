"use client";

import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export default function HeadlinesSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner Header Skeleton */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="w-48 h-6" />
          <Skeleton className="w-72 h-4" />
        </div>
        <Skeleton className="w-36 h-10 rounded-2xl" />
      </div>

      {/* Headline Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="w-28 h-6 rounded-full" />
              <Skeleton className="w-20 h-4" />
            </div>
            <Skeleton className="w-3/4 h-5" />
            <Skeleton className="w-full h-16 rounded-xl" />
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <Skeleton className="w-32 h-4" />
              <Skeleton className="w-20 h-8 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
