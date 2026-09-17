"use client";

import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Greeting Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="space-y-2">
          <Skeleton className="w-56 sm:w-72 h-8 rounded-xl" />
          <Skeleton className="w-36 h-4 rounded-lg" />
        </div>
        <Skeleton className="w-48 h-10 rounded-xl" />
      </div>

      {/* 5 Summary Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3.5 sm:p-5 rounded-xl shadow-xs ${
              i === 5 ? "col-span-2 sm:col-span-1" : ""
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1 min-w-0 pr-2">
                <Skeleton className="w-20 h-3 rounded" />
                <Skeleton className="w-12 h-7 rounded-lg" />
                <Skeleton className="w-24 h-3 rounded" />
              </div>
              <Skeleton className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex-shrink-0" />
            </div>
          </div>
        ))}
      </div>

      {/* Prioritas Rocks (Traction L10) Highlight Skeleton */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-5 rounded-xl shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800/60">
          <div className="flex items-center gap-2.5">
            <Skeleton className="w-8 h-8 rounded-lg flex-shrink-0" />
            <div className="space-y-1.5">
              <Skeleton className="w-48 sm:w-64 h-5 rounded-lg" />
              <Skeleton className="w-32 h-3 rounded" />
            </div>
          </div>
          <Skeleton className="w-28 h-4 rounded" />
        </div>

        {/* Rock Item Rows */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {[1, 2].map((r) => (
            <div
              key={r}
              className="p-4 rounded-xl bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/80 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="w-3/4 h-4 rounded" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-14 h-4 rounded-md" />
                    <Skeleton className="w-20 h-4 rounded-md" />
                  </div>
                </div>
                <Skeleton className="w-16 h-5 rounded-full" />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Skeleton className="w-16 h-3 rounded" />
                  <Skeleton className="w-10 h-3 rounded" />
                </div>
                <Skeleton className="w-full h-2 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Middle Split Section: Performance Chart & Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Metric Performance Chart Card Skeleton */}
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-5 rounded-xl shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-zinc-100 dark:border-zinc-800/60">
            <div className="space-y-1.5">
              <Skeleton className="w-40 h-5 rounded-lg" />
              <Skeleton className="w-56 h-3 rounded" />
            </div>
            <Skeleton className="w-20 h-6 rounded-full" />
          </div>
          <Skeleton className="w-full h-56 rounded-xl" />
          <div className="flex items-center justify-between pt-2">
            <Skeleton className="w-32 h-3 rounded" />
            <Skeleton className="w-24 h-3 rounded" />
          </div>
        </div>

        {/* Operations Highlights Card Skeleton */}
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-5 rounded-xl shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-zinc-100 dark:border-zinc-800/60">
            <div className="space-y-1.5">
              <Skeleton className="w-40 h-5 rounded-lg" />
              <Skeleton className="w-52 h-3 rounded" />
            </div>
            <Skeleton className="w-24 h-4 rounded" />
          </div>

          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="p-3 rounded-lg border border-zinc-100 dark:border-zinc-800/70 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Skeleton className="w-5 h-5 rounded flex-shrink-0" />
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <Skeleton className="w-3/4 h-4 rounded" />
                    <Skeleton className="w-1/2 h-3 rounded" />
                  </div>
                </div>
                <Skeleton className="w-16 h-5 rounded-full flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity & History Log Skeleton */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-5 rounded-xl shadow-xs space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-zinc-100 dark:border-zinc-800/60">
          <div className="space-y-1.5">
            <Skeleton className="w-36 h-5 rounded-lg" />
            <Skeleton className="w-48 h-3 rounded" />
          </div>
          <Skeleton className="w-24 h-4 rounded" />
        </div>

        <div className="space-y-3">
          {[1, 2, 3, 4].map((log) => (
            <div
              key={log}
              className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800/40 last:border-0"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                <div className="space-y-1.5 flex-1 min-w-0">
                  <Skeleton className="w-2/3 h-4 rounded" />
                  <Skeleton className="w-1/3 h-3 rounded" />
                </div>
              </div>
              <Skeleton className="w-20 h-3 rounded flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
