"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Target,
  Flame,
  BarChart3,
  Trophy,
  Settings,
  LifeBuoy,
  Zap,
  ShieldCheck,
} from "lucide-react";
import NavItem from "./NavItem";
import { useApp } from "@/context/AppContext";

export const navigationItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/missions", label: "Missions", icon: Target, badge: 3 },
  { href: "/focus", label: "Focus Mode", icon: Flame },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/achievements", label: "Achievements", icon: Trophy },
  { href: "/settings", label: "Settings", icon: Settings },
];

export const emergencyItem = {
  href: "/save-me",
  label: "SAVE ME",
  icon: LifeBuoy,
  isEmergency: true,
};

interface SidebarProps {
  onNavClick?: () => void;
}

export default function Sidebar({ onNavClick }: SidebarProps) {
  const pathname = usePathname();
  const { user, missions } = useApp();

  const pendingMissionsCount = missions.filter((m) => m.status === "pending").length;

  return (
    <aside className="w-64 bg-[#0B0F14] border-r border-[#1E2638] flex flex-col h-full select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-[#1E2638] flex items-center justify-between">
        <Link href="/dashboard" onClick={onNavClick} className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-wide text-zinc-100 font-sans">
                FOCUS CANNON
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 tracking-wider uppercase font-semibold">
              Student Productivity OS
            </p>
          </div>
        </Link>
      </div>

      {/* Emergency Section */}
      <div className="p-3 border-b border-[#1E2638]/60 bg-[#121821]/40">
        <NavItem
          href={emergencyItem.href}
          label={emergencyItem.label}
          icon={emergencyItem.icon}
          isActive={pathname === emergencyItem.href}
          isEmergency={true}
          onClick={onNavClick}
        />
      </div>

      {/* Primary Navigation */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        <div className="px-3 py-1.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
          Main Menu
        </div>
        {navigationItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const badgeValue = item.href === "/missions" ? pendingMissionsCount : item.badge;
          return (
            <NavItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              isActive={isActive}
              badge={badgeValue}
              onClick={onNavClick}
            />
          );
        })}
      </div>

      {/* Gamification / User Level Summary Card */}
      <div className="p-3 border-t border-[#1E2638] bg-[#121821]">
        <div className="p-3 rounded-lg bg-[#0B0F14] border border-[#1E2638] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-xs font-semibold text-zinc-200">
                Level {user.level} {user.levelTitle}
              </span>
            </div>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
              🔥 {user.streakDays} Day Streak
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-zinc-400">
              <span>XP Progress</span>
              <span className="font-medium text-zinc-300">
                {user.xp} / {user.xpToNextLevel}
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#1E2638] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (user.xp / user.xpToNextLevel) * 100)}%` }}
              ></div>
            </div>
          </div>

          {user.streakShieldActive && (
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 pt-0.5">
              <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>Streak Shield Active</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
