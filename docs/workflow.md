# AIMBTI 유입 워크플로우

## 유입 경로

```
SNS 공유 (카카오/인스타/링크)
    ↓
랜딩 페이지 (/)
    ↓
테스트 (/test)
    ↓
결과 페이지 (/result/[id])
    ↓
전환 (부트캠프 상담 / 단톡방 / 전자책)
```

---

## 채널별 유입

| 채널 | 진입점 | 비고 |
|------|--------|------|
| 카카오톡 공유 | `/result/[id]` 직접 | OG 이미지 + 유형명 노출 |
| 인스타그램 | `/result/[id]` 직접 | 세로형 카드 이미지 공유 |
| 링크 복사 | `/result/[id]` 직접 | - |
| 직접 유입 | `/` 랜딩 | metacode.kr 등 외부 링크 |

---

## 사용자 여정 (Happy Path)

### 1단계 — 랜딩 (`/`)
- 불안 자극 카피 → CTA 클릭
- GA 이벤트: `cta_click` (location: hero / type_preview / viral)

### 2단계 — 테스트 (`/test`)
- 20문항 (파트 A~E) 순차 응답
- Q5/10/15 완료 시 독려 팝업 (2초)
- GA 이벤트: `test_start` (첫 문항), `test_complete` (마지막 문항)
- 완료 → `calculateResult()` → `/analyzing` 이동

### 3단계 — 분석 (`/analyzing`)
- 가짜 프로그레스바 (80ms 틱) + Supabase 저장 병렬 실행
- 저장 성공 → `/result/[id]`
- 저장 실패 → `/result/local?...` (폴백)

### 4단계 — 결과 (`/result/[id]`)
- Confetti 등장 + AI 점수 카운트업 애니메이션
- GA 이벤트: `result_view`
- 공유 섹션: 카카오 / 인스타 / 링크복사
- 전환 섹션: 전자책 → 메타코드 회원가입 / 단톡방 입장

---

## 전환 흐름

```
결과 페이지
    ├── 공유 버튼 클릭 → 친구 유입 (바이럴 루프)
    ├── 전자책 CTA → 메타코드 회원가입 (utm_source=aimbti)
    └── 단톡방 CTA → AImBTI 전용 오픈채팅방
```

---

## CI/CD 파이프라인

```
git push to main
    ├── GitHub Actions (CI)
    │     ├── tsc --noEmit   # 타입 체크
    │     └── eslint          # 린트
    └── Vercel (CD)           # 자동 빌드 + 프로덕션 배포
```

- CI 결과: https://github.com/information-creator/AI_MBTI/actions
- 프로덕션: https://aimbti-seven.vercel.app

---

## 전환 시나리오 예시

유형별 AI 대체 점수(aiScore)와 추천 부트캠프에 따라 CTA 강도가 달라짐.

### 시나리오 A — 고위험 유형 (aiScore 45%+)
> 예: `DA 논리왕 (HALP)` aiScore 48%, `DE 은둔자 (HASP)` aiScore 45%

```
결과 페이지 진입
    → "AI 대체 가능성 48%" 카운트업 (강한 불안 자극)
    → "지금 전환하지 않으면 위험합니다" 코멘트
    → 데이터 엔지니어 부트캠프 CTA 강조 노출
    → 단톡방 입장 → 부트캠프 상담 전환
```

**핵심 동기:** 위기감 → 즉각 행동

---

### 시나리오 B — 중간 위험 유형 (aiScore 30~44%)
> 예: `LLM 아티스트 (HACP)` aiScore 32%, `DA 독립군 (HASP)` aiScore 38%

```
결과 페이지 진입
    → "AI 대체 가능성 32%" 카운트업
    → "지금 스킬 추가하면 대체 불가 포지션 가능" 코멘트
    → AI LLM / 데이터 분석 부트캠프 CTA 노출
    → 전자책 무료 다운로드 → 메타코드 회원가입 전환
```

**핵심 동기:** 기회감 → 천천히 탐색

---

### 시나리오 C — 저위험 유형 (aiScore ~30% 이하)
> 예: `LLM 장인 (HASP)` aiScore 25%, `AI 지배자 (HALF)` aiScore 28%

```
결과 페이지 진입
    → "AI 대체 가능성 25%" (낮은 점수 = 자랑하고 싶음)
    → 공유 욕구 자극 → 카카오/인스타 공유 먼저 클릭
    → 친구들의 결과 공유 → 바이럴 루프
    → 본인은 AI 서비스 개발자 부트캠프 CTA 탐색
```

**핵심 동기:** 자랑 → 공유 → 바이럴

---

### 시나리오 D — SNS 공유로 유입된 신규 사용자
> 친구 결과 카드를 카카오/인스타에서 보고 진입

```
/result/[친구 id] 직접 진입
    → 친구 유형 확인 → "나는 어떤 유형일까?" 궁금증 유발
    → "내 유형 확인하기" CTA 클릭
    → / 랜딩 → /test → /result/[내 id]
    → 바이럴 루프 반복
```

**핵심 동기:** 비교 심리 → 테스트 참여

---

## GA4 전환 추적 포인트

| 단계 | 이벤트 | 의미 |
|------|--------|------|
| 랜딩 CTA | `cta_click` | 테스트 시작 의향 |
| 첫 문항 응답 | `test_start` | 실제 참여 시작 |
| 마지막 문항 | `test_complete` | 완주율 |
| 결과 진입 | `result_view` | 결과 확인 |
| 공유 버튼 | `share_click` | 바이럴 전파 |
| 단톡방 입장 | `openchat_click` | 핵심 전환 |
| 전자책 클릭 | `ebook_click` | 회원가입 전환 |
