"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface FormSelectOption {
  value: string;
  label: string;
  sublabel?: string;
  badge?: string;
  icon?: React.ReactNode;
  group?: string;
}

interface FormSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: FormSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  size?: "default" | "sm";
}

export default function FormSelect({
  value,
  onChange,
  options,
  placeholder = "Pilih opsi...",
  disabled = false,
  className = "",
  required = false,
  size = "default",
}: FormSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [maxDropdownHeight, setMaxDropdownHeight] = useState(240);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const updatePosition = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const windowSpaceBelow = window.innerHeight - rect.bottom - 16;
      const windowSpaceAbove = rect.top - 16;

      const scrollParent = containerRef.current.closest(".overflow-y-auto");
      let parentSpaceBelow = windowSpaceBelow;
      let parentSpaceAbove = windowSpaceAbove;

      if (scrollParent) {
        const parentRect = scrollParent.getBoundingClientRect();
        parentSpaceBelow = parentRect.bottom - rect.bottom - 12;
        parentSpaceAbove = rect.top - parentRect.top - 12;
      }

      const spaceBelow = Math.min(windowSpaceBelow, parentSpaceBelow);
      const spaceAbove = Math.min(windowSpaceAbove, parentSpaceAbove);

      // Flip upward if space below is limited (< 210px) and space above is larger
      const shouldOpenUpward = spaceBelow < 210 && spaceAbove > spaceBelow;
      setOpenUpward(shouldOpenUpward);

      const availableSpace = shouldOpenUpward ? spaceAbove : spaceBelow;
      setMaxDropdownHeight(Math.min(240, Math.max(130, Math.floor(availableSpace))));
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      updatePosition();
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);

      const handleScrollOrResize = () => {
        updatePosition();
      };
      window.addEventListener("resize", handleScrollOrResize);
      window.addEventListener("scroll", handleScrollOrResize, true);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("resize", handleScrollOrResize);
        window.removeEventListener("scroll", handleScrollOrResize, true);
      };
    }
  }, [isOpen]);

  const isSmall = size === "sm";

  return (
    <div className={`relative w-full text-left ${className}`} ref={containerRef}>
      {/* Hidden input for form requirement/validation if needed */}
      {required && (
        <input
          type="text"
          value={value}
          onChange={() => {}}
          required={required}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
        />
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!isOpen) updatePosition();
          setIsOpen(!isOpen);
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full ${
          isSmall ? "px-3 py-2 rounded-xl text-xs" : "px-4 py-3 rounded-xl text-xs"
        } bg-white dark:bg-zinc-950 border font-semibold text-left flex items-center justify-between cursor-pointer transition-all duration-150 group select-none shadow-2xs ${
          disabled
            ? "opacity-50 cursor-not-allowed bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800"
            : isOpen
            ? "border-zinc-500 dark:border-zinc-400 ring-2 ring-zinc-900/10 dark:ring-white/15 bg-white dark:bg-zinc-950"
            : "border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white hover:border-slate-300 dark:hover:border-zinc-700 hover:bg-slate-50/80 dark:hover:bg-zinc-900/80"
        }`}
      >
        <div className="flex items-center gap-2 truncate min-w-0 pr-2">
          {selectedOption?.icon && (
            <span className="shrink-0 text-slate-500 dark:text-zinc-400 transition-colors duration-150 group-hover:text-slate-700 dark:group-hover:text-zinc-200">
              {selectedOption.icon}
            </span>
          )}
          <span
            className={`truncate font-bold ${
              selectedOption
                ? "text-slate-900 dark:text-white"
                : "text-slate-400 dark:text-zinc-500 font-normal"
            }`}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.badge && (
            <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200/60 dark:border-zinc-700/60 shrink-0 uppercase">
              {selectedOption.badge}
            </span>
          )}
        </div>

        <ChevronDown
          className={`${
            isSmall ? "w-3.5 h-3.5" : "w-4 h-4"
          } text-slate-400 dark:text-zinc-500 transition-transform duration-200 shrink-0 group-hover:text-slate-700 dark:group-hover:text-zinc-200 ${
            isOpen ? "rotate-180 text-slate-900 dark:text-white" : ""
          }`}
        />
      </button>

      {/* Floating Options Dropdown (Auto-Flip Upward or Downward) */}
      {isOpen && (
        <div
          role="listbox"
          style={{ maxHeight: `${maxDropdownHeight}px` }}
          className={`absolute left-0 right-0 z-[60] overflow-y-auto rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-1 shadow-xl shadow-slate-900/10 dark:shadow-black/40 overscroll-contain ${
            openUpward
              ? "bottom-full mb-1.5 animate-in fade-in-0 slide-in-from-bottom-1 duration-100"
              : "top-full mt-1.5 animate-in fade-in-0 slide-in-from-top-1 duration-100"
          }`}
        >
          <div className="space-y-0.5">
            {options.map((opt, idx) => {
              const isSelected = opt.value === value;
              const showGroupHeader = opt.group && (idx === 0 || options[idx - 1].group !== opt.group);

              return (
                <React.Fragment key={opt.value}>
                  {showGroupHeader && (
                    <div className={`px-2.5 pt-2 pb-1 text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-wider ${idx > 0 ? "border-t border-slate-100 dark:border-zinc-800 mt-1" : ""}`}>
                      {opt.group}
                    </div>
                  )}
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left ${
                      isSmall ? "px-2.5 py-2 text-xs" : "px-3 py-2.5 text-xs"
                    } rounded-lg font-semibold transition-colors duration-100 flex items-center justify-between cursor-pointer group ${
                      isSelected
                        ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold shadow-2xs"
                        : "text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate min-w-0 pr-2">
                      {opt.icon && (
                        <span
                          className={`shrink-0 transition-colors duration-100 ${
                            isSelected
                              ? "text-white dark:text-zinc-950"
                              : "text-slate-400 dark:text-zinc-500 group-hover:text-slate-700 dark:group-hover:text-zinc-200"
                          }`}
                        >
                          {opt.icon}
                        </span>
                      )}
                      <div className="truncate min-w-0">
                        <div className="flex items-center gap-2 truncate">
                          <span className="truncate">{opt.label}</span>
                          {opt.badge && (
                            <span
                              className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold shrink-0 uppercase ${
                                isSelected
                                  ? "bg-white/20 text-white dark:bg-zinc-900/20 dark:text-zinc-950"
                                  : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200/60 dark:border-zinc-700/60"
                              }`}
                            >
                              {opt.badge}
                            </span>
                          )}
                        </div>
                        {opt.sublabel && (
                          <p
                            className={`text-[10px] mt-0.5 truncate ${
                              isSelected
                                ? "text-white/75 dark:text-zinc-950/75 font-normal"
                                : "text-slate-400 dark:text-zinc-500 group-hover:text-slate-500 dark:group-hover:text-zinc-400"
                            }`}
                          >
                            {opt.sublabel}
                          </p>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <Check className="w-3.5 h-3.5 shrink-0 stroke-[3] ml-2 text-white dark:text-zinc-950" />
                    )}
                  </button>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
