"use client";

import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export default function IssuesSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-xs"
          >
            <Skeleton className="w-20 h-4" />
            <Skeleton className="w-16 h-8" />
          </div>
        ))}
      </div>

      {/* Filter & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <Skeleton className="w-48 h-9 rounded-2xl" />
        <Skeleton className="w-36 h-9 rounded-2xl" />
      </div>

      {/* Issues Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="w-20 h-5 rounded-full" />
              <Skeleton className="w-24 h-5 rounded-full" />
            </div>
            <Skeleton className="w-56 h-5" />
            <Skeleton className="w-full h-12 rounded-xl" />
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <Skeleton className="w-28 h-4" />
              <Skeleton className="w-20 h-8 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
