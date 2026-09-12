import { createClient, SupabaseClient, User } from "@supabase/supabase-js";
import { UserProfile, Mission, FocusSession } from "./types";

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(customUrl?: string, customKey?: string): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;

  const url = customUrl || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = customKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (url && key && url.startsWith("http")) {
    try {
      supabaseClient = createClient(url, key);
      return supabaseClient;
    } catch (e) {
      console.warn("Failed to initialize Supabase client:", e);
      return null;
    }
  }

  return null;
}

export async function signUpWithSupabase(email: string, password: string, name: string) {
  const client = getSupabaseClient();
  if (!client) return { user: null, error: "Supabase URL/Key not configured. Operating in local mode." };

  try {
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (error) return { user: null, error: error.message };
    return { user: data.user, error: null };
  } catch (e: any) {
    return { user: null, error: e.message || "Failed to sign up with Supabase" };
  }
}

export async function signInWithSupabase(email: string, password: string) {
  const client = getSupabaseClient();
  if (!client) return { user: null, error: "Supabase URL/Key not configured. Operating in local mode." };

  try {
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { user: null, error: error.message };
    return { user: data.user, error: null };
  } catch (e: any) {
    return { user: null, error: e.message || "Failed to sign in with Supabase" };
  }
}

export async function signOutWithSupabase() {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    await client.auth.signOut();
  } catch (e) {}
}

export async function getCurrentSupabaseUser(): Promise<User | null> {
  const client = getSupabaseClient();
  if (!client) return null;
  try {
    const { data } = await client.auth.getUser();
    return data.user;
  } catch (e) {
    return null;
  }
}

export async function syncUserProfileToSupabase(profile: UserProfile): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client
      .from("user_profiles")
      .upsert({ id: "default_user", ...profile, updated_at: new Date().toISOString() });

    if (error) throw error;
    return true;
  } catch (e) {
    console.warn("Supabase profile sync error:", e);
    return false;
  }
}

export async function saveMissionToSupabase(mission: Mission): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from("missions").upsert(mission);
    if (error) throw error;
    return true;
  } catch (e) {
    console.warn("Supabase mission save error:", e);
    return false;
  }
}

export async function logFocusSessionToSupabase(session: FocusSession): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from("focus_sessions").insert(session);
    if (error) throw error;
    return true;
  } catch (e) {
    console.warn("Supabase session log error:", e);
    return false;
  }
}
