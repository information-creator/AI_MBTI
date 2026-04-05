# AI 시대 생존력 진단 서비스 — PRD

**버전**: v1.3  
**스택**: Next.js 16 (App Router) + Tailwind CSS v4 + Vercel + Supabase  
**배포 URL**: https://aimbti-jet.vercel.app  
**상태**: MVP 배포 완료 → 16유형 확장 진행 중

---

## 1. 서비스 개요

MBTI 유형 기반으로 AI 시대 생존 역량을 진단하고, 직업 추천 · 자동화 가이드 · 부트캠프 연동 · 커뮤니티로 연결하는 바이럴 테스트 서비스.

**핵심 KPI**
- metacode 부트캠프 유입 증대 (데이터 분석 / 데이터 엔지니어링 / AI LLM)
- 오픈채팅방 멤버 확보
- 결과 카드 SNS 공유 수

**핵심 가설**  
"내가 AI에 대체될까?" 라는 질문은 누구나 궁금하다. 결과를 SNS에 공유하게 만들면 광고비 없이 바이럴이 가능하다.

---

## 2. 페이지 구조

| 페이지 | 경로 | 역할 |
|---|---|---|
| 랜딩 | `/` | 훅 카피 + 테스트 시작 CTA + 무료 쿠폰 10개 배너 |
| 테스트 | `/test` | 16문항 스텝 형식 (4축 메인 + 퇴근 보너스) |
| 결과 | `/result/[id]` | 유형 캐릭터 + 직업 추천 + 부트캠프 추천 + 공유 카드 |
| 가이드 | `/guide` | 전자책 다운로드 / 오픈채팅방 입장 CTA |

---

## 3. 테스트 설계

### 핵심 4축 기준 (옵션 1 — AI 시대 생존 관점)

| 축 | 코드 A | 코드 B |
|---|---|---|
| 1. 업무 방식 | 혼자 깊게 (H) | 함께 넓게 (T) |
| 2. AI 활용도 | AI 적극 사용 (A) | 사람 감각 중심 (S) |
| 3. 강점 영역 | 논리/분석 (L) | 창의/감성 (C) |
| 4. 실행 속도 | 빠르게 실행 (F) | 완벽하게 준비 (P) |

각 축당 3~4문항 → 총 12~16문항으로 4글자 코드 산출

### 파트 A — 업무 방식 (3문항)
혼자 vs 함께 성향 측정

### 파트 B — AI 활용도 (3문항)
AI 적극 사용 vs 사람 감각 중심 측정

### 파트 C — 강점 영역 (3문항)
논리/분석 vs 창의/감성 측정

### 파트 D — 실행 속도 (3문항)
빠르게 실행 vs 완벽하게 준비 측정

### 파트 E — 퇴근/워라밸 보너스 (4문항, 유형 반영 없음)
유머 문항. 공유율 상승 목적. 결과 페이지에 별도 표시.

| 축 | A | B |
|---|---|---|
| 1. 퇴근 시간 | 칼퇴 | 야근 |
| 2. 업무 몰입 | 일이 곧 나 | 일은 그냥 일 |
| 3. 스트레스 해소 | 혼자 해소 | 사람 만나서 해소 |
| 4. 미래 준비 | 이미 준비 중 | 되면 되겠지 |

---

## 4. 16유형 정의

### 유형 코드 체계
`[업무방식][AI활용][강점][속도]` 4글자 조합

