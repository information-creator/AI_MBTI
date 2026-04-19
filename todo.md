# Google Ads API 연동 TODO

현재 상태: `src/app/api/google-ads/route.ts` 코드는 있지만 자격증명 미설정 + access token 방식 설계 오류.

---

## 1. Google Ads 콘솔 작업 (사용자 직접)

- [ ] **Developer token 신청** (가장 오래 걸림 — 먼저 시작)
  - ads.google.com → 우상단 도구(🔧) → API Center
  - Test access는 즉시 발급 / Basic access는 심사 1~3일
  - 테스트 토큰으로 연결 검증 선행 가능

- [ ] **Customer ID 메모**
  - Google Ads 우상단 `XXX-XXX-XXXX` 10자리
  - 하이픈 제거 후 저장
  - MCC 계정 여부 확인 (MCC면 `login-customer-id` 헤더 필요)

## 2. Google Cloud Console 작업

- [ ] **Google Ads API 활성화**
  - console.cloud.google.com → APIs & Services → Library → "Google Ads API" Enable
  - 기존 GA4 프로젝트 재활용 가능

- [ ] **OAuth 2.0 Client ID 생성 (Desktop app 타입)**
  - Credentials → Create Credentials → OAuth client ID → Desktop app
  - client_id / client_secret 저장

- [ ] **Refresh token 발급 (OAuth Playground)**
  - developers.google.com/oauthplayground
  - 우상단 톱니바퀴 → "Use your own OAuth credentials" → client_id/secret 입력
  - Step 1 scope: `https://www.googleapis.com/auth/adwords` 직접 입력 → Authorize
  - Step 2 Exchange authorization code → **refresh_token 복사**

## 3. 코드 수정 (Claude 작업)

- [ ] **`src/app/api/google-ads/route.ts` 리팩토링**
  - 현재: `GOOGLE_ADS_ACCESS_TOKEN`을 env에 박음 (1시간 만료 버그)
  - 변경: refresh_token으로 요청마다 access_token 자동 갱신
  - `oauth2.googleapis.com/token` POST로 갱신 구현
  - MCC면 `login-customer-id` 헤더 추가

- [ ] **env 변수 정리**
  ```
  GOOGLE_ADS_CLIENT_ID=
  GOOGLE_ADS_CLIENT_SECRET=
  GOOGLE_ADS_REFRESH_TOKEN=
  GOOGLE_ADS_DEVELOPER_TOKEN=
  GOOGLE_ADS_CUSTOMER_ID=
  GOOGLE_ADS_LOGIN_CUSTOMER_ID=   # MCC일 때만
  ```
  - `.env.example`에도 반영

## 4. 배포

- [ ] **Vercel 환경변수 등록**
  - Vercel 대시보드 → Settings → Environment Variables
  - Production / Preview / Development 모두 체크

- [ ] **로컬 테스트**
  - `npm run dev` → `/api/google-ads?pass=720972` 호출
  - 응답 200 + campaigns 배열 확인

- [ ] **프로덕션 배포 후 대시보드 확인**
  - `/dashboard2/google` 접속
  - 캠페인/노출/클릭/CTR/CPC 수치 정상 렌더 확인

## 5. 확인 메모

- gtag 전환 ID `AW-11436424421` ≠ API용 customer ID (전혀 다른 값)
- Developer token 승인 시 "자사 광고 성과 조회용 내부 대시보드" 명시
- Test access 상태에선 test 계정 데이터만 조회됨 (실제 광고 데이터는 Basic 이상)
