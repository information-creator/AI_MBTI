# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # 개발 서버 (localhost:3000)
npm run build    # 프로덕션 빌드
npm run lint     # ESLint
```

테스트 프레임워크 없음. 수동 확인 또는 브라우저 콘솔로 검증.

## 프로젝트 개요

AI 시대 생존력 진단 서비스 (AIMBTI). 20문항 테스트 → 16가지 유형 → 결과 페이지 + 부트캠프 추천.

**스택**: Next.js 16 (App Router) · React 19 · Tailwind v4 · Supabase v2 · TypeScript

## 핵심 데이터 흐름

```
/test  →  /analyzing?type=HALF&score=28&overtime=...  →  /result/[id]
```

1. **`/test`** (클라이언트) — 20문항 응답 수집, `calculateResult()` 호출 후 URL params로 전달
2. **`/analyzing`** (클라이언트) — 가짜 프로그레스바(80ms 틱) + Supabase 저장 병렬 실행. DB 실패 시 `/result/local?...` 폴백
3. **`/result/[id]`** (서버 컴포넌트) — DB에서 결과 조회, `ResultClient`로 전달

## 유형 시스템 (`src/lib/quiz.ts`)

4개 차원의 조합으로 16가지 TypeCode 생성:

| 파트 | 축 | 값 |
|---|---|---|
| A | 업무방식 | H(혼자) / T(팀) |
| B | AI 활용도 | A(적극) / S(소극) |
| C | 강점 | L(논리) / C(창의) |
| D | 속도 | F(빠름) / P(완벽) |

파트 E (야근 관련 4문항)는 TypeCode에 영향 없음 — `overtimeLevel`만 계산.

`typeInfo[typeCode]`에서 title, aiScore, bootcamp, jobs, scoreComment 등 모든 유형 데이터 조회.

## DB 테이블 (Supabase)

- **`results_v2`** — 테스트 결과 저장 (type_code, ai_score, overtime_result 등)
- **`coupons`** — 결과당 자동 생성된 쿠폰 코드 (현재 UI에 미노출)
- **`leads`** — 전화번호·이름·이메일 리드 (phone + source 조합 중복 방지)

Supabase 클라이언트: 클라이언트사이드는 `src/lib/supabase.ts` (Proxy 패턴으로 env 없을 때 no-op), 서버사이드는 `getSupabaseServer()`, 어드민은 `getSupabaseAdmin()` (SUPABASE_SECRET_KEY 필요).

## API

**`POST /api/leads`** — 결과 페이지 리드 캡처. 중복(phone+source) 시 조용히 성공 반환.

## 환경변수

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SECRET_KEY          # 서버사이드 전용
NEXT_PUBLIC_GA_ID
NEXT_PUBLIC_KAKAO_APP_KEY
NEXT_PUBLIC_OPENCHAT_URL
NEXT_PUBLIC_OPENCHAT_SURVEY_URL
```

## GA4 이벤트 구조 (`src/lib/ga.ts`)

`gtagEvent(name, params)` 유틸로 통일. 전체 이벤트:

| 이벤트 | 발생 위치 |
|---|---|
| `test_start` | 첫 문항 응답 시 |
| `test_complete` | 결과 생성 시 (type_code, ai_score) |
| `result_view` | 결과 페이지 마운트 |
| `page_exit` | pagehide (time_on_page 포함) |
| `exit_click` | 내부 링크 이탈 (destination, label) |
| `share_click` | 공유 버튼 (method: kakao/link/instagram/card_download) |
| `bootcamp_click` | 커리어 상담 신청 |
| `openchat_click` | 단톡방 입장 |
| `ebook_click` | 전자책 버튼 |
| `cta_click` | CTA 버튼 (location) |

## 주요 비즈니스 로직

- **전자책**: 1-2페이지 무료, 3-4페이지 잠금. 잠금 해제 링크는 `ebookLinkMap`에서 부트캠프별 분기. 이미지 규격 **860×1216px PNG**, `public/zunza/{부트캠프}/` 폴더에 `da_ebook_01.png` 형식으로 저장
- **쿠폰**: 결과 저장 시 자동 생성 (`"AI" + 6자리`), 현재 UI 미노출
- **공유 카드**: `<canvas>`로 800×1600px 이미지 생성 후 다운로드/인스타 공유
- **OG 이미지**: `/result/[id]/opengraph-image` 동적 생성 (`ImageResponse`)
- **결과 페이지**: `force-dynamic` (캐싱 없음)
