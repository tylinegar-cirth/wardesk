"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

// Helper: build redirect URL for booking flow
async function buildBookingRedirect(
  supabase: SupabaseClient,
  formData: FormData
): Promise<string | null> {
  const advisorName = formData.get("booking_advisor") as string;
  if (!advisorName) return null;

  // Look up the advisor by name in the database
  const { data: advisorRecord } = await supabase
    .from("advisors")
    .select("id")
    .eq("name", advisorName)
    .single();

  if (!advisorRecord) return null;

  const params = new URLSearchParams();
  const dur = formData.get("booking_dur") as string;
  const date = formData.get("booking_date") as string;
  const time = formData.get("booking_time") as string;
  if (dur) params.set("dur", dur);
  if (date) params.set("date", date);
  if (time) params.set("time", time);

  const query = params.toString();
  return `/portal/advisor/${advisorRecord.id}${query ? `?${query}` : ""}`;
}

export async function login(formData: FormData) {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });
  if (error) return { error: error.message };

  // Fetch user role to redirect to correct portal
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    // Check for booking params — redirect to advisor page with pre-populated booking
    const bookingAdvisor = formData.get("booking_advisor") as string | null;
    if (bookingAdvisor && (!profile?.role || profile.role === "user")) {
      const bookingRedirect = await buildBookingRedirect(supabase, formData);
      if (bookingRedirect) redirect(bookingRedirect);
    }

    switch (profile?.role) {
      case "advisor":
        redirect("/advisor");
      case "admin":
        redirect("/admin");
      default:
        redirect("/portal");
    }
  }

  redirect("/portal");
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  // Build the post-confirmation redirect path
  let redirectAfterConfirm = "/portal/setup";
  const bookingAdvisor = formData.get("booking_advisor") as string | null;

  if (bookingAdvisor) {
    const bookingRedirect = await buildBookingRedirect(supabase, formData);
    if (bookingRedirect) redirectAfterConfirm = bookingRedirect;
  }

  const { error } = await supabase.auth.signUp({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: { name: formData.get("name") as string },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?redirect=${encodeURIComponent(redirectAfterConfirm)}`,
    },
  });
  if (error) return { error: error.message };

  // Don't redirect — return success so the UI shows "check your email"
  return { success: true };
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function sendMagicLink(formData: FormData) {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: formData.get("email") as string,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });
  if (error) return { error: error.message };
  return { success: true };
}

export async function updateProfile(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("users")
    .update({
      name: formData.get("name") as string,
      company: formData.get("company") as string,
      focus_areas: (formData.get("focus_areas") as string)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    })
    .eq("id", user.id);

  if (error) return { error: error.message };
  redirect("/portal");
}
