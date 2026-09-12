"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface NavItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  isEmergency?: boolean;
  badge?: string | number;
  onClick?: () => void;
}

export default function NavItem({
  href,
  label,
  icon: Icon,
  isActive,
  isEmergency = false,
  badge,
  onClick,
}: NavItemProps) {
  if (isEmergency) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={`group relative flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
          isActive
            ? "bg-red-950/40 text-red-300 border border-red-500/50 shadow-md shadow-red-900/20"
            : "bg-red-950/20 text-red-400 border border-red-500/30 hover:bg-red-950/40 hover:text-red-300 hover:border-red-500/50"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <Icon className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          </div>
          <span>{label}</span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider bg-red-500/20 text-red-300 px-2 py-0.5 rounded border border-red-500/30">
          RECOVERY
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
        isActive
          ? "bg-[#1A2230] text-indigo-400 border border-[#2A364F] shadow-sm"
          : "text-zinc-400 hover:text-zinc-200 hover:bg-[#121821]/80"
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon
          className={`w-4 h-4 transition-colors ${
            isActive ? "text-indigo-400" : "text-zinc-500 group-hover:text-zinc-300"
          }`}
        />
        <span>{label}</span>
      </div>
      {badge !== undefined && (
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            isActive
              ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
              : "bg-[#1E2638] text-zinc-400"
          }`}
        >
          {badge}
        </span>
      )}
    </Link>
  );
}
