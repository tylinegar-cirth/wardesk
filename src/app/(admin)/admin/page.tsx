import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import StatusBadge from "@/components/shared/StatusBadge";

export default async function AdminOverview() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // Fetch stats in parallel
  const [
    { count: totalUsers },
    { count: totalAdvisors },
    { count: totalBookings },
    { count: activeRetainers },
    { data: revenueData },
    { data: recentBookings },
    { data: recentUsers },
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
    supabase
      .from("bookings")
      .select(
        "id, scheduled_at, duration_minutes, status, price, user:users(name, email), advisor:advisors(name)"
      )
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("users")
      .select("id, name, email, company, role, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const totalRevenue =
    revenueData?.reduce((sum, b) => sum + (b.price || 0), 0) || 0;

  const stats = [
    { label: "Total Users", value: totalUsers || 0 },
    { label: "Total Advisors", value: totalAdvisors || 0 },
    { label: "Total Bookings", value: totalBookings || 0 },
    { label: "Active Retainers", value: activeRetainers || 0 },
    {
      label: "Total Revenue",
      value: `$${(totalRevenue / 100).toLocaleString()}`,
    },
  ];

  return (
    <div className="p-8 md:p-12 max-w-6xl">
      {/* Header */}
      <div className="mb-10">
        <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-gold mb-3">
          Admin Dashboard
        </p>
        <h1 className="font-serif text-3xl text-wd-text">
          Platform Overview
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-wd-card border border-wd-border rounded-[14px] p-5"
          >
            <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted mb-2">
              {stat.label}
            </p>
            <p className="font-serif text-2xl text-wd-text">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <div>
          <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-gold mb-4">
            Recent Bookings
          </p>
          {recentBookings && recentBookings.length > 0 ? (
            <div className="space-y-3">
              {recentBookings.map((booking) => {
                const dt = new Date(booking.scheduled_at);
                const client = booking.user as unknown as { name: string | null; email: string } | null;
                const advisor = booking.advisor as unknown as { name: string } | null;
                return (
                  <div
                    key={booking.id}
                    className="bg-wd-card border border-wd-border rounded-xl p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-sans text-sm text-wd-text font-medium">
                          {client?.name || client?.email || "—"}
                        </p>
                        <p className="font-sans text-xs text-wd-muted">
                          → {advisor?.name || "Unknown Advisor"}
                        </p>
                      </div>
                      <StatusBadge status={booking.status} />
                    </div>
                    <div className="flex items-center gap-3 text-wd-sub font-mono text-[10px]">
                      <span>
                        {dt.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span>{booking.duration_minutes}min</span>
                      <span>
                        ${(booking.price / 100).toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="font-sans text-sm text-wd-muted">
              No bookings yet.
            </p>
          )}
        </div>

        {/* Recent Users */}
        <div>
          <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-gold mb-4">
            Recent Signups
          </p>
          {recentUsers && recentUsers.length > 0 ? (
            <div className="space-y-3">
              {recentUsers.map((u) => (
                <div
                  key={u.id}
                  className="bg-wd-card border border-wd-border rounded-xl p-4"
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-sans text-sm text-wd-text font-medium">
                      {u.name || u.email}
                    </p>
                    <span
                      className={`font-mono text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 rounded ${
                        u.role === "admin"
                          ? "text-red-400 bg-red-500/10"
                          : u.role === "advisor"
                          ? "text-wd-gold bg-wd-gold-glow"
                          : "text-wd-muted bg-white/[0.05]"
                      }`}
                    >
                      {u.role}
                    </span>
                  </div>
                  <p className="font-mono text-[10px] text-wd-sub">
                    {u.email}
                    {u.company ? ` · ${u.company}` : ""}
                  </p>
                  <p className="font-mono text-[9px] text-wd-muted mt-1">
                    Joined{" "}
                    {new Date(u.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="font-sans text-sm text-wd-muted">No users yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