| 코드 | 유형 이름 | AI 대체 점수 | 추천 부트캠프 |
|---|---|---|---|
| HALF | AI 시대 지휘관 | 28% | AI LLM |
| HALP | 완벽주의 AI 설계자 | 25% | 데이터 엔지니어 |
| HACF | 데이터로 판치는 크리에이터 | 32% | AI LLM |
| HACP | 느린 듯 정확한 AI 예술가 | 30% | AI LLM |
| HSLF | 조용한 논리 장인 | 48% | 데이터 엔지니어 |
| HSLP | 철저한 혼자형 전략가 | 45% | 데이터 엔지니어 |
| HSCF | 감성 독립군 | 38% | AI LLM |
| HSCP | 나만의 세계 완성형 | 35% | AI LLM |
| TALF | 팀 이끄는 AI 선봉장 | 31% | 데이터 분석 |
| TALP | 함께 만드는 AI 설계자 | 29% | 데이터 분석 |
| TACF | AI 부리는 크리에이터 | 33% | AI LLM |
| TACP | 협력형 AI 아티스트 | 31% | AI LLM |
| TSLF | 사람으로 굴러가는 분석가 | 61% | 데이터 분석 |
| TSLP | 신중한 팀 전략가 | 58% | 데이터 분석 |
| TSCF | 감성으로 팀 살리는 사람 | 65% | 데이터 분석 |
| TSCP | 완벽한 팀의 완성자 | 62% | 데이터 분석 |

### AI 점수별 멘트 구조

| AI 점수 | 톤 | 메시지 방향 |
|---|---|---|
| ~30% | 안도 + 경계 | "지금은 안전. 하지만 안심하면 안 되는 이유 →" |
| 31~60% | 위기감 | "위험 신호 감지. 지금 준비 안 하면 3년 후 후회" |
| 61~100% | 강한 위협 | "⚠️ 위험. 당신 직업 AI가 이미 넘보고 있습니다" |

### 퇴근 보너스 결과 예시
```
당신의 AI 유형: AI 시대 지휘관 (HALF)
당신의 퇴근 레벨: 야근 3단계 😂
"AI는 잘 쓰는데 퇴근은 못 하는 사람"
```

### 점수 계산 방식
- 모든 로직은 프론트엔드 JS에서 처리 (API 호출 없음, LLM 불필요)
- Supabase에는 결과값만 저장 (응답 집계용)
- Supabase 연결 실패 시 로컬 결과 페이지(`/result/local`)로 fallback

---

## 5. 결과 페이지 스펙

| 요소 | 상세 |
|---|---|
| 유형 카드 | 4글자 코드 + 유형명 + 캐릭터 이미지 |
| AI 대체 점수 | 0~100 게이지바 + 점수별 위협/안도 카피 |
| 퇴근 레벨 | 보너스 유머 결과 별도 표시 |
| 직업 추천 | 유형별 3개 직업 + 대기업 예시 |
| AI 자동화 가이드 | 유형별 GPT/SLM 활용 팁 (하드코딩) |
| 부트캠프 추천 | 유형별 1개 과정 자동 추천 + CTA → `NEXT_PUBLIC_BOOTCAMP_URL` |
| 공유 카드 | Canvas API로 PNG 생성. 카카오 · 링크 복사 · 카드 저장 |
| 무료 쿠폰 | 결과 확인 후 쿠폰 코드 노출 + 오픈채팅방 링크 |

---

## 6. 캐릭터 이미지 (16종)

로우폴리 3D 캐릭터 스타일. Gemini ImageGen으로 생성.

**공통 베이스 프롬프트**
```
Low-poly geometric 3D character illustration, isometric style, faceted polygon shapes, 
clean flat colors, white background, full body standing pose, no text, no shadow.
```

