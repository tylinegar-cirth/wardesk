"use server";

import { createClient } from "@/lib/supabase/server";

export async function createBooking({
  advisorId,
  scheduledAt,
  durationMinutes,
  price,
}: {
  advisorId: string;
  scheduledAt: string;
  durationMinutes: 30 | 60 | 90;
  price: number;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data, error } = await supabase
    .from("bookings")
    .insert({
      user_id: user.id,
      advisor_id: advisorId,
      duration_minutes: durationMinutes,
      scheduled_at: scheduledAt,
      price,
      status: "confirmed",
    })
    .select()
    .single();

  if (error) return { error: error.message };
  return { data };
}

export async function cancelBooking(bookingId: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Verify booking exists, belongs to user, and is cancellable
  const { data: booking } = await supabase
    .from("bookings")
    .select("id, status")
    .eq("id", bookingId)
    .eq("user_id", user.id)
    .single();

  if (!booking) return { error: "Booking not found" };

  if (booking.status === "completed" || booking.status === "cancelled") {
    return { error: `Cannot cancel a ${booking.status} booking` };
  }

  const { error } = await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", bookingId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  return { success: true };
}

export async function updateBookingNotes(bookingId: string, notes: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("bookings")
    .update({ notes })
    .eq("id", bookingId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  return { success: true };
}
