import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: NextRequest) {
  // Verify the user is authenticated
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { mission } = await req.json();
  if (!mission || typeof mission !== "string" || mission.trim().length < 10) {
    return NextResponse.json(
      { error: "Please describe your mission in at least a few words." },
      { status: 400 }
    );
  }

  // Fetch all advisors from Supabase
  const { data: advisors, error: dbError } = await supabase
    .from("advisors")
    .select("id, name, title, branch, category, stars, focus, clearance, rate, bio, image_url, years_service, availability_status")
    .eq("availability_status", "available")
    .order("stars", { ascending: false });

  if (dbError || !advisors) {
    return NextResponse.json(
      { error: "Failed to load advisors." },
      { status: 500 }
    );
  }

  const advisorRoster = advisors
    .map(
      (a) =>
        `[${a.id}] ${a.name} — ${a.title} | ${a.branch} | ${a.stars}-star | Focus: ${a.focus.join(", ")} | Clearance: ${a.clearance} | ${a.years_service}yr service | $${a.rate}/hr\nBio: ${a.bio || "N/A"}`
    )
    .join("\n\n");

  try {
    const response = await anthropic.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 2048,
      thinking: { type: "adaptive" },
      system: `You are the War Desk mission concierge — an expert at matching defense technology companies with the right senior military and defense advisors.

Given a client's mission brief, ALWAYS recommend exactly 3 advisors from the roster below, ranked #1 to #3 by relevance. Never return an empty list — even if the brief is vague, pick the 3 best-fit advisors. For each recommendation, explain WHY this advisor is uniquely suited to help — reference their specific experience, title, focus areas, and how those connect to the client's stated goals.

ADVISOR ROSTER:
${advisorRoster}

Respond in valid JSON only. No markdown, no code fences. Use this exact structure:
{
  "recommendations": [
    {
      "advisor_id": "uuid-here",
      "name": "Full Name",
      "reason": "2-3 sentence explanation of why this advisor matches their mission"
    }
  ],
  "summary": "One sentence summarizing the recommended approach"
}`,
      messages: [
        {
          role: "user",
          content: `MISSION BRIEF:\n${mission.trim()}`,
        },
      ],
    });

    // Extract text from response
    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json(
        { error: "No response from AI." },
        { status: 500 }
      );
    }

    // Parse the JSON response
    let parsed;
    try {
      parsed = JSON.parse(textBlock.text);
    } catch {
      // Try to extract JSON from the response if it has extra text
      const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        return NextResponse.json(
          { error: "Failed to parse AI response." },
          { status: 500 }
        );
      }
    }

    // Enrich recommendations with full advisor data
    const enriched = parsed.recommendations.map(
      (rec: { advisor_id: string; name: string; reason: string }) => {
        const advisor = advisors.find((a) => a.id === rec.advisor_id);
        return {
          ...rec,
          advisor: advisor || null,
        };
      }
    );

    return NextResponse.json({
      recommendations: enriched,
      summary: parsed.summary,
    });
  } catch (err: unknown) {
    console.error("Claude API error:", err);
    const message =
      err instanceof Error ? err.message : "AI matching failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
