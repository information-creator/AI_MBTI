-- AImBTI Supabase 스키마
-- Supabase SQL Editor에서 실행하세요

-- 결과 저장 테이블
create table if not exists results (
  id uuid default gen_random_uuid() primary key,
  mbti_type text not null,
  ai_score integer not null check (ai_score >= 0 and ai_score <= 100),
  job_type text not null,
  shared boolean default false,
  created_at timestamp with time zone default now()
);

-- 쿠폰 발급 테이블
create table if not exists coupons (
  id uuid default gen_random_uuid() primary key,
  code text unique not null,
  used boolean default false,
  result_id uuid references results(id) on delete cascade,
  created_at timestamp with time zone default now()
);

-- RLS 활성화
alter table results enable row level security;
alter table coupons enable row level security;

-- 익명 insert 허용
create policy "allow anon insert results"
  on results for insert
  with check (true);

create policy "allow anon insert coupons"
  on coupons for insert
  with check (true);

-- 본인 결과 조회 허용 (UUID 기반)
create policy "allow select results"
  on results for select
  using (true);

create policy "allow select coupons"
  on coupons for select
  using (true);

-- 쿠폰 사용 처리 (update)
create policy "allow update coupon used"
  on coupons for update
  using (true)
  with check (true);

-- 인덱스
create index if not exists results_created_at_idx on results(created_at desc);
create index if not exists coupons_result_id_idx on coupons(result_id);
create index if not exists coupons_code_idx on coupons(code);
