import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import StatusBadge from "@/components/shared/StatusBadge";
import MissionBrief from "@/components/portal/MissionBrief";
import {
  demoProfile,
  demoUpcomingSessions,
  demoRetainers,
  demoRecentSessions,
  demoRecommendedAdvisors,
} from "@/data/demo-advisory-mock";

export default async function DashboardPage() {
  const isDemo = cookies().get("wd-demo")?.value === "1";

  let upcomingSessions: typeof demoUpcomingSessions | null = null;
  let retainers: typeof demoRetainers | null = null;
  let recentSessions: typeof demoRecentSessions | null = null;
  let profile: typeof demoProfile | null = null;
  let recommendedAdvisors: typeof demoRecommendedAdvisors | null = null;

  if (isDemo) {
    upcomingSessions = demoUpcomingSessions;
    retainers = demoRetainers;
    recentSessions = demoRecentSessions;
    profile = demoProfile;
    recommendedAdvisors = demoRecommendedAdvisors;
  } else {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: s1 } = await supabase
      .from("bookings")
      .select("*, advisor:advisors(*)")
      .eq("user_id", user.id)
      .eq("status", "confirmed")
      .gte("scheduled_at", new Date().toISOString())
      .order("scheduled_at", { ascending: true })
      .limit(5);
    upcomingSessions = s1 as typeof demoUpcomingSessions | null;

    const { data: r1 } = await supabase
      .from("retained_subscriptions")
      .select("*, advisor:advisors(*)")
      .eq("user_id", user.id)
      .eq("status", "active");
    retainers = r1 as typeof demoRetainers | null;

    const { data: s2 } = await supabase
      .from("bookings")
      .select("*, advisor:advisors(*)")
      .eq("user_id", user.id)
      .eq("status", "completed")
      .order("scheduled_at", { ascending: false })
      .limit(3);
    recentSessions = s2 as typeof demoRecentSessions | null;

    const { data: p1 } = await supabase
      .from("users")
      .select("name, focus_areas")
      .eq("id", user.id)
      .single();
    profile = p1;

    const { data: a1 } = await supabase
      .from("advisors")
      .select("*")
      .eq("availability_status", "available")
      .limit(3);
    recommendedAdvisors = a1 as typeof demoRecommendedAdvisors | null;
  }

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
        <h2 className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-sub mb-4">
          Upcoming Sessions
        </h2>
        {upcomingSessions && upcomingSessions.length > 0 ? (
          <div className="space-y-3">
            {upcomingSessions.map((session) => (
              <div
                key={session.id}
                className="bg-wd-card border border-wd-border rounded-[14px] p-5 flex items-center gap-4 hover:border-wd-border-hov transition-colors"
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
                  <p className="font-mono text-[10px] text-wd-sub">
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
          <div className="bg-wd-card border border-wd-border rounded-[14px] p-10 text-center">
            <div className="w-12 h-12 rounded-full bg-wd-overlay/[0.04] mx-auto mb-4 flex items-center justify-center">
              <svg className="w-5 h-5 text-wd-sub" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
            </div>
            <p className="font-sans text-sm text-wd-sub mb-4">
              No upcoming sessions yet
            </p>
            <Link
              href="/portal/advisors"
              className="inline-block font-mono text-[10px] tracking-[0.1em] uppercase py-2.5 px-5 bg-wd-gold/10 text-wd-gold border border-wd-gold/20 rounded-lg hover:bg-wd-gold/20 transition-all"
            >
              Browse advisors &rarr;
            </Link>
          </div>
        )}
      </section>

      {/* Active Retainers */}
      {retainers && retainers.length > 0 && (
        <section className="mb-10">
          <h2 className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-sub mb-4">
            Active Retainers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {retainers.map((retainer) => (
              <div
                key={retainer.id}
                className="bg-wd-card border border-wd-border rounded-[14px] p-5 hover:border-wd-border-hov transition-colors"
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
                        tierColors[retainer.tier] || "text-wd-sub"
                      }`}
                    >
                      {retainer.tier} tier
                    </p>
                  </div>
                </div>
                <div className="flex justify-between text-wd-sub font-mono text-[10px]">
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
            <h2 className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-sub">
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
                className="bg-wd-card border border-wd-border rounded-[14px] p-5 hover:border-wd-gold/30 hover:-translate-y-0.5 transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 mb-3">
                  {advisor.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={advisor.image_url}
                      alt=""
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-wd-overlay/[0.06] group-hover:ring-wd-gold/30 transition-all"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="font-sans text-sm text-wd-text group-hover:text-wd-gold transition-colors truncate">
                      {advisor.name}
                    </p>
                    <p className="font-mono text-[10px] text-wd-sub truncate">
                      {advisor.title}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {advisor.focus.slice(0, 2).map((f: string) => (
                    <span
                      key={f}
                      className="font-mono text-[8px] tracking-[0.05em] uppercase text-wd-sub bg-wd-overlay/[0.04] px-2 py-0.5 rounded"
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
          <h2 className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-sub mb-4">
            Recent Sessions
          </h2>
          <div className="space-y-3">
            {recentSessions.map((session) => (
              <div
                key={session.id}
                className="bg-wd-card border border-wd-border rounded-[14px] p-5 flex items-center gap-4 hover:border-wd-border-hov transition-colors"
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
                  <p className="font-mono text-[10px] text-wd-sub">
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
