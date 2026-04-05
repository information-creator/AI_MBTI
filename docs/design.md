# AImBTI — 서비스 설계 문서

> AI 시대 생존력 진단 서비스  
> **URL**: https://aimbti.vercel.app | **운영사**: metacode.kr  
> 작성일: 2026-04-05

---

## 1. 서비스 한 줄 정의

> "내가 AI에 대체될까?" — 20문항으로 알아보는 AI 시대 생존 유형 진단

MBTI 형식의 심리 테스트를 활용해 바이럴을 만들고,  
결과 페이지에서 이름/전화번호를 수집해 부트캠프 상담으로 전환하는 **퍼널형 마케팅 서비스**입니다.

---

## 2. 문제 정의

| 문제 | 해결 방법 |
|------|---------|
| AI 위협에 막연한 불안감을 가진 직장인 | MBTI 형식으로 구체적 유형화 → 공감 유발 |
| 부트캠프 광고 피로도 높음 | 테스트 결과로 자연스럽게 연결 (광고 아닌 정보) |
| 리드 수집 비용 | 바이럴 공유 → 유기적 유입 → 결과 페이지에서 수집 |

---

## 3. 사용자 플로우

```
[랜딩 페이지]
  "AI가 당신 월급을 노리고 있습니다"
  → 테스트 시작 버튼
        ↓
[테스트] 20문항 (4파트 × 4문항 + 퇴근 보너스 4문항)
        ↓
[분석 화면] 0~100% 진행바 애니메이션 (~3초)
        ↓
[결과 페이지] 유형 코드 + AI 대체 점수 + 직업 추천
        ↓
  "무료 상담 받아보기" 클릭
        ↓
[리드 수집 모달] 이름 + 전화번호 입력 + 개인정보 동의
        ↓
  부트캠프 URL 오픈 (metacodes.co.kr)
  + AI 활용 팁 노출
  + 쿠폰 섹션 노출
        ↓
[공유] 카카오톡 / URL 복사 → 친구에게 전달
```

---

## 4. 진단 시스템

### 4.1 4축 기준

| 축 | 코드A | 코드B | 측정 내용 |
|---|---|---|---|
| 업무 방식 | H (독립) | T (협업) | 혼자 vs 함께 |
| AI 활용도 | A (적극) | S (신중) | AI 도구 의존도 |
| 강점 영역 | L (논리) | C (창의) | 분석형 vs 감성형 |
| 실행 속도 | F (빠름) | P (완벽) | 속도 vs 완성도 |

### 4.2 16유형 코드

```
H/T + A/S + L/C + F/P = 2⁴ = 16가지
예) HALF = 독립 + AI적극 + 논리 + 빠름 = "AI 시대 지휘관"
```

### 4.3 AI 대체 점수 의미

| 구간 | 메시지 톤 | 예시 유형 |
|------|---------|---------|
| ~35% | 안도 + 경계 ("지금은 안전, 하지만...") | HALF, HALP, TALF |
| 36~60% | 위기감 ("지금 준비 안 하면...") | HSLF, HSLP |
| 61%+ | 강한 위협 ("⚠️ 이미 위험권") | TSLF, TSCF, TSCP |

---

## 5. 부트캠프 연결 전략

### 5.1 유형별 부트캠프 매핑

```
AI 활용(A) + 논리(L)  →  AI 서비스 개발자  (HALF, HALP, TALF, TALP)
AI 활용(A) + 창의(C)  →  AI LLM           (HACF, HACP, TACF, TACP)
사람감각(S) + 논리(L) + 독립(H)  →  데이터 엔지니어  (HSLF, HSLP)
사람감각(S) + 그 외  →  데이터 분석        (나머지 6개)
```

### 5.2 전환 흐름

1. 위협감 유발 (AI 대체 점수 시각화)
2. "이렇게 하면 역전 가능합니다" (방향 제시)
3. "무료 상담 받아보기" CTA
4. 이름/전화번호 입력 → 부트캠프 URL 오픈

---

## 6. 기술 아키텍처

```
[클라이언트]                    [서버]                    [외부]
Next.js (App Router)
  /                            ─────────────────         Vercel CDN
  /test                        /api/results  ─────────>  Supabase
  /result/[id]                 /api/leads    ─────────>  Supabase
  /privacy                     /api/coupons  ─────────>  Supabase
                               ─────────────────
GA4 이벤트 ─────────────────────────────────────────>  Google Analytics
Kakao SDK ──────────────────────────────────────────>  카카오 공유
```

