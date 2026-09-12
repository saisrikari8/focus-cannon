"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  UserProfile,
  Mission,
  CalendarEvent,
  FocusSession,
  Badge,
  AppSettings,
  AIInsightReport,
} from "@/lib/types";
import { generateAIStudyMissions, generateAIWeeklyReport, AIPlanRequest } from "@/lib/groq";
import {
  syncUserProfileToSupabase,
  saveMissionToSupabase,
  logFocusSessionToSupabase,
  signInWithSupabase,
  signUpWithSupabase,
  signOutWithSupabase,
  getCurrentSupabaseUser,
} from "@/lib/supabase";

interface AppContextType {
  user: UserProfile;
  missions: Mission[];
  calendarEvents: CalendarEvent[];
  focusSessions: FocusSession[];
  badges: Badge[];
  settings: AppSettings;
  activeMissionId: string | null;
  aiReport: AIInsightReport | null;
  isAiGenerating: boolean;
  isAuthenticated: boolean;
  isGuest: boolean;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  setActiveMissionId: (id: string | null) => void;
  addMission: (mission: Omit<Mission, "id" | "createdAt">) => void;
  completeMission: (id: string) => void;
  deleteMission: (id: string) => void;
  triggerAIMissionGeneration: (request: AIPlanRequest) => Promise<void>;
  addCalendarEvent: (event: Omit<CalendarEvent, "id">) => void;
  syncGoogleCalendar: () => Promise<number>;
  recordFocusSession: (session: {
    durationMinutes: number;
    course: string;
    missionTitle?: string;
    distractionsBlocked: number;
    mode: "pomodoro" | "deep_work" | "sprint";
  }) => void;
  generateWeeklyReport: () => Promise<void>;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  claimXP: (amount: number) => void;
  signIn: (e: string, p: string) => Promise<string | null>;
  signUp: (e: string, p: string, n: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  continueAsGuest: () => void;
}

const initialProfile: UserProfile = {
  name: "Alex Scholar",
  email: "alex@university.edu",
  level: 5,
  levelTitle: "Focus Tactician",
  xp: 1450,
  xpToNextLevel: 2000,
  streakDays: 4,
  streakShieldActive: true,
  focusMinutesToday: 165,
  focusGoalMinutes: 240,
  totalFocusMinutes: 1110,
  totalXp: 9450,
  distractionsBlockedToday: 18,
};

const initialMissions: Mission[] = [
  {
    id: "m-1",
    course: "CS301",
    title: "Dynamic Programming & Graph Traversal",
    description: "Review Memoization tables, Dijkstra algorithm, and solve 3 LeetCode medium problems.",
    estimatedMinutes: 45,
    xpReward: 150,
    priority: "high",
    status: "pending",
    syllabusCoverage: 85,
    createdAt: new Date().toISOString(),
  },
  {
    id: "m-2",
    course: "MATH202",
    title: "Eigenvalues & Eigenvectors Problem Set",
    description: "Complete questions 1 to 8 from Chapter 4 revision set.",
    estimatedMinutes: 60,
    xpReward: 200,
    priority: "medium",
    status: "pending",
    syllabusCoverage: 70,
    createdAt: new Date().toISOString(),
  },
  {
    id: "m-3",
    course: "PHYS101",
    title: "Rotational Kinematics Lab Analysis",
    description: "Graph torque vs angular acceleration from Tuesday lab data.",
    estimatedMinutes: 30,
    xpReward: 100,
    priority: "low",
    status: "pending",
    syllabusCoverage: 60,
    createdAt: new Date().toISOString(),
  },
];

const initialCalendarEvents: CalendarEvent[] = [
  {
    id: "e-1",
    title: "CS301 Midterm Exam",
    course: "CS301 Algorithms",
    date: "2026-09-14",
    time: "10:00 AM",
    type: "exam",
    status: "upcoming",
  },
  {
    id: "e-2",
    title: "MATH202 Problem Set 4 Due",
    course: "MATH202 Linear Algebra",
    date: "2026-09-16",
    time: "11:59 PM",
    type: "assignment",
    status: "upcoming",
  },
  {
    id: "e-3",
    title: "PHYS101 Lab Quiz",
    course: "PHYS101 Physics",
    date: "2026-09-18",
    time: "02:00 PM",
    type: "exam",
    status: "upcoming",
  },
];

const initialBadges: Badge[] = [
  {
    id: "b-1",
    title: "Ignition Streak",
    description: "Maintained a 3-day consecutive focus streak.",
    iconName: "Flame",
    unlocked: true,
    unlockedAt: "2026-09-10",
    progress: 4,
    target: 3,
  },
  {
    id: "b-2",
    title: "Deep Work Master",
    description: "Completed 10 focus blocks with zero distractions.",
    iconName: "Award",
    unlocked: true,
    unlockedAt: "2026-09-11",
    progress: 10,
    target: 10,
  },
  {
    id: "b-3",
    title: "Exam Destroyer",
    description: "Complete 5 study missions with >80% syllabus coverage.",
    iconName: "Lock",
    unlocked: false,
    progress: 2,
    target: 5,
  },
  {
    id: "b-4",
    title: "Century Club",
    description: "Accumulate 100 total hours of focus session time.",
    iconName: "Star",
    unlocked: false,
    progress: 18.5,
    target: 100,
  },
];

const initialSettings: AppSettings = {
  pomodoroMinutes: 25,
  breakMinutes: 5,
  streakShieldAuto: true,
  supabaseUrl: "",
  supabaseAnonKey: "",
  groqApiKey: "",
  allowlistApps: ["VS Code", "Notion", "Obsidian", "Terminal"],
  blocklistSites: ["youtube.com", "reddit.com", "x.com", "facebook.com", "instagram.com"],
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(initialProfile);
  const [missions, setMissions] = useState<Mission[]>(initialMissions);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(initialCalendarEvents);
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>([]);
  const [badges, setBadges] = useState<Badge[]>(initialBadges);
  const [settings, setSettings] = useState<AppSettings>(initialSettings);
  const [activeMissionId, setActiveMissionId] = useState<string | null>("m-1");
  const [aiReport, setAiReport] = useState<AIInsightReport | null>(null);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Load state from localStorage & check Supabase Auth on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("fc_user");
      if (savedUser) setUser(JSON.parse(savedUser));

      const savedMissions = localStorage.getItem("fc_missions");
      if (savedMissions) setMissions(JSON.parse(savedMissions));

      const savedEvents = localStorage.getItem("fc_events");
      if (savedEvents) setCalendarEvents(JSON.parse(savedEvents));

      const savedSessions = localStorage.getItem("fc_sessions");
      if (savedSessions) setFocusSessions(JSON.parse(savedSessions));

      const savedSettings = localStorage.getItem("fc_settings");
      if (savedSettings) setSettings(JSON.parse(savedSettings));

      const savedAuth = localStorage.getItem("fc_auth");
      if (savedAuth === "true") {
        setIsAuthenticated(true);
        setIsGuest(false);
      }
    } catch (e) {}

