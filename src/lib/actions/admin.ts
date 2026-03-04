"use server";

import { createClient } from "@/lib/supabase/server";

async function verifyAdmin(): Promise<boolean> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  return profile?.role === "admin";
}

export async function adminUpdateBooking(
  bookingId: string,
  data: { status?: string; meeting_link?: string; notes?: string }
) {
  if (!(await verifyAdmin())) return { error: "Unauthorized" };

  const supabase = createClient();
  const { error } = await supabase
    .from("bookings")
    .update(data)
    .eq("id", bookingId);

  if (error) return { error: error.message };
  return { success: true };
}

export async function adminCancelBooking(bookingId: string) {
  return adminUpdateBooking(bookingId, { status: "cancelled" });
}

export async function adminCreateAdvisor(data: {
  name: string;
  title: string;
  branch: string;
  category: string;
  stars: number;
  focus: string[];
  clearance: string;
  rate: number;
  bio: string;
  image_url: string;
  years_service: number;
}) {
  if (!(await verifyAdmin())) return { error: "Unauthorized" };

  const supabase = createClient();
  const { data: advisor, error } = await supabase
    .from("advisors")
    .insert({
      ...data,
      availability_status: "available",
      image_url: data.image_url || null,
      bio: data.bio || null,
    })
    .select()
    .single();

  if (error) return { error: error.message };
  return { data: advisor };
}

export async function adminUpdateAdvisor(
  advisorId: string,
  data: {
    name?: string;
    title?: string;
    branch?: string;
    category?: string;
    stars?: number;
    focus?: string[];
    clearance?: string;
    rate?: number;
    bio?: string;
    image_url?: string;
    years_service?: number;
    availability_status?: string;
  }
) {
  if (!(await verifyAdmin())) return { error: "Unauthorized" };

  const supabase = createClient();
  const { error } = await supabase
    .from("advisors")
    .update(data)
    .eq("id", advisorId);

  if (error) return { error: error.message };
  return { success: true };
}

export async function adminLinkAdvisorUser(
  advisorId: string,
  userEmail: string
) {
  if (!(await verifyAdmin())) return { error: "Unauthorized" };

  const supabase = createClient();

  // Find user by email
  const { data: userRecord } = await supabase
    .from("users")
    .select("id")
    .eq("email", userEmail)
    .single();

  if (!userRecord) return { error: "User not found with that email" };

  // Update advisor with user_id
  const { error: advisorError } = await supabase
    .from("advisors")
    .update({ user_id: userRecord.id })
    .eq("id", advisorId);

  if (advisorError) return { error: advisorError.message };

  // Update user role to advisor
  const { error: roleError } = await supabase
    .from("users")
    .update({ role: "advisor" })
    .eq("id", userRecord.id);

  if (roleError) return { error: roleError.message };

  return { success: true };
}

export async function adminUpdateUserRole(
  userId: string,
  role: "user" | "advisor" | "admin"
) {
  if (!(await verifyAdmin())) return { error: "Unauthorized" };

  const supabase = createClient();
  const { error } = await supabase
    .from("users")
    .update({ role })
    .eq("id", userId);

  if (error) return { error: error.message };
  return { success: true };
}

export async function getAdminStats() {
  if (!(await verifyAdmin())) return { error: "Unauthorized" };

  const supabase = createClient();

  const [
    { count: totalUsers },
    { count: totalAdvisors },
    { count: totalBookings },
    { count: activeRetainers },
    { data: revenueData },
  ] = await Promise.all([
    supabase.from("users").select("id", { count: "exact", head: true }),
    supabase.from("advisors").select("id", { count: "exact", head: true }),
    supabase.from("bookings").select("id", { count: "exact", head: true }),
    supabase
      .from("retained_subscriptions")
      .select("id", { count: "exact", head: true })
      .eq("status", "active"),
    supabase
      .from("bookings")
      .select("price")
      .in("status", ["confirmed", "completed"]),
  ]);

  const totalRevenue =
    revenueData?.reduce((sum, b) => sum + (b.price || 0), 0) || 0;

  return {
    data: {
      totalUsers: totalUsers || 0,
      totalAdvisors: totalAdvisors || 0,
      totalBookings: totalBookings || 0,
      activeRetainers: activeRetainers || 0,
      totalRevenue,
    },
  };
}
