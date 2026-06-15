"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";

export interface User {
  id: string;
  name: string;
  email: string;
  initials: string;
  plan: string;
  credits: number;
  onboarding_completed: boolean;
  exam_target?: string;
  goals?: string[];
  study_format?: string[];
}

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password?: string) => Promise<void>;
  signup: (name: string, email: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (name: string) => Promise<void>;
  updateOnboardingData: (data: { exam_target: string, goals: string[], study_format: string[] }) => Promise<void>;
  decrementCredits: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

/**
 * Fetches the user's profile from the `profiles` table.
 * Retries up to `maxRetries` times with a delay to allow
 * the database trigger to create the profile row after signup.
 */
async function fetchProfileWithRetry(
  supabase: SupabaseClient,
  userId: string,
  email: string,
  maxRetries = 3,
  delayMs = 800
): Promise<User> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (data && !error) {
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        initials: data.initials,
        plan: data.plan,
        credits: data.credits,
        onboarding_completed: data.onboarding_completed ?? false,
        exam_target: data.exam_target,
        goals: data.goals,
        study_format: data.study_format,
      };
    }

    // If this is not the last attempt, wait before retrying
    // (the trigger may not have fired yet on a fresh signup)
    if (attempt < maxRetries - 1) {
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }

  // All retries exhausted — return a sensible fallback so the app
  // doesn't crash, but log the issue for debugging.
  console.warn(
    `[AuthContext] Could not fetch profile for user ${userId} after ${maxRetries} attempts. Using fallback.`
  );
  const initials = email
    .split("@")[0]
    .slice(0, 2)
    .toUpperCase();
  return {
    id: userId,
    name: email.split("@")[0],
    email,
    initials,
    plan: "Free Plan",
    credits: 5,
    onboarding_completed: false,
  };
}

/**
 * Maps Supabase auth error codes/messages to user-friendly strings.
 */
function humanizeAuthError(error: any): string {
  const msg = error?.message?.toLowerCase() ?? "";
  const code = error?.code ?? "";

  if (code === "user_already_exists" || msg.includes("user already registered")) {
    return "An account with this email already exists. Please log in instead.";
  }
  if (msg.includes("invalid login credentials")) {
    return "Incorrect email or password. Please try again.";
  }
  if (msg.includes("email not confirmed")) {
    return "Please confirm your email before logging in. Check your inbox.";
  }
  if (msg.includes("signup is disabled") || msg.includes("signups not allowed")) {
    return "New account registration is currently disabled. Please try again later.";
  }
  if (msg.includes("rate limit") || msg.includes("too many requests") || msg.includes("over_email_send_rate_limit")) {
    return "Too many attempts. If testing locally, increase the Email Rate Limit in your Supabase Dashboard (Auth > Rate Limits).";
  }
  if (msg.includes("password") && msg.includes("at least")) {
    return error.message; // Already a clear message like "Password should be at least 6 characters"
  }
  if (msg.includes("network") || msg.includes("fetch")) {
    return "Network error — please check your internet connection and try again.";
  }
  // Fallback: return the original message
  return error?.message || "An unexpected error occurred. Please try again.";
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Stabilize the Supabase client so it is not recreated on every render.
  const supabaseRef = useRef<SupabaseClient | null>(null);
  if (!supabaseRef.current) {
    supabaseRef.current = createClient();
  }
  const supabase = supabaseRef.current;

  // ——————————————————————————————————————————————
  // 1. Initialize auth state from the existing session
  // 2. Subscribe to auth state changes
  // ——————————————————————————————————————————————
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user && isMounted) {
          const profile = await fetchProfileWithRetry(
            supabase,
            user.id,
            user.email || ""
          );
          if (isMounted) setCurrentUser(profile);
        }
      } catch (err) {
        console.error("[AuthContext] Error initializing auth:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      if (event === "SIGNED_OUT") {
        setCurrentUser(null);
        return;
      }

      if (session?.user) {
        const profile = await fetchProfileWithRetry(
          supabase,
          session.user.id,
          session.user.email || ""
        );
        if (isMounted) setCurrentUser(profile);
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ——————————————————————————————————————————————
  // Auth Actions
  // ——————————————————————————————————————————————
  const login = useCallback(
    async (email: string, password?: string) => {
      if (!password) throw new Error("Password is required.");
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(humanizeAuthError(error));
    },
    [supabase]
  );

  const signup = useCallback(
    async (name: string, email: string, password?: string) => {
      if (!password) throw new Error("Password is required.");

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });

      if (error) throw new Error(humanizeAuthError(error));

      // Supabase may return a user with `identities: []` if the email
      // already exists and email confirmations are enabled. Handle this.
      if (
        data?.user &&
        Array.isArray(data.user.identities) &&
        data.user.identities.length === 0
      ) {
        throw new Error(
          "An account with this email already exists. Please log in instead."
        );
      }

      // If email confirmation is required, the session will be null.
      // The onAuthStateChange listener will pick up the session when
      // the user confirms their email. For auto-confirm setups the
      // session is immediately available and the listener will fire.
    },
    [supabase]
  );

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("[AuthContext] Error signing out:", error);
    }
    setCurrentUser(null);
    router.push("/");
  }, [supabase, router]);

  const updateProfile = useCallback(
    async (name: string) => {
      if (!currentUser) return;
      const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

      const { error } = await supabase
        .from("profiles")
        .update({ name, initials })
        .eq("id", currentUser.id);

      if (!error) {
        setCurrentUser((prev) => (prev ? { ...prev, name, initials } : prev));
      } else {
        console.error("[AuthContext] Error updating profile:", error);
      }
    },
    [supabase, currentUser]
  );

  const updateOnboardingData = useCallback(
    async (data: { exam_target: string, goals: string[], study_format: string[] }) => {
      if (!currentUser) return;
      const { error } = await supabase
        .from("profiles")
        .update({ 
          onboarding_completed: true, 
          exam_target: data.exam_target,
          goals: data.goals,
          study_format: data.study_format
        })
        .eq("id", currentUser.id);

      if (!error) {
        setCurrentUser((prev) => (prev ? { 
          ...prev, 
          onboarding_completed: true,
          exam_target: data.exam_target,
          goals: data.goals,
          study_format: data.study_format
        } : prev));
      } else {
        // Log detailed error to console for developers
        console.error("[AuthContext] Error updating onboarding data:", error.message || error);
        
        if (error.message?.includes("exam_target") || error.message?.includes("schema cache")) {
          console.error("🔴 DEVELOPER ACTION REQUIRED: Supabase could not find the new columns. Ensure you ran the ALTER TABLE command to add exam_target, goals, and study_format columns, then reload the schema cache.");
        }
        
        // Throw generic, user-friendly error to the frontend
        throw new Error("Oops, we encountered an issue saving your preferences. Our system has flagged the issue. Please try again in a moment.");
      }
    },
    [supabase, currentUser]
  );

  const decrementCredits = useCallback(async () => {
    if (!currentUser) return;
    const newCredits = Math.max(0, currentUser.credits - 1);
    const { error } = await supabase
      .from("profiles")
      .update({ credits: newCredits })
      .eq("id", currentUser.id);

    if (!error) {
      setCurrentUser((prev) => (prev ? { ...prev, credits: newCredits } : prev));
    } else {
      console.error("[AuthContext] Error decrementing credits:", error);
    }
  }, [supabase, currentUser]);

  return (
    <AuthContext.Provider
      value={{ currentUser, login, signup, logout, updateProfile, updateOnboardingData, decrementCredits, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
