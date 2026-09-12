"use client";

import { useState } from "react";
import PageContainer from "@/components/layout/PageContainer";
import {
  LifeBuoy,
  AlertTriangle,
  ShieldAlert,
  Sparkles,
  Zap,
  CheckCircle,
  Loader2,
  Clock,
  BookOpen,
  RefreshCw,
  Flame,
} from "lucide-react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";

export default function SaveMePage() {
  const { addMission, setActiveMissionId, triggerAIMissionGeneration, isAiGenerating } = useApp();

  const [selectedCourse, setSelectedCourse] = useState("CS301");
  const [availableHours, setAvailableHours] = useState(4);
  const [generatedPlan, setGeneratedPlan] = useState<null | {
    course: string;
    saveRate: number;
    totalDuration: string;
    sprints: { id: string; title: string; weight: string; description: string; duration: string; xp: number }[];
  }>({
    course: "CS301: Algorithms & Data Structures",
    saveRate: 88,
    totalDuration: "3h 30m",
    sprints: [
      {
        id: "sprint-1",
        title: "Sprint 1: Dynamic Programming Subproblems",
        weight: "35% Exam Weight",
        description: "Focus exclusively on Memoization tables & 1D/2D DP recurrence relations.",
        duration: "45 mins",
        xp: 180,
      },
      {
        id: "sprint-2",
        title: "Sprint 2: Graph Traversal & Shortest Path",
        weight: "25% Exam Weight",
        description: "Dijkstra algorithm implementation & BFS/DFS cycle detection patterns.",
        duration: "45 mins",
        xp: 150,
      },
      {
        id: "sprint-3",
        title: "Sprint 3: High-Yield Practice Problems",
        weight: "20% Exam Weight",
        description: "Solve 3 targeted past midterm exam problems with timer enforcement.",
        duration: "60 mins",
        xp: 220,
      },
    ],
  });

  const handleGenerateRoadmap = async () => {
    await triggerAIMissionGeneration({
      courses: [selectedCourse],
      hoursAvailable: availableHours,
      urgency: "save_me",
    });

    setGeneratedPlan({
      course: `${selectedCourse} Intensive Sprint`,
      saveRate: 92,
      totalDuration: `${availableHours}h Total`,
      sprints: [
        {
          id: `sprint-${Date.now()}-1`,
          title: `Sprint 1: ${selectedCourse} Core High-Yield Topics`,
          weight: "40% Exam Weight",
          description: "Targeted focus on most heavily weighted exam questions.",
          duration: "45 mins",
          xp: 200,
        },
        {
          id: `sprint-${Date.now()}-2`,
          title: `Sprint 2: ${selectedCourse} Past Paper Drill`,
          weight: "35% Exam Weight",
          description: "Strictly timed solution drill covering top 3 past exam patterns.",
          duration: "45 mins",
          xp: 180,
        },
      ],
    });
  };

  return (
    <PageContainer
      title="SAVE ME / Recovery Mode"
      description="Emergency AI recovery engine for when you fall behind on study schedules, exams, or coursework deadlines."
      icon={<LifeBuoy className="w-5 h-5" />}
      badge="Emergency Mode"
      badgeType="danger"
      actionSlot={
        <button
          onClick={handleGenerateRoadmap}
          disabled={isAiGenerating}
          className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-red-600 via-red-500 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-900/30 transition-transform hover:scale-105 disabled:opacity-50 cursor-pointer"
        >
          {isAiGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Analyzing Syllabus & Time...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 fill-current" />
              <span>Generate Recovery Roadmap</span>
            </>
          )}
        </button>
      }
    >
      <div className="space-y-6">
        {/* Urgent Warning Banner */}
        <div className="bg-gradient-to-r from-red-950/40 via-[#121821] to-amber-950/30 border border-red-500/40 rounded-xl p-6 space-y-3 relative overflow-hidden">
          <div className="flex items-center gap-3 text-red-400 font-bold text-base">
            <AlertTriangle className="w-5 h-5 shrink-0 animate-bounce" />
            <span>Academic Emergency Protocol Active</span>
          </div>

          <p className="text-xs text-zinc-300 max-w-3xl leading-relaxed">
            Don&apos;t panic. The AI Recovery Engine analyzes remaining time before your exams, prunes non-essential topics, prioritizes high-weight syllabus items, and outputs an aggressive step-by-step cramming roadmap.
          </p>

          <div className="flex items-center gap-4 text-xs pt-1 text-zinc-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle className="w-3.5 h-3.5" /> High-Yield Topic Filter
            </span>
            <span className="flex items-center gap-1 text-amber-400">
              <ShieldAlert className="w-3.5 h-3.5" /> Burnout Protection Included
            </span>
          </div>
        </div>

        {/* Step-by-Step AI Recovery Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Step 1: Select Course */}
          <div className="bg-[#121821] border border-[#1E2638] rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                Step 1
              </span>
              <span className="text-[11px] text-zinc-500">Diagnosis</span>
            </div>
            <h4 className="font-bold text-sm text-zinc-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>Select Urgent Course</span>
            </h4>
            <div className="space-y-1.5">
              {[
                { id: "CS301", name: "CS301 Algorithms (Exam in 48h)" },
                { id: "MATH202", name: "MATH202 Linear Algebra (Exam in 3d)" },
                { id: "PHYS101", name: "PHYS101 Physics (Exam in 5d)" },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCourse(c.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    selectedCourse === c.id
                      ? "bg-indigo-600/20 text-indigo-300 border-indigo-500/50 font-bold"
                      : "bg-[#0B0F14] text-zinc-400 border-[#1E2638] hover:text-zinc-200"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Available Hours Allocation */}
          <div className="bg-[#121821] border border-[#1E2638] rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Step 2
              </span>
              <span className="text-[11px] text-zinc-500">Optimization</span>
            </div>
            <h4 className="font-bold text-sm text-zinc-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Time Allocation</span>
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-zinc-400">
                <span>Available Focus Hours</span>
                <span className="font-bold text-amber-400">{availableHours} Hours Today</span>
              </div>
              <input
                type="range"
                min={2}
                max={8}
                value={availableHours}
                onChange={(e) => setAvailableHours(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-500">
                <span>2h (Sprint)</span>
                <span>5h (Standard)</span>
                <span>8h (Cram Mode)</span>
              </div>
            </div>
          </div>

          {/* Step 3: Trigger Roadmap */}
          <div className="bg-[#121821] border border-[#1E2638] rounded-xl p-5 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Step 3
                </span>
                <span className="text-[11px] text-zinc-500">Execution</span>
              </div>
              <h4 className="font-bold text-sm text-zinc-100 mt-2">Generate Recovery Roadmap</h4>
              <p className="text-xs text-zinc-400 mt-1">
                Synthesize high-yield study sprints with distraction shield locks.
              </p>
            </div>

            <button
              onClick={handleGenerateRoadmap}
              disabled={isAiGenerating}
              className="w-full py-2.5 px-3 rounded-lg bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] disabled:opacity-50 cursor-pointer"
            >
              {isAiGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Computing Strategy...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Run AI Recovery Engine</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Roadmap Output */}
        {isAiGenerating ? (
          <div className="bg-[#121821] border border-[#1E2638] rounded-xl p-12 flex flex-col items-center justify-center text-center space-y-3">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
            <div className="font-bold text-zinc-200 text-sm">
              AI Recovery Engine is prioritizing syllabus concepts...
            </div>
            <p className="text-xs text-zinc-500 max-w-sm">
              Calculating high-yield topic weights, pruning optional material, and building focus sprint sequence.
            </p>
          </div>
        ) : generatedPlan ? (
          <div className="bg-[#121821] border border-[#1E2638] rounded-xl p-6 space-y-4 shadow-lg animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1E2638] pb-4 gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h3 className="font-bold text-base text-zinc-100">
                    Generated Recovery Plan: {generatedPlan.course}
                  </h3>
                </div>
                <p className="text-xs text-zinc-400">
                  Targeted sprint plan optimized for {generatedPlan.totalDuration}.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  🎯 Estimated Save Rate: {generatedPlan.saveRate}%
                </div>
                <button
                  onClick={handleGenerateRoadmap}
                  className="p-1.5 rounded-lg bg-[#0B0F14] border border-[#1E2638] text-zinc-400 hover:text-zinc-200 cursor-pointer"
                  title="Regenerate plan"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Generated Sprint Cards */}
            <div className="space-y-3">
              {generatedPlan.sprints.map((sprint, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#0B0F14] border border-[#1E2638] hover:border-[#2A364F] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {sprint.weight}
                      </span>
                      <h4 className="font-bold text-sm text-zinc-100">{sprint.title}</h4>
                    </div>
                    <p className="text-xs text-zinc-400">{sprint.description}</p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1E2638]">
                    <div className="text-right text-xs">
                      <div className="font-bold text-zinc-200">{sprint.duration}</div>
                      <div className="text-indigo-400 font-semibold">+{sprint.xp} XP</div>
                    </div>
                    <Link
                      href="/focus"
                      onClick={() => {
                        addMission({
                          course: selectedCourse,
                          title: sprint.title,
                          description: sprint.description,
                          estimatedMinutes: 45,
                          xpReward: sprint.xp,
                          priority: "high",
                          status: "pending",
                          syllabusCoverage: 85,
                        });
                      }}
                      className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Flame className="w-3.5 h-3.5" />
                      <span>Start Sprint</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </PageContainer>
  );
}
