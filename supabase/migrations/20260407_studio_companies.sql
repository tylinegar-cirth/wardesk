-- Studio companies table for monthly auto-updated company data
CREATE TABLE IF NOT EXISTS studio_companies (
  name TEXT PRIMARY KEY,
  abbr TEXT NOT NULL,
  sector TEXT NOT NULL,
  funding TEXT NOT NULL DEFAULT 'Undisclosed',
  valuation TEXT NOT NULL DEFAULT 'Undisclosed',
  employees TEXT NOT NULL DEFAULT 'Unknown',
  news TEXT NOT NULL DEFAULT '',
  trending BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Public data — allow reads from anon, writes from service role
ALTER TABLE studio_companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON studio_companies FOR SELECT TO anon USING (true);
CREATE POLICY "Service write access" ON studio_companies FOR ALL TO service_role USING (true);
