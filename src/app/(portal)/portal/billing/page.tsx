import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import StatusBadge from "@/components/shared/StatusBadge";
import ManageBillingButton from "@/components/portal/ManageBillingButton";
import { demoBillingRetainers, demoPayments } from "@/data/demo-advisory-mock";

export default async function BillingPage() {
  const isDemo = cookies().get("wd-demo")?.value === "1";

  let hasStripeAccount = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let retainers: any[] | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let payments: any[] | null = null;

  if (isDemo) {
    hasStripeAccount = true;
    retainers = demoBillingRetainers;
    payments = demoPayments;
  } else {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase
      .from("users")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    hasStripeAccount = !!profile?.stripe_customer_id;

    const { data: r1 } = await supabase
      .from("retained_subscriptions")
      .select("*, advisor:advisors(*)")
      .eq("user_id", user.id)
      .in("status", ["active", "paused"]);
    retainers = r1;

    const { data: p1 } = await supabase
      .from("bookings")
      .select("*, advisor:advisors(name, image_url)")
      .eq("user_id", user.id)
      .in("status", ["pending_payment", "confirmed", "completed"])
      .order("created_at", { ascending: false })
      .limit(20);
    payments = p1;
  }

  const tierColors: Record<string, string> = {
    signal: "text-wd-sub",
    strategy: "text-wd-gold",
    principal: "text-emerald-400",
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-gold mb-2">
            Billing
          </p>
          <h1 className="font-serif text-3xl text-wd-text">
            Payments &amp; subscriptions
          </h1>
        </div>
        {hasStripeAccount && !isDemo && <ManageBillingButton />}
      </div>

      {/* Active subscriptions */}
      <section className="mb-10">
        <h2 className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-muted mb-4">
          Active Subscriptions
        </h2>
        {retainers && retainers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {retainers.map((retainer) => (
              <div
                key={retainer.id}
                className="bg-wd-card border border-wd-border rounded-[14px] p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  {retainer.advisor?.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={retainer.advisor.image_url}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover"
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
                  <div className="ml-auto">
                    <StatusBadge status={retainer.status} />
                  </div>
                </div>
                <div className="flex justify-between text-wd-muted font-mono text-[10px] border-t border-wd-border pt-3">
                  <span>{retainer.hours_per_month} hours/month</span>
                  <span className="text-wd-gold">
                    ${(retainer.monthly_price / 100).toLocaleString()}/mo
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-wd-card border border-wd-border rounded-[14px] p-8 text-center">
            <p className="font-sans text-sm text-wd-muted">
              No active subscriptions
            </p>
          </div>
        )}
      </section>

      {/* Payment history */}
      <section>
        <h2 className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-muted mb-4">
          Payment History
        </h2>
        {payments && payments.length > 0 ? (
          <div className="bg-wd-card border border-wd-border rounded-[14px] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-wd-border">
                  <th className="text-left font-mono text-[9px] tracking-[0.1em] uppercase text-wd-muted p-4">
                    Date
                  </th>
                  <th className="text-left font-mono text-[9px] tracking-[0.1em] uppercase text-wd-muted p-4">
                    Advisor
                  </th>
                  <th className="text-left font-mono text-[9px] tracking-[0.1em] uppercase text-wd-muted p-4">
                    Duration
                  </th>
                  <th className="text-left font-mono text-[9px] tracking-[0.1em] uppercase text-wd-muted p-4">
                    Status
                  </th>
                  <th className="text-right font-mono text-[9px] tracking-[0.1em] uppercase text-wd-muted p-4">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b border-wd-border last:border-none"
                  >
                    <td className="p-4 font-mono text-[10px] text-wd-sub">
                      {new Date(payment.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {payment.advisor?.image_url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={payment.advisor.image_url}
                            alt=""
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        )}
                        <span className="font-sans text-sm text-wd-text truncate">
                          {payment.advisor?.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-[10px] text-wd-muted">
                      {payment.duration_minutes}min
                    </td>
                    <td className="p-4">
                      <StatusBadge status={payment.status} />
                    </td>
                    <td className="p-4 text-right font-mono text-sm text-wd-gold">
                      ${(payment.price / 100).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-wd-card border border-wd-border rounded-[14px] p-8 text-center">
            <p className="font-sans text-sm text-wd-muted">
              No payment history yet
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