    // Check Supabase Auth User if configured
    getCurrentSupabaseUser().then((sbUser) => {
      if (sbUser) {
        setIsAuthenticated(true);
        setIsGuest(false);
        setUser((prev) => ({
          ...prev,
          email: sbUser.email || prev.email,
          name: sbUser.user_metadata?.name || sbUser.email?.split("@")[0] || prev.name,
        }));
      }
    });
  }, []);

  // Save changes to localStorage & try Supabase sync
  useEffect(() => {
    try {
      localStorage.setItem("fc_user", JSON.stringify(user));
      syncUserProfileToSupabase(user);
    } catch (e) {}
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem("fc_missions", JSON.stringify(missions));
    } catch (e) {}
  }, [missions]);

  useEffect(() => {
    try {
      localStorage.setItem("fc_events", JSON.stringify(calendarEvents));
    } catch (e) {}
  }, [calendarEvents]);

  useEffect(() => {
    try {
      localStorage.setItem("fc_sessions", JSON.stringify(focusSessions));
    } catch (e) {}
  }, [focusSessions]);

  useEffect(() => {
    try {
      localStorage.setItem("fc_settings", JSON.stringify(settings));
    } catch (e) {}
  }, [settings]);

  // Auth Methods with Local Fallback support
  const signIn = async (email: string, pass: string): Promise<string | null> => {
    const { user: sbUser, error } = await signInWithSupabase(email, pass);

    if (error && !error.includes("not configured")) {
      return error;
    }

    setIsAuthenticated(true);
    setIsGuest(false);
    localStorage.setItem("fc_auth", "true");
    setUser((prev) => ({
      ...prev,
      email: sbUser?.email || email || prev.email,
      name: sbUser?.user_metadata?.name || (email ? email.split("@")[0] : prev.name),
    }));

    return null;
  };

  const signUp = async (email: string, pass: string, name: string): Promise<string | null> => {
    const { user: sbUser, error } = await signUpWithSupabase(email, pass, name);

    if (error && !error.includes("not configured")) {
      return error;
    }

    setIsAuthenticated(true);
    setIsGuest(false);
    localStorage.setItem("fc_auth", "true");
    setUser((prev) => ({
      ...prev,
      email: sbUser?.email || email || prev.email,
      name: name || (email ? email.split("@")[0] : prev.name),
    }));

    return null;
  };

  const signOut = async () => {
    await signOutWithSupabase();
    setIsAuthenticated(false);
    setIsGuest(true);
    localStorage.removeItem("fc_auth");
  };

  const continueAsGuest = () => {
    setIsAuthenticated(false);
    setIsGuest(true);
    localStorage.removeItem("fc_auth");
  };

  // XP & Level calculations
  const claimXP = (amount: number) => {
    setUser((prev) => {
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      let newTarget = prev.xpToNextLevel;

      if (newXp >= newTarget) {
        newLevel += 1;
        newXp -= newTarget;
        newTarget = Math.floor(newTarget * 1.25);
      }

      return {
        ...prev,
        level: newLevel,
        xp: newXp,
        xpToNextLevel: newTarget,
        totalXp: prev.totalXp + amount,
      };
    });
  };

  const addMission = (m: Omit<Mission, "id" | "createdAt">) => {
    const newMission: Mission = {
      ...m,
      id: `m-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setMissions((prev) => [newMission, ...prev]);
    saveMissionToSupabase(newMission);
  };

  const completeMission = (id: string) => {
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === id && m.status !== "completed") {
          claimXP(m.xpReward);
          return { ...m, status: "completed" };
        }
        return m;
      })
    );
  };

  const deleteMission = (id: string) => {
    setMissions((prev) => prev.filter((m) => m.id !== id));
    if (activeMissionId === id) setActiveMissionId(null);
  };

  const triggerAIMissionGeneration = async (request: AIPlanRequest) => {
    setIsAiGenerating(true);
    try {
      const generated = await generateAIStudyMissions(request, settings.groqApiKey);
      setMissions((prev) => [...generated, ...prev]);
      generated.forEach((m) => saveMissionToSupabase(m));
    } finally {
      setIsAiGenerating(false);
    }
  };

  const addCalendarEvent = (event: Omit<CalendarEvent, "id">) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: `e-${Date.now()}`,
    };
    setCalendarEvents((prev) => [newEvent, ...prev]);
  };

  const syncGoogleCalendar = async (): Promise<number> => {
    const syncedEvents: CalendarEvent[] = [
      {
        id: `e-gcal-${Date.now()}-1`,
        title: "CS301 Final Project Submission",
        course: "CS301 Algorithms",
        date: "2026-09-22",
        time: "11:59 PM",
        type: "assignment",
        status: "upcoming",
      },
    ];

    setCalendarEvents((prev) => [...syncedEvents, ...prev]);

    addMission({
      course: "CS301 Algorithms",
      title: "Final Project Code Optimization",
      description: "Auto-synced from Google Calendar deadline.",
      estimatedMinutes: 60,
      xpReward: 250,
      priority: "high",
      status: "pending",
      syllabusCoverage: 90,
    });

    return 1;
  };

  const recordFocusSession = (sessionData: {
    durationMinutes: number;
    course: string;
    missionTitle?: string;
    distractionsBlocked: number;
    mode: "pomodoro" | "deep_work" | "sprint";
  }) => {
    const xpEarned = sessionData.durationMinutes * 3 + sessionData.distractionsBlocked * 5;
    const newSession: FocusSession = {
      id: `s-${Date.now()}`,
      timestamp: new Date().toISOString(),
      xpEarned,
      ...sessionData,
    };

    setFocusSessions((prev) => [newSession, ...prev]);
    logFocusSessionToSupabase(newSession);

    setUser((prev) => ({
      ...prev,
      focusMinutesToday: prev.focusMinutesToday + sessionData.durationMinutes,
      totalFocusMinutes: prev.totalFocusMinutes + sessionData.durationMinutes,
      distractionsBlockedToday: prev.distractionsBlockedToday + sessionData.distractionsBlocked,
    }));

    claimXP(xpEarned);
  };

  const generateWeeklyReport = async () => {
    setIsAiGenerating(true);
    try {
      const report = await generateAIWeeklyReport(
        focusSessions.length || 8,
        Math.round(user.totalFocusMinutes / 60) || 18,
        settings.groqApiKey
      );
      setAiReport(report);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        missions,
        calendarEvents,
        focusSessions,
        badges,
        settings,
        activeMissionId,
        aiReport,
        isAiGenerating,
        isAuthenticated,
        isGuest,
        authModalOpen,
        setAuthModalOpen,
        setActiveMissionId,
        addMission,
        completeMission,
        deleteMission,
        triggerAIMissionGeneration,
        addCalendarEvent,
        syncGoogleCalendar,
        recordFocusSession,
        generateWeeklyReport,
        updateSettings,
        claimXP,
        signIn,
        signUp,
        signOut,
        continueAsGuest,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};
