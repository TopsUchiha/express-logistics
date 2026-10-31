// Created on first connection. Every statement is idempotent.
export const SCHEMA = `
create table if not exists admin_users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text not null,
  created_at timestamptz not null default now()
);
create table if not exists admin_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references admin_users(id) on delete cascade,
  token_hash text unique not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
create table if not exists shipments (
  id uuid primary key default gen_random_uuid(),
  tracking_number text unique not null,
  status text not null default 'PENDING',
  mode text not null check (mode in ('air','ocean','road')),
  service text not null,
  sender_name text not null, sender_phone text, sender_email text, sender_address text,
  receiver_name text not null, receiver_phone text, receiver_email text, receiver_address text,
  origin text not null, origin_lat double precision not null, origin_lng double precision not null,
  destination text not null, dest_lat double precision not null, dest_lng double precision not null,
  current_location text not null, current_lat double precision not null, current_lng double precision not null,
  eta date, product text, quantity text, total_freight text, comment text,
  packages jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists shipments_created_idx on shipments(created_at desc);
create table if not exists shipment_events (
  id uuid primary key default gen_random_uuid(),
  shipment_id uuid not null references shipments(id) on delete cascade,
  status text not null, location text not null, description text,
  created_at timestamptz not null default now()
);
create index if not exists events_shipment_idx on shipment_events(shipment_id, created_at);
create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null, email text not null, message text not null,
  status text not null default 'NEW',
  created_at timestamptz not null default now()
);
create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  shipment_id uuid unique not null references shipments(id) on delete cascade,
  contact_email text not null,
  status text not null default 'OPEN',
  admin_unread int not null default 0,
  client_unread int not null default 0,
  admin_notified_at timestamptz,
  client_notified_at timestamptz,
  created_at timestamptz not null default now(),
  last_message_at timestamptz not null default now()
);
create table if not exists messages (
  id bigint generated always as identity primary key,
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender text not null check (sender in ('CLIENT','AGENT','SYSTEM')),
  body text not null,
  created_at timestamptz not null default now()
);
create index if not exists messages_conv_idx on messages(conversation_id, id);
create table if not exists chat_sessions (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  token_hash text unique not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
create table if not exists rate_limits (
  key text primary key,
  count int not null,
  window_start timestamptz not null default now()
);
`
