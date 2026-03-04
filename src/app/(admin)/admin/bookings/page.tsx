"use client";

import { useState, useEffect, useCallback } from "react";
import { createBrowserClient } from "@supabase/ssr";
import StatusBadge from "@/components/shared/StatusBadge";
import { adminUpdateBooking, adminCancelBooking } from "@/lib/actions/admin";

type StatusFilter = "all" | "confirmed" | "completed" | "cancelled" | "no-show";

interface BookingRow {
  id: string;
  scheduled_at: string;
  duration_minutes: number;
  status: string;
  price: number;
  meeting_link: string | null;
  user: { name: string | null; email: string; company: string | null } | null;
  advisor: { name: string } | null;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const loadBookings = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("bookings")
      .select(
        "id, scheduled_at, duration_minutes, status, price, meeting_link, user:users(name, email, company), advisor:advisors(name)"
      )
      .order("scheduled_at", { ascending: false })
      .limit(50);

    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    const { data } = await query;
    setBookings((data as unknown as BookingRow[]) || []);
    setLoading(false);
  }, [supabase, statusFilter]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  async function handleStatusChange(
    bookingId: string,
    newStatus: string
  ) {
    const result = await adminUpdateBooking(bookingId, {
      status: newStatus,
    });
    if (!result.error) {
      loadBookings();
    }
  }

  async function handleCancel(bookingId: string) {
    const result = await adminCancelBooking(bookingId);
    if (!result.error) {
      loadBookings();
    }
  }

  const statuses: StatusFilter[] = [
    "all",
    "confirmed",
    "completed",
    "cancelled",
    "no-show",
  ];

  return (
    <div className="p-8 md:p-12 max-w-6xl">
      <div className="mb-10">
        <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-gold mb-3">
          Booking Management
        </p>
        <h1 className="font-serif text-3xl text-wd-text">All Bookings</h1>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`font-mono text-[10px] tracking-[0.1em] uppercase px-4 py-2 rounded-lg border transition-all duration-200 ${
              statusFilter === s
                ? "bg-wd-gold text-wd-bg font-bold border-wd-gold"
                : "bg-transparent text-wd-muted border-wd-border hover:text-wd-sub hover:border-wd-sub/30"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-16 bg-wd-card border border-wd-border rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-wd-card border border-wd-border rounded-xl p-8 text-center">
          <p className="font-sans text-sm text-wd-muted">
            No bookings found.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-wd-border">
                <th className="text-left font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted py-3 px-4">
                  Date
                </th>
                <th className="text-left font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted py-3 px-4">
                  Client
                </th>
                <th className="text-left font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted py-3 px-4">
                  Advisor
                </th>
                <th className="text-left font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted py-3 px-4">
                  Duration
                </th>
                <th className="text-left font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted py-3 px-4">
                  Status
                </th>
                <th className="text-right font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted py-3 px-4">
                  Price
                </th>
                <th className="text-right font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted py-3 px-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => {
                const dt = new Date(booking.scheduled_at);
                return (
                  <tr
                    key={booking.id}
                    className="border-b border-wd-border/50 hover:bg-wd-overlay/[0.02] transition-colors"
                  >
                    <td className="py-3 px-4">
                      <p className="font-mono text-xs text-wd-text">
                        {dt.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <p className="font-mono text-[10px] text-wd-muted">
                        {dt.toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-sans text-sm text-wd-text">
                        {booking.user?.name || booking.user?.email || "—"}
                      </p>
                      {booking.user?.company && (
                        <p className="font-sans text-xs text-wd-muted">
                          {booking.user.company}
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-4 font-sans text-sm text-wd-text">
                      {booking.advisor?.name || "—"}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-wd-sub">
                      {booking.duration_minutes}min
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs text-wd-text">
                      ${(booking.price / 100).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex gap-2 justify-end">
                        {booking.status === "confirmed" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusChange(booking.id, "completed")
                              }
                              className="font-mono text-[9px] uppercase text-emerald-400 hover:text-emerald-300 bg-transparent border-none"
                            >
                              Complete
                            </button>
                            <button
                              onClick={() => handleCancel(booking.id)}
                              className="font-mono text-[9px] uppercase text-red-400 hover:text-red-300 bg-transparent border-none"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
