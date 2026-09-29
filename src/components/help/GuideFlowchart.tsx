"use client";

import React from "react";
import { Lightbulb } from "lucide-react";

// --- Types --------------------------------------------------------------------

export interface StartNode {
  type: "start";
  emoji?: string;
  titleId: string;
  titleEn: string;
}

export interface StepNode {
  type: "step";
  num: number;
  emoji?: string;
  titleId: string;
  titleEn: string;
  descId: string;
  descEn: string;
  tipsId?: string;
  tipsEn?: string;
  mockup?: React.ReactNode;
}

export interface DecisionBranch {
  labelId: string;
  labelEn: string;
  emoji?: string;
  titleId: string;
  titleEn: string;
  descId: string;
  descEn: string;
  variant: "success" | "danger" | "info" | "warning";
}

export interface DecisionNode {
  type: "decision";
  questionId: string;
  questionEn: string;
  yes: DecisionBranch;
  no: DecisionBranch;
}

export interface EndNode {
  type: "end";
  emoji?: string;
  titleId: string;
  titleEn: string;
}

export type ChartNode = StartNode | StepNode | DecisionNode | EndNode;

export type AccentColor =
  | "emerald"
  | "amber"
  | "rose"
  | "indigo"
  | "cyan"
  | "purple"
  | "blue";

interface GuideFlowchartProps {
  isId: boolean;
  nodes: ChartNode[];
  accent: AccentColor;
}

// --- Accent palette -----------------------------------------------------------

