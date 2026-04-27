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

## 사용자 트리거 키워드

- **`push`** (단독) 또는 **`/push`** → `.claude/commands/push.md` 절차 실행:
  1. `git status` 확인
  2. `npm run lint` + `npm run build` 병렬 검증 (하나라도 실패 시 중단)
  3. 변경사항 기반 커밋 메시지 작성 (Conventional Commits, 한국어 본문 OK)
  4. `git add` (민감 파일 체크) → `git commit` (Co-Authored-By 포함) → `git push`
  5. 실패 시 자동 수정 금지, 사용자에게 에러 보고

## variant 약속어 (결과 페이지 진입 경로별 UI 분기)

결과 페이지(`/result/[id]`)는 모든 진입자가 공유하지만, `ab_variant` 쿠키로 UI를 분기한다. 사용자가 다음처럼 짧게 말하면 해당 분기로 이해:

| 약속어 | 의미 | 쿠키 값 |
|---|---|---|
| **메인 결과** / **M** | `/`로 진입한 사용자 | `ab_variant=main` |
| **v1 결과** | `/v1` (fear) 진입자 | `ab_variant=v1` |
| **v3 결과** | `/v3` (social) 진입자 | `ab_variant=v3` |
| **v4 결과** | `/v4` (simple) 진입자 | `ab_variant=v4` |
| **공통 결과** | 모든 진입자에게 동일 | — |

**구현 방식**: `ResultClient.tsx`에서 `document.cookie` 파싱 → `useState` 플래그(`showFloating` 등) → `{flag && (...)}` 또는 `{!flag && (...)}` 로 감싸기.

**예시**:
- "메인 결과에 긴급 배너 추가" → `variant === 'main'`일 때만 노출
- "v3 결과에 후기 카드" → `variant === 'v3'`일 때만 노출
- "공통 결과에서 점수 키우기" → 분기 없이 전체 수정

**테스트**: 브라우저 콘솔에서 `document.cookie = 'ab_variant=main; path=/'` 후 새로고침.

## 프로젝트 개요

AI 시대 생존력 진단 서비스 (AIMBTI). 20문항 테스트 → 16가지 유형 → 결과 페이지 + 부트캠프 추천.

**스택**: Next.js 16 (App Router) · React 19 · Tailwind v4 · Supabase v2 · TypeScript

## 핵심 데이터 흐름

```
/test  →  /analyzing?type=HALF&score=28  →  /result/[id]
```

1. **`/test`** — 20문항 응답 수집, `calculateResult()` 호출 후 URL params로 전달
2. **`/analyzing`** — 프로그레스바 + Supabase 저장 병렬 실행. DB 실패 시 `/result/local?...` 폴백
3. **`/result/[id]`** — DB에서 결과 조회, `ResultClient`로 전달

## 유형 시스템 (`src/lib/quiz.ts`)

5차원 점수제(A~E 각 0-4) → 4차원 양극 변환 → 16유형 TypeCode 생성:

| 차원 | 축 | 변환 기준 |
|---|---|---|
| A+B 합산 | AI 활용 A/S | 합산 ≥5 → A |
| C | 업무방식 H/T | ≥3 → H |
| D | 강점 L/C | ≥3 → L |
| E | 실행력 F/P | ≥3 → F |

## DB 테이블 (Supabase)

- **`results_v2`** — 테스트 결과 저장 (type_code, ai_score, score_a~e 등)
- **`coupons`** — 결과당 자동 생성 쿠폰 (UI 미노출)
- **`events`** — 이벤트 로그 (page_view, test_start, test_complete, result_view, openchat_click, ebook_click)

Supabase 클라이언트: `src/lib/supabase.ts` (Proxy 패턴, env 없으면 no-op). 이벤트 기록: `src/lib/track.ts`

## 트래킹 이중화

GA4(`gtagEvent`) + Supabase(`trackEvent`) 동시 전송. Clarity로 히트맵/세션리코딩.

## API

- **`GET /api/ga4`** — GA4 Data API 조회 (GCP 서비스 계정 키 필요, `cred/ga4-key.json`)

## 환경변수

```
NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SECRET_KEY          # 서버사이드 전용
NEXT_PUBLIC_GA_ID / NEXT_PUBLIC_KAKAO_APP_KEY
NEXT_PUBLIC_OPENCHAT_URL / NEXT_PUBLIC_OPENCHAT_SURVEY_URL
```

## 배포

Vercel 배포. 도메인: mcodegc.com. 환경변수는 Vercel 대시보드에서 설정.
