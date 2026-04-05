# AI 시대 생존력 진단 서비스 — PRD

**버전**: v1.2  
**스택**: Next.js 16 (App Router) + Tailwind CSS v4 + Vercel + Supabase  
**배포 URL**: https://aimbti-jet.vercel.app  
**상태**: MVP 배포 완료

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
| 테스트 | `/test` | 13문항 스텝 형식 (MBTI + AI역량 + 퇴근 레벨) |
| 결과 | `/result/[id]` | 유형 캐릭터 + 직업 추천 + 부트캠프 추천 + 공유 카드 |
| 가이드 | `/guide` | 전자책 다운로드 / 오픈채팅방 입장 CTA |

---

## 3. 테스트 설계 (총 13문항)

### 파트 A — MBTI 매핑 (6문항)
MBTI 4축 (E/I, S/N, T/F, J/P) 기반. 결과를 AI 역량 지표에 연결.

### 파트 B — AI 대체 가능성 (4문항)
직업군 · 업무 루틴 · 반복성 질문. 점수 0~100 산출.

### 파트 C — 퇴근 레벨 (3문항)
유머 문항. 공유율 상승 목적.

### 결과 유형 — v2 설계 (16가지, MBTI 직접 매핑)

> 기존 MBTI 코드를 그대로 유지하여 공감대 확보. AI 점수로 위협/희망 멘트를 구분.

| MBTI | 유형명 | AI 점수 기준 | 추천 부트캠프 | 위협 메시지 |
|---|---|---|---|---|
| ENTJ | 🏛️ AI 제국 건설자 | 35% | 데이터 분석 | 전략가도 AI가 시나리오 짜는 시대. 판단력 없으면 도구로 전락 |
| ENTP | 🚀 AI 실험 개척자 | 28% | AI LLM | 아이디어만 많고 실행 없으면 AI한테 집니다 |
| ENFJ | 🎙️ AI 무장 리더 | 31% | 데이터 분석 | 사람을 이끄는 능력, AI 코치가 대체 시작했습니다 |
| ENFP | 🌈 AI 감성 크리에이터 | 29% | AI LLM | 창의력은 안전. 근데 당신 실행력은요? |
| ESTJ | 🏢 AI 도입 관리자 | 68% | 데이터 분석 | 관리직 AI 대체율 1위. 보고서·회의록은 이미 AI가 씁니다 |
| ESTP | ⚡ AI 즉흥 실행가 | 55% | AI 서비스 | 현장 감각은 강점. 근데 반복 업무는 AI가 더 빠릅니다 |
| ESFJ | 🤝 AI 활용 관계왕 | 61% | 데이터 분석 | 친절한 CS·HR, AI 챗봇이 24시간 대체 중 |
| ESFP | 🎭 AI 바이럴 메이커 | 45% | AI LLM | 콘텐츠 제작 AI 넘쳐납니다. 당신만의 얼굴 없으면 묻힙니다 |
| INTJ | 🔭 AI 전략 설계자 | 33% | 데이터 엔지니어 | 냉철한 분석가. 근데 데이터 해석 AI가 따라잡고 있습니다 |
| INTP | 🔬 AI 시스템 해커 | 25% | 데이터 엔지니어 | AI 구조를 이해하는 당신, 가장 안전. 근데 커뮤니케이션은요? |
| INFJ | 🌙 AI 인사이트 탐구자 | 30% | AI LLM | 직관은 강점. 근데 직관만으론 밥 못 먹는 시대 왔습니다 |
| INFP | 🎨 AI 불가침 감성인 | 22% | AI LLM | AI가 가장 못 베끼는 유형. 근데 감성을 돈으로 못 바꾸면 무용지물 |
| ISTJ | ⚙️ AI 자동화 장인 | 74% | 데이터 엔지니어 | 꼼꼼한 반복 업무 담당자. AI 대체율 전체 1위 직군입니다 |
| ISTP | 🛠️ AI 도구 마스터 | 48% | 데이터 엔지니어 | 손으로 하는 건 강점. 근데 디지털 전환 못 하면 고립됩니다 |
| ISFJ | 🛡️ AI 시대 버팀목 | 69% | 데이터 분석 | 성실하고 꼼꼼한 당신. 그 일 AI가 더 성실하게 합니다 |
| ISFP | 🃏 AI 예측불가 아티스트 | 38% | AI 서비스 | 예술적 감성은 안전. 근데 AI 그림이 시장 잠식 중입니다 |

### 점수별 멘트 구조

| AI 점수 | 톤 | 메시지 방향 |
|---|---|---|
| ~30% | 안도 + 경계 | "지금은 안전. 하지만 안심하면 안 되는 이유 →" |
| 31~60% | 위기감 | "위험 신호 감지. 지금 준비 안 하면 3년 후 후회" |
| 61~100% | 강한 위협 | "⚠️ 위험. 당신 직업 AI가 이미 넘보고 있습니다" |

### 점수 계산 방식
- 모든 로직은 프론트엔드 JS에서 처리 (API 호출 없음, LLM 불필요)
- Supabase에는 결과값만 저장 (응답 집계용)
- Supabase 연결 실패 시 로컬 결과 페이지(`/result/local`)로 fallback