| 코드 | 유형명 | 색상 | 소품/포즈 특징 |
|---|---|---|---|
| HALF | AI 시대 지휘관 | 퍼플 + 인디고 | AI 스크린 3개 띄우고 손가락 튕기는 포즈 |
| HALP | 완벽주의 AI 설계자 | 딥네이비 + 실버 | 설계도 들고 돋보기로 검토하는 포즈 |
| HACF | 데이터로 판치는 크리에이터 | 에메랄드 + 골드 | 차트 보드 + 붓 동시에 든 포즈 |
| HACP | 느린 듯 정확한 AI 예술가 | 틸 + 민트 | 태블릿에 천천히 그림 그리는 포즈 |
| HSLF | 조용한 논리 장인 | 슬레이트 + 차콜 | 렌치 + 작은 로봇 완성품 든 포즈 |
| HSLP | 철저한 혼자형 전략가 | 다크그린 + 올리브 | 체스 퀸 들고 체스판 바라보는 포즈 |
| HSCF | 감성 독립군 | 앰버 + 오렌지 | 붓 + 팔레트 들고 윙크하는 포즈 |
| HSCP | 나만의 세계 완성형 | 로즈골드 + 베이지 | 헤드폰 끼고 자기 작품 감상하는 포즈 |
| TALF | 팀 이끄는 AI 선봉장 | 코발트 + 스카이블루 | 양손으로 팀원들 이끄는 리더 포즈 |
| TALP | 함께 만드는 AI 설계자 | 블루 + 스틸 | 화이트보드에 팀과 설계하는 포즈 |
| TACF | AI 부리는 크리에이터 | 바이올렛 + 핫핑크 | 노트북 + 마이크 동시에 든 포즈 |
| TACP | 협력형 AI 아티스트 | 라벤더 + 퍼플 | 팀원과 함께 캔버스 그리는 포즈 |
| TSLF | 사람으로 굴러가는 분석가 | 스카이블루 + 화이트 | 명함 뿌리며 악수하는 포즈 |
| TSLP | 신중한 팀 전략가 | 네이비 + 골드 | 두꺼운 폴더 들고 회의실 걷는 포즈 |
| TSCF | 감성으로 팀 살리는 사람 | 핑크 + 로즈 | 양팔 벌려 팀원 3명 안는 포즈 |
| TSCP | 완벽한 팀의 완성자 | 코랄 + 피치 | 체크리스트 들고 팀원 칭찬하는 포즈 |

---

## 7. 부트캠프 연동 퍼널

### 퍼널 구조

```
랜딩 ("AI가 당신 월급을 노리고 있습니다")
    ↓
테스트 (16문항)
    ↓
결과 페이지
    ├── 위협 메시지 (AI 점수 기반 불안 유발)
    ├── "이렇게 하면 역전 가능합니다"
    └── 부트캠프 추천 섹션
            ↓
        무료 커리큘럼 받아보기 → metacodes.co.kr
```

### 부트캠프 4종 및 유형 매핑

| 부트캠프 | 대상 코드 | 추천 이유 |
|---|---|---|
| 데이터 분석 | TALF, TALP, TSLF, TSLP, TSCF, TSCP | 조직/관계 중심 → 데이터로 설득력 강화 |
| 데이터 엔지니어 | HALP, HSLF, HSLP | 시스템/논리 중심 → 파이프라인 설계 적합 |
| AI LLM | HALF, HACF, HACP, HSCF, HSCP, TACF, TACP | 창의/AI 중심 → LLM 활용 극대화 |
| AI 서비스 *(런칭 대기)* | 추후 배정 | 실행/현장 중심 |

### 부트캠프별 카피 방향

**데이터 분석**
> "당신의 조직 장악력 + 데이터 = AI 시대 생존 패키지"

**데이터 엔지니어**
> "AI가 대체 못 하는 파이프라인 설계자로 전환하세요"

**AI LLM**
> "ChatGPT를 도구로 쓰는 사람 vs 도구가 되는 사람"

**AI 서비스** *(런칭 대기)*
> "AI 서비스를 만드는 사람이 AI에 대체되지 않습니다"

### 공유 카피 (바이럴 설계)

```
낮은 점수 (자랑형):
"나는 AI 대체 가능성 25%야 😏 너는 몇 %야?
→ aimbti-jet.vercel.app"

높은 점수 (공감 유발형):
"나 AI한테 대체될 수도 있대... 65% 😱
너도 한번 해봐 → aimbti-jet.vercel.app"

퇴근 유머형:
"AI 시대 지휘관인데 야근 3단계래 ㅋㅋㅋ
→ aimbti-jet.vercel.app"
```

---

## 8. 기술 스택

