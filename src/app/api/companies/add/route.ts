import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";

export const maxDuration = 60;

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { company_name } = await req.json();

  if (!company_name) {
    return NextResponse.json({ error: "company_name required" }, { status: 400 });
  }

  // Generate abbreviation
  const words = company_name.trim().split(/\s+/);
  const abbr =
    words.length > 1
      ? words.map((w: string) => w[0]).join("").slice(0, 3).toUpperCase()
      : company_name.slice(0, 2).toUpperCase();

  // Defaults if Claude fails
  let funding = "Undisclosed";
  let valuation = "Undisclosed";
  let employees = "Unknown";
  let news = `${company_name} added to radar`;
  let trending = false;
  let sector = "Software";

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      tools: [
        {
          type: "web_search_20250305" as const,
          name: "web_search",
          max_uses: 5,
        },
      ],
      messages: [
        {
          role: "user",
          content: `Search the web for the company "${company_name}" in the defense, aerospace, or hard tech space.

Find and provide:
- funding: Total funding raised (e.g. "$50M", "$1.2B+"). "Public" if publicly traded. "Undisclosed" if unknown.
- valuation: Latest valuation or market cap (e.g. "$500M"). "Undisclosed" if unknown.
- employees: Approximate headcount (e.g. "50+", "200+"). "Unknown" if not findable.
- news: One headline (max 12 words) about their most recent activity
- trending: true if significant news in the past 60 days
- sector: Best match from: Defense AI, Space, Manufacturing, Aerospace, Directed Energy, Software, Sensors, Robotics

Return ONLY valid JSON, no markdown, no explanation:
{"funding":"...","valuation":"...","employees":"...","news":"...","trending":false,"sector":"..."}`,
        },
      ],
    });

    const textBlocks = response.content.filter(
      (block): block is Anthropic.TextBlock => block.type === "text"
    );
    const text = textBlocks.map((b) => b.text).join("");
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      funding = parsed.funding || funding;
      valuation = parsed.valuation || valuation;
      employees = parsed.employees || employees;
      news = parsed.news || news;
      trending = parsed.trending ?? trending;
      sector = parsed.sector || sector;
    }
  } catch (e) {
    console.error("Claude research failed:", e);
  }

  const companyData = {
    name: company_name.trim(),
    abbr,
    sector,
    funding,
    valuation,
    employees,
    news,
    trending,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("studio_companies")
    .upsert(companyData, { onConflict: "name" });

  if (error) {
    return NextResponse.json(
      { error: "Failed to add company", details: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, company: companyData });
}