### 6.1 결과 저장 방식

```
사용자 답변 (브라우저)
    ↓ 계산 (JS, 서버 불필요)
POST /api/results
    ↓
Supabase results_v2 테이블
    ↓ UUID 반환
router.push('/result/[uuid]')
    ↓
결과 페이지에서 UUID로 Supabase 조회
```

**Fallback**: Supabase 연결 실패 시 `/result/local`로 라우팅 (sessionStorage 활용)

### 6.2 리드 수집 방식

```
사용자: 이름 + 전화번호 입력
    ↓
POST /api/leads (서버 라우트)
    ↓ SUPABASE_SECRET_KEY 사용 (클라이언트 미노출)
중복 체크: phone + source 조합
    ↓ 신규면 INSERT
Supabase leads 테이블
    ↓
클라이언트: 부트캠프 URL 오픈 + aiTip + 쿠폰 노출
```

---

## 7. 데이터베이스 설계

### results_v2 (진단 결과)
```
id(PK)  type_code  ai_score  answers(JSON)  created_at
```

### leads (리드 정보)
```
name  phone  interest  type_code  source  result_id(FK)  created_at  id(PK)
```
- `interest`: 부트캠프 유형 (type_code에서 자동 파생)
- `source`: 'bootcamp_modal' | 'coupon_gate'
- 중복 방지: phone + source 조합으로 API 레벨 체크

### coupons (쿠폰)
```
id(PK)  result_id(FK)  code  used  created_at
```

---

## 8. 분석 설계 (GA4)

### 추적 이벤트

| 이벤트 | 목적 |
|--------|------|
| `cta_click` (location별) | 어느 CTA가 효과적인지 |
| `test_complete` | 테스트 완료율 측정 |
| `lead_submit` | 핵심 전환 지표 |
| `bootcamp_click` | 부트캠프 실제 관심도 |
| `share_click` | 바이럴 계수 측정 |

### 페이지별 분석
- `/`: 랜딩 이탈률, CTA 클릭 위치
- `/test`: 문항별 이탈 지점
- `/result/[id]`: 유형별 전환율 비교

---

## 9. 레이아웃 전략

- **모바일 퍼스트**: 실제 사용 디바이스 90% 이상 모바일
- **max-width: 480px**: 웹에서도 모바일 경험 제공 (중앙 정렬)
- **배경색 분리**: body `bg-slate-100` + 컨텐츠 `bg-white shadow-xl`로 앱 느낌

---

## 10. 바이럴 설계

### 공유 카피 전략
```
낮은 점수 (자랑형):
"나는 AI 대체 가능성 28%야 😏 너는 몇 %야? → aimbti.vercel.app"

높은 점수 (공감 유발):
"나 AI한테 대체될 수도 있대... 65% 😱 너도 한번 해봐"

퇴근 유머형:
"AI 시대 지휘관인데 야근 3단계래 ㅋㅋ"
```

### 공유 수단
- 카카오톡 공유 (Kakao SDK) — 썸네일 + 설명 포함
- URL 복사 → 클립보드

---

## 11. 개인정보 처리

| 항목 | 내용 |
|------|------|
| 수집 정보 | 이름, 전화번호 |
| 수집 목적 | 부트캠프 상담 연결 |
| 동의 방식 | 체크박스 클릭 + /privacy 링크 |
| 저장소 | Supabase (서버 사이드만 접근) |
| 중복 방지 | phone + source 조합으로 API 레벨 처리 |
| 고지 위치 | /privacy 페이지 (별도 URL) |

---

## 12. 향후 로드맵

| 우선순위 | 항목 | 설명 |
|---------|------|------|
| 즉시 | GA page_title 추가 | GAPageView.tsx에 `page_title: document.title` 추가 |
| 단기 | 쿠폰 발급 자동화 | 현재 UI만, 실제 코드 생성 로직 없음 |
| 단기 | 대시보드 | /dashboard 폴더 존재, 페이지 미구현 |
| 중기 | 이메일 수집 | leads 테이블에 email 컬럼 있음, UI 미노출 |
| 중기 | A/B 테스트 | CTA 카피, 위협 강도 테스트 |
| 장기 | 카카오 로그인 | 현재 익명 UUID 방식 |
