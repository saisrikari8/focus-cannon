"use client";

import { useState } from "react";
import PageContainer from "@/components/layout/PageContainer";
import {
  Settings as SettingsIcon,
  Database,
  Cpu,
  Calendar,
  Shield,
  Save,
  Check,
  User,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function SettingsPage() {
  const { user, settings, updateSettings } = useApp();

  // Student Profile
  const [userName, setUserName] = useState(user.name || "Alex Scholar");
  const [userEmail, setUserEmail] = useState(user.email || "alex@university.edu");

  // Timer & Focus Rules
  const [pomodoroMinutes, setPomodoroMinutes] = useState(settings.pomodoroMinutes || 25);
  const [breakMinutes, setBreakMinutes] = useState(settings.breakMinutes || 5);
  const [streakShieldAuto, setStreakShieldAuto] = useState(settings.streakShieldAuto ?? true);

  // Advanced / Integrations
  const [supabaseUrl, setSupabaseUrl] = useState(settings.supabaseUrl || "");
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(settings.supabaseAnonKey || "");
  const [groqApiKey, setGroqApiKey] = useState(settings.groqApiKey || "");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      pomodoroMinutes: Number(pomodoroMinutes),
      breakMinutes: Number(breakMinutes),
      supabaseUrl,
      supabaseAnonKey,
      groqApiKey,
      streakShieldAuto,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <PageContainer
      title="Settings"
      description="Customize your study profile, focus timer preferences, distraction shield rules, and optional cloud integrations."
      icon={<SettingsIcon className="w-5 h-5" />}
      actionSlot={
        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
        >
          {savedSuccess ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Preferences Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>Save Preferences</span>
            </>
          )}
        </button>
      }
    >
      <form onSubmit={handleSave} className="space-y-6">
        {/* Student Reassurance Banner */}
        <div className="bg-gradient-to-r from-indigo-950/40 via-[#121821] to-purple-950/30 border border-indigo-500/30 rounded-xl p-5 space-y-2 relative overflow-hidden">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Zero Setup Required for Students</span>
          </div>

          <p className="text-xs text-zinc-300 max-w-3xl leading-relaxed">
            Focus Cannon is ready out-of-the-box! Your study missions, focus timers, XP, and badges save automatically in your browser. API keys and cloud databases below are completely optional for advanced users.
          </p>

          <div className="flex items-center gap-4 text-[11px] pt-1 text-zinc-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <Check className="w-3.5 h-3.5 text-emerald-400" /> Local Student Storage Active
            </span>
            <span className="flex items-center gap-1 text-indigo-300">
              <Check className="w-3.5 h-3.5 text-indigo-400" /> Built-in AI Planner Active
            </span>
          </div>
        </div>

        {/* Section 1: Student Profile */}
        <div className="bg-[#121821] border border-[#1E2638] rounded-xl p-6 space-y-4">
          <h3 className="font-bold text-sm text-zinc-100 border-b border-[#1E2638] pb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-400" />
            <span>Student Profile</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-zinc-400 mb-1">Student Display Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[#0B0F14] border border-[#1E2638] text-zinc-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">Student Email Address</label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[#0B0F14] border border-[#1E2638] text-zinc-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Focus Timer & Study Preferences */}
        <div className="bg-[#121821] border border-[#1E2638] rounded-xl p-6 space-y-4">
          <h3 className="font-bold text-sm text-zinc-100 border-b border-[#1E2638] pb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-400" />
            <span>Focus Timer & Study Preferences</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-[#1E2638] gap-2">
              <div>
                <div className="font-semibold text-zinc-200">Pomodoro Focus Block Duration</div>
                <div className="text-zinc-500">Standard focus timer length before taking a break</div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={15}
                  max={90}
                  value={pomodoroMinutes}
                  onChange={(e) => setPomodoroMinutes(Number(e.target.value))}
                  className="w-24 p-2 rounded-lg bg-[#0B0F14] border border-[#1E2638] text-center text-zinc-100 focus:outline-none focus:border-indigo-500 font-bold"
                />
                <span className="text-zinc-400">minutes</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-[#1E2638] gap-2">
              <div>
                <div className="font-semibold text-zinc-200">Short Break Duration</div>
                <div className="text-zinc-500">Rest duration between focus sessions</div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={3}
                  max={30}
                  value={breakMinutes}
                  onChange={(e) => setBreakMinutes(Number(e.target.value))}
                  className="w-24 p-2 rounded-lg bg-[#0B0F14] border border-[#1E2638] text-center text-zinc-100 focus:outline-none focus:border-indigo-500 font-bold"
                />
                <span className="text-zinc-400">minutes</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 gap-2">
              <div>
                <div className="font-semibold text-zinc-200">Automatic Streak Shield Protection</div>
                <div className="text-zinc-500">
                  Automatically consumes a streak shield if you miss a daily study goal to protect your streak.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStreakShieldAuto(!streakShieldAuto)}
                className={`px-3.5 py-1.5 rounded-lg border font-semibold transition-colors cursor-pointer shrink-0 ${
                  streakShieldAuto
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : "bg-[#0B0F14] text-zinc-400 border-[#1E2638]"
                }`}
              >
                {streakShieldAuto ? "Shield Protection Enabled" : "Shield Protection Disabled"}
              </button>
            </div>
          </div>
        </div>

        {/* Section 3: Advanced Cloud & AI Connections (Optional) */}
        <div className="bg-[#121821] border border-[#1E2638] rounded-xl p-6 space-y-4">
          <div
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center justify-between cursor-pointer select-none"
          >
            <div>
              <h3 className="font-bold text-sm text-zinc-100 flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-400" />
                <span>Cloud Sync & Custom AI Keys (Advanced / Optional)</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Optional credentials for team database backups and custom Groq AI keys.
              </p>
            </div>

            <button
              type="button"
              className="p-2 rounded-lg bg-[#0B0F14] border border-[#1E2638] text-zinc-400 hover:text-zinc-200"
            >
              {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-3 border-t border-[#1E2638]">
              {/* Supabase Config */}
              <div className="p-4 rounded-lg bg-[#0B0F14] border border-[#1E2638] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold text-zinc-200">
                    <Database className="w-4 h-4 text-emerald-400" />
                    <span>Supabase Cloud Sync</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      supabaseUrl ? "bg-emerald-500/10 text-emerald-400" : "bg-[#1E2638] text-zinc-400"
                    }`}
                  >
                    {supabaseUrl ? "CONNECTED" : "LOCAL MODE (ACTIVE)"}
                  </span>
                </div>

                <p className="text-[11px] text-zinc-400">
                  Connect a Supabase project to back up your study sessions across multiple laptops.
                </p>

                <div>
                  <label className="block text-zinc-400 mb-1">Supabase URL</label>
                  <input
                    type="text"
                    placeholder="https://xyz.supabase.co"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[#121821] border border-[#1E2638] text-zinc-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Supabase Anon Key</label>
                  <input
                    type="password"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5c..."
                    value={supabaseAnonKey}
                    onChange={(e) => setSupabaseAnonKey(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[#121821] border border-[#1E2638] text-zinc-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Groq AI Config */}
              <div className="p-4 rounded-lg bg-[#0B0F14] border border-[#1E2638] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold text-zinc-200">
                    <Cpu className="w-4 h-4 text-purple-400" />
                    <span>Custom Groq AI Key</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      groqApiKey ? "bg-purple-500/10 text-purple-400" : "bg-[#1E2638] text-zinc-400"
                    }`}
                  >
                    {groqApiKey ? "CUSTOM KEY ACTIVE" : "BUILT-IN AI (ACTIVE)"}
                  </span>
                </div>

                <p className="text-[11px] text-zinc-400">
                  By default, built-in AI handles study planning. Add your own Groq API key for custom quota limits.
                </p>

                <div>
                  <label className="block text-zinc-400 mb-1">Groq API Key</label>
                  <input
                    type="password"
                    placeholder="gsk_..."
                    value={groqApiKey}
                    onChange={(e) => setGroqApiKey(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[#121821] border border-[#1E2638] text-zinc-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
    </PageContainer>
  );
}
