import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { advisors as staticAdvisors } from "@/data/advisors";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: NextRequest) {
  // Check for demo mode or authenticated user
  const cookieStore = cookies();
  const isDemo = cookieStore.has("wd-demo");

  if (!isDemo) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const { mission } = await req.json();
  if (!mission || typeof mission !== "string" || mission.trim().length < 10) {
    return NextResponse.json(
      { error: "Please describe your mission in at least a few words." },
      { status: 400 }
    );
  }

  // In demo mode, use static advisors; otherwise fetch from Supabase
  let advisorList: {
    id: string | number;
    name: string;
    title: string;
    branch: string;
    category?: string;
    stars: number;
    focus: string[];
    clearance: string;
    rate: number;
    bio: string;
    image_url: string | null;
    years_service?: number;
    years?: number;
  }[];

  if (isDemo) {
    advisorList = staticAdvisors.map((a) => ({
      id: a.id,
      name: a.name,
      title: a.title,
      branch: a.branch,
      category: a.category,
      stars: a.stars,
      focus: a.focus,
      clearance: a.clearance,
      rate: a.rate,
      bio: a.bio,
      image_url: a.image,
      years: a.years,
    }));
  } else {
    const supabase = createClient();
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
    advisorList = advisors;
  }

  const advisorRoster = advisorList
    .map(
      (a) =>
        `[${a.id}] ${a.name} — ${a.title} | ${a.branch} | ${a.stars}-star | Focus: ${a.focus.join(", ")} | Clearance: ${a.clearance} | ${a.years_service ?? a.years ?? "N/A"}yr service | $${a.rate}/hr\nBio: ${a.bio || "N/A"}`
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
        const advisor = advisorList.find((a) => String(a.id) === String(rec.advisor_id));
        return {
          ...rec,
          advisor: advisor
            ? {
                id: String(advisor.id),
                name: advisor.name,
                title: advisor.title,
                branch: advisor.branch,
                stars: advisor.stars,
                focus: advisor.focus,
                rate: advisor.rate,
                image_url: advisor.image_url,
              }
            : null,
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
