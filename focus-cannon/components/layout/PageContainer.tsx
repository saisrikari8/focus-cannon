import React from "react";

interface PageContainerProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  badge?: string;
  badgeType?: "default" | "success" | "warning" | "danger" | "indigo";
  actionSlot?: React.ReactNode;
  children?: React.ReactNode;
}

export default function PageContainer({
  title,
  description,
  icon,
  badge,
  badgeType = "indigo",
  actionSlot,
  children,
}: PageContainerProps) {
  const badgeStyles = {
    default: "bg-zinc-800 text-zinc-300 border-zinc-700",
    indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    danger: "bg-red-500/10 text-red-400 border-red-500/30",
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header Banner Card */}
      <div className="bg-[#121821] border border-[#1E2638] rounded-xl p-6 shadow-sm relative overflow-hidden">
        {/* Background glow subtle accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              {icon && (
                <div className="p-2 rounded-lg bg-[#1E2638] text-indigo-400 border border-[#2A364F]">
                  {icon}
                </div>
              )}
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 tracking-tight">
                {title}
              </h2>
              {badge && (
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${badgeStyles[badgeType]}`}
                >
                  {badge}
                </span>
              )}
            </div>
            <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
              {description}
            </p>
          </div>

          {actionSlot && <div className="shrink-0">{actionSlot}</div>}
        </div>
      </div>

      {/* Main Content Area */}
      <div>{children}</div>
    </div>
  );
}
