"use client";

import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export default function HistorySkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="w-48 h-6" />
          <Skeleton className="w-64 h-4" />
        </div>
        <Skeleton className="w-36 h-9 rounded-2xl" />
      </div>

      {/* Audit Logs List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-4 shadow-xs">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="flex items-start gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80 last:border-0 last:pb-0"
          >
            <Skeleton className="w-10 h-10 rounded-2xl shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="flex items-center justify-between">
                <Skeleton className="w-36 h-4" />
                <Skeleton className="w-24 h-3" />
              </div>
              <Skeleton className="w-64 h-3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
