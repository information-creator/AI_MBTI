# API 데이터 — 필드 표 + JSON 샘플

대시보드가 호출하는 `/api/*` 각 엔드포인트에 대해
- **어떤 필드가 오는지** (표)
- **실제 JSON 응답 예시** (샘플)

을 한 파일에 정리.

---

## 1. GA4 이벤트 — `GET /api/ga4`

### 오는 필드

| 필드 | 타입 | 설명 |
|------|------|------|
| `events` | Record<이벤트명, { events, users }> | 이벤트별 발생 횟수·순 사용자 수 |
| `events.<name>.events` | number | 이벤트 발생 총 횟수 (중복 포함) |
| `events.<name>.users` | number | 해당 이벤트를 발생시킨 순 사용자 수 |
| `totalUsers` | number | 전체 기간 총 방문자 (GA4 `totalUsers` 메트릭) |
| `startDate` / `endDate` | string | 조회 기간 (YYYY-MM-DD) |

### 추적 이벤트 종류

| 이벤트명 | 의미 | 발화 위치 |
|---------|------|----------|
| `page_view` | 페이지 방문 | Next.js 라우팅 자동 |
| `cta_click` | "진단하기" 버튼 클릭 | 랜딩 헤더/히어로/프리뷰 |
| `test_start` | 첫 문항 진입 | `/test` 진입 시 |
| `test_complete` | 20문항 완료 | 마지막 문항 제출 시 |
| `result_view` | 결과 페이지 진입 | `/result/[id]` 로드 |
| `openchat_click` | 단톡방 링크 클릭 | 결과 페이지 |
| `ebook_click` | 전자책 CTA 클릭 | 결과 페이지 |
| `share_click` | 공유 버튼 클릭 | 결과 페이지 |

### JSON 샘플

```json
{
  "events": {
    "page_view":      { "events": 2340, "users": 1820 },
    "cta_click":      { "events": 520,  "users": 431 },
    "test_start":     { "events": 410,  "users": 392 },
    "test_complete":  { "events": 285,  "users": 280 },
    "result_view":    { "events": 278,  "users": 274 },
    "openchat_click": { "events": 45,   "users": 38 },
    "ebook_click":    { "events": 22,   "users": 20 },
    "share_click":    { "events": 8,    "users": 7 }
  },
  "totalUsers": 1820,
  "startDate": "2026-03-03",
  "endDate": "2026-04-19"
}
```

---

## 2. GA4 트래픽 분석 — `GET /api/ga4-traffic`

### 오는 필드

| 필드 | 타입 | 설명 |
|------|------|------|
| `sources[]` | 배열 | 유입 소스/매체별 데이터 (Top 20) |
| `sources[].source` | string | 소스명 (google, facebook, (direct) 등) |
| `sources[].medium` | string | 매체 (organic, cpc, referral 등) |
| `sources[].users` | number | 순 사용자 수 |
| `sources[].sessions` | number | 세션 수 |
| `sources[].engaged` | number | 참여 세션 수 (10초↑ 또는 2페이지↑ 또는 전환 발생) |
| `countries[]` | 배열 | 국가별 데이터 |
| `countries[].country` | string | 영어 국가명 (South Korea, India 등) |
| `devices[]` | 배열 | 디바이스별 데이터 |
| `devices[].device` | string | `mobile` / `desktop` / `tablet` |
| `pages[]` | 배열 | 랜딩 페이지별 데이터 |
| `pages[].page` | string | URL path (/, /test 등) |
| `summary.totalUsers` | number | 총 방문자 |
| `summary.totalSessions` | number | 총 세션 |
| `summary.totalEngaged` | number | 참여 세션 합 |
| `summary.koreaUsers` | number | 한국 방문자만 |

### JSON 샘플

```json
{
  "sources": [
    { "source": "google", "medium": "organic", "users": 620, "sessions": 780, "engaged": 510 },
    { "source": "(direct)", "medium": "(none)", "users": 480, "sessions": 540, "engaged": 310 },
    { "source": "facebook", "medium": "cpc", "users": 320, "sessions": 410, "engaged": 220 }
  ],
  "countries": [
    { "country": "South Korea", "users": 1200, "sessions": 1450, "engaged": 980 },
    { "country": "India", "users": 180, "sessions": 190, "engaged": 0 },
    { "country": "United States", "users": 95, "sessions": 110, "engaged": 62 }
  ],
  "devices": [
    { "device": "mobile", "users": 1240, "sessions": 1580, "engaged": 950 },
    { "device": "desktop", "users": 520, "sessions": 620, "engaged": 380 },
    { "device": "tablet", "users": 60, "sessions": 70, "engaged": 45 }
  ],
  "pages": [
    { "page": "/", "users": 1500, "sessions": 1800, "engaged": 1100 },
    { "page": "/preview/v1", "users": 120, "sessions": 140, "engaged": 85 }
  ],
  "summary": {
    "totalUsers": 1820,
    "totalSessions": 2270,
    "totalEngaged": 1375,
    "koreaUsers": 1200
  },
  "startDate": "2026-03-03",
  "endDate": "2026-04-19"
}
```

---

## 3. Meta Ads — `GET /api/meta-ads`

### 오는 필드

| 필드 | 타입 | 설명 |
|------|------|------|
| `campaigns[]` | 배열 | 캠페인별 성과 (최대 50개) |
| `campaigns[].name` | string | Meta 캠페인명 |
| `campaigns[].impressions` | number | 노출 수 |
| `campaigns[].clicks` | number | 클릭 수 (모든 유형) |
| `campaigns[].spend` | number | 광고비 (원화 정수) |
| `campaigns[].ctr` | number | 클릭률 (%, 소수점 2자리) |
| `campaigns[].cpc` | number | 클릭당 비용 (원, 정수) |
| `campaigns[].cpm` | number | 1,000회 노출당 비용 (원) |
| `campaigns[].conversions` | number | `offsite_conversion.fb_pixel_lead` 수 |
| `campaigns[].linkClicks` | number | 실제 외부 이동 클릭 수 |
| `campaigns[].pageViews` | number | 랜딩 페이지 뷰 수 |
| `totals` | object | 캠페인 합산 + 평균 CTR/CPC/CPM 재계산 |
| `since` / `until` | string | 조회 기간 |

### JSON 샘플

```json
{
  "campaigns": [
    {
      "name": "ai-mbti-v1-interest",
      "impressions": 125000,
      "clicks": 1580,
      "spend": 285000,
      "ctr": 1.26,
      "cpc": 180,
      "cpm": 2280,
      "conversions": 48,
      "linkClicks": 1420,
      "pageViews": 1180
    },
    {
      "name": "ai-mbti-v4-broad",
      "impressions": 88000,
      "clicks": 720,
      "spend": 164000,
      "ctr": 0.82,
      "cpc": 228,
      "cpm": 1863,
      "conversions": 15,
      "linkClicks": 680,
      "pageViews": 520
    }
  ],
  "totals": {
    "impressions": 213000,
    "clicks": 2300,
    "spend": 449000,
    "conversions": 63,
    "linkClicks": 2100,
    "pageViews": 1700,
    "ctr": 1.08,
    "cpc": 195,
    "cpm": 2108
  },
  "since": "2026-03-03",
  "until": "2026-04-19"
}
```

---

## 4. Google Ads — `GET /api/google-ads`

### 오는 필드 (우리 서버가 가공 후)

| 필드 | 타입 | 설명 |
|------|------|------|
| `campaigns[].name` | string | Google 캠페인명 (`%MBTI%` 필터) |
| `campaigns[].impressions` | number | 노출 수 |
| `campaigns[].clicks` | number | 클릭 수 |
| `campaigns[].spend` | number | 광고비 (원) — `cost_micros ÷ 1,000,000` |
| `campaigns[].ctr` | number | 클릭률 (%) — 원본 × 100 |
| `campaigns[].cpc` | number | 평균 CPC (원) — 마이크로 환산 |
| `campaigns[].conversions` | number | Google Ads 전환 액션 수 |
| `totals` | object | 합산 + 평균 지표 |

### Google Ads 원본 (raw) — 서버에서 가공 전

Google은 **마이크로 단위**로 금액이 오고, CTR은 비율(0~1)로 옵니다. 우리 서버가 환산 후 프론트에 전달:

| 원본 필드 | 원본 단위 | 가공 후 |
|-----------|----------|---------|
| `metrics.costMicros` | "450000000" (string) | `spend: 450` (원, 나눔) |
| `metrics.averageCpc` | "1406250" (string, 마이크로) | `cpc: 1` (원, 나눔) |
| `metrics.ctr` | 0.0266 | `ctr: 2.66` (%, ×100) |
| `metrics.impressions` | "12000" (string) | `impressions: 12000` (number) |
| `metrics.clicks` | "320" (string) | `clicks: 320` (number) |

### Google Ads 원본 JSON (우리 서버가 받는 것)

```json
[
  {
    "results": [
      {
        "campaign": {
          "resourceName": "customers/1234567890/campaigns/111222333",
          "name": "MBTI-Search-v1"
        },
        "metrics": {
          "clicks": "320",
          "impressions": "12000",
          "costMicros": "450000000",
          "ctr": 0.0266,
          "averageCpc": "1406250",
          "conversions": 12.0
        }
      },
      {
        "campaign": { "name": "MBTI-Display" },
        "metrics": {
          "clicks": "80",
          "impressions": "8000",
          "costMicros": "80000000",
          "ctr": 0.01,
          "averageCpc": "1000000",
          "conversions": 3.0
        }
      }
    ]
  }
]
```

### 우리 서버가 가공한 JSON (프론트가 받는 것)

```json
{
  "campaigns": [
    { "name": "MBTI-Search-v1", "impressions": 12000, "clicks": 320, "spend": 450, "ctr": 2.66, "cpc": 1, "conversions": 12 },
    { "name": "MBTI-Display",   "impressions": 8000,  "clicks": 80,  "spend": 80,  "ctr": 1.00, "cpc": 1, "conversions": 3 }
  ],
  "totals": {
    "impressions": 20000,
    "clicks": 400,
    "spend": 530,
    "conversions": 15,
    "ctr": 2.00,
    "cpc": 1,
    "cpm": 27
  },
  "since": "2026-03-03",
  "until": "2026-04-19"
}
```

### OAuth 토큰 갱신 (사전 단계)

매 요청마다 **refresh_token → access_token** 재발급 (1시간 유효).

```http
POST https://oauth2.googleapis.com/token
Content-Type: application/x-www-form-urlencoded

client_id=xxx&client_secret=xxx&refresh_token=xxx&grant_type=refresh_token
```

응답:
```json
{ "access_token": "ya29.a0AfH6SMB...", "expires_in": 3599, "token_type": "Bearer" }
```

---

## 5. A/B 테스트 — `GET /api/ab-test`

### 오는 필드

| 필드 | 타입 | 설명 |
|------|------|------|
| `variants[]` | 배열 (3개: v1, v3, v4) | 변형별 퍼널 카운트 |
| `variants[].variant` | string | `v1` / `v3` / `v4` |
| `variants[].pageView` | number | 변형 랜딩 페이지 방문 수 |
| `variants[].ctaClick` | number | CTA 클릭 수 |
| `variants[].testStart` | number | 테스트 시작 |
| `variants[].testComplete` | number | 테스트 완료 |
| `variants[].resultView` | number | 결과 확인 |
| `variants[].openchatClick` | number | 단톡방 클릭 |
| `variants[].ebookClick` | number | 전자책 클릭 |
| `variants[].shareClick` | number | 공유 클릭 |

### 변형 종류

| 변형 | 컨셉 | 경로 |
|------|------|------|
| `v1` | 공포소구 ("AI가 당신 월급을 노리고 있습니다") | `/preview/v1` |
| `v3` | 사회적 증거 ("2,341명이 진단 완료") | `/preview/v3` |
| `v4` | 극심플 ("지금 2분") | `/preview/v4` |

### 필터링 방식

Supabase `events` 테이블에서 `metadata->>ab_variant = 'v1'` 식으로 필터 → 이벤트명별 count.

### JSON 샘플

```json
{
  "variants": [
    {
      "variant": "v1",
      "pageView": 420, "ctaClick": 135, "testStart": 128, "testComplete": 95, "resultView": 93,
      "openchatClick": 18, "ebookClick": 9, "shareClick": 3
    },
    {
      "variant": "v3",
      "pageView": 380, "ctaClick": 155, "testStart": 148, "testComplete": 115, "resultView": 113,
      "openchatClick": 22, "ebookClick": 14, "shareClick": 5
    },
    {
      "variant": "v4",
      "pageView": 290, "ctaClick": 98, "testStart": 90, "testComplete": 70, "resultView": 68,
      "openchatClick": 11, "ebookClick": 6, "shareClick": 2
    }
  ]
}
```

---

## 6. 메타코드 전자책 — `GET /api/metacode-ebooks`

### 오는 필드

| 필드 | 타입 | 설명 |
|------|------|------|
| `ebooks[]` | 배열 (4개, 필터됨) | 전자책별 수강 데이터 |
| `ebooks[].id` | number/string | EP_IDX (27433, 27427, 27426, 27422) |
| `ebooks[].title` | string | 전자책 제목 (원본 그대로) |
| `ebooks[].students` | number | 실제 수강 등록 인원 (`cnt_join`) |
| `fetchedAt` | string (ISO) | 크롤링 시각 |

### 필터

메타코드 API 응답 중 Super Event 메뉴(`menu2_idx=30656`) → EP_IDX가 `{ 27433, 27427, 27426, 27422 }` 중 하나인 것만.

### JSON 샘플

```json
{
  "ebooks": [
    { "id": 27433, "title": "[무료/26년 최신버전] AI로 취업 뚫는 법", "students": 2847 },
    { "id": 27427, "title": "[무료/26년 최신버전] 데이터 분석 기초", "students": 1920 },
    { "id": 27426, "title": "[무료/26년 최신버전] 프롬프트 엔지니어링", "students": 1445 },
    { "id": 27422, "title": "[무료/26년 최신버전] SQL 마스터", "students": 892 }
  ],
  "fetchedAt": "2026-04-19T08:15:32.448Z"
}
```

---

## 한눈에 비교 — 출처별 데이터 성격

| API | 출처 | 데이터 성격 | 단위 환산 필요 | 인증 |
|-----|------|-----------|--------------|------|
| `/api/ga4` | Google Analytics 4 | 이벤트 카운트 (users / events) | 없음 | GCP 서비스 계정 |
| `/api/ga4-traffic` | 동일 | 세션 차원 분석 (source/country/device) | 없음 | 동일 |
| `/api/meta-ads` | Meta Graph API | 캠페인 성과 (원화 정수) | 없음 (서버 처리) | Long-lived Token |
| `/api/google-ads` | Google Ads API | 캠페인 성과 (마이크로/비율) | **있음** — micros ÷ 10⁶, CTR × 100 | OAuth Refresh Token |
| `/api/ab-test` | Supabase 자체 DB | 이벤트 카운트 (변형별) | 없음 | Supabase Service Key |
| `/api/metacode-ebooks` | 메타코드 공식 API | 수강 등록 수 | 없음 | Basic Auth |

## 인증 토큰 갱신 주기

| 출처 | 토큰 | 유효기간 | 갱신 방법 |
|------|------|---------|----------|
| GA4 | Service Account Key | 무기한 | GCP Console 재발급 |
| Meta | Long-lived Access Token | **60일** | Meta Business → System Users |
| Google Ads | Refresh Token | 반영구 | OAuth Playground 재인증 |
| Google Ads | Access Token | **1시간** | 매 요청마다 자동 갱신 |
| Supabase | Service Role Key | 무기한 | Supabase 대시보드 |
| 메타코드 | Basic Auth 키 | 무기한 | 메타코드에 재발급 요청 |
