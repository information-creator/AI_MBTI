# Meta Ads 3개 캠페인 운영 플랜

> 작성일: 2026-04-20
> 목표: 3개 랜딩 페이지 변형을 동시 실험해 CPA·E2E 전환율이 가장 좋은 버전 찾기

## 📌 개요

3개 캠페인을 동일 예산·동일 타겟으로 병렬 실행하고, **랜딩 페이지만 다르게 해서** 어떤 설득 전략이 가장 효과적인지 검증한다.

| 캠페인 | 랜딩 | 심리 전략 | 톤 |
|---|---|---|---|
| A — Fear | `/v1` | 공포소구 (손실 회피) | 다크 + 빨강 경고 |
| B — Social | `/v3` | 사회적 증거 (밴드왜건) | 다크 + 후기 + 실시간 카운터 |
| C — Simple | `/v4` | 인지 부하 최소화 | 화이트 + 텍스트만 |

> 내부 QA용 `/preview/v1`, `/preview/v3`, `/preview/v4`는 VariantAnalysis 전략 배너가 포함된 별도 버전 (key 필요)

---

## 🏗️ 인프라 현황 (2026-04-20 기준)

### ✅ 정상 작동
- GA4 트래킹
- Meta Pixel (픽셀 ID `4172135629693592`)
- Google Ads 전환 추적
- **Supabase `events` 테이블** — A/B 추적 핵심 (2026-04-20 복구)
- `VariantTracker` 쿠키 세팅 (`ab_variant=v1|v3|v4`, 30일 유효)
- `trackEvent`가 모든 이벤트에 `ab_variant` 자동 태깅

