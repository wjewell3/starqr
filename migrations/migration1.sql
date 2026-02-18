create table public.check_ins (
  id uuid not null default extensions.uuid_generate_v4 (),
  merchant_id uuid not null,
  customer_id uuid not null,
  stamps_added integer null default 1,
  created_at timestamp with time zone null default now(),
  constraint check_ins_pkey primary key (id),
  constraint check_ins_customer_id_fkey foreign KEY (customer_id) references customers (id) on delete CASCADE,
  constraint check_ins_merchant_id_fkey foreign KEY (merchant_id) references merchants (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_checkins_merchant_customer on public.check_ins using btree (merchant_id, customer_id) TABLESPACE pg_default;

create index IF not exists idx_checkins_created on public.check_ins using btree (merchant_id, created_at desc) TABLESPACE pg_default;

create table public.customers (
  id uuid not null default extensions.uuid_generate_v4 (),
  merchant_id uuid not null,
  phone_hash text not null,
  phone_last_4 text not null,
  stamps_current integer null default 0,
  stamps_lifetime integer null default 0,
  visits_total integer null default 0,
  first_visit_at timestamp with time zone null default now(),
  last_visit_at timestamp with time zone null,
  apple_pass_serial text null,
  google_pass_id text null,
  wallet_enabled boolean null default false,
  created_at timestamp with time zone null default now(),
  constraint customers_pkey primary key (id),
  constraint customers_google_pass_id_key unique (google_pass_id),
  constraint customers_apple_pass_serial_key unique (apple_pass_serial),
  constraint customers_merchant_id_phone_hash_key unique (merchant_id, phone_hash),
  constraint customers_merchant_id_fkey foreign KEY (merchant_id) references merchants (id) on delete CASCADE,
  constraint customers_stamps_current_check check ((stamps_current >= 0)),
  constraint customers_stamps_lifetime_check check ((stamps_lifetime >= 0))
) TABLESPACE pg_default;

create index IF not exists idx_customers_merchant on public.customers using btree (merchant_id) TABLESPACE pg_default;

create index IF not exists idx_customers_phone_hash on public.customers using btree (merchant_id, phone_hash) TABLESPACE pg_default;

create table public.customers (
  id uuid not null default extensions.uuid_generate_v4 (),
  merchant_id uuid not null,
  phone_hash text not null,
  phone_last_4 text not null,
  stamps_current integer null default 0,
  stamps_lifetime integer null default 0,
  visits_total integer null default 0,
  first_visit_at timestamp with time zone null default now(),
  last_visit_at timestamp with time zone null,
  apple_pass_serial text null,
  google_pass_id text null,
  wallet_enabled boolean null default false,
  created_at timestamp with time zone null default now(),
  constraint customers_pkey primary key (id),
  constraint customers_google_pass_id_key unique (google_pass_id),
  constraint customers_apple_pass_serial_key unique (apple_pass_serial),
  constraint customers_merchant_id_phone_hash_key unique (merchant_id, phone_hash),
  constraint customers_merchant_id_fkey foreign KEY (merchant_id) references merchants (id) on delete CASCADE,
  constraint customers_stamps_current_check check ((stamps_current >= 0)),
  constraint customers_stamps_lifetime_check check ((stamps_lifetime >= 0))
) TABLESPACE pg_default;

create index IF not exists idx_customers_merchant on public.customers using btree (merchant_id) TABLESPACE pg_default;

create index IF not exists idx_customers_phone_hash on public.customers using btree (merchant_id, phone_hash) TABLESPACE pg_default;

create table public.customers (
  id uuid not null default extensions.uuid_generate_v4 (),
  merchant_id uuid not null,
  phone_hash text not null,
  phone_last_4 text not null,
  stamps_current integer null default 0,
  stamps_lifetime integer null default 0,
  visits_total integer null default 0,
  first_visit_at timestamp with time zone null default now(),
  last_visit_at timestamp with time zone null,
  apple_pass_serial text null,
  google_pass_id text null,
  wallet_enabled boolean null default false,
  created_at timestamp with time zone null default now(),
  constraint customers_pkey primary key (id),
  constraint customers_google_pass_id_key unique (google_pass_id),
  constraint customers_apple_pass_serial_key unique (apple_pass_serial),
  constraint customers_merchant_id_phone_hash_key unique (merchant_id, phone_hash),
  constraint customers_merchant_id_fkey foreign KEY (merchant_id) references merchants (id) on delete CASCADE,
  constraint customers_stamps_current_check check ((stamps_current >= 0)),
  constraint customers_stamps_lifetime_check check ((stamps_lifetime >= 0))
) TABLESPACE pg_default;

create index IF not exists idx_customers_merchant on public.customers using btree (merchant_id) TABLESPACE pg_default;

create index IF not exists idx_customers_phone_hash on public.customers using btree (merchant_id, phone_hash) TABLESPACE pg_default;