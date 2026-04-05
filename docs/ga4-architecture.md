# GA4 추적 구조 및 동작 원리

## GA4란?

Google Analytics 4의 약자. 구글이 만든 무료 웹 분석 도구.

사용자가 사이트에서 어떤 행동을 하는지 데이터를 수집해서 대시보드로 보여준다.
페이스북 픽셀과 완전히 같은 구조 — 픽셀은 메타 서버로, GA4는 구글 서버로 데이터를 보내는 차이만 있다.

---

## 기술 구조

```
사용자 브라우저
    ↓ 페이지 로드 시 gtag.js 다운로드
구글 서버 (googletagmanager.com)
    ↓ 이벤트 발생 시 데이터 전송
GA4 수집 서버 (google-analytics.com/g/collect)
    ↓ 처리 후 저장
GA4 대시보드 (analytics.google.com)
```

---

## AImBTI에 적용한 방법

### 1단계 — 스크립트 삽입 (src/app/layout.tsx)

```tsx
// 구글 서버에서 gtag.js 로드
<Script src="https://www.googletagmanager.com/gtag/js?id=G-X6R0LGZKDJ" />

// GA4 초기화
<Script id="ga-init">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-X6R0LGZKDJ');
  `}
</Script>
```

모든 페이지에 공통 적용되는 layout.tsx에 넣었기 때문에
사이트 어느 페이지를 열어도 자동으로 GA4가 붙는다.

### 2단계 — 이벤트 전송 함수 (src/lib/ga.ts)

```ts
export function gtagEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return  // 서버사이드 렌더링 방지
  if (!(window as any).gtag) return          // gtag 로드 전 방지
  (window as any).gtag('event', name, params)
}
```

이 함수를 호출하면 구글 서버로 이벤트 데이터가 전송된다.

### 3단계 — 페이지 전환 추적 (src/components/GAPageView.tsx)

Next.js는 SPA라서 페이지 이동 시 HTML을 새로 받지 않는다.
그래서 URL 변경을 감지해서 GA4에 수동으로 page_view를 전송한다.

---

## 심은 이벤트 목록

| 이벤트 | 파일 | 시점 | 파라미터 |
|--------|------|------|----------|
| `page_view` | GAPageView.tsx | 페이지 이동 시 (자동) | `page_location` |
| `cta_click` | CTAButton.tsx | 랜딩 CTA 버튼 클릭 | `location` |
| `test_start` | test/page.tsx | 1번 문항 답변 시 | - |
| `test_complete` | test/page.tsx | 마지막 문항 답변 후 | `type_code`, `ai_score` |
| `result_view` | ResultClient.tsx | 결과 페이지 진입 | `type_code`, `ai_score` |
| `share_click` | ResultClient.tsx | 공유 버튼 클릭 | `method` |
| `coupon_copy` | ResultClient.tsx | 쿠폰 복사 클릭 | - |
| `bootcamp_click` | ResultClient.tsx | 부트캠프 버튼 클릭 | `bootcamp`, `type_code` |

### cta_click location 값

| 값 | 위치 |
|----|------|
| `header` | 헤더 우상단 버튼 |
| `hero` | 히어로 메인 CTA |
| `type_preview` | 유형 카드 하단 버튼 |
| `viral` | 바이럴 섹션 버튼 |

---

## 데이터 흐름 상세

```
1. 사용자가 aimbti-jet.vercel.app 접속
        ↓
2. layout.tsx가 gtag.js 스크립트 로드 (구글 서버에서)
        ↓
3. gtag('config', 'G-X6R0LGZKDJ') 실행 → GA4 초기화
   → 이 시점에 page_view 이벤트 자동 전송
        ↓
4. 사용자가 CTA 버튼 클릭
   → CTAButton의 onClick → gtagEvent('cta_click', { location: 'hero' })
   → gtag('event', ...) → 구글 수집 서버로 HTTP 요청
        ↓
5. 사용자가 테스트 완료
   → gtagEvent('test_complete', { type_code: 'HALF', ai_score: 72 })
        ↓
6. GA4 대시보드에서 실시간/보고서/탐색 분석으로 확인
```

---

## 환경변수 구조

```
NEXT_PUBLIC_GA_ID=G-X6R0LGZKDJ
```

- `NEXT_PUBLIC_` 접두사: 브라우저에서 접근 가능한 변수
- 값이 없으면 layout.tsx에서 스크립트 자체를 삽입하지 않음 (조건부 렌더링)
- Vercel 대시보드 → Settings → Environment Variables에서 관리

---

## 브라우저에서 확인하는 법

```js
// GA4 로드 확인
typeof window.gtag  // "function" 이면 정상

// 쌓인 이벤트 확인
window.dataLayer    // 배열에 전송된 이벤트 목록

// 수동으로 이벤트 전송
gtag('event', 'test_event', { foo: 'bar' })
```

Network 탭에서 `google-analytics.com/g/collect` 요청이 보이면
이벤트가 구글 서버로 정상 전송되고 있는 것.
