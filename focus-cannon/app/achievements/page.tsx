"use client";

import PageContainer from "@/components/layout/PageContainer";
import { Trophy, ShieldCheck, Flame, Award, Lock, Star, Zap } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function AchievementsPage() {
  const { user, badges, claimXP } = useApp();

  const percentage = Math.min(100, Math.round((user.xp / user.xpToNextLevel) * 100));

  return (
    <PageContainer
      title="Achievements"
      description="Track your level progression, XP milestones, streak shields, and earned productivity badges."
      icon={<Trophy className="w-5 h-5" />}
      badge={`Level ${user.level} ${user.levelTitle}`}
      badgeType="warning"
      actionSlot={
        <button
          onClick={() => claimXP(50)}
          className="px-3.5 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>Claim Daily Reward (+50 XP)</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* Level Progression Banner */}
        <div className="bg-[#121821] border border-[#1E2638] rounded-xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                Current Status
              </div>
              <h3 className="text-2xl font-extrabold text-zinc-100 flex items-center gap-2">
                Level {user.level}: {user.levelTitle}
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center gap-1.5">
                <Flame className="w-4 h-4" /> {user.streakDays}-Day Streak
              </div>
              {user.streakShieldActive && (
                <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Shield Active
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-zinc-400">
              <span>{user.xp} XP earned</span>
              <span className="font-semibold text-zinc-200">
                {user.xpToNextLevel - user.xp} XP to Level {user.level + 1}
              </span>
            </div>
            <div className="w-full bg-[#1E2638] h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 via-indigo-500 to-purple-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-zinc-100">Badges & Productivity Milestones</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {badges.map((b) => (
              <div
                key={b.id}
                className={`border rounded-xl p-4 space-y-2 flex flex-col items-center text-center transition-all ${
                  b.unlocked
                    ? "bg-[#121821] border-amber-500/30 shadow-md shadow-amber-900/10"
                    : "bg-[#121821]/60 border-[#1E2638] opacity-60"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full border flex items-center justify-center ${
                    b.unlocked
                      ? "bg-amber-500/10 border-amber-500/40 text-amber-400"
                      : "bg-[#1E2638] border-transparent text-zinc-500"
                  }`}
                >
                  {b.iconName === "Flame" ? (
                    <Flame className="w-6 h-6" />
                  ) : b.iconName === "Award" ? (
                    <Award className="w-6 h-6" />
                  ) : b.iconName === "Star" ? (
                    <Star className="w-6 h-6" />
                  ) : (
                    <Lock className="w-5 h-5" />
                  )}
                </div>

                <div className="font-bold text-sm text-zinc-100">{b.title}</div>
                <p className="text-[11px] text-zinc-400">{b.description}</p>

                <div className="pt-1">
                  {b.unlocked ? (
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      UNLOCKED
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-zinc-500 bg-[#1E2638] px-2 py-0.5 rounded">
                      {b.progress} / {b.target}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
