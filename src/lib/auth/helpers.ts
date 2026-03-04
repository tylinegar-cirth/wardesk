import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { DbUser, DbAdvisor } from "@/lib/types/database";

/**
 * Get the current authenticated user and their profile.
 * Redirects to /auth/login if not authenticated.
 */
export async function getCurrentUser(): Promise<{
  userId: string;
  profile: DbUser;
}> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/auth/login");
  }

  return { userId: user.id, profile: profile as DbUser };
}

/**
 * Get the advisor record linked to the current user.
 * Returns null if the user is not linked to any advisor.
 */
export async function getAdvisorForUser(
  userId: string
): Promise<DbAdvisor | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("advisors")
    .select("*")
    .eq("user_id", userId)
    .single();

  return (data as DbAdvisor) || null;
}

/**
 * Require the current user to have a specific role.
 * Redirects to the appropriate portal if role doesn't match.
 */
export async function requireRole(
  requiredRole: "user" | "advisor" | "admin"
): Promise<{ userId: string; profile: DbUser }> {
  const { userId, profile } = await getCurrentUser();

  if (profile.role !== requiredRole) {
    // Redirect to the correct portal for their role
    switch (profile.role) {
      case "advisor":
        redirect("/advisor");
      case "admin":
        redirect("/admin");
      default:
        redirect("/portal");
    }
  }

  return { userId, profile };
}
