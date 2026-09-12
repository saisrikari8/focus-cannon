"use client";

import { useState } from "react";
import { X, Lock, Mail, User as UserIcon, Zap, Loader2, ArrowRight, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { useApp } from "@/context/AppContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signIn, signUp, continueAsGuest, settings } = useApp();

  const [mode, setMode] = useState<"signin" | "signup" | "guest">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const isSupabaseConfigured = Boolean(settings.supabaseUrl && settings.supabaseAnonKey);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === "signin") {
        const err = await signIn(email, password);
        if (err) {
          setErrorMsg(err);
        } else {
          setSuccessMsg(
            isSupabaseConfigured
              ? "Signed in with Supabase!"
              : "Signed in locally! Configure Supabase keys in Settings for cloud sync."
          );
          setTimeout(onClose, 800);
        }
      } else if (mode === "signup") {
        const err = await signUp(email, password, name || "Student Scholar");
        if (err) {
          setErrorMsg(err);
        } else {
          setSuccessMsg(
            isSupabaseConfigured
              ? "Account created in Supabase!"
              : "Local student profile created successfully!"
          );
          setTimeout(onClose, 800);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = () => {
    continueAsGuest();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#121821] border border-[#1E2638] rounded-2xl p-6 max-w-md w-full space-y-4 text-zinc-100 shadow-2xl relative animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-[#0B0F14] border border-[#1E2638] text-zinc-400 hover:text-zinc-100 focus:outline-none"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-100">FOCUS CANNON</h3>
            <p className="text-xs text-zinc-400">Student Productivity & Focus OS</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#0B0F14] p-1 rounded-lg border border-[#1E2638] text-xs font-semibold">
          <button
            onClick={() => {
              setMode("signin");
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-md transition-colors ${
              mode === "signin" ? "bg-indigo-600 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Sign In
          </button>

          <button
            onClick={() => {
              setMode("signup");
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-md transition-colors ${
              mode === "signup" ? "bg-indigo-600 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Sign Up
          </button>

          <button
            onClick={() => {
              setMode("guest");
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-md transition-colors ${
              mode === "guest" ? "bg-indigo-600 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Guest Mode
          </button>
        </div>

        {/* Informational Mode Status Banner */}
        {!isSupabaseConfigured && mode !== "guest" && (
          <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[11px] flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0 text-indigo-400" />
            <span>
              Operating in <strong>Local Mode</strong>. You can sign in locally now, or enter Supabase keys in Settings anytime.
            </span>
          </div>
        )}

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Mode 1 & 2: Sign In / Sign Up Form */}
        {mode !== "guest" ? (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            {mode === "signup" && (
              <div>
                <label className="block text-zinc-400 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Alex Scholar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#0B0F14] border border-[#1E2638] text-zinc-100 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-zinc-400 mb-1">Student Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="email"
                  placeholder="alex@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#0B0F14] border border-[#1E2638] text-zinc-100 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#0B0F14] border border-[#1E2638] text-zinc-100 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition-transform hover:scale-[1.01] disabled:opacity-50 cursor-pointer pt-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>{mode === "signin" ? "Sign In to Account" : "Create Student Account"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Mode 3: Guest Mode */
          <div className="space-y-4 text-xs text-center py-2">
            <p className="text-zinc-300 leading-relaxed">
              Continue instantly with local state storage. No Supabase account required. Your XP, missions, and focus sessions will be saved locally in your browser.
            </p>

            <button
              onClick={handleGuest}
              className="w-full py-3 rounded-xl bg-[#1E2638] hover:bg-[#2A364F] text-zinc-100 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Continue in Guest Mode</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
