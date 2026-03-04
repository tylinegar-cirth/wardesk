import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import StatusBadge from "@/components/shared/StatusBadge";

export default async function AdvisorDashboard() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // Get advisor record
  const { data: advisor } = await supabase
    .from("advisors")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!advisor) {
    return (
      <div className="p-8 md:p-12">
        <p className="text-wd-sub font-sans">
          No advisor profile linked to your account. Contact admin.
        </p>
      </div>
    );
  }

  // Get upcoming sessions
  const { data: upcomingSessions } = await supabase
    .from("bookings")
    .select("*, user:users(name, company, email)")
    .eq("advisor_id", advisor.id)
    .eq("status", "confirmed")
    .gte("scheduled_at", new Date().toISOString())
    .order("scheduled_at", { ascending: true })
    .limit(7);

  // Get recent completed sessions
  const { data: recentSessions } = await supabase
    .from("bookings")
    .select("*, user:users(name, company, email)")
    .eq("advisor_id", advisor.id)
    .in("status", ["completed", "cancelled"])
    .order("scheduled_at", { ascending: false })
    .limit(5);

  // Get total session counts
  const { count: totalSessions } = await supabase
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .eq("advisor_id", advisor.id);

  // Active retainers
  const { data: retainers } = await supabase
    .from("retained_subscriptions")
    .select("*, user:users(name, company)")
    .eq("advisor_id", advisor.id)
    .eq("status", "active");

  const stats = [
    { label: "Total Sessions", value: totalSessions || 0 },
    { label: "Upcoming", value: upcomingSessions?.length || 0 },
    { label: "Active Retainers", value: retainers?.length || 0 },
    { label: "Hourly Rate", value: `$${advisor.rate}` },
  ];

  return (
    <div className="p-8 md:p-12 max-w-6xl">
      {/* Header */}
      <div className="mb-10">
        <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-gold mb-3">
          Advisor Dashboard
        </p>
        <h1 className="font-serif text-3xl text-wd-text mb-1">
          Welcome back, {advisor.name?.split(" ")[0]}
        </h1>
        <p className="font-sans text-sm text-wd-sub">
          {advisor.title} · {advisor.branch}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
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

      {/* Quick Actions */}
      <div className="flex gap-3 mb-10">
        <Link
          href="/advisor/schedule"
          className="font-mono text-[10px] tracking-[0.1em] uppercase py-2.5 px-5 bg-wd-gold text-wd-bg font-bold rounded-lg transition-all duration-300 hover:-translate-y-0.5 shadow-[0_2px_12px_rgba(212,168,67,0.15)] hover:shadow-[0_4px_20px_rgba(212,168,67,0.35)]"
        >
          Edit Schedule
        </Link>
        <Link
          href="/advisor/profile"
          className="font-mono text-[10px] tracking-[0.1em] uppercase py-2.5 px-5 bg-wd-overlay/[0.05] text-wd-text border border-wd-border font-bold rounded-lg transition-all duration-300 hover:bg-wd-overlay/[0.08]"
        >
          View Profile
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Upcoming Sessions */}
        <div>
          <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-gold mb-4">
            Upcoming Sessions
          </p>
          {upcomingSessions && upcomingSessions.length > 0 ? (
            <div className="space-y-3">
              {upcomingSessions.map((session) => {
                const dt = new Date(session.scheduled_at);
                const client = session.user as unknown as { name: string | null; company: string | null; email: string } | null;
                return (
                  <div
                    key={session.id}
                    className="bg-wd-card border border-wd-border rounded-xl p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-sans text-sm text-wd-text font-medium">
                          {client?.name || client?.email || "Client"}
                        </p>
                        {client?.company && (
                          <p className="font-sans text-xs text-wd-muted">
                            {client.company}
                          </p>
                        )}
                      </div>
                      <StatusBadge status={session.status} />
                    </div>
                    <div className="flex items-center gap-3 text-wd-sub font-mono text-[10px]">
                      <span>
                        {dt.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span>
                        {dt.toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                      <span>{session.duration_minutes}min</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="font-sans text-sm text-wd-muted">
              No upcoming sessions scheduled.
            </p>
          )}
        </div>

        {/* Recent Completed */}
        <div>
          <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-gold mb-4">
            Recent Sessions
          </p>
          {recentSessions && recentSessions.length > 0 ? (
            <div className="space-y-3">
              {recentSessions.map((session) => {
                const dt = new Date(session.scheduled_at);
                const client = session.user as unknown as { name: string | null; company: string | null; email: string } | null;
                return (
                  <div
                    key={session.id}
                    className="bg-wd-card border border-wd-border rounded-xl p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-sans text-sm text-wd-text">
                        {client?.name || client?.email || "Client"}
                      </p>
                      <StatusBadge status={session.status} />
                    </div>
                    <p className="font-mono text-[10px] text-wd-sub">
                      {dt.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      · {session.duration_minutes}min · $
                      {(session.price / 100).toLocaleString()}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="font-sans text-sm text-wd-muted">
              No recent sessions.
            </p>
          )}
        </div>
      </div>

      {/* Active Retainers */}
      {retainers && retainers.length > 0 && (
        <div className="mt-10">
          <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-gold mb-4">
            Active Retainers
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {retainers.map((r) => {
              const client = r.user as unknown as { name: string | null; company: string | null } | null;
              const tierColor =
                r.tier === "principal"
                  ? "text-wd-gold"
                  : r.tier === "strategy"
                  ? "text-blue-400"
                  : "text-emerald-400";
              return (
                <div
                  key={r.id}
                  className="bg-wd-card border border-wd-border rounded-xl p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-sans text-sm text-wd-text font-medium">
                        {client?.name || "Client"}
                      </p>
                      {client?.company && (
                        <p className="font-sans text-xs text-wd-muted">
                          {client.company}
                        </p>
                      )}
                    </div>
                    <span
                      className={`font-mono text-[9px] tracking-[0.1em] uppercase ${tierColor}`}
                    >
                      {r.tier}
                    </span>
                  </div>
                  <p className="font-mono text-[10px] text-wd-sub">
                    {r.hours_per_month}hr/mo · $
                    {(r.monthly_price / 100).toLocaleString()}/mo
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
