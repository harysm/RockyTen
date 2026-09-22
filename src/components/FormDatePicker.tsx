"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  RotateCcw
} from "lucide-react";

export interface FormDatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  minDate?: string; // YYYY-MM-DD
  maxDate?: string; // YYYY-MM-DD
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  showPresets?: boolean;
}

const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const DAY_NAMES = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

// Timezone-safe date string formatter (YYYY-MM-DD)
function toDateString(year: number, monthIndex: number, day: number): string {
  const mm = String(monthIndex + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

// Format date for trigger button display
export function formatDisplayDate(dateStr: string): string {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr || "";
  const [y, m, d] = dateStr.split("-").map(Number);
  const dateObj = new Date(y, m - 1, d);
  const dayName = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"][dateObj.getDay()];
  const monthName = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agt",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ][m - 1];
  return `${dayName}, ${d} ${monthName} ${y}`;
}

export default function FormDatePicker({
  value,
  onChange,
  minDate,
  maxDate,
  placeholder = "Pilih tanggal deadline...",
  disabled = false,
  className = "",
  required = false,
  showPresets = true,
}: FormDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Today's date reference
  const now = new Date();
  const todayStr = toDateString(now.getFullYear(), now.getMonth(), now.getDate());

  // Parse initial view month & year from value or today
  const getInitialView = () => {
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [y, m] = value.split("-").map(Number);
      return { year: y, month: m - 1 };
    }
    return { year: now.getFullYear(), month: now.getMonth() };
  };

  const [viewDate, setViewDate] = useState(getInitialView);

  // Sync view when value changes from outside
  useEffect(() => {
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [y, m] = value.split("-").map(Number);
      setViewDate({ year: y, month: m - 1 });
    }
  }, [value]);

  // Click outside & Escape listener
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
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handlePrevMonth = () => {
    setViewDate((prev) => {
      if (prev.month === 0) {
        return { year: prev.year - 1, month: 11 };
      }
      return { year: prev.year, month: prev.month - 1 };
    });
  };

  const handleNextMonth = () => {
    setViewDate((prev) => {
      if (prev.month === 11) {
        return { year: prev.year + 1, month: 0 };
      }
      return { year: prev.year, month: prev.month + 1 };
    });
  };

  const handleSelectDate = (dateStr: string) => {
    onChange(dateStr);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  // Quick preset helper (add N days to today)
  const handlePresetDays = (daysToAdd: number) => {
    const target = new Date();
    target.setDate(target.getDate() + daysToAdd);
    const dateStr = toDateString(target.getFullYear(), target.getMonth(), target.getDate());
    onChange(dateStr);
    setIsOpen(false);
  };

  // Construct Calendar Grid
  const { year, month } = viewDate;
  const firstDayOfMonth = new Date(year, month, 1);
  const dayOfWeek = firstDayOfMonth.getDay(); // 0 = Sun, 1 = Mon
  const startDayIndex = (dayOfWeek + 6) % 7; // 0 = Mon, 6 = Sun

  const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const totalCells = Math.ceil((startDayIndex + daysInCurrentMonth) / 7) * 7;
  const calendarCells = [];

  for (let i = 0; i < totalCells; i++) {
    if (i < startDayIndex) {
      // Prev month trailing days
      const d = daysInPrevMonth - (startDayIndex - 1 - i);
      const prevMonthIndex = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      const dateStr = toDateString(prevYear, prevMonthIndex, d);
      calendarCells.push({
        day: d,
        dateStr,
        isCurrentMonth: false,
      });
    } else if (i < startDayIndex + daysInCurrentMonth) {
      // Current month days
      const d = i - startDayIndex + 1;
      const dateStr = toDateString(year, month, d);
      calendarCells.push({
        day: d,
        dateStr,
        isCurrentMonth: true,
      });
    } else {
      // Next month leading days
      const d = i - (startDayIndex + daysInCurrentMonth) + 1;
      const nextMonthIndex = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      const dateStr = toDateString(nextYear, nextMonthIndex, d);
      calendarCells.push({
        day: d,
        dateStr,
        isCurrentMonth: false,
      });
    }
  }

  const isSelected = (dateStr: string) => value === dateStr;
  const isToday = (dateStr: string) => todayStr === dateStr;
  const isDisabled = (dateStr: string) => {
    if (minDate && dateStr < minDate) return true;
    if (maxDate && dateStr > maxDate) return true;
    return false;
  };

  return (
    <div className={`relative w-full text-left ${className}`} ref={containerRef}>
      {/* Hidden input for HTML5 required form validation */}
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
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className={`w-full px-4 py-3 bg-white dark:bg-zinc-950 border rounded-xl text-xs font-semibold text-left flex items-center justify-between cursor-pointer transition-colors duration-150 group select-none ${
          disabled
            ? "opacity-50 cursor-not-allowed bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800"
            : isOpen
            ? "border-zinc-400 dark:border-zinc-500 ring-2 ring-zinc-900/10 dark:ring-white/15 bg-white dark:bg-zinc-950"
            : "border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white hover:border-slate-300 dark:hover:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-900"
        }`}
      >
        <div className="flex items-center gap-2.5 truncate min-w-0 pr-2">
          <CalendarIcon className="w-4 h-4 text-slate-400 dark:text-zinc-500 shrink-0 transition-colors duration-150 group-hover:text-slate-700 dark:group-hover:text-zinc-200" />
          <span
            className={`truncate ${
              value
                ? "text-slate-900 dark:text-white font-bold"
                : "text-slate-400 dark:text-zinc-500 font-normal"
            }`}
          >
            {value ? formatDisplayDate(value) : placeholder}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {value && !disabled && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClear}
              title="Hapus tanggal"
              className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
      </button>

      {/* Popover Calendar Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="false"
          className="absolute left-0 z-50 mt-1.5 w-[310px] sm:w-[325px] rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-3.5 shadow-xl shadow-slate-900/10 dark:shadow-black/40 animate-in fade-in-0 slide-in-from-top-1 duration-100 select-none"
        >
          {/* Header Navigation */}
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                {MONTH_NAMES[month]}
              </span>
              <span className="text-xs font-bold text-slate-400 dark:text-zinc-500">
                {year}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                aria-label="Bulan sebelumnya"
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewDate({ year: now.getFullYear(), month: now.getMonth() });
                }}
                title="Kembali ke bulan sekarang"
                className="px-1.5 py-1 text-[10px] font-bold text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-md transition-colors cursor-pointer"
              >
                Hari Ini
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                aria-label="Bulan berikutnya"
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Names Header */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {DAY_NAMES.map((name) => (
              <div
                key={name}
                className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-zinc-500 py-1"
              >
                {name}
              </div>
            ))}
          </div>

          {/* Calendar Day Cells */}
          <div className="grid grid-cols-7 gap-1">
            {calendarCells.map((cell, idx) => {
              const selected = isSelected(cell.dateStr);
              const disabledCell = isDisabled(cell.dateStr);
              const today = isToday(cell.dateStr);

              return (
                <button
                  key={`${cell.dateStr}-${idx}`}
                  type="button"
                  disabled={disabledCell}
                  onClick={() => handleSelectDate(cell.dateStr)}
                  className={`h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors duration-100 relative ${
                    disabledCell
                      ? "opacity-25 cursor-not-allowed text-slate-400 dark:text-zinc-600"
                      : selected
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-extrabold shadow-sm"
                      : cell.isCurrentMonth
                      ? "text-slate-800 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-900 cursor-pointer"
                      : "text-slate-350 dark:text-zinc-650 hover:bg-slate-100/60 dark:hover:bg-zinc-900/60 cursor-pointer"
                  } ${
                    today && !selected
                      ? "ring-1 ring-zinc-400/80 dark:ring-zinc-600 font-bold"
                      : ""
                  }`}
                >
                  <span>{cell.day}</span>
                  {today && !selected && (
                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-red-500 dark:bg-red-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Preset Pills */}
          {showPresets && (
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-zinc-800/80">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-zinc-500 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Cepat:</span>
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handlePresetDays(0)}
                    className="px-2 py-1 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    Hari Ini
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetDays(3)}
                    className="px-2 py-1 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    +3 Hari
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetDays(7)}
                    className="px-2 py-1 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    +7 Hari
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetDays(14)}
                    className="px-2 py-1 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    +14 Hari
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
