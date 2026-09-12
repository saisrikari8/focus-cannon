export type PriorityLevel = "high" | "medium" | "low";
export type MissionStatus = "pending" | "active" | "completed";
export type EventType = "exam" | "assignment" | "focus_block" | "lecture";

export interface UserProfile {
  name: string;
  email: string;
  level: number;
  levelTitle: string;
  xp: number;
  xpToNextLevel: number;
  streakDays: number;
  streakShieldActive: boolean;
  focusMinutesToday: number;
  focusGoalMinutes: number;
  totalFocusMinutes: number;
  totalXp: number;
  distractionsBlockedToday: number;
}

export interface Mission {
  id: string;
  course: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  xpReward: number;
  priority: PriorityLevel;
  status: MissionStatus;
  syllabusCoverage: number;
  deadline?: string;
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  course: string;
  date: string;
  time: string;
  type: EventType;
  status: "upcoming" | "completed";
}

export interface FocusSession {
  id: string;
  timestamp: string;
  durationMinutes: number;
  course: string;
  missionTitle?: string;
  distractionsBlocked: number;
  xpEarned: number;
  mode: "pomodoro" | "deep_work" | "sprint";
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  target: number;
}

export interface AppSettings {
  pomodoroMinutes: number;
  breakMinutes: number;
  streakShieldAuto: boolean;
  supabaseUrl: string;
  supabaseAnonKey: string;
  groqApiKey: string;
  allowlistApps: string[];
  blocklistSites: string[];
}

export interface AIInsightReport {
  generatedAt: string;
  summary: string;
  peakFocusWindow: string;
  recommendedFocusHours: string;
  weakTopics: string[];
  focusScore: number;
}
