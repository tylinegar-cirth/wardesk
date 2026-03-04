-- War Desk: Advisor Portal & Admin Dashboard RLS
-- Adds user_id to advisors + new RLS policies for advisor/admin roles

-- ============================================================
-- ADD user_id TO ADVISORS (links auth account → advisor record)
-- ============================================================
ALTER TABLE public.advisors ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
CREATE INDEX IF NOT EXISTS idx_advisors_user_id ON public.advisors(user_id);

-- ============================================================
-- ADVISOR RLS POLICIES
-- ============================================================

-- Advisors can read their own record
CREATE POLICY "Advisors can read own record"
  ON public.advisors FOR SELECT USING (user_id = auth.uid());

-- Advisors can update their own record (bio, image, availability_status)
CREATE POLICY "Advisors can update own record"
  ON public.advisors FOR UPDATE USING (user_id = auth.uid());

-- Advisors can see bookings assigned to them
CREATE POLICY "Advisors can read assigned bookings"
  ON public.bookings FOR SELECT USING (
    advisor_id IN (SELECT id FROM public.advisors WHERE user_id = auth.uid())
  );

-- Advisors can update assigned bookings (mark completed, add meeting link)
CREATE POLICY "Advisors can update assigned bookings"
  ON public.bookings FOR UPDATE USING (
    advisor_id IN (SELECT id FROM public.advisors WHERE user_id = auth.uid())
  );

-- Advisors can manage their own availability
CREATE POLICY "Advisors can insert own availability"
  ON public.availability FOR INSERT WITH CHECK (
    advisor_id IN (SELECT id FROM public.advisors WHERE user_id = auth.uid())
  );
CREATE POLICY "Advisors can update own availability"
  ON public.availability FOR UPDATE USING (
    advisor_id IN (SELECT id FROM public.advisors WHERE user_id = auth.uid())
  );
CREATE POLICY "Advisors can delete own availability"
  ON public.availability FOR DELETE USING (
    advisor_id IN (SELECT id FROM public.advisors WHERE user_id = auth.uid())
  );

-- Advisors can manage their own blocked dates
CREATE POLICY "Advisors can insert own blocked dates"
  ON public.blocked_dates FOR INSERT WITH CHECK (
    advisor_id IN (SELECT id FROM public.advisors WHERE user_id = auth.uid())
  );
CREATE POLICY "Advisors can update own blocked dates"
  ON public.blocked_dates FOR UPDATE USING (
    advisor_id IN (SELECT id FROM public.advisors WHERE user_id = auth.uid())
  );
CREATE POLICY "Advisors can delete own blocked dates"
  ON public.blocked_dates FOR DELETE USING (
    advisor_id IN (SELECT id FROM public.advisors WHERE user_id = auth.uid())
  );

-- Advisors can see their own retainer subscriptions
CREATE POLICY "Advisors can read assigned subscriptions"
  ON public.retained_subscriptions FOR SELECT USING (
    advisor_id IN (SELECT id FROM public.advisors WHERE user_id = auth.uid())
  );

-- ============================================================
-- ADMIN RLS POLICIES (supplements existing)
-- ============================================================

-- Admin: can update all users (role changes, etc.)
CREATE POLICY "Admins can update all users"
  ON public.users FOR UPDATE USING (
    id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );

-- Admin: delete availability
CREATE POLICY "Admins can delete availability"
  ON public.availability FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Admin: delete blocked dates
CREATE POLICY "Admins can delete blocked dates"
  ON public.blocked_dates FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );
