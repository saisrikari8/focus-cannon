"use client";

import PageContainer from "@/components/layout/PageContainer";
import { LayoutDashboard, Target, Zap, Clock, ShieldAlert, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";

export default function DashboardPage() {
  const { user, missions, completeMission, setActiveMissionId } = useApp();

  const activeMission = missions.find((m) => m.status === "pending") || missions[0];
  const completedMissionsCount = missions.filter((m) => m.status === "completed").length;

  return (
    <PageContainer
      title="Dashboard"
      description={`Welcome back, ${user.name}. Here is your academic focus overview, priority mission, and current streak.`}
      icon={<LayoutDashboard className="w-5 h-5" />}
      badge={`Level ${user.level} ${user.levelTitle}`}
      badgeType="indigo"
      actionSlot={
        <Link
          href="/focus"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02]"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>Launch Focus Mode</span>
        </Link>
      }
    >
      {/* Overview Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Recommended Priority Mission Card */}
        {activeMission ? (
          <div className="md:col-span-2 bg-[#121821] border border-[#1E2638] rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E2638] pb-3">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
                <Target className="w-4 h-4" />
                <span>Recommended Next Step</span>
              </div>
              <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-medium uppercase">
                {activeMission.priority} Priority
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  {activeMission.course}
                </span>
                <h3 className="text-lg font-bold text-zinc-100">{activeMission.title}</h3>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">{activeMission.description}</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#1E2638]/60 text-xs text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-zinc-500" /> {activeMission.estimatedMinutes} Mins Recommended
              </span>
              <div className="flex items-center gap-3">
                <span className="text-indigo-400 font-medium">+{activeMission.xpReward} XP Reward</span>
                <Link
                  href="/focus"
                  onClick={() => setActiveMissionId(activeMission.id)}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Start Mission</span>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="md:col-span-2 bg-[#121821] border border-[#1E2638] rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-2">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
            <h3 className="font-bold text-zinc-100">All Missions Completed!</h3>
            <p className="text-xs text-zinc-400">Great job clearing your study list for today.</p>
          </div>
        )}

        {/* SAVE ME Quick Access Box */}
        <div className="bg-gradient-to-br from-red-950/30 via-[#121821] to-[#121821] border border-red-500/30 rounded-xl p-6 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
              <ShieldAlert className="w-4 h-4" />
              <span>Behind Schedule?</span>
            </div>
            <p className="text-xs text-zinc-300">
              Falling behind on deadlines? Trigger Recovery Mode for an instant AI catch-up plan.
            </p>
          </div>

          <Link
            href="/save-me"
            className="inline-flex items-center justify-between w-full px-3.5 py-2 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300 hover:bg-red-900/40 font-semibold text-xs transition-colors"
          >
            <span>Activate SAVE ME</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Live Module Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
        <div className="bg-[#121821] border border-[#1E2638] p-5 rounded-xl space-y-2">
          <span className="text-xs font-medium text-zinc-400">Today&apos;s Focus Goal</span>
          <div className="text-2xl font-bold text-zinc-100">
            {Math.floor(user.focusMinutesToday / 60)}h {user.focusMinutesToday % 60}m / {user.focusGoalMinutes / 60}h
          </div>
          <div className="w-full bg-[#1E2638] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-500 h-full transition-all duration-300"
              style={{ width: `${Math.min(100, (user.focusMinutesToday / user.focusGoalMinutes) * 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-[#121821] border border-[#1E2638] p-5 rounded-xl space-y-2">
          <span className="text-xs font-medium text-zinc-400">Active Streak</span>
          <div className="text-2xl font-bold text-amber-400">{user.streakDays} Days 🔥</div>
          <span className="text-[11px] text-emerald-400">
            {user.streakShieldActive ? "Streak Shield Active" : "Shield Available"}
          </span>
        </div>

        <div className="bg-[#121821] border border-[#1E2638] p-5 rounded-xl space-y-2">
          <span className="text-xs font-medium text-zinc-400">Missions Completed</span>
          <div className="text-2xl font-bold text-emerald-400">
            {completedMissionsCount} / {missions.length}
          </div>
          <span className="text-[11px] text-zinc-400">
            {missions.length ? Math.round((completedMissionsCount / missions.length) * 100) : 0}% completion rate
          </span>
        </div>

        <div className="bg-[#121821] border border-[#1E2638] p-5 rounded-xl space-y-2">
          <span className="text-xs font-medium text-zinc-400">Distractions Intercepted</span>
          <div className="text-2xl font-bold text-purple-400">{user.distractionsBlockedToday} Attempted</div>
          <span className="text-[11px] text-purple-300">Shield Protection Enabled</span>
        </div>
      </div>
    </PageContainer>
  );
}
