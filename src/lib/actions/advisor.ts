"use server";

import { createClient } from "@/lib/supabase/server";

async function getAdvisorId(): Promise<string | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("advisors")
    .select("id")
    .eq("user_id", user.id)
    .single();

  return data?.id || null;
}

export async function updateAvailability(
  slots: {
    day_of_week: number;
    start_time: string;
    end_time: string;
    timezone: string;
  }[]
) {
  const supabase = createClient();
  const advisorId = await getAdvisorId();
  if (!advisorId) return { error: "Not an advisor" };

  // Delete existing availability for this advisor
  const { error: deleteError } = await supabase
    .from("availability")
    .delete()
    .eq("advisor_id", advisorId);

  if (deleteError) return { error: deleteError.message };

  // Insert new slots
  if (slots.length > 0) {
    const { error: insertError } = await supabase
      .from("availability")
      .insert(slots.map((s) => ({ ...s, advisor_id: advisorId })));

    if (insertError) return { error: insertError.message };
  }

  return { success: true };
}

export async function addBlockedDate(date: string, reason?: string) {
  const supabase = createClient();
  const advisorId = await getAdvisorId();
  if (!advisorId) return { error: "Not an advisor" };

  const { error } = await supabase
    .from("blocked_dates")
    .insert({ advisor_id: advisorId, date, reason: reason || null });

  if (error) return { error: error.message };
  return { success: true };
}

export async function removeBlockedDate(id: string) {
  const supabase = createClient();
  const advisorId = await getAdvisorId();
  if (!advisorId) return { error: "Not an advisor" };

  const { error } = await supabase
    .from("blocked_dates")
    .delete()
    .eq("id", id)
    .eq("advisor_id", advisorId);

  if (error) return { error: error.message };
  return { success: true };
}

export async function updateMeetingLink(bookingId: string, meetingLink: string) {
  const supabase = createClient();
  const advisorId = await getAdvisorId();
  if (!advisorId) return { error: "Not an advisor" };

  const { error } = await supabase
    .from("bookings")
    .update({ meeting_link: meetingLink })
    .eq("id", bookingId)
    .eq("advisor_id", advisorId);

  if (error) return { error: error.message };
  return { success: true };
}

export async function markSessionCompleted(bookingId: string) {
  const supabase = createClient();
  const advisorId = await getAdvisorId();
  if (!advisorId) return { error: "Not an advisor" };

  const { error } = await supabase
    .from("bookings")
    .update({ status: "completed" })
    .eq("id", bookingId)
    .eq("advisor_id", advisorId);

  if (error) return { error: error.message };
  return { success: true };
}

export async function updateAdvisorProfile(data: {
  title: string;
  bio: string;
  focus: string[];
  availability_status: "available" | "limited" | "unavailable";
  image_url: string;
}) {
  const supabase = createClient();
  const advisorId = await getAdvisorId();
  if (!advisorId) return { error: "Not an advisor" };

  const { error } = await supabase
    .from("advisors")
    .update({
      title: data.title,
      bio: data.bio,
      focus: data.focus,
      availability_status: data.availability_status,
      image_url: data.image_url || null,
    })
    .eq("id", advisorId);

  if (error) return { error: error.message };
  return { success: true };
}
