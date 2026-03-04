import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { advisorId, advisorName, scheduledAt, durationMinutes, price } =
      body as {
        advisorId: string;
        advisorName: string;
        scheduledAt: string;
        durationMinutes: number;
        price: number; // in cents
      };

    if (!advisorId || !scheduledAt || !durationMinutes || !price) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Look up or create Stripe customer
    const { data: profile } = await supabase
      .from("users")
      .select("stripe_customer_id, email, name")
      .eq("id", user.id)
      .single();

    const stripe = getStripe();
    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: profile?.email || user.email,
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
    const scheduledDate = new Date(scheduledAt);
    const dateStr = scheduledAt.split("T")[0];
    const timeStr = `${String(scheduledDate.getHours()).padStart(2, "0")}:${String(scheduledDate.getMinutes()).padStart(2, "0")}`;
    const cancelUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/portal/advisor/${advisorId}?dur=${durationMinutes}&date=${dateStr}&time=${encodeURIComponent(timeStr)}`;

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
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/portal/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
