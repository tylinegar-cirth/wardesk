import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import StatusBadge from "@/components/shared/StatusBadge";
import MissionBrief from "@/components/portal/MissionBrief";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch upcoming sessions
  const { data: upcomingSessions } = await supabase
    .from("bookings")
    .select("*, advisor:advisors(*)")
    .eq("user_id", user.id)
    .eq("status", "confirmed")
    .gte("scheduled_at", new Date().toISOString())
    .order("scheduled_at", { ascending: true })
    .limit(5);

  // Fetch active retainers
  const { data: retainers } = await supabase
    .from("retained_subscriptions")
    .select("*, advisor:advisors(*)")
    .eq("user_id", user.id)
    .eq("status", "active");

  // Fetch recent completed sessions
  const { data: recentSessions } = await supabase
    .from("bookings")
    .select("*, advisor:advisors(*)")
    .eq("user_id", user.id)
    .eq("status", "completed")
    .order("scheduled_at", { ascending: false })
    .limit(3);

  // Fetch user profile
  const { data: profile } = await supabase
    .from("users")
    .select("name, focus_areas")
    .eq("id", user.id)
    .single();

  const { data: recommendedAdvisors } = await supabase
    .from("advisors")
    .select("*")
    .eq("availability_status", "available")
    .limit(3);

  const tierColors: Record<string, string> = {
    signal: "text-wd-sub",
    strategy: "text-wd-gold",
    principal: "text-emerald-400",
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl">
      {/* Header */}
      <div className="mb-10">
        <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-gold mb-2">
          Dashboard
        </p>
        <h1 className="font-serif text-3xl text-wd-text">
          {profile?.focus_areas?.length
            ? `Welcome back${profile?.name ? `, ${profile.name.split(" ")[0]}` : ""}`
            : profile?.name
            ? `Welcome, ${profile.name.split(" ")[0]}`
            : "Welcome"}
        </h1>
        {!profile?.focus_areas?.length && (
          <p className="font-sans text-sm text-wd-sub mt-2 mb-1">
            Complete your profile to get personalized advisor recommendations.
          </p>
        )}
        {!profile?.focus_areas?.length && (
          <Link
            href="/portal/setup"
            className="inline-block mt-2 font-mono text-[10px] tracking-[0.1em] uppercase py-2.5 px-5 bg-wd-gold text-wd-bg font-bold rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(212,168,67,0.35)]"
          >
            Complete profile
          </Link>
        )}
      </div>

      {/* Mission Brief — AI Advisor Matching */}
      <section className="mb-10">
        <MissionBrief />
      </section>

      {/* Upcoming Sessions */}
      <section className="mb-10">
        <h2 className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-muted mb-4">
          Upcoming Sessions
        </h2>
        {upcomingSessions && upcomingSessions.length > 0 ? (
          <div className="space-y-3">
            {upcomingSessions.map((session) => (
              <div
                key={session.id}
                className="bg-wd-card border border-wd-border rounded-[14px] p-5 flex items-center gap-4"
              >
                {session.advisor?.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={session.advisor.image_url}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-sm text-wd-text truncate">
                    {session.advisor?.name}
                  </p>
                  <p className="font-mono text-[10px] text-wd-muted">
                    {new Date(session.scheduled_at).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    &middot;{" "}
                    {new Date(session.scheduled_at).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}{" "}
                    &middot; {session.duration_minutes}min
                  </p>
                </div>
                <StatusBadge status={session.status} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-wd-card border border-wd-border rounded-[14px] p-8 text-center">
            <p className="font-sans text-sm text-wd-muted mb-3">
              No upcoming sessions
            </p>
            <Link
              href="/portal/advisors"
              className="font-mono text-[10px] tracking-[0.1em] uppercase text-wd-gold hover:text-wd-text transition-colors"
            >
              Browse advisors &rarr;
            </Link>
          </div>
        )}
      </section>

      {/* Active Retainers */}
      {retainers && retainers.length > 0 && (
        <section className="mb-10">
          <h2 className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-muted mb-4">
            Active Retainers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {retainers.map((retainer) => (
              <div
                key={retainer.id}
                className="bg-wd-card border border-wd-border rounded-[14px] p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  {retainer.advisor?.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={retainer.advisor.image_url}
                      alt=""
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="font-sans text-sm text-wd-text truncate">
                      {retainer.advisor?.name}
                    </p>
                    <p
                      className={`font-mono text-[9px] tracking-[0.1em] uppercase ${
                        tierColors[retainer.tier] || "text-wd-muted"
                      }`}
                    >
                      {retainer.tier} tier
                    </p>
                  </div>
                </div>
                <div className="flex justify-between text-wd-muted font-mono text-[10px]">
                  <span>{retainer.hours_per_month}h / month</span>
                  <span>${(retainer.monthly_price / 100).toLocaleString()}/mo</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recommended Advisors */}
      {recommendedAdvisors && recommendedAdvisors.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-muted">
              Recommended Advisors
            </h2>
            <Link
              href="/portal/advisors"
              className="font-mono text-[10px] tracking-[0.05em] text-wd-gold hover:text-wd-text transition-colors"
            >
              View all &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedAdvisors.map((advisor) => (
              <Link
                key={advisor.id}
                href={`/portal/advisor/${advisor.id}`}
                className="bg-wd-card border border-wd-border rounded-[14px] p-5 hover:border-wd-gold/30 transition-colors group"
              >
                <div className="flex items-center gap-3 mb-3">
                  {advisor.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={advisor.image_url}
                      alt=""
                      className="w-11 h-11 rounded-full object-cover"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="font-sans text-sm text-wd-text group-hover:text-wd-gold transition-colors truncate">
                      {advisor.name}
                    </p>
                    <p className="font-mono text-[10px] text-wd-muted truncate">
                      {advisor.title}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {advisor.focus.slice(0, 2).map((f: string) => (
                    <span
                      key={f}
                      className="font-mono text-[8px] tracking-[0.05em] uppercase text-wd-muted bg-white/[0.04] px-2 py-0.5 rounded"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recent Completed */}
      {recentSessions && recentSessions.length > 0 && (
        <section>
          <h2 className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-muted mb-4">
            Recent Sessions
          </h2>
          <div className="space-y-3">
            {recentSessions.map((session) => (
              <div
                key={session.id}
                className="bg-wd-card border border-wd-border rounded-[14px] p-5 flex items-center gap-4"
              >
                {session.advisor?.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={session.advisor.image_url}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-sm text-wd-text truncate">
                    {session.advisor?.name}
                  </p>
                  <p className="font-mono text-[10px] text-wd-muted">
                    {new Date(session.scheduled_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    &middot; {session.duration_minutes}min
                  </p>
                </div>
                <StatusBadge status={session.status} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