### ⚠️ 확인 필요
- `.env.production`의 Supabase URL이 **존재하지 않는 프로젝트**를 가리킴
  → Vercel 대시보드에서 환경변수 업데이트 필수
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://wxquegztcufayixdleps.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_oipIdxr4gTdsTEdLjqqPMw_figxucHL
  ```
- `/preview/*` — **내부 QA 전용** (VariantAnalysis 전략 배너 포함, 미들웨어 보호, `?key=720972` 필요)
- `/v1`, `/v3`, `/v4` — **공개 광고용** (VariantAnalysis 제거, 바로 접속 가능)

---

## 🎯 Meta Ads 설정

### 캠페인 구조
**3개 독립 캠페인** (선택 — 통제가 쉬움)
- 각 캠페인 동일 예산 · 동일 타겟 · 동일 소재그룹
- 차이는 랜딩 페이지만 → 공정한 비교

> 대안: 1개 캠페인 + 3개 광고세트 (CBO). Meta가 자동 배분하지만 공정 비교 어려움.

### 예산 · 기간

| 항목 | 값 |
|---|---|
| 캠페인당 일예산 | **₩20,000 ~ 30,000** |
| 3개 합계 일예산 | ₩60,000 ~ 90,000 |
| 최소 운영 기간 | **7일** |
| 종료 판단 | 각 캠페인 **리드 50건 도달** 시 |

Meta 학습 단계 탈출 조건: **광고세트당 주 50 전환**. 이하면 신뢰할 수치 안 나옴.

### 세부 설정

| 설정 | 값 | 이유 |
|---|---|---|
| 캠페인 목표 | 리드 (Lead Generation) | - |
| 전환 이벤트 | `test_complete` | Meta Pixel에 이미 이벤트 전달 중 |
| 위치 | **한국만** (해외 체크 해제) | 봇 트래픽 차단 |
| 연령 | 25 ~ 44 | 직장인 타겟 |
| 관심사 | 커리어 · 자기계발 · AI · 생산성 | - |
| 게재 위치 | 피드 · 스토리만 | Audience Network OFF (봇 유입 방지) |
| 광고 포맷 | 동일 소재 3종 공유 | 이미지 · 영상 · 캐러셀 |

### 랜딩 URL — 단축 URL 사용 (권장)

Meta Ads Manager에 아래 3개 URL 그대로 입력:

```
A (공포):     https://mcodegc.com/go/meta/fear
B (사회적증거): https://mcodegc.com/go/meta/social
C (미니멀):   https://mcodegc.com/go/meta/simple
```

**자동 처리되는 것**
- UTM 3종 (`utm_source=meta`, `utm_medium=paid`, `utm_campaign=fear|social|simple`) 자동 부착
- Meta가 클릭 시 붙이는 `fbclid` 통과 → Meta Ads Manager 어트리뷰션 정상 작동
- `utm_content={{ad.name}}` 파라미터 붙이면(광고 단위에서) 그대로 통과 → 소재별 분리 집계 가능

**소재별 분리 원할 때**
Meta Ads Manager 광고 단위 URL 파라미터에 추가:
```
utm_content={{ad.name}}
```
→ 라우트가 자동 통과해서 최종 URL에 유지됨.

### 직접 URL 사용 (단축 URL 안 쓸 때)

```
A: https://mcodegc.com/v1?utm_source=meta&utm_medium=paid&utm_campaign=fear
B: https://mcodegc.com/v3?utm_source=meta&utm_medium=paid&utm_campaign=social
C: https://mcodegc.com/v4?utm_source=meta&utm_medium=paid&utm_campaign=simple
```

각 페이지의 `VariantTracker`가 쿠키 자동 세팅 → dashboard **A/B 테스트 탭**에서 분리 집계.

---

## 🔎 어트리뷰션 구조 이해

### 3-레이어 어트리뷰션

| 레이어 | 뭘 보는가 | 구분 기준 | 자동? |
|---|---|---|---|
| **Meta Ads Manager** | 캠페인 A/B/C별 CPA·ROAS | `fbclid` | ✅ Meta가 자동 |
| **GA4** | 트래픽 소스·캠페인별 전환 | `utm_*` | ❌ 우리가 수동 |
| **Supabase `events`** | 랜딩·캠페인별 이벤트 로그 | `ab_variant` 쿠키 + `utm_*` | ❌ 우리가 수동 |

### fbclid — Meta의 자동 꼬리표

Meta는 광고 클릭 순간 URL에 `fbclid` 파라미터를 **자동으로** 붙입니다.

```
설정한 URL:     https://mcodegc.com/v1
실제 이동 URL:  https://mcodegc.com/v1?fbclid=IwAR0abc123xyz...
                                        ↑ Meta가 자동으로 붙임
```

동작 흐름:
1. 사용자가 Campaign A 광고 클릭 → `fbclid` 부여
2. Pixel이 이 값을 `_fbc` 쿠키로 저장 (최대 90일)
3. 나중에 `test_complete` 발화 시 Pixel이 이벤트 전송
4. Meta 서버가 `_fbc` 쿠키 보고 **"이건 Campaign A 전환"** 자동 판정
5. Meta Ads Manager에서 캠페인별 CPA 자동 분리

→ **같은 Pixel을 써도 캠페인별 분리는 자동**. Pixel을 캠페인마다 따로 만들 필요 없음.

### UTM — 우리가 직접 붙이는 꼬리표

Meta만 `fbclid`를 읽을 수 있어서, GA4·Supabase는 **"이 방문자가 Meta에서 왔는지"를 모릅니다**. 그래서 UTM을 수동으로 붙여야 합니다.

- `utm_source=meta` → GA4의 소스/매체에 `meta`로 잡힘 (안 붙이면 `(direct)`로 집계됨)
- `utm_campaign=fear` → GA4·Supabase에서 캠페인별 분리 가능
- `src/lib/track.ts`가 `utm_*`를 자동으로 이벤트 metadata에 저장 → Supabase에서 `metadata->>utm_campaign`으로 쿼리 가능

### 결론: 한 링크에 둘 다 공존

최종 이동 URL은 자연스럽게:
```
https://mcodegc.com/v1?utm_source=meta&utm_campaign=fear&fbclid=IwAR0xxx
                      ↑ 우리 수동                        ↑ Meta 자동
```

→ **Meta Ads Manager + GA4 + 우리 Supabase** 세 레이어 모두 캠페인별로 분리 집계됩니다.

### 자주 하는 오해

| 오해 | 실제 |
|---|---|
| "같은 Pixel·같은 `test_complete`면 중복 적재 아닌가?" | ❌ `fbclid`/`_fbc`로 Meta가 자동 구분. DB에 같은 이벤트명이 찍혀도 "어디서 왔는지"는 metadata로 식별됨. |
| "캠페인마다 Pixel을 새로 만들어야 하나?" | ❌ 도메인당 Pixel 1개가 정상. 여러 개 쓰면 오히려 혼란. |
| "UTM만 있으면 충분하지 않나?" | ⚠️ GA4·Supabase엔 충분. 하지만 Meta는 `fbclid`로만 어트리뷰션하고 UTM은 안 씀. (둘은 독립적) |
| "UTM 안 붙이면 캠페인 성과 아예 안 보이나?" | ⚠️ Meta Ads Manager에선 잘 보임. 근데 우리 대시보드·GA4에선 구분 불가. |

---

## 📊 측정 & 분석

### 주 관찰 지표
| 지표 | 정의 | 목표 |
|---|---|---|
| **CPA** | 전환당 비용 = 광고비 ÷ 2차 전환 | ₩5,000 이하 |
| **E2E 전환율** | 방문 → 2차 전환(단톡/전자책/공유) | 3%+ 양호 |
| **완료율** | 테스트 시작 → 완료 | 70%+ |

### 확인 경로
- **Dashboard3 (데스크탑)**: http://localhost:3000/dashboard3 → **A/B 테스트 탭**
- **Dashboard4 (모바일)**: http://localhost:3000/dashboard4
- **Supabase 직접**: https://supabase.com/dashboard/project/wxquegztcufayixdleps/editor → `events` 테이블

### 추적되는 이벤트 (모두 `ab_variant` 태깅됨)

| 이벤트 | 발화 시점 |
|---|---|
| `page_view` | 랜딩 페이지 진입 |
| `cta_click` | "진단 시작" 버튼 클릭 |
| `test_start` | 첫 문항 첫 답변 |
| `test_progress` | Q4 · Q8 · Q12 · Q16 완료 |
| `test_complete` | 20문항 완료 |
| `result_view` | 결과 페이지 도착 |
| `ebook_click` | 전자책 언락/다운로드 |
| `openchat_click` | 단톡방 진입 |

---

## 🏁 판단 기준

### 승리 조건
동시 만족:
- CPA 최저
- E2E 전환율 ≥ 3%

### 승리 예시
| 시나리오 | 결정 |
|---|---|
| V1만 CPA 달성 + E2E 양호 | V1 채택 → 나머지 예산 V1으로 이전 |
| 전부 CPA 초과 | 랜딩이 아니라 **오퍼/소재/타겟** 문제 → 캠페인 중단 후 재설계 |
| V1 · V3 공동 우세 | 둘 다 살려두고 V4 중단 |

### 의사결정 시점
- **7일차 중간 점검**: 데이터 너무 적으면 3일 추가
- **14일차 최종**: 각 캠페인 50건+ 확보 여부 확인 후 결정

---

## 📈 1차 실측 결과 (2026-04-22 ~ 04-23)

> 집계 출처: `GET /api/ab-test?start=2026-04-22&end=2026-04-23`

### 단계별 이벤트 수

| 단계 | V1 공포 | V3 사회증거 | V4 극심플 |
|---|---:|---:|---:|
| 방문 (page_view) | 85 | 77 | **92** |
| CTA 클릭 | 43 | 41 | **50** |
| 테스트 시작 | 36 | 32 | **43** |
| 테스트 완료 | 41 | 39 | **47** |
| 결과 확인 | 27 | **45** | 36 |
| 오픈챗 클릭 | 0 | **2** | 1 |
| 전자책 클릭 | 1 | **8** | 5 |

### 핵심 전환율

| 지표 | V1 공포 | V3 사회증거 | V4 극심플 | 승자 |
|---|---:|---:|---:|---|
| CTA 클릭률 (cta / pageView) | 50.6% | 53.2% | **54.3%** | V4 (근소) |
| **E2E 전환율** (resultView / pageView) | 31.8% | **58.4%** | 39.1% | **V3** 압승 |
| **2차 전환율** ((단톡+이북+공유) / resultView) | 3.7% | **22.2%** | 16.7% | **V3** 압승 |

### 🏆 결론 — **V3 사회적 증거 승자 (잠정)**

- **상단 단계(클릭률)는 3안 모두 비슷** — V4가 근소 1위지만 ±3%p 오차 범위.
- **실제 돈 되는 구간(결과 확인 → 2차 전환)에서 V3 압승** — 2차 전환율이 V1 대비 6배, V4 대비 1.3배.
- **V1 공포소구는 초반엔 끌지만 뒤에서 빠짐** — 결과 확인 전환율이 가장 낮음.
- **가설 확증**: "사회적 증거(후기 + 실시간 카운터)가 교육/리드젠 카테고리에선 공포보다 설득력 강함"이라는 벤치마크와 일치.

### ⚠️ 주의 — 아직 확정 결론 아님

1. **표본 부족** — variant당 77~92명 수준. 코드상 최소 기준(100명+) 아슬아슬, Meta 학습탈출 기준(주 50 전환)엔 한참 못 미침.
2. **이상치 존재** — 시작(36) < 완료(41), V3의 resultView(45) > testComplete(39). 이벤트 중복 발송 또는 과거 결과 링크 재방문이 섞인 것으로 추정. **이벤트 로직 재검증 필요**.
3. **기간 경계 오염** — 4.22 이전 시작 → 4.22~23 완료 유저가 일부 포함됐을 수 있음.

### 🎯 다음 액션

- [ ] **예산 재배분 보류** — 100명+ 쌓일 때까지 3안 동시 운영 유지
- [ ] **이벤트 중복 여부 점검** — `testStart > testComplete` 이상치 원인 추적 (`src/lib/track.ts`)
- [ ] **V3 소재 강화 검토** — 후기 더 추가 / 실시간 카운터 숫자 검증
- [ ] **재측정 일정**: 2026-04-29 (7일 누적)

---

## 🚦 실행 체크리스트

### 캠페인 시작 전
- [ ] Vercel에서 Supabase 환경변수 업데이트
- [x] ~~공개 `/v1`, `/v3`, `/v4` 라우트 분리~~ ✅ 2026-04-20 완료
- [ ] 로컬에서 `/v1`, `/v3`, `/v4` 각각 접속 → Supabase `events`에 레코드 쌓이는지 확인
- [ ] Meta Pixel에 `test_complete` 전환 이벤트 설정 확인
- [ ] 광고 소재 3종 준비 (이미지 / 영상 / 캐러셀)
- [ ] Meta Ads Manager에 3개 캠페인 생성

### 캠페인 중
- [ ] 매일 dashboard A/B 테스트 탭 확인
- [ ] 해외 트래픽 비율 > 30%면 타겟 즉시 조정
- [ ] CTR < 0.5%면 소재 교체
- [ ] 3일차에 학습 단계 탈출 여부 확인

### 캠페인 종료
- [ ] 각 캠페인 50건+ 확보 여부 체크
- [ ] 승자 결정 후 스케일업 (예산 증액)
- [ ] 패자 캠페인의 시사점 기록 (v1은 왜 안 먹었나 등)

---

## 📎 참고 자료

- `docs/ab-test-guide.md` — A/B 테스트 심화 가이드
- `docs/marketing/utm-links.md` — UTM 파라미터 레퍼런스
- `src/lib/track.ts` — 이벤트 태깅 구조
- `src/components/VariantTracker.tsx` — 쿠키 세팅 로직
- `src/app/api/ab-test/route.ts` — 집계 API
