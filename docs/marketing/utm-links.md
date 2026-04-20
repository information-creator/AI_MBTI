# 단축 링크 & UTM 정리

모든 링크는 `mcodegc.com/go/코드` 형식
GA4 트래픽 분석 페이지(/dashboard/traffic)에서 소스별로 추적 가능

> **자동 파라미터 통과**: `fbclid`, `gclid`, `utm_content`, `utm_term`은 리다이렉트 과정에서 자동으로 보존됩니다 (`src/lib/shortlink.ts`). Meta·Google 광고 어트리뷰션 유지 목적.

## Meta 광고 — 3-캠페인 A/B (현재 운영 대상)

| URL | 목적지 | GA4 소스 | utm_campaign | 전략 |
|---|---|---|---|---|
| `/go/meta/fear` | `/v1` | meta/paid | fear | 공포소구 (손실회피) |
| `/go/meta/social` | `/v3` | meta/paid | social | 사회적증거 (밴드왜건) |
| `/go/meta/simple` | `/v4` | meta/paid | simple | 인지부하 최소화 |

Meta Ads Manager에는 이 3개 URL만 입력. `fbclid`는 Meta가 자동 부착 → 라우트가 목적지로 통과.

## Meta 광고 — 기존 공통 링크

| URL | GA4 소스 | 용도 |
|---|---|---|
| /go/me | meta/paid | Meta 광고 (공통 랜딩 `/`) |
| /go/mi | meta_instagram/paid | 인스타그램 광고 |
| /go/mf | meta_facebook/paid | 페이스북 광고 |
| /go/ig | instagram/ad | (구버전, 기존 광고 호환용) |

## Google Ads

Google Ads는 자동 태깅(gclid)으로 GA4에서 google/cpc로 잡힘. 별도 단축링크 불필요.

## 카카오

| URL | GA4 소스 | 용도 |
|---|---|---|
| /go/ad | kakao_biz/ad | 카카오 비즈 광고 |
| /go/ks | kakao/share | 카카오톡 공유 (결과 페이지) |
| /go/kt | kakao/openchat | 카카오 오픈채팅 |
| /go/kakao | kakao/chat | 카카오 채팅 공유 |

## 기타

| URL | GA4 소스 | 용도 |
|---|---|---|
| /go/ls | link/share | 링크 복사 공유 |
| /go/yt | youtube/post | 유튜브 |
| /go/sms | sms/text | 문자 발송 |