| 영역 | 기술 |
|---|---|
| 프레임워크 | Next.js 16 (App Router) |
| 스타일 | Tailwind CSS v4 (모바일 퍼스트) |
| 레이아웃 | 콘텐츠 최대 너비 480px, 가운데 정렬 (웹/모바일 동일 경험) |
| DB | Supabase (익명 UUID, RLS 활성화) |
| 배포 | Vercel (GitHub 자동 배포) |
| 분석 | GA4 (`NEXT_PUBLIC_GA_ID`) |
| 공유 | Canvas API + 카카오 SDK (선택) |

---

## 9. 환경변수

| 변수 | 설명 | 필수 |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase publishable key | ✅ |
| `SUPABASE_SECRET_KEY` | Supabase secret key (서버 전용) | ✅ |
| `NEXT_PUBLIC_BOOTCAMP_URL` | 부트캠프 랜딩 URL | ✅ |
| `NEXT_PUBLIC_GA_ID` | GA4 측정 ID | 권장 |
| `NEXT_PUBLIC_OPENCHAT_URL` | 카카오 오픈채팅 URL | 권장 |
| `NEXT_PUBLIC_KAKAO_APP_KEY` | 카카오 JS 키 | 선택 |

---

## 10. Supabase 테이블

```sql
-- 결과 저장
create table results (
  id uuid default gen_random_uuid() primary key,
  type_code text not null,
  type_name text not null,
  ai_score integer not null,
  work_style text not null,
  ai_usage text not null,
  strength text not null,
  speed text not null,
  overtime_result text,
  shared boolean default false,
  created_at timestamp with time zone default now()
);

-- 쿠폰 발급
create table coupons (
  id uuid default gen_random_uuid() primary key,
  code text unique not null,
  used boolean default false,
  result_id uuid references results(id),
  created_at timestamp with time zone default now()
);

-- RLS 활성화
alter table results enable row level security;
alter table coupons enable row level security;

create policy "allow insert" on results for insert with check (true);
create policy "allow insert" on coupons for insert with check (true);
create policy "allow select" on results for select using (true);
create policy "allow select" on coupons for select using (true);
```

---

## 11. SEO

| 파일 | 역할 |
|---|---|
| `app/layout.tsx` | 공통 메타태그, OG, keywords |
| `app/page.tsx` | 랜딩 페이지 메타태그 + canonical |
| `app/guide/page.tsx` | 가이드 페이지 메타태그 |
| `app/sitemap.ts` | `/sitemap.xml` 자동 생성 |
| `app/robots.ts` | `/robots.txt` 자동 생성 |

---

## 12. MVP 진행 상태

### 완료
- [x] 랜딩 페이지
- [x] 테스트 플로우 (스텝 형식)
- [x] 결과 페이지 (유형 + 점수 + 직업 추천)
- [x] 부트캠프 추천 섹션
- [x] SNS 공유 카드 (Canvas API)
- [x] 쿠폰 자동 발급
- [x] Supabase 결과 저장 + fallback
- [x] GA4 연동
- [x] SEO (sitemap, robots, 메타태그)
- [x] Vercel 배포

### 2차 개발 (진행 중)
- [ ] **4축 기반 16유형으로 전면 재설계** (HALF 코드 시스템)
- [ ] **퇴근 보너스 테스트 분리** (유형 반영 없음, 유머 결과만)
- [ ] **16종 캐릭터 이미지** (Gemini ImageGen 생성)
- [ ] **랜딩 카피 위협 버전으로 교체**
- [ ] **결과 페이지 위협 멘트 강화** (점수 구간별)
- [ ] **AI 서비스 부트캠프 연동** (런칭 후 즉시 반영)
- [ ] 로그인 / 회원가입
- [ ] 어드민 대시보드
- [ ] 이메일 자동 발송
- [ ] 다국어 지원

---

## 13. 비기능 요구사항

- Lighthouse 모바일 점수 90 이상
- 테스트 페이지 LCP 2초 이내
- 이미지 WebP 변환 필수
- Supabase RLS 활성화
- 개인정보 미수집 (익명 UUID만 저장)
- 쿠폰 중복 사용 방지 로직 필수
