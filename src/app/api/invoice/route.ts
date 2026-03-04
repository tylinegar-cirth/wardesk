import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";
import { createServerClient } from "@supabase/ssr";
import { headers } from "next/headers";

function ensureScheme(url: string): string {
  const trimmed = url.replace(/\/$/, "");
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

function getSiteUrl(requestHeaders: Headers): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return ensureScheme(process.env.NEXT_PUBLIC_SITE_URL);
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  const host = requestHeaders.get("host") || "localhost:3000";
  const proto = requestHeaders.get("x-forwarded-proto") || "https";
  return `${proto}://${host}`;
}

// Service role client to bypass RLS for creating bookings
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
    const { advisorId, scheduledAt, durationMinutes, companyName, poNumber } =
      body as {
        advisorId: string;
        scheduledAt: string;
        durationMinutes: number;
        companyName: string;
        poNumber?: string;
      };

    if (!advisorId || !scheduledAt || !durationMinutes || !companyName) {
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
    const parsedDate = new Date(scheduledAt);
    if (isNaN(parsedDate.getTime()) || parsedDate.getTime() < Date.now()) {
      return NextResponse.json(
        { error: "Scheduled date must be valid and in the future" },
        { status: 400 }
      );
    }

    // Validate advisor exists and calculate price server-side
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

      await supabase
        .from("users")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    // Format date/time for descriptions
    const scheduledDate = new Date(scheduledAt);
    const timeStr = `${String(scheduledDate.getHours()).padStart(2, "0")}:${String(scheduledDate.getMinutes()).padStart(2, "0")}`;
    const dateStr = scheduledDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });

    // Create invoice item
    await stripe.invoiceItems.create({
      customer: customerId,
      amount: price,
      currency: "usd",
      description: `Advisory Session — ${advisorName}, ${durationMinutes}-min on ${dateStr} at ${timeStr}`,
    });

    // Create the invoice
    const invoiceParams: Record<string, unknown> = {
      customer: customerId,
      collection_method: "send_invoice",
      days_until_due: 30,
      metadata: {
        advisorId,
        scheduledAt,
        durationMinutes: String(durationMinutes),
        price: String(price),
        userId: user.id,
        companyName,
        ...(poNumber ? { poNumber } : {}),
      },
    };

    // Add PO number as custom field if provided
    if (poNumber) {
      invoiceParams.custom_fields = [{ name: "PO Number", value: poNumber }];
    }

    const invoice = await stripe.invoices.create(invoiceParams as Parameters<typeof stripe.invoices.create>[0]);

    // Finalize the invoice
    await stripe.invoices.finalizeInvoice(invoice.id);

    // Send the invoice
    await stripe.invoices.sendInvoice(invoice.id);

    // Create the booking immediately with pending_payment status
    const serviceClient = createServiceClient();
    const { error: bookingError } = await serviceClient.from("bookings").insert({
      user_id: user.id,
      advisor_id: advisorId,
      duration_minutes: durationMinutes,
      scheduled_at: scheduledAt,
      price,
      status: "pending_payment",
      stripe_payment_id: null,
      stripe_invoice_id: invoice.id,
      notes: `Invoice — ${companyName}${poNumber ? `, PO: ${poNumber}` : ""}`,
    });

    if (bookingError) {
      console.error("Failed to create booking for invoice:", bookingError);
      return NextResponse.json(
        { error: "Invoice created but failed to reserve booking slot" },
        { status: 500 }
      );
    }

    // Build redirect URL with booking details for the confirmation page
    const params = new URLSearchParams({
      advisor: advisorName,
      date: dateStr,
      time: timeStr,
      duration: String(durationMinutes),
      price: String(price),
      company: companyName,
    });

    return NextResponse.json({
      success: true,
      invoiceId: invoice.id,
      redirectUrl: `${siteUrl}/portal/booking/invoice-sent?${params.toString()}`,
    });
  } catch (error: unknown) {
    console.error("Invoice error:", error);

    const message =
      error instanceof Error ? error.message : "Unknown error";

    if (message.includes("STRIPE_SECRET_KEY")) {
      return NextResponse.json(
        { error: "Payment system not configured. Please contact support." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create invoice. Please try again." },
      { status: 500 }
    );
  }
}
