-- Company submission requests ("Add your company" on the radar)
CREATE TABLE IF NOT EXISTS company_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE company_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert" ON company_submissions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Service read" ON company_submissions FOR SELECT TO service_role USING (true);
