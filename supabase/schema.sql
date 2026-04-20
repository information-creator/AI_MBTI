-- AImBTI Supabase 스키마
-- Supabase SQL Editor에 통째로 붙여넣어 실행
-- 현재 코드 기준 테이블: results_v2, coupons, events, daily_ads_metrics, daily_funnel_metrics

-- =========================================
-- 결과 저장 (테스트 결과)
-- =========================================
create table if not exists public.results_v2 (
  id              uuid primary key default gen_random_uuid(),
  type_code       text not null,
  type_name       text,
  ai_score        integer not null check (ai_score >= 0 and ai_score <= 100),
  score_a         integer,
  score_b         integer,
  score_c         integer,
  score_d         integer,
  score_e         integer,
  work_style      text,
  ai_usage        text,
  strength        text,
  speed           text,
  overtime_result text,
  shared          boolean default false,
  created_at      timestamptz not null default now()
);

create index if not exists results_v2_created_at_idx on public.results_v2(created_at desc);
create index if not exists results_v2_type_code_idx on public.results_v2(type_code);

-- =========================================
-- 쿠폰 (결과당 1개 자동 생성, UI 미노출)
-- =========================================
create table if not exists public.coupons (
  id         uuid primary key default gen_random_uuid(),
  code       text unique not null,
  used       boolean not null default false,
  result_id  uuid references public.results_v2(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists coupons_result_id_idx on public.coupons(result_id);
create index if not exists coupons_code_idx on public.coupons(code);

-- =========================================
-- 이벤트 로그
-- (page_view, cta_click, test_start, test_complete, result_view,
--  openchat_click, ebook_click, share_click)
-- =========================================
create table if not exists public.events (
  id         uuid primary key default gen_random_uuid(),
  event_name text not null,
  type_code  text,
  metadata   jsonb,
  created_at timestamptz not null default now()
);

create index if not exists events_created_at_idx on public.events(created_at desc);
create index if not exists events_event_name_idx on public.events(event_name);
create index if not exists events_metadata_gin   on public.events using gin (metadata);

-- =========================================
-- 광고 지표 일별 스냅샷
-- =========================================
create table if not exists public.daily_ads_metrics (
  id           uuid primary key default gen_random_uuid(),
  date         date not null,
  platform     text not null,                 -- 'meta' | 'google'
  impressions  integer default 0,
  clicks       integer default 0,
  spend        integer default 0,
  conversions  integer default 0,
  ctr          numeric(5,2) default 0,
  cpc          integer default 0,
  cpm          integer default 0,
  created_at   timestamptz default now(),
  unique (date, platform)
);

create index if not exists daily_ads_metrics_date_idx on public.daily_ads_metrics(date desc);

-- =========================================
-- 퍼널 지표 일별 스냅샷
-- =========================================
create table if not exists public.daily_funnel_metrics (
  id               uuid primary key default gen_random_uuid(),
  date             date not null unique,
  total_users      integer default 0,
  cta_clicks       integer default 0,
  test_starts      integer default 0,
  test_completes   integer default 0,
  result_views     integer default 0,
  openchat_clicks  integer default 0,
  ebook_clicks     integer default 0,
  share_clicks     integer default 0,
  created_at       timestamptz default now()
);

create index if not exists daily_funnel_metrics_date_idx on public.daily_funnel_metrics(date desc);

-- =========================================
-- 전자책 수강생 일별 스냅샷 (메타코드 API 크롤링)
-- =========================================
create table if not exists public.daily_ebook_metrics (
  id         uuid primary key default gen_random_uuid(),
  date       date not null,
  ebook_id   text not null,
  title      text not null,
  students   integer not null default 0,
  created_at timestamptz default now(),
  unique (date, ebook_id)
);

create index if not exists daily_ebook_metrics_date_idx     on public.daily_ebook_metrics(date desc);
create index if not exists daily_ebook_metrics_ebook_id_idx on public.daily_ebook_metrics(ebook_id);

-- =========================================
-- RLS (익명 insert/select 허용)
-- =========================================
alter table public.results_v2           enable row level security;
alter table public.coupons              enable row level security;
alter table public.events               enable row level security;
alter table public.daily_ads_metrics    enable row level security;
alter table public.daily_funnel_metrics enable row level security;
alter table public.daily_ebook_metrics  enable row level security;

-- results_v2
create policy "anon insert results_v2" on public.results_v2 for insert with check (true);
create policy "anon select results_v2" on public.results_v2 for select using (true);

-- coupons
create policy "anon insert coupons" on public.coupons for insert with check (true);
create policy "anon select coupons" on public.coupons for select using (true);
create policy "anon update coupons" on public.coupons for update using (true) with check (true);

-- events
create policy "anon insert events" on public.events for insert with check (true);
create policy "anon select events" on public.events for select using (true);

-- daily_ads_metrics
create policy "anon insert daily_ads_metrics" on public.daily_ads_metrics for insert with check (true);
create policy "anon select daily_ads_metrics" on public.daily_ads_metrics for select using (true);
create policy "anon update daily_ads_metrics" on public.daily_ads_metrics for update using (true) with check (true);

-- daily_funnel_metrics
create policy "anon insert daily_funnel_metrics" on public.daily_funnel_metrics for insert with check (true);
create policy "anon select daily_funnel_metrics" on public.daily_funnel_metrics for select using (true);
create policy "anon update daily_funnel_metrics" on public.daily_funnel_metrics for update using (true) with check (true);

-- daily_ebook_metrics
create policy "anon insert daily_ebook_metrics" on public.daily_ebook_metrics for insert with check (true);
create policy "anon select daily_ebook_metrics" on public.daily_ebook_metrics for select using (true);
create policy "anon update daily_ebook_metrics" on public.daily_ebook_metrics for update using (true) with check (true);

-- =========================================
-- 대시보드 메모 (운영 기록용)
-- =========================================
create table if not exists public.dashboard_memos (
  id         uuid primary key default gen_random_uuid(),
  memo_date  date not null default current_date,
  content    text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_dashboard_memos_date
  on public.dashboard_memos (memo_date desc, created_at desc);

alter table public.dashboard_memos enable row level security;

create policy "anon select dashboard_memos" on public.dashboard_memos for select using (true);
create policy "anon insert dashboard_memos" on public.dashboard_memos for insert with check (true);
create policy "anon delete dashboard_memos" on public.dashboard_memos for delete using (true);
