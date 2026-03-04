import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createServerClient } from "@supabase/ssr";

export const dynamic = "force-dynamic";

// Use service role client to bypass RLS (webhook runs outside user auth context)
function createServiceClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {},
      },
    }
  );
}

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event;

  const stripe = getStripe();

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const metadata = session.metadata;

    if (!metadata?.advisorId || !metadata?.userId) {
      console.error("Missing metadata in checkout session:", session.id);
      return NextResponse.json({ received: true });
    }

    const supabase = createServiceClient();

    // Create the booking now that payment is confirmed
    const { error } = await supabase.from("bookings").insert({
      user_id: metadata.userId,
      advisor_id: metadata.advisorId,
      duration_minutes: parseInt(metadata.durationMinutes),
      scheduled_at: metadata.scheduledAt,
      price: parseInt(metadata.price),
      status: "confirmed",
      stripe_payment_id: session.payment_intent as string,
    });

    if (error) {
      console.error("Failed to create booking:", error);
      return NextResponse.json(
        { error: "Failed to create booking" },
        { status: 500 }
      );
    }

    console.log(
      `Booking created for user ${metadata.userId} with advisor ${metadata.advisorId}`
    );
  }

  if (event.type === "invoice.paid") {
    const invoice = event.data.object;
    const metadata = invoice.metadata;

    if (!metadata?.advisorId || !metadata?.userId) {
      // Not one of our advisory invoices — ignore
      return NextResponse.json({ received: true });
    }

    const supabase = createServiceClient();

    // Find the booking by stripe_invoice_id and update to confirmed
    const { error } = await supabase
      .from("bookings")
      .update({
        status: "confirmed",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        stripe_payment_id: (invoice as any).payment_intent as string || null,
      })
      .eq("stripe_invoice_id", invoice.id);

    if (error) {
      console.error("Failed to confirm invoiced booking:", error);
      return NextResponse.json(
        { error: "Failed to confirm booking" },
        { status: 500 }
      );
    }

    console.log(
      `Invoice paid — booking confirmed for user ${metadata.userId} with advisor ${metadata.advisorId}`
    );
  }

  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object;
    const metadata = invoice.metadata;

    if (metadata?.advisorId && metadata?.userId) {
      console.error(
        `Invoice payment failed for user ${metadata.userId}, advisor ${metadata.advisorId}, invoice ${invoice.id}`
      );
    }
  }

  return NextResponse.json({ received: true });
}
