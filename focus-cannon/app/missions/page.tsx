"use client";

import { useState } from "react";
import PageContainer from "@/components/layout/PageContainer";
import { Target, Filter, Plus, CheckCircle2, Zap, Trash2, Sparkles, Loader2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import Link from "next/link";

export default function MissionsPage() {
  const {
    missions,
    completeMission,
    deleteMission,
    setActiveMissionId,
    triggerAIMissionGeneration,
    isAiGenerating,
  } = useApp();

  const [activeTab, setActiveTab] = useState<"all" | "high" | "completed">("all");
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // AI Modal inputs
  const [selectedCourse, setSelectedCourse] = useState("CS301");
  const [hours, setHours] = useState(3);

  const filteredMissions = missions.filter((m) => {
    if (activeTab === "high") return m.priority === "high" && m.status !== "completed";
    if (activeTab === "completed") return m.status === "completed";
    return true;
  });

  const handleGenerateAI = async () => {
    await triggerAIMissionGeneration({
      courses: [selectedCourse],
      hoursAvailable: hours,
      urgency: "normal",
    });
    setIsAiModalOpen(false);
  };

  return (
    <PageContainer
      title="Missions"
      description="AI-prioritized study missions structured by course syllabus, deadline urgency, and difficulty."
      icon={<Target className="w-5 h-5" />}
      badge={`${missions.filter((m) => m.status === "pending").length} Pending`}
      badgeType="indigo"
      actionSlot={
        <button
          onClick={() => setIsAiModalOpen(true)}
          className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Generate AI Study Plan</span>
        </button>
      }
    >
      <div className="space-y-4">
        {/* Filter Bar */}
        <div className="flex items-center justify-between bg-[#121821] border border-[#1E2638] p-3 rounded-xl">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === "all"
                  ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              All Missions ({missions.length})
            </button>

            <button
              onClick={() => setActiveTab("high")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === "high"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              High Priority ({missions.filter((m) => m.priority === "high" && m.status !== "completed").length})
            </button>

            <button
              onClick={() => setActiveTab("completed")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === "completed"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Completed ({missions.filter((m) => m.status === "completed").length})
            </button>
          </div>

          <div className="text-xs text-zinc-500 font-medium hidden sm:block">
            Syllabus Weighted Priority
          </div>
        </div>

        {/* Mission Cards List */}
        <div className="space-y-3">
          {filteredMissions.map((m) => (
            <div
              key={m.id}
              className={`bg-[#121821] border rounded-xl p-5 transition-all space-y-3 ${
                m.status === "completed"
                  ? "border-[#1E2638] opacity-60 bg-[#0B0F14]/40"
                  : "border-[#1E2638] hover:border-[#2A364F]"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      {m.course}
                    </span>
                    <h3
                      className={`font-bold text-base ${
                        m.status === "completed" ? "line-through text-zinc-400" : "text-zinc-100"
                      }`}
                    >
                      {m.title}
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">{m.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                      m.priority === "high"
                        ? "text-amber-400 bg-amber-500/10 border border-amber-500/30"
                        : "text-zinc-400 bg-[#1E2638]"
                    }`}
                  >
                    {m.priority}
                  </span>

                  <button
                    onClick={() => deleteMission(m.id)}
                    className="p-1.5 text-zinc-500 hover:text-red-400 rounded hover:bg-[#1E2638]"
                    title="Delete Mission"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-[#1E2638] text-xs text-zinc-400 gap-2">
                <div className="flex items-center gap-4 flex-wrap">
                  <span>⏱️ Est. {m.estimatedMinutes} mins</span>
                  <span className="text-indigo-300">⚡ +{m.xpReward} XP</span>
                  <span className="text-emerald-400">🎯 Syllabus: {m.syllabusCoverage}%</span>
                </div>

                <div className="flex items-center gap-2">
                  {m.status === "completed" ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Completed
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => completeMission(m.id)}
                        className="px-3 py-1.5 rounded-lg bg-[#1E2638] hover:bg-[#2A364F] text-zinc-200 font-semibold text-xs transition-colors cursor-pointer"
                      >
                        Mark Done (+{m.xpReward} XP)
                      </button>

                      <Link
                        href="/focus"
                        onClick={() => setActiveMissionId(m.id)}
                        className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        <span>Start Mission</span>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Generator Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121821] border border-[#1E2638] rounded-2xl p-6 max-w-md w-full space-y-4 text-zinc-100 shadow-2xl">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-bold">Generate AI Study Missions</h3>
            </div>

            <p className="text-xs text-zinc-400">
              The AI Planner will analyze course difficulty, exam weight, and available hours to generate targeted missions.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Target Course</label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#0B0F14] border border-[#1E2638] text-zinc-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="CS301">CS301 Algorithms & Data Structures</option>
                  <option value="MATH202">MATH202 Linear Algebra</option>
                  <option value="PHYS101">PHYS101 Mechanics</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Available Study Hours Today</label>
                <input
                  type="number"
                  min={1}
                  max={8}
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg bg-[#0B0F14] border border-[#1E2638] text-zinc-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAiModalOpen(false)}
                className="flex-1 py-2.5 rounded-lg bg-[#0B0F14] border border-[#1E2638] text-zinc-400 hover:text-zinc-200 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGenerateAI}
                disabled={isAiGenerating}
                className="flex-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5"
              >
                {isAiGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Synthesizing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run AI Generator</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
