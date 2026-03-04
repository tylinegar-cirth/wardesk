"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });
  if (error) return { error: error.message };
  redirect("/portal");
}

export async function signup(formData: FormData) {
  const supabase = createClient();
  const { error } = await supabase.auth.signUp({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: { name: formData.get("name") as string },
    },
  });
  if (error) return { error: error.message };
  redirect("/portal/setup");
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
