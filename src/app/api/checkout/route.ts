import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";
import { headers } from "next/headers";

function ensureScheme(url: string): string {
  const trimmed = url.replace(/\/$/, "");
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

function getSiteUrl(requestHeaders: Headers): string {
  // 1. Explicit env var
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return ensureScheme(process.env.NEXT_PUBLIC_SITE_URL);
  }
  // 2. Vercel auto-set URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // 3. Derive from request headers
  const host = requestHeaders.get("host") || "localhost:3000";
  const proto = requestHeaders.get("x-forwarded-proto") || "https";
  return `${proto}://${host}`;
}

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const siteUrl = getSiteUrl(headersList);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { advisorId, scheduledAt, durationMinutes } = body as {
      advisorId: string;
      scheduledAt: string;
      durationMinutes: number;
    };

    if (!advisorId || !scheduledAt || !durationMinutes) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate duration
    const allowedDurations = [30, 60, 90];
    if (!allowedDurations.includes(durationMinutes)) {
      return NextResponse.json(
        { error: "Duration must be 30, 60, or 90 minutes" },
        { status: 400 }
      );
    }

    // Validate scheduled date is in the future
    const scheduledDate = new Date(scheduledAt);
    if (isNaN(scheduledDate.getTime()) || scheduledDate.getTime() < Date.now()) {
      return NextResponse.json(
        { error: "Scheduled date must be valid and in the future" },
        { status: 400 }
      );
    }

    // Validate advisor exists and is available, and calculate price server-side
    const { data: advisor } = await supabase
      .from("advisors")
      .select("id, name, rate, availability_status")
      .eq("id", advisorId)
      .single();

    if (!advisor) {
      return NextResponse.json(
        { error: "Advisor not found" },
        { status: 404 }
      );
    }

    const advisorName = advisor.name;
    const price = Math.round((advisor.rate * durationMinutes) / 60);

    // Look up or create Stripe customer
    const { data: profile } = await supabase
      .from("users")
      .select("stripe_customer_id, name")
      .eq("id", user.id)
      .single();

    const stripe = getStripe();
    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: profile?.name || undefined,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;

      // Save Stripe customer ID back to the user record
      await supabase
        .from("users")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    // Build cancel URL that preserves booking params
    const dateStr = scheduledAt.split("T")[0];
    const timeStr = `${String(scheduledDate.getHours()).padStart(2, "0")}:${String(scheduledDate.getMinutes()).padStart(2, "0")}`;
    const cancelUrl = `${siteUrl}/portal/advisor/${advisorId}?dur=${durationMinutes}&date=${dateStr}&time=${encodeURIComponent(timeStr)}`;

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: price, // already in cents
            product_data: {
              name: `Advisory Session — ${advisorName}`,
              description: `${durationMinutes}-minute session on ${new Date(scheduledAt).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} at ${timeStr}`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        advisorId,
        scheduledAt,
        durationMinutes: String(durationMinutes),
        price: String(price),
        userId: user.id,
      },
      success_url: `${siteUrl}/portal/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error("Checkout error:", error);

    // Return more specific error messages
    const message =
      error instanceof Error ? error.message : "Unknown error";

    // Check for common Stripe errors
    if (message.includes("STRIPE_SECRET_KEY")) {
      return NextResponse.json(
        { error: "Payment system not configured. Please contact support." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create checkout session. Please try again." },
      { status: 500 }
    );
  }
}