---

## 4. 결과 페이지 스펙

| 요소 | 상세 |
|---|---|
| 유형 카드 | 이모지 + 유형명 + MBTI + 유명인/기업 매핑 |
| AI 대체 점수 | 0~100 게이지바 + 유머 카피 |
| 직업 추천 | 유형별 3개 직업 + 대기업 예시 |
| AI 자동화 가이드 | 유형별 GPT/SLM 활용 팁 (하드코딩) |
| 부트캠프 추천 | 유형별 1개 과정 자동 추천 + CTA → `NEXT_PUBLIC_BOOTCAMP_URL` |
| 공유 카드 | Canvas API로 PNG 생성. 카카오 · 링크 복사 · 카드 저장 |
| 무료 쿠폰 | 결과 확인 후 쿠폰 코드 노출 + 오픈채팅방 링크 |

---

## 5. 부트캠프 연동 퍼널

### 퍼널 구조

```
랜딩 ("AI가 당신 월급을 노리고 있습니다")
    ↓
테스트 (13문항)
    ↓
결과 페이지
    ├── 위협 메시지 (AI 점수 기반 불안 유발)
    ├── "이렇게 하면 역전 가능합니다"
    └── 부트캠프 추천 섹션
            ↓
        무료 커리큘럼 받아보기 → metacodes.co.kr
```

### 부트캠프 4종 및 MBTI 매핑

| 부트캠프 | 대상 MBTI | 추천 이유 |
|---|---|---|
| **데이터 분석** | ENTJ, ENFJ, ESTJ, ESFJ, ISFJ | 조직/관계 중심 → 데이터로 설득력 강화 |
| **데이터 엔지니어** | INTJ, INTP, ISTJ, ISTP | 시스템/논리 중심 → 파이프라인 설계 적합 |
| **AI LLM** | ENTP, ENFP, INFJ, INFP, ESFP | 창의/아이디어 중심 → LLM 활용 극대화 |
| **AI 서비스** *(런칭 대기)* | ESTP, ISFP | 실행/현장 중심 → AI 서비스 기획·운영 |

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
"나는 AI 대체 가능성 22%야 😏 너는 몇 %야?
→ aimbti-jet.vercel.app"

높은 점수 (공감 유발형):
"나 AI한테 대체될 수도 있대... 74% 😱
너도 한번 해봐 → aimbti-jet.vercel.app"
```

---

## 6. 기술 스택

| 영역 | 기술 |
|---|---|
| 프레임워크 | Next.js 16 (App Router) |
| 스타일 | Tailwind CSS v4 (모바일 퍼스트) |
| DB | Supabase (익명 UUID, RLS 활성화) |
| 배포 | Vercel (GitHub 자동 배포) |
| 분석 | GA4 (`NEXT_PUBLIC_GA_ID`) |
| 공유 | Canvas API + 카카오 SDK (선택) |

---

## 7. 환경변수

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

## 8. Supabase 테이블

```sql
-- 결과 저장
create table results (
  id uuid default gen_random_uuid() primary key,
  mbti_type text not null,
  ai_score integer not null,
  job_type text not null,
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
```

---

## 9. SEO

| 파일 | 역할 |
|---|---|
| `app/layout.tsx` | 공통 메타태그, OG, keywords |
| `app/page.tsx` | 랜딩 페이지 메타태그 + canonical |
| `app/guide/page.tsx` | 가이드 페이지 메타태그 |
| `app/sitemap.ts` | `/sitemap.xml` 자동 생성 |
| `app/robots.ts` | `/robots.txt` 자동 생성 |

---

## 10. MVP 범위

### 완료
- [x] 랜딩 페이지
- [x] 테스트 플로우 (13문항 스텝)
- [x] 결과 페이지 (유형 + 점수 + 직업 추천)
- [x] 부트캠프 추천 섹션 (유형별 자동 매핑)
- [x] SNS 공유 카드 (Canvas API)
- [x] 쿠폰 자동 발급
- [x] Supabase 결과 저장 + fallback
- [x] GA4 연동
- [x] SEO (sitemap, robots, 메타태그)
- [x] Vercel 배포

### 2차 개발
- [ ] **16가지 MBTI 유형으로 확장** (현재 8가지 → 16가지)
- [ ] **랜딩 카피 위협 버전으로 교체** ("AI가 당신 월급을 노리고 있습니다")
- [ ] **결과 페이지 위협 멘트 강화** (점수 구간별 불안 유발 카피)
- [ ] **AI 서비스 부트캠프 연동** (런칭 후 즉시 반영)
- [ ] 유형별 캐릭터 이미지 (현재 1종 → 16종)
- [ ] 로그인 / 회원가입
- [ ] 어드민 대시보드
- [ ] 이메일 자동 발송
- [ ] 다국어 지원

---

## 11. 비기능 요구사항

- Lighthouse 모바일 점수 90 이상
- 테스트 페이지 LCP 2초 이내
- Supabase RLS 활성화
- 개인정보 미수집 (익명 UUID만 저장)
- 쿠폰 중복 사용 방지 로직 필수