const ACCENT: Record<AccentColor, { pill: string; badgeSide: string; cardBorder: string; diamondBg: string; diamondBorder: string; label: string; tip: string; }> = {
  emerald: { pill: "bg-emerald-600 text-white", badgeSide: "bg-emerald-600 text-white", cardBorder: "border-emerald-200 dark:border-emerald-800/50", diamondBg: "bg-emerald-50 dark:bg-emerald-950/40", diamondBorder: "border-emerald-400 dark:border-emerald-700", label: "text-emerald-700 dark:text-emerald-300", tip: "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-900 dark:text-emerald-300" },
  amber: { pill: "bg-amber-600 text-white", badgeSide: "bg-amber-600 text-white", cardBorder: "border-amber-200 dark:border-amber-800/50", diamondBg: "bg-amber-50 dark:bg-amber-950/40", diamondBorder: "border-amber-400 dark:border-amber-700", label: "text-amber-700 dark:text-amber-300", tip: "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/30 dark:border-amber-900 dark:text-amber-300" },
  rose: { pill: "bg-rose-600 text-white", badgeSide: "bg-rose-600 text-white", cardBorder: "border-rose-200 dark:border-rose-800/50", diamondBg: "bg-rose-50 dark:bg-rose-950/40", diamondBorder: "border-rose-400 dark:border-rose-700", label: "text-rose-700 dark:text-rose-300", tip: "bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/30 dark:border-rose-900 dark:text-rose-300" },
  indigo: { pill: "bg-indigo-600 text-white", badgeSide: "bg-indigo-600 text-white", cardBorder: "border-indigo-200 dark:border-indigo-800/50", diamondBg: "bg-indigo-50 dark:bg-indigo-950/40", diamondBorder: "border-indigo-400 dark:border-indigo-700", label: "text-indigo-700 dark:text-indigo-300", tip: "bg-indigo-50 border-indigo-200 text-indigo-800 dark:bg-indigo-950/30 dark:border-indigo-900 dark:text-indigo-300" },
  cyan: { pill: "bg-cyan-600 text-white", badgeSide: "bg-cyan-600 text-white", cardBorder: "border-cyan-200 dark:border-cyan-800/50", diamondBg: "bg-cyan-50 dark:bg-cyan-950/40", diamondBorder: "border-cyan-400 dark:border-cyan-700", label: "text-cyan-700 dark:text-cyan-300", tip: "bg-cyan-50 border-cyan-200 text-cyan-800 dark:bg-cyan-950/30 dark:border-cyan-900 dark:text-cyan-300" },
  purple: { pill: "bg-purple-600 text-white", badgeSide: "bg-purple-600 text-white", cardBorder: "border-purple-200 dark:border-purple-800/50", diamondBg: "bg-purple-50 dark:bg-purple-950/40", diamondBorder: "border-purple-400 dark:border-purple-700", label: "text-purple-700 dark:text-purple-300", tip: "bg-purple-50 border-purple-200 text-purple-800 dark:bg-purple-950/30 dark:border-purple-900 dark:text-purple-300" },
  blue: { pill: "bg-blue-600 text-white", badgeSide: "bg-blue-600 text-white", cardBorder: "border-blue-200 dark:border-blue-800/50", diamondBg: "bg-blue-50 dark:bg-blue-950/40", diamondBorder: "border-blue-400 dark:border-blue-700", label: "text-blue-700 dark:text-blue-300", tip: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/30 dark:border-blue-900 dark:text-blue-300" },
};

const BRANCH_STYLE: Record<DecisionBranch["variant"], { card: string; label: string; title: string; desc: string }> = {
  success: { card: "border-emerald-300 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/30", label: "bg-emerald-600 text-white", title: "text-emerald-900 dark:text-emerald-100", desc: "text-emerald-700 dark:text-emerald-300" },
  danger: { card: "border-rose-300 dark:border-rose-800 bg-rose-50/70 dark:bg-rose-950/30", label: "bg-rose-600 text-white", title: "text-rose-900 dark:text-rose-100", desc: "text-rose-700 dark:text-rose-300" },
  info: { card: "border-blue-300 dark:border-blue-800 bg-blue-50/70 dark:bg-blue-950/30", label: "bg-blue-600 text-white", title: "text-blue-900 dark:text-blue-100", desc: "text-blue-700 dark:text-blue-300" },
  warning: { card: "border-amber-300 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/30", label: "bg-amber-600 text-white", title: "text-amber-900 dark:text-amber-100", desc: "text-amber-700 dark:text-amber-300" },
};

// --- Sub-components -----------------------------------------------------------

function ArrowConnector() {
  return (
    <div className="flex flex-col items-center select-none py-0.5">
      <div className="w-px h-6 bg-slate-300 dark:bg-zinc-700" />
      <svg width="12" height="8" viewBox="0 0 12 8" fill="#94a3b8"><path d="M6 8L0 0H12L6 8Z" /></svg>
    </div>
  );
}

function ConvergingConnector() {
  return (
    <div className="flex justify-center select-none py-0.5">
      <div className="relative" style={{ width: 280, height: 32 }}>
        {/* Left vertical down from left outcome card */}
        <div className="absolute top-0 left-0 w-px h-1/2 bg-slate-300 dark:bg-zinc-700" />
        {/* Right vertical down from right outcome card */}
        <div className="absolute top-0 right-0 w-px h-1/2 bg-slate-300 dark:bg-zinc-700" />
        {/* Horizontal bar joining both sides */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-300 dark:bg-zinc-700" />
        {/* Center stem down to end node */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-px h-1/2 bg-slate-300 dark:bg-zinc-700" />
        <svg className="absolute bottom-0 left-1/2 -translate-x-[6px]" width="12" height="8" viewBox="0 0 12 8" fill="#94a3b8">
          <path d="M6 8L0 0H12L6 8Z" />
        </svg>
      </div>
    </div>
  );
}

function StartEndNode({ node, accent, isId }: { node: StartNode | EndNode; accent: AccentColor; isId: boolean }) {
  const a = ACCENT[accent];
  return (
    <div className="flex justify-center">
      <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full text-sm font-extrabold shadow-sm transition-transform hover:scale-105 ${a.pill}`}>
        {node.emoji && <span className="text-base leading-none">{node.emoji}</span>}
        <span>{isId ? node.titleId : node.titleEn}</span>
      </div>
    </div>
  );
}

function StepCard({ node, accent, isId }: { node: StepNode; accent: AccentColor; isId: boolean }) {
  const a = ACCENT[accent];
  return (
    <div className="mx-auto w-full max-w-md sm:max-w-xl">
      <div className={`flex items-stretch rounded-2xl border bg-white dark:bg-zinc-950 shadow-xs hover:shadow-md transition-all overflow-hidden ${a.cardBorder}`}>
        <div className={`flex flex-col items-center justify-center gap-0.5 px-3 py-3 shrink-0 min-w-[56px] ${a.badgeSide}`}>
          <span className="text-[9px] font-black uppercase tracking-widest opacity-75">{isId ? "LANGKAH" : "STEP"}</span>
          <span className="text-2xl font-black leading-none">{String(node.num).padStart(2, "0")}</span>
          {node.emoji && <span className="text-lg leading-none mt-1">{node.emoji}</span>}
        </div>
        <div className="flex-1 p-3.5 sm:p-4 space-y-2 min-w-0">
          <div className="space-y-1">
            <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">{isId ? node.titleId : node.titleEn}</h4>
            <p className="text-xs sm:text-[13px] text-slate-600 dark:text-zinc-400 leading-relaxed">{isId ? node.descId : node.descEn}</p>
          </div>

          {/* Visual Mini Mockup / Contoh Tampilan */}
          {node.mockup && (
            <div className="mt-2.5 rounded-xl border border-slate-200/80 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-900/60 p-2.5 overflow-hidden">
              <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-500 mb-1.5 flex items-center justify-between">
                <span>{isId ? "Contoh Tampilan" : "Visual Preview"}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              {node.mockup}
            </div>
          )}

          {/* Practical Tips */}
          {(isId ? node.tipsId : node.tipsEn) && (
            <div className={`flex items-start gap-1.5 text-[11px] sm:text-xs px-2.5 py-1.5 rounded-xl border mt-2 ${a.tip}`}>
              <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5 opacity-80" />
              <span><strong className="font-extrabold">{isId ? "Tips:" : "Tip:"}</strong> {isId ? node.tipsId : node.tipsEn}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DiamondDecision({ node, accent, isId }: { node: DecisionNode; accent: AccentColor; isId: boolean }) {
  const a = ACCENT[accent];
  const yS = BRANCH_STYLE[node.yes.variant];
  const nS = BRANCH_STYLE[node.no.variant];

  return (
    <div className="w-full">
      {/* Diamond */}
      <div className="flex justify-center">
        <div className="relative flex items-center justify-center" style={{ width: 220, height: 120 }}>
          <div className={`absolute w-[94px] h-[94px] rotate-45 rounded-xl border-2 shadow-sm ${a.diamondBg} ${a.diamondBorder}`} />
          <div className="relative z-10 text-center px-6">
            <span className="block text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-0.5">{isId ? "KONDISI" : "CONDITION"}</span>
            <span className={`block text-xs font-black leading-snug ${a.label}`}>{isId ? node.questionId : node.questionEn}</span>
          </div>
        </div>
      </div>

      {/* Branch arms down from diamond */}
      <div className="flex justify-center">
        <div className="relative" style={{ width: 280, height: 36 }}>
          <div className="absolute top-0 left-0 right-0 h-px bg-slate-300 dark:bg-zinc-700" />
          <div className="absolute top-0 left-0 w-px h-full bg-slate-300 dark:bg-zinc-700" />
          <div className="absolute top-0 right-0 w-px h-full bg-slate-300 dark:bg-zinc-700" />
          <svg className="absolute bottom-0 left-0 -translate-x-[5px]" width="12" height="8" viewBox="0 0 12 8" fill="#94a3b8"><path d="M6 8L0 0H12L6 8Z" /></svg>
          <svg className="absolute bottom-0 right-0 -translate-x-[5px]" width="12" height="8" viewBox="0 0 12 8" fill="#94a3b8"><path d="M6 8L0 0H12L6 8Z" /></svg>
        </div>
      </div>

      {/* Outcome cards */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center sm:items-stretch px-2 max-w-xl mx-auto">
        <div className="flex flex-col items-center gap-1.5 flex-1 w-full sm:w-auto sm:max-w-[230px]">
          <span className={`px-3 py-0.5 rounded-full text-[10px] font-extrabold shadow-2xs ${yS.label}`}>{node.yes.emoji} {isId ? node.yes.labelId : node.yes.labelEn}</span>
          <div className={`w-full rounded-2xl border p-3.5 space-y-1 shadow-2xs flex-1 ${yS.card}`}>
            <p className={`font-extrabold text-xs sm:text-[13px] leading-snug ${yS.title}`}>{isId ? node.yes.titleId : node.yes.titleEn}</p>
            <p className={`text-[11px] sm:text-xs leading-relaxed ${yS.desc}`}>{isId ? node.yes.descId : node.yes.descEn}</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1.5 flex-1 w-full sm:w-auto sm:max-w-[230px]">
          <span className={`px-3 py-0.5 rounded-full text-[10px] font-extrabold shadow-2xs ${nS.label}`}>{node.no.emoji} {isId ? node.no.labelId : node.no.labelEn}</span>
          <div className={`w-full rounded-2xl border p-3.5 space-y-1 shadow-2xs flex-1 ${nS.card}`}>
            <p className={`font-extrabold text-xs sm:text-[13px] leading-snug ${nS.title}`}>{isId ? node.no.titleId : node.no.titleEn}</p>
            <p className={`text-[11px] sm:text-xs leading-relaxed ${nS.desc}`}>{isId ? node.no.descId : node.no.descEn}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Main export --------------------------------------------------------------

export default function GuideFlowchart({ isId, nodes, accent }: GuideFlowchartProps) {
  return (
    <div className="flex flex-col items-center w-full py-4 gap-0">
      {nodes.map((node, idx) => {
        const isLast = idx === nodes.length - 1;
        const isDecision = node.type === "decision";
        const nextNode = idx < nodes.length - 1 ? nodes[idx + 1] : null;

        return (
          <React.Fragment key={idx}>
            {(node.type === "start" || node.type === "end") && <StartEndNode node={node} accent={accent} isId={isId} />}
            {node.type === "step" && <StepCard node={node} accent={accent} isId={isId} />}
            {node.type === "decision" && <DiamondDecision node={node} accent={accent} isId={isId} />}
            
            {/* Connectors */}
            {!isLast && !isDecision && <ArrowConnector />}
            {!isLast && isDecision && nextNode?.type === "end" && <ConvergingConnector />}
            {!isLast && isDecision && nextNode?.type !== "end" && <div className="h-5" />}
          </React.Fragment>
        );
      })}
    </div>
  );
}
