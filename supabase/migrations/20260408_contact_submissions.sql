-- Contact form submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL,
  message TEXT NOT NULL DEFAULT '',
  source TEXT NOT NULL DEFAULT 'studio_contact',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Deck download requests
CREATE TABLE IF NOT EXISTS deck_downloads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Allow inserts from anon (public forms), reads from service role only
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert" ON contact_submissions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Service read" ON contact_submissions FOR SELECT TO service_role USING (true);

ALTER TABLE deck_downloads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert" ON deck_downloads FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Service read" ON deck_downloads FOR SELECT TO service_role USING (true);
