-- War Desk Initial Schema
-- 6 tables: advisors, users, bookings, retained_subscriptions, availability, blocked_dates

create extension if not exists "uuid-ossp";

-- ============================================================
-- ADVISORS
-- ============================================================
create table public.advisors (
  id                  uuid primary key default uuid_generate_v4(),
  name                text not null,
  title               text not null,
  branch              text not null,
  category            text not null,
  stars               int not null default 0,
  focus               text[] not null default '{}',
  clearance           text not null default 'TS/SCI',
  rate                int not null,
  bio                 text,
  image_url           text,
  years_service       int not null default 0,
  availability_status text not null default 'available'
    check (availability_status in ('available', 'limited', 'unavailable')),
  created_at          timestamptz not null default now()
);

-- ============================================================
-- USERS (extends auth.users)
-- ============================================================
create table public.users (
  id                 uuid primary key references auth.users(id) on delete cascade,
  email              text not null,
  name               text,
  company            text,
  role               text not null default 'user'
    check (role in ('user', 'advisor', 'admin')),
  focus_areas        text[] default '{}',
  stripe_customer_id text,
  created_at         timestamptz not null default now()
);

-- ============================================================
-- BOOKINGS
-- ============================================================
create table public.bookings (
  id                uuid primary key default uuid_generate_v4(),
  user_id           uuid not null references public.users(id) on delete cascade,
  advisor_id        uuid not null references public.advisors(id) on delete cascade,
  duration_minutes  int not null check (duration_minutes in (30, 60, 90)),
  scheduled_at      timestamptz not null,
  status            text not null default 'confirmed'
    check (status in ('confirmed', 'completed', 'cancelled', 'no-show')),
  price             int not null,
  stripe_payment_id text,
  meeting_link      text,
  notes             text,
  created_at        timestamptz not null default now()
);

-- ============================================================
-- RETAINED SUBSCRIPTIONS
-- ============================================================
create table public.retained_subscriptions (
  id                     uuid primary key default uuid_generate_v4(),
  user_id                uuid not null references public.users(id) on delete cascade,
  advisor_id             uuid not null references public.advisors(id) on delete cascade,
  tier                   text not null check (tier in ('signal', 'strategy', 'principal')),
  hours_per_month        int not null,
  monthly_price          int not null,
  stripe_subscription_id text,
  status                 text not null default 'active'
    check (status in ('active', 'paused', 'cancelled')),
  created_at             timestamptz not null default now()
);

-- ============================================================
-- AVAILABILITY
-- ============================================================
create table public.availability (
  id          uuid primary key default uuid_generate_v4(),
  advisor_id  uuid not null references public.advisors(id) on delete cascade,
  day_of_week int not null check (day_of_week between 0 and 6),
  start_time  time not null,
  end_time    time not null,
  timezone    text not null default 'America/New_York'
);

-- ============================================================
-- BLOCKED DATES
-- ============================================================
create table public.blocked_dates (
  id         uuid primary key default uuid_generate_v4(),
  advisor_id uuid not null references public.advisors(id) on delete cascade,
  date       date not null,
  reason     text
);

-- ============================================================
-- INDEXES
-- ============================================================
create index idx_bookings_user on public.bookings(user_id);
create index idx_bookings_advisor on public.bookings(advisor_id);
create index idx_bookings_scheduled on public.bookings(scheduled_at);
create index idx_availability_advisor on public.availability(advisor_id);
create index idx_blocked_dates_advisor on public.blocked_dates(advisor_id);
create index idx_retained_user on public.retained_subscriptions(user_id);
create index idx_retained_advisor on public.retained_subscriptions(advisor_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.advisors enable row level security;
alter table public.users enable row level security;
alter table public.bookings enable row level security;
alter table public.retained_subscriptions enable row level security;
alter table public.availability enable row level security;
alter table public.blocked_dates enable row level security;

-- ADVISORS: public read, admin write
create policy "Advisors are publicly readable"
  on public.advisors for select using (true);
create policy "Admins can insert advisors"
  on public.advisors for insert with check (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );
create policy "Admins can update advisors"
  on public.advisors for update using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );
create policy "Admins can delete advisors"
  on public.advisors for delete using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

-- USERS: own data + admin
create policy "Users can read own profile"
  on public.users for select using (id = auth.uid());
create policy "Users can update own profile"
  on public.users for update using (id = auth.uid());
create policy "Users can insert own profile"
  on public.users for insert with check (id = auth.uid());
create policy "Admins can read all users"
  on public.users for select using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

-- BOOKINGS: users see own, admins see all
create policy "Users can read own bookings"
  on public.bookings for select using (user_id = auth.uid());
create policy "Users can insert bookings"
  on public.bookings for insert with check (user_id = auth.uid());
create policy "Users can update own bookings"
  on public.bookings for update using (user_id = auth.uid());
create policy "Admins can manage all bookings"
  on public.bookings for all using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

-- RETAINED SUBSCRIPTIONS
create policy "Users can read own subscriptions"
  on public.retained_subscriptions for select using (user_id = auth.uid());
create policy "Users can insert subscriptions"
  on public.retained_subscriptions for insert with check (user_id = auth.uid());
create policy "Admins can manage all subscriptions"
  on public.retained_subscriptions for all using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

-- AVAILABILITY: public read, admin write
create policy "Availability is publicly readable"
  on public.availability for select using (true);
create policy "Admins can manage availability"
  on public.availability for insert with check (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );
create policy "Admins can update availability"
  on public.availability for update using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

-- BLOCKED DATES: public read, admin write
create policy "Blocked dates are publicly readable"
  on public.blocked_dates for select using (true);
create policy "Admins can manage blocked dates"
  on public.blocked_dates for insert with check (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );
create policy "Admins can update blocked dates"
  on public.blocked_dates for update using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );
