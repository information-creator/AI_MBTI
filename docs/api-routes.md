# API Routes 문서

대시보드(`/dashboard3`)와 스냅샷/이벤트 추적에서 사용하는 내부 API 엔드포인트 정리.
**모든 엔드포인트는 `?pass=720972` 쿼리 파라미터 인증 필요** (Vercel Cron은 `Authorization: Bearer $CRON_SECRET` 별도 경로).

---

## 1. `GET /api/ga4` — GA4 이벤트 집계

사이트 전체의 GA4 이벤트 카운트·사용자 수 조회. 퍼널 단계별 사용자(방문/CTA/시작/완료/결과/2차 전환) 계산의 원천.

**출처** — Google Analytics 4 Data API (Beta)
**인증** — GCP 서비스 계정
  - 로컬: `cred/ga4-key.json` 파일
  - 프로덕션: `GA4_SERVICE_ACCOUNT_KEY` 환경변수 (JSON string)
**GA4 Property ID** — `531252719` (하드코딩)

**Query params**
| 키 | 기본값 | 설명 |
|----|--------|------|
| `pass` | — | 필수, `720972` |
| `start` | `2026-03-03` | 조회 시작일 (YYYY-MM-DD) |
| `end` | `today` | 조회 종료일 |

**응답**
```json
{
  "events": {
    "page_view": { "events": 1234, "users": 800 },
    "cta_click": { "events": 210, "users": 180 },
    "test_start": { "events": 170, "users": 160 },
    ...
  },
  "totalUsers": 800,
  "startDate": "2026-03-03",
  "endDate": "2026-04-19"
}
```

**사용처** — 대시보드 종합/퍼널 뷰, AB 테스트 뷰, 스냅샷 수집

---

## 2. `GET /api/ga4-traffic` — GA4 트래픽 세부 분석

소스/매체/국가/디바이스/랜딩 페이지 단위 세션·사용자·참여 세션 수집. 봇·해외 트래픽 탐지용.

**출처** — GA4 Data API (같은 서비스 계정)

**Query params** — `pass`, `start`, `end` (기본 `2026-04-16 ~ today`)

**응답**
```json
{
  "sources": [{ "source": "google", "medium": "organic", "users": 100, "sessions": 150, "engaged": 80 }],
  "countries": [{ "country": "South Korea", "users": 500, "sessions": 700, "engaged": 450 }],
  "devices": [{ "device": "mobile", "users": 400, "sessions": 550, "engaged": 320 }],
  "pages": [{ "page": "/", "users": 600, "sessions": 800, "engaged": 500 }],
  "summary": { "totalUsers": 800, "totalSessions": 1100, "totalEngaged": 650, "koreaUsers": 500 },
  "startDate": "...", "endDate": "..."
}
```

**사용처** — 대시보드 트래픽 분석 뷰 (세계지도·소스 차트·국가 테이블)

---

## 3. `GET /api/meta-ads` — Meta Ads 캠페인 성과

Meta Graph API로 캠페인별 광고비·노출·클릭·CTR·CPC·CPM·전환 조회.

**출처** — `https://graph.facebook.com/v21.0/act_{ACCOUNT_ID}/insights`
**인증** — 장기 Access Token (Meta Business에서 발급)
**필터** — 캠페인 이름에 `ai-mbti` 포함된 것만

**환경변수**
- `META_ADS_ACCESS_TOKEN` — 장기 토큰 (60일 주기 갱신 필요)
- `META_ADS_ACCOUNT_ID` — 광고 계정 ID (앞의 `act_` 제외)

**Query params** — `pass`, `since`, `until` (기본 `2026-03-03 ~ today`)

**응답**
```json
{
  "campaigns": [
    {
      "name": "ai-mbti-v1-interest",
      "impressions": 50000, "clicks": 1200, "spend": 300000,
      "ctr": 2.4, "cpc": 250, "cpm": 6000,
      "conversions": 30,        // Pixel Lead 이벤트
      "linkClicks": 1100,        // 실제 링크 이동
      "pageViews": 900           // 랜딩 페이지 로딩 완료
    }
  ],
  "totals": { /* 합산 + 평균 CTR/CPC/CPM 재계산 */ },
  "since": "...", "until": "..."
}
```

**주의** — `conversions`는 `offsite_conversion.fb_pixel_lead` 액션 카운트. 다른 전환 유형 쓰려면 `getAction(...)` 수정 필요.

---

## 4. `GET /api/google-ads` — Google Ads 캠페인 성과

Google Ads API v15로 캠페인별 성과 조회. Refresh token을 매 요청마다 갱신해서 안정적으로 호출.

**출처** — `https://googleads.googleapis.com/v{version}/customers/{CUSTOMER_ID}/googleAds:search`
**인증** — OAuth2 Refresh Token flow
  1. `oauth2.googleapis.com/token`에 `refresh_token` → `access_token` 발급
  2. `access_token`으로 Google Ads API 호출

**환경변수**
- `GOOGLE_ADS_CLIENT_ID`, `GOOGLE_ADS_CLIENT_SECRET` — Google Cloud OAuth 클라이언트
- `GOOGLE_ADS_REFRESH_TOKEN` — 1회 발급 후 반영구 (수동 갱신만 필요 시)
- `GOOGLE_ADS_DEVELOPER_TOKEN` — Google Ads 개발자 토큰
- `GOOGLE_ADS_CUSTOMER_ID` — 광고주 ID (하이픈 제거)
- `GOOGLE_ADS_LOGIN_CUSTOMER_ID` *(선택)* — MCC 계정 경유 시

**Query params** — `pass`, `since`, `until`

**응답** — Meta와 동일한 스키마 (`campaigns[]` + `totals`)

---

## 5. `GET /api/ab-test` — A/B 테스트 변형별 퍼널

Supabase `events` 테이블에서 `metadata->>ab_variant`로 필터 집계.

**출처** — Supabase (`events` 테이블)
**인증** — `SUPABASE_SECRET_KEY` (서버사이드)

**Query params** — `pass`, `start`, `end`

**응답**
```json
{
  "variants": [
    {
      "variant": "v1",
      "pageView": 100, "ctaClick": 35, "testStart": 30,
      "testComplete": 22, "resultView": 20,
      "openchatClick": 3, "ebookClick": 2, "shareClick": 1
    },
    // v3, v4 동일 구조
  ]
}
```

**변형 ID** — `v1` (공포소구), `v3` (사회적 증거), `v4` (극심플). `/v1,v3,v4` 공개 랜딩 또는 `/preview/v1,v3,v4` 내부 QA 랜딩에서 이벤트 기록 시 `metadata.ab_variant`에 값 주입.

---

## 6. `GET /api/metacode-ebooks` — 메타코드 전자책 수강생 크롤링

메타코드 공식 교육 API에서 Super Event 메뉴(`menu2_idx=30656`) 항목 중 전자책 4종의 실제 수강생 수(`cnt_join`) 가져오기.

**출처** — `https://www.metacodes.co.kr/api/v1/edu`
**인증** — `Authorization: Basic {key}` (하드코딩 상수)
**필터** — `EBOOK_IDS = {27433, 27427, 27426, 27422}` (4종)

**Query params** — `pass`

**응답**
```json
{
  "ebooks": [
    { "id": "27433", "title": "[무료/26년 최신버전] ...", "students": 1234 },
    ...
  ],
  "fetchedAt": "2026-04-19T08:00:00.000Z"
}
```

---

## 7. `POST /api/snapshot` — 일일 스냅샷 저장 (Cron)

매일 자정에 GA4·Meta·Google 데이터를 Supabase에 upsert. Vercel Cron 또는 수동 호출.

**출처** — 위 API들을 내부적으로 호출 (`baseUrl + /api/...`)
**인증 2가지**
- `?pass=720972` (수동)
- `Authorization: Bearer $CRON_SECRET` (Vercel Cron)

**저장 테이블**
- `daily_funnel_metrics` — 퍼널 단계별 일일 수치
- (Meta/Google 캠페인 스냅샷은 추가 가능)

**사용처** — 장기 트렌드 조회 (현재 대시보드에는 미반영, 스키마만 준비)

---

## 8. 단축 URL 라우트 (`/go/*`) — 리다이렉트 + UTM 자동 부착

광고·공유 링크용 서버사이드 리다이렉트. 공통 헬퍼(`src/lib/shortlink.ts`)로 UTM 박고 fbclid·gclid 통과.

**인증 불필요** — 공개 링크
**응답** — 307 Redirect (목적지에 `utm_source/medium/campaign` + 통과된 `fbclid/gclid/utm_content/utm_term`)

### Meta 3-캠페인 (A/B 테스트)

| 단축 URL | 목적지 | utm_source | utm_campaign |
|---|---|---|---|
| `/go/meta/fear` | `/v1` | meta | fear |
| `/go/meta/social` | `/v3` | meta | social |
| `/go/meta/simple` | `/v4` | meta | simple |

### 기존 공유·광고 링크

| URL | 목적지 | utm_source | medium | campaign | 용도 |
|---|---|---|---|---|---|
| `/go/me` | `/` | meta | paid | promotion | Meta 통합 광고 |
| `/go/mi` | `/` | meta_instagram | paid | promotion | 인스타그램 광고 |
| `/go/mf` | `/` | meta_facebook | paid | promotion | 페이스북 광고 |
| `/go/ig` | `/` | instagram | ad | promotion | (구버전 호환) |
| `/go/ad` | `/` | kakao_biz | ad | promotion | 카카오 비즈 |
| `/go/ks` | `/` | kakao | share | result | 카카오 공유 |
| `/go/kt` | `/` | kakao | openchat | share | 카카오 오픈채팅 |
| `/go/kakao` | `/` | kakao | chat | share | 카카오톡 공유 |
| `/go/ls` | `/` | link | share | result | 링크 복사 |
| `/go/yt` | `/` | youtube | post | share | 유튜브 |
| `/go/sms` | `/` | sms | text | promotion | 문자 |

### 새 단축 URL 만들기

`src/app/go/{경로}/route.ts`:
```ts
import type { NextRequest } from 'next/server'
import { redirectWithUtm } from '@/lib/shortlink'

export function GET(req: NextRequest) {
  redirectWithUtm(req, '/목적지', {
    source: 'xxx', medium: 'yyy', campaign: 'zzz',
  })
}
```

헬퍼가 `fbclid`·`gclid`·`utm_content`·`utm_term`를 자동 통과. 다른 파라미터도 통과 필요하면 `src/lib/shortlink.ts`의 `PASSTHROUGH_KEYS` 배열에 추가.

---

## 9. `POST /api/export` — 대시보드 CSV 내보내기

기간 필터의 전 섹션 데이터를 단일 CSV로 묶어 다운로드. LLM(GPT/Claude)에 첨부해 분석 용도.

**Query params** — `pass`, `since`, `until`
**응답** — `text/csv; charset=utf-8` (UTF-8 BOM 포함), `Content-Disposition: attachment`

**CSV 섹션 구성**
1. SUMMARY — 기간 합계·평균
2. DAILY METRICS — 일별 wide 테이블 (퍼널 + Meta + Google + 전자책)
3. EBOOK DETAIL — 전자책별 현재 + 1일/7일 delta
4. AB TEST BY VARIANT — v1/v3/v4 퍼널 비교
5. RESULT TYPE DISTRIBUTION — 16유형 분포 + 평균 AI 점수

---

## 데이터 흐름 요약

```
┌─────────────────┐
│  브라우저        │  GA4 gtag / Meta Pixel / Clarity
│  랜딩/테스트     │──┐
└─────────────────┘  │                          ┌─────────────────────┐
                     ▼                          │  GA4 Data API       │ ◄─── /api/ga4, /api/ga4-traffic
                  Supabase                      │  (서비스 계정)       │
                  events 테이블                  └─────────────────────┘
                     │
                     └──── /api/ab-test ◄─┐
                                          │
                     ┌─── /api/meta-ads ──┼──── Meta Graph API (장기토큰)
Dashboard3  ◄────────┼─── /api/google-ads─┼──── Google Ads API (OAuth refresh)
                     └─── /api/metacode-ebooks ── metacodes.co.kr API (Basic Auth)
                     │
                     └─── /api/snapshot (Cron) → daily_funnel_metrics
```

## 환경변수 체크리스트

```bash
# GA4
GA4_SERVICE_ACCOUNT_KEY='{...JSON...}'   # Vercel
# 로컬은 cred/ga4-key.json

# Meta
META_ADS_ACCESS_TOKEN=...
META_ADS_ACCOUNT_ID=...                   # act_ 제외 숫자만

# Google Ads
GOOGLE_ADS_CLIENT_ID=...
GOOGLE_ADS_CLIENT_SECRET=...
GOOGLE_ADS_REFRESH_TOKEN=...
GOOGLE_ADS_DEVELOPER_TOKEN=...
GOOGLE_ADS_CUSTOMER_ID=...                # 하이픈 제거
GOOGLE_ADS_LOGIN_CUSTOMER_ID=...          # 선택 (MCC)

# Supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SECRET_KEY=...                   # 서버사이드 쿼리용

# Cron
CRON_SECRET=...
```

## 토큰 갱신 주기

| 서비스 | 토큰 종류 | 유효 기간 | 갱신 방법 |
|--------|-----------|-----------|-----------|
| GA4 | Service Account Key | 무기한 | GCP 콘솔에서 재발급 |
| Meta | Long-lived Access Token | 60일 | Meta Business → System Users → 토큰 재발급 |
| Google Ads | Refresh Token | 반영구 | OAuth Playground 재인증 |
| Google Ads | Access Token | 1시간 | 요청마다 자동 갱신 (`getAccessToken()`) |
| Metacode API Key | Basic Auth 키 | 무기한 | 메타코드에서 재발급 요청 |
