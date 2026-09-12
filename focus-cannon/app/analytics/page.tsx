"use client";

import PageContainer from "@/components/layout/PageContainer";
import { BarChart3, TrendingUp, Sparkles, ShieldCheck, Clock, Loader2 } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function AnalyticsPage() {
  const { user, focusSessions, aiReport, isAiGenerating, generateWeeklyReport } = useApp();

  const totalHours = (user.totalFocusMinutes / 60).toFixed(1);
  const totalBlocked = user.distractionsBlockedToday + focusSessions.reduce((acc, s) => acc + s.distractionsBlocked, 0);

  return (
    <PageContainer
      title="Analytics"
      description="Deep performance insights, weekly AI study reports, focus time heatmaps, and distraction trends."
      icon={<BarChart3 className="w-5 h-5" />}
      badge="Live Metrics Active"
      badgeType="indigo"
      actionSlot={
        <button
          onClick={generateWeeklyReport}
          disabled={isAiGenerating}
          className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
        >
          {isAiGenerating ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
              <span>Analyzing Performance...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
              <span>Generate AI Insight</span>
            </>
          )}
        </button>
      }
    >
      <div className="space-y-6">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#121821] border border-[#1E2638] rounded-xl p-5 space-y-1">
            <span className="text-xs font-medium text-zinc-400">Total Focus Time</span>
            <div className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
              {totalHours}h Total
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" /> +15%
              </span>
            </div>
            <span className="text-[11px] text-zinc-500">Recorded across {focusSessions.length || 8} sessions</span>
          </div>

          <div className="bg-[#121821] border border-[#1E2638] rounded-xl p-5 space-y-1">
            <span className="text-xs font-medium text-zinc-400">Focus Efficiency Score</span>
            <div className="text-2xl font-bold text-indigo-400">
              {aiReport ? `${aiReport.focusScore} / 100` : "88 / 100"}
            </div>
            <span className="text-[11px] text-emerald-400">Top 10% student consistency</span>
          </div>

          <div className="bg-[#121821] border border-[#1E2638] rounded-xl p-5 space-y-1">
            <span className="text-xs font-medium text-zinc-400">Time & Distractions Protected</span>
            <div className="text-2xl font-bold text-purple-400">{totalBlocked} Attempts</div>
            <span className="text-[11px] text-zinc-500">Shield enforcement active</span>
          </div>
        </div>

        {/* Heatmap & AI Report Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#121821] border border-[#1E2638] rounded-xl p-6 space-y-4">
            <h3 className="font-bold text-sm text-zinc-100 border-b border-[#1E2638] pb-3">
              Focus Sessions History Log
            </h3>

            {focusSessions.length > 0 ? (
              <div className="space-y-2">
                {focusSessions.map((s) => (
                  <div
                    key={s.id}
                    className="p-3.5 rounded-lg bg-[#0B0F14] border border-[#1E2638] flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="font-semibold text-zinc-200">{s.missionTitle || s.course}</div>
                      <div className="text-zinc-500 text-[11px] flex items-center gap-2">
                        <span>Mode: {s.mode}</span>
                        <span>•</span>
                        <span>{new Date(s.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-zinc-100">{s.durationMinutes} Mins</div>
                      <div className="text-indigo-400 font-semibold">+{s.xpEarned} XP</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-48 border border-dashed border-[#1E2638] rounded-lg bg-[#0B0F14]/50 flex flex-col items-center justify-center text-center p-6 text-xs text-zinc-500 space-y-1">
                <BarChart3 className="w-8 h-8 text-zinc-600" />
                <span>Interactive Focus Hours Logged Here</span>
                <p className="text-[11px] text-zinc-600">Start a timer session in Focus Mode to log metrics.</p>
              </div>
            )}
          </div>

          {/* AI Weekly Executive Summary Card */}
          <div className="bg-gradient-to-br from-indigo-950/20 via-[#121821] to-[#121821] border border-indigo-500/30 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Groq AI Executive Report</span>
            </div>

            {aiReport ? (
              <div className="space-y-3 text-xs">
                <p className="text-zinc-300 leading-relaxed font-medium">{aiReport.summary}</p>

                <div className="p-3 rounded-lg bg-[#0B0F14] border border-[#1E2638] space-y-1.5">
                  <div className="flex justify-between text-zinc-400">
                    <span>Peak Focus Window</span>
                    <span className="font-bold text-indigo-300">{aiReport.peakFocusWindow}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Target Daily Hours</span>
                    <span className="font-bold text-emerald-400">{aiReport.recommendedFocusHours}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-zinc-400">Identified Weak Concepts:</span>
                  <div className="flex flex-wrap gap-1">
                    {aiReport.weakTopics.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-red-500/10 text-red-300 border border-red-500/20 px-2 py-0.5 rounded"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <p className="text-zinc-300 leading-relaxed">
                  &quot;Peak focus occurs between 9:00 AM – 11:30 AM. Distractions peak on Thursday evenings. Recommendation: Schedule CS301 complex problem sets in morning blocks.&quot;
                </p>

                <div className="pt-2 border-t border-[#1E2638] text-xs text-zinc-400 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" /> High Consistency
                  </span>
                  <button
                    onClick={generateWeeklyReport}
                    className="text-indigo-400 font-medium hover:underline cursor-pointer"
                  >
                    Run Fresh Analysis
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
