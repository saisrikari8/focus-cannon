"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import {
  Play,
  Pause,
  RotateCcw,
  ShieldCheck,
  Lock,
  Flame,
  CheckCircle,
  Sliders,
  Sparkles,
  Volume2,
  AlertOctagon,
} from "lucide-react";

export default function FocusEngine() {
  const { missions, activeMissionId, recordFocusSession, settings } = useApp();

  const [selectedMode, setSelectedMode] = useState<"pomodoro" | "deep_work" | "sprint">("pomodoro");
  const [secondsLeft, setSecondsLeft] = useState(settings.pomodoroMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [distractionsBlocked, setDistractionsBlocked] = useState(0);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);

  const activeMission = missions.find((m) => m.id === activeMissionId) || missions[0];

  useEffect(() => {
    let initialMins = 25;
    if (selectedMode === "deep_work") initialMins = 45;
    if (selectedMode === "sprint") initialMins = 15;
    if (selectedMode === "pomodoro") initialMins = settings.pomodoroMinutes || 25;

    setSecondsLeft(initialMins * 60);
    setIsRunning(false);
  }, [selectedMode, settings.pomodoroMinutes]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && secondsLeft === 0) {
      setIsRunning(false);
      handleFinishSession();
    }
    return () => clearInterval(timer);
  }, [isRunning, secondsLeft]);

  const handleFinishSession = () => {
    let mins = 25;
    if (selectedMode === "deep_work") mins = 45;
    if (selectedMode === "sprint") mins = 15;
    if (selectedMode === "pomodoro") mins = settings.pomodoroMinutes || 25;

    const calculatedXp = mins * 3 + distractionsBlocked * 5;
    setEarnedXp(calculatedXp);

    recordFocusSession({
      durationMinutes: mins,
      course: activeMission ? activeMission.course : "General Focus",
      missionTitle: activeMission ? activeMission.title : undefined,
      distractionsBlocked,
      mode: selectedMode,
    });

    setSessionCompleted(true);
  };

  const handleSimulateDistraction = () => {
    setDistractionsBlocked((prev) => prev + 1);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Focus Timer Display Card */}
      <div className="lg:col-span-2 bg-[#121821] border border-[#1E2638] rounded-xl p-8 flex flex-col items-center justify-center space-y-6 text-center shadow-lg relative overflow-hidden">
        {/* Active Shield Indicator */}
        <div className="absolute top-4 left-4 flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-md border border-emerald-500/30 font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Shield Enforcement Active</span>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex gap-2 bg-[#0B0F14] p-1.5 rounded-lg border border-[#1E2638] text-xs font-semibold">
          <button
            onClick={() => setSelectedMode("pomodoro")}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              selectedMode === "pomodoro"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Pomodoro ({settings.pomodoroMinutes}m)
          </button>
          <button
            onClick={() => setSelectedMode("deep_work")}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              selectedMode === "deep_work"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Deep Work (45m)
          </button>
          <button
            onClick={() => setSelectedMode("sprint")}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              selectedMode === "sprint"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Sprint (15m)
          </button>
        </div>

        {/* Active Mission Display */}
        {activeMission && (
          <div className="bg-[#0B0F14] border border-indigo-500/30 rounded-lg px-4 py-2 text-xs max-w-md w-full flex items-center justify-between">
            <div className="flex items-center gap-2 text-left truncate">
              <Flame className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="font-semibold text-zinc-200 truncate">{activeMission.title}</span>
            </div>
            <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded shrink-0">
              {activeMission.course}
            </span>
          </div>
        )}

        {/* Timer Display */}
        <div className="py-4 space-y-1">
          <div className="text-6xl sm:text-8xl font-extrabold tracking-tight text-zinc-100 font-mono select-none">
            {formatTime(secondsLeft)}
          </div>
          <p className="text-xs text-zinc-400">
            {isRunning ? "Focus Block Active • Zero Distractions Allowed" : "Ready to Start Session"}
          </p>
        </div>

        {/* Timer Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setIsRunning(false);
              let initialMins = 25;
              if (selectedMode === "deep_work") initialMins = 45;
              if (selectedMode === "sprint") initialMins = 15;
              if (selectedMode === "pomodoro") initialMins = settings.pomodoroMinutes || 25;
              setSecondsLeft(initialMins * 60);
            }}
            className="p-3.5 rounded-xl bg-[#1E2638] text-zinc-400 hover:text-zinc-200 transition-colors border border-[#2A364F]"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-base shadow-lg shadow-indigo-500/25 flex items-center gap-2.5 transition-transform hover:scale-105"
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-current" />
                <span>Pause Session</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>Start Session</span>
              </>
            )}
          </button>

          {/* Distraction Logger Simulation */}
          <button
            onClick={handleSimulateDistraction}
            className="p-3.5 rounded-xl bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border border-purple-500/30 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            title="Simulate Distraction Intercepted"
          >
            <AlertOctagon className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">Block Attempt ({distractionsBlocked})</span>
          </button>
        </div>
      </div>

      {/* Focus Environment & Rule Controls Sidebar */}
      <div className="bg-[#121821] border border-[#1E2638] rounded-xl p-6 space-y-4">
        <h3 className="font-bold text-sm text-zinc-100 border-b border-[#1E2638] pb-3 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-400" />
            <span>Shield Rule Protection</span>
          </span>
          <span className="text-xs font-bold text-emerald-400">ENFORCING</span>
        </h3>

        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-lg bg-[#0B0F14] border border-[#1E2638] space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-zinc-200">Social Media Blocker</span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 truncate">
              {settings.blocklistSites.slice(0, 3).join(", ")} + {settings.blocklistSites.length - 3} more
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#0B0F14] border border-[#1E2638] space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-zinc-200">App Allowlist</span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                STRICT
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 truncate">{settings.allowlistApps.join(", ")}</p>
          </div>

          <div className="p-3 rounded-lg bg-[#0B0F14] border border-[#1E2638] space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-zinc-200">Distractions Blocked Today</span>
              <span className="text-xs font-bold text-purple-400">{distractionsBlocked} Blocked</span>
            </div>
            <p className="text-[11px] text-zinc-500">Each blocked attempt grants +5 bonus XP upon session finish.</p>
          </div>
        </div>
      </div>

      {/* Session Completion Modal */}
      {sessionCompleted && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121821] border border-indigo-500/40 rounded-2xl p-6 max-w-md w-full space-y-5 text-center shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-zinc-100">Focus Session Complete!</h3>
              <p className="text-xs text-zinc-400">Great work protecting your deep focus time.</p>
            </div>

            <div className="bg-[#0B0F14] border border-[#1E2638] rounded-xl p-4 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>XP Earned</span>
                <span className="font-bold text-indigo-400">+{earnedXp} XP</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Distractions Blocked</span>
                <span className="font-bold text-purple-400">{distractionsBlocked} Attempted</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Streak Maintained</span>
                <span className="font-bold text-amber-400">🔥 Active</span>
              </div>
            </div>

            <button
              onClick={() => setSessionCompleted(false)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs hover:from-indigo-500 hover:to-purple-500 transition-transform hover:scale-[1.02]"
            >
              Claim Rewards & Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
