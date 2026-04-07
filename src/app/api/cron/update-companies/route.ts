import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import { studioCompanies } from "@/data/studio-companies";

export const maxDuration = 300;

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BATCH_SIZE = 10;

export async function GET(req: Request) {
  // Allow manual trigger via ?secret= param, or Vercel CRON_SECRET header
  const url = new URL(req.url);
  const manualSecret = url.searchParams.get("secret");
  const authHeader = req.headers.get("authorization");
  const isAuthorized =
    authHeader === `Bearer ${process.env.CRON_SECRET}` ||
    manualSecret === process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: {
    name: string;
    funding: string;
    valuation: string;
    employees: string;
    news: string;
    trending: boolean;
  }[] = [];

  // Process companies in batches
  const batches: (typeof studioCompanies)[] = [];
  for (let i = 0; i < studioCompanies.length; i += BATCH_SIZE) {
    batches.push(studioCompanies.slice(i, i + BATCH_SIZE));
  }

  for (const batch of batches) {
    const companyList = batch
      .map((c) => `- ${c.name} (${c.sector})`)
      .join("\n");

    try {
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-6-20250514",
        max_tokens: 4096,
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
            content: `Research these defense/aerospace/hard-tech companies and return their latest data. Search the web for current information.

For each company provide:
- funding: Total funding raised (e.g. "$2.8B+"). Use "Public" for publicly traded companies.
- valuation: Latest valuation or market cap (e.g. "$14B" or "$50B+ MCap"). "Undisclosed" if unknown.
- employees: Approximate headcount (e.g. "2,500+")
- news: One headline (max 12 words) about their most recent notable activity
- trending: true if significant news in the past 60 days

Companies:
${companyList}

Return ONLY a valid JSON array. No markdown fences, no explanation. Example format:
[{"name":"Anduril","funding":"$2.8B+","valuation":"$14B","employees":"2,500+","news":"Roadrunner-M in full production","trending":true}]`,
          },
        ],
      });

      const textBlocks = response.content.filter(
        (block): block is Anthropic.TextBlock => block.type === "text"
      );
      const text = textBlocks.map((b) => b.text).join("");

      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        results.push(...parsed);
      }
    } catch (e) {
      console.error("Failed to process batch:", e);
    }
  }

  // Merge with static data and upsert
  const upsertData = studioCompanies.map((company) => {
    const updated = results.find(
      (r) => r.name.toLowerCase() === company.name.toLowerCase()
    );
    return {
      name: company.name,
      abbr: company.abbr,
      sector: company.sector,
      funding: updated?.funding || company.funding,
      valuation: updated?.valuation || company.valuation,
      employees: updated?.employees || company.employees,
      news: updated?.news || company.news,
      trending: updated?.trending ?? company.trending,
      updated_at: new Date().toISOString(),
    };
  });

  const { error } = await supabase
    .from("studio_companies")
    .upsert(upsertData, { onConflict: "name" });

  if (error) {
    console.error("Supabase upsert error:", error);
    return NextResponse.json(
      { error: "Failed to update", details: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    updated: upsertData.length,
    timestamp: new Date().toISOString(),
  });
}
