"use client";

import React from "react";
import Image from "next/image";

interface Documentation3DBookProps {
  isId?: boolean;
}

export const Documentation3DBook: React.FC<Documentation3DBookProps> = () => {
  return (
    <div className="relative flex items-center justify-center shrink-0 select-none py-2 px-4">
      {/* Ambient Lighting Halo Behind Book */}
      <div className="absolute w-52 h-52 sm:w-64 sm:h-64 rounded-full bg-gradient-to-tr from-blue-500/20 via-indigo-500/15 to-amber-500/10 dark:from-blue-500/30 dark:via-indigo-500/20 dark:to-amber-400/15 blur-3xl pointer-events-none transform -translate-y-2" />

      {/* Floating 3D Book (Pure Book - No Card) */}
      <div className="relative z-10 animate-float-levitate transform-gpu cursor-pointer group">
        <div className="relative w-52 h-52 sm:w-60 sm:h-60 lg:w-68 lg:h-68 transition-transform duration-500 ease-out group-hover:scale-105 drop-shadow-2xl">
          <Image
            src="/docs_3d_book_transparent.png"
            alt="RockyTen Documentation 3D Manual"
            fill
            sizes="(max-width: 640px) 208px, (max-width: 1024px) 240px, 272px"
            priority
            className="object-contain filter contrast-105"
          />
        </div>
      </div>
    </div>
  );
};
