"use client";

import { usePathname } from "next/navigation";
import { Menu, Flame, Clock, Bell, User as UserIcon, Sparkles, LogIn, LogOut } from "lucide-react";
import { useApp } from "@/context/AppContext";
import AuthModal from "@/components/auth/AuthModal";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": { title: "Dashboard", subtitle: "Today's priority study missions & focus status" },
  "/calendar": { title: "Calendar", subtitle: "Upcoming academic deadlines & study blocks" },
  "/missions": { title: "Missions", subtitle: "AI-prioritized study tasks & syllabus coverage" },
  "/focus": { title: "Focus Mode", subtitle: "Distraction-free timer & app enforcement" },
  "/analytics": { title: "Analytics", subtitle: "Focus trends, heatmap & AI performance reports" },
  "/achievements": { title: "Achievements", subtitle: "Level progression, streaks & earned badges" },
  "/settings": { title: "Settings", subtitle: "Preferences, account & API integrations" },
  "/save-me": { title: "SAVE ME / Recovery Mode", subtitle: "Instant AI emergency catch-up plan" },
};

interface TopbarProps {
  onOpenMobileMenu: () => void;
}

export default function Topbar({ onOpenMobileMenu }: TopbarProps) {
  const pathname = usePathname();
  const { user, isAuthenticated, isGuest, authModalOpen, setAuthModalOpen, signOut } = useApp();

  const pageMeta = pageTitles[pathname] || {
    title: "Focus Cannon",
    subtitle: "Student Productivity Platform",
  };

  const focusHoursToday = (user.focusMinutesToday / 60).toFixed(1);

  return (
    <>
      <header className="h-16 bg-[#0B0F14] border-b border-[#1E2638] px-4 md:px-6 flex items-center justify-between shrink-0 select-none z-10">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3 md:gap-4">
          <button
            onClick={onOpenMobileMenu}
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-[#121821] border border-[#1E2638] md:hidden focus:outline-none focus:ring-1 focus:ring-indigo-500"
            aria-label="Open mobile menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-base md:text-lg font-bold text-zinc-100 flex items-center gap-2">
              {pageMeta.title}
              {pathname === "/save-me" && (
                <span className="text-[10px] font-extrabold text-red-400 bg-red-500/10 border border-red-500/30 px-2 py-0.5 rounded uppercase tracking-wider animate-pulse">
                  Emergency
                </span>
              )}
            </h1>
            <p className="hidden sm:block text-xs text-zinc-400">{pageMeta.subtitle}</p>
          </div>
        </div>

        {/* Right: Status Badges & Auth Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Streak Counter */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#121821] border border-[#1E2638] text-xs font-semibold text-amber-400">
            <Flame className="w-4 h-4 fill-amber-400/20 text-amber-400" />
            <span>{user.streakDays} Days</span>
          </div>

          {/* Daily Focus Time */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#121821] border border-[#1E2638] text-xs font-medium text-indigo-300">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>{focusHoursToday}h Today</span>
          </div>

          {/* AI Quick Assistant Button */}
          <button
            className="p-2 rounded-lg bg-[#121821] border border-[#1E2638] text-zinc-400 hover:text-indigo-300 hover:border-indigo-500/30 transition-colors relative"
            title="AI Assistant"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </button>

          {/* Notifications Icon Button */}
          <button
            className="p-2 rounded-lg bg-[#121821] border border-[#1E2638] text-zinc-400 hover:text-zinc-200 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500"></span>
          </button>

          {/* Auth State Button / Profile Dropdown */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#1E2638]">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="relative" title={user.email}>
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs border border-indigo-400/30 shadow-sm">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#0B0F14]"></span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="p-1.5 rounded-lg bg-[#121821] border border-[#1E2638] text-zinc-400 hover:text-red-400 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-transform hover:scale-105 cursor-pointer shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Interactive Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
