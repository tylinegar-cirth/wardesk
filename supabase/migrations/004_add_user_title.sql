-- Add title/position field to users table
alter table public.users add column if not exists title text;
