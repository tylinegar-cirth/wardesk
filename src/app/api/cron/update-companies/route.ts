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

const BATCH_SIZE = 6;

export async function GET(req: Request) {
  // Allow manual trigger via ?run=wardesk or Vercel CRON_SECRET
  const url = new URL(req.url);
  const manualRun = url.searchParams.get("run") === "wardesk";
  const authHeader = req.headers.get("authorization");
  if (!manualRun && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Support ?batch=0,1,2... to process one batch at a time (avoids timeout)
  const batchParam = url.searchParams.get("batch");

  const results: {
    name: string;
    funding: string;
    valuation: string;
    employees: string;
    news: string;
    trending: boolean;
  }[] = [];

  const errors: string[] = [];

  // Split companies into batches
  const allBatches: (typeof studioCompanies)[] = [];
  for (let i = 0; i < studioCompanies.length; i += BATCH_SIZE) {
    allBatches.push(studioCompanies.slice(i, i + BATCH_SIZE));
  }

  // If batch param specified, only process that batch
  const batchesToProcess =
    batchParam !== null
      ? [allBatches[parseInt(batchParam)]].filter(Boolean)
      : allBatches;

  for (const batch of batchesToProcess) {
    const companyList = batch
      .map(
        (c) =>
          `- ${c.name} (${c.sector}) — STALE DATA: valuation ${c.valuation}, funding ${c.funding}, employees ${c.employees}`
      )
      .join("\n");

    try {
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 4096,
        tools: [
          {
            type: "web_search_20250305" as const,
            name: "web_search",
            max_uses: 10,
          },
        ],
        messages: [
          {
            role: "user",
            content: `You MUST use the web_search tool to look up current 2025-2026 data for these companies. The data shown below is STALE and likely WRONG. Do NOT repeat it back — search for the real current numbers.

For each company, search the web and provide:
- funding: Total funding raised to date (e.g. "$4.7B+"). "Public" for publicly traded companies.
- valuation: Latest known valuation or market cap as of 2025-2026 (e.g. "$28B"). "Undisclosed" if truly unknown after searching.
- employees: Current approximate headcount (e.g. "3,000+")
- news: One headline (max 12 words) about their most recent notable activity in 2025-2026
- trending: true if significant news in the past 60 days

Companies with STALE data to update:
${companyList}

IMPORTANT: Search the web for EACH company. Do not guess or use the stale data shown above.

Return ONLY a valid JSON array. No markdown fences, no explanation.
[{"name":"CompanyName","funding":"...","valuation":"...","employees":"...","news":"...","trending":true}]`,
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
      } else {
        errors.push(
          `No JSON found for batch: ${batch.map((c) => c.name).join(", ")}. Response: ${text.slice(0, 200)}`
        );
      }
    } catch (e) {
      errors.push(
        `Batch failed: ${batch.map((c) => c.name).join(", ")} — ${e}`
      );
    }
  }

  // Merge with static data and upsert — only companies in processed batches
  const processedCompanies =
    batchParam !== null
      ? batchesToProcess.flat()
      : studioCompanies;
  const upsertData = processedCompanies.map((company) => {
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
    return NextResponse.json(
      { error: "Failed to update", details: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    updated: upsertData.length,
    resultsFromClaude: results.length,
    totalBatches: allBatches.length,
    batchProcessed: batchParam ?? "all",
    errors: errors.length > 0 ? errors : undefined,
    sample: results.slice(0, 3),
    timestamp: new Date().toISOString(),
  });
}
