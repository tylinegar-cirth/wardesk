import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";

export async function GET(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing session_id" },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Verify this session belongs to the authenticated user
    if (session.metadata?.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const metadata = session.metadata!;
    const scheduledDate = new Date(metadata.scheduledAt);

    // Look up advisor name
    const { data: advisor } = await supabase
      .from("advisors")
      .select("name")
      .eq("id", metadata.advisorId)
      .single();

    return NextResponse.json({
      advisorName: advisor?.name || "Advisor",
      date: scheduledDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
      time: `${String(scheduledDate.getHours()).padStart(2, "0")}:${String(scheduledDate.getMinutes()).padStart(2, "0")}`,
      duration: `${metadata.durationMinutes} minutes`,
      price: `$${(parseInt(metadata.price) / 100).toLocaleString()}`,
    });
  } catch (error) {
    console.error("Session lookup error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve session" },
      { status: 500 }
    );
  }
}
