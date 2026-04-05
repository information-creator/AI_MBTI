# AI 시대 생존력 진단 서비스 — PRD

**버전**: v2.0 (2026-04-05)  
**스택**: Next.js (App Router) + Tailwind CSS + Vercel + Supabase  
**배포 URL**: https://aimbti.vercel.app  
**운영사**: metacode.kr  
**상태**: 리드 수집 퍼널 완성 · 운영 중

---

## 1. 서비스 개요

MBTI 형식의 20문항 진단으로 AI 대체 가능성을 측정하고, 결과에 따라 부트캠프 상담 신청(리드 수집)으로 연결하는 퍼널형 바이럴 진단 서비스.

**핵심 KPI**
- 리드 전환율: 결과 페이지 → 이름/전화번호 제출 비율
- 부트캠프 클릭률: 리드 제출 → https://metacodes.co.kr/ 클릭 비율
- 바이럴 확산: 결과 공유 → SNS 자연 유입
- 테스트 완료율: /test 진입 → /result 도달 비율

**핵심 가설**  
"내가 AI에 대체될까?" 라는 질문은 누구나 궁금하다. 결과를 공유하게 만들면 광고비 없이 바이럴이 가능하고, 위협감으로 부트캠프 전환이 가능하다.

---

## 2. 페이지 구조

| 페이지 | 경로 | 역할 |
|---|---|---|
| 랜딩 | `/` | 훅 카피 + 테스트 시작 CTA + 16유형 미리보기 |
| 테스트 | `/test` | 20문항 스텝 형식 + 분석 애니메이션 |
| 결과 | `/result/[id]` | 유형 결과 + 리드 수집 CTA + 쿠폰 |
| 개인정보처리방침 | `/privacy` | 법적 고지 (별도 페이지) |

---

## 3. 테스트 설계 (20문항)

### 핵심 4축 기준

| 파트 | 축 | 문항 수 | 설명 |
|---|---|---|---|
| A | H / T | 4 | 독립형(H) vs 협업형(T) — 업무 방식 |
| B | A / S | 4 | AI 적극활용(A) vs 신중형(S) — AI 활용도 |
| C | L / C | 4 | 논리/분석형(L) vs 창의/감성형(C) — 강점 영역 |
| D | F / P | 4 | 속도우선(F) vs 완성도우선(P) — 실행 속도 |
| E | 보너스 | 4 | 퇴근 시간/야근 (유형 반영 없음, 유머 코멘트용) |

파트 A~D 각 4문항 다수결 → 4글자 코드 산출 (예: HALF, TSCP)

### 분석 화면 애니메이션
- 0→85%: 4%씩 80ms 간격
- 85→95%: 0.5%씩 80ms 간격
- 완료 직전 100% 표시 → router.push('/result/[id]')
- 단계 레이블: "응답 분석 중..." → "AI 성향 매핑..." → "유형 계산 중..." → "리포트 생성 중..."

---

## 4. 16유형 정의

### 유형 코드 체계
`[업무방식][AI활용][강점][속도]` 4글자 조합

| 코드 | 유형 이름 | AI 대체 점수 | 추천 부트캠프 |
|---|---|---|---|
| HALF | AI 시대 지휘관 | 28% | AI 서비스 개발자 |
| HALP | 완벽주의 AI 설계자 | 25% | AI 서비스 개발자 |
| HACF | 데이터로 판치는 크리에이터 | 32% | AI LLM |
| HACP | 느린 듯 정확한 AI 예술가 | 30% | AI LLM |
| HSLF | 조용한 논리 장인 | 48% | 데이터 엔지니어 |
| HSLP | 철저한 혼자형 전략가 | 45% | 데이터 엔지니어 |
| HSCF | 감성 독립군 | 38% | 데이터 분석 |
| HSCP | 나만의 세계 완성형 | 35% | 데이터 분석 |
| TALF | 팀 이끄는 AI 선봉장 | 31% | AI 서비스 개발자 |
| TALP | 함께 만드는 AI 설계자 | 29% | AI 서비스 개발자 |
| TACF | AI 부리는 크리에이터 | 33% | AI LLM |
| TACP | 협력형 AI 아티스트 | 31% | AI LLM |
| TSLF | 사람으로 굴러가는 분석가 | 61% | 데이터 분석 |
| TSLP | 신중한 팀 전략가 | 58% | 데이터 분석 |
| TSCF | 감성으로 팀 살리는 사람 | 65% | 데이터 분석 |
| TSCP | 완벽한 팀의 완성자 | 62% | 데이터 분석 |

### 부트캠프 매핑 로직

| 조건 | 부트캠프 | 해당 유형 |
|---|---|---|
| A + L (AI 활용 + 논리형) | AI 서비스 개발자 | HALF, HALP, TALF, TALP |
| A + C (AI 활용 + 창의형) | AI LLM | HACF, HACP, TACF, TACP |
| S + L + H (사람감각 + 논리형 + 독립) | 데이터 엔지니어 | HSLF, HSLP |
| S + L + T (사람감각 + 논리형 + 협업) | 데이터 분석 | TSLF, TSLP |
| S + C (사람감각 + 창의형) | 데이터 분석 | HSCF, HSCP, TSCF, TSCP |

---

## 5. 결과 페이지 스펙 (`/result/[id]`)

### 섹션 구성
1. **헤더**: 유형명, 4글자 코드, 이모지, AI 대체 점수 게이지
2. **위기 진단**: 강점 / 위기 / 방향 (3단 카드)
3. **직업 영향도**: 직무별 AI 대체율 막대 차트 (3개 직무)
4. **직업 전환 제안**: from → to (화살표 시각화)
5. **무료 상담 CTA**: "무료 상담 받아보기" → 이름/전화번호 입력 모달
6. **AI 활용 팁** (`aiTip`): 상담 신청 완료 후 노출 (쿠폰 언락과 동시)
7. **쿠폰 섹션**: 상담 신청 후 쿠폰 코드 표시
8. **공유 버튼**: 카카오톡 + URL 복사

### 리드 수집 모달 (부트캠프 상담)
- 이름 입력 (필수)
- 전화번호 입력 (필수, 9~11자리 숫자)
- 개인정보 수집 동의 체크박스 + /privacy 링크
- 제출 시: Supabase leads 저장 → bootcamp URL 오픈 → aiTip + 쿠폰 노출

### 공유
- 카카오톡 공유 (Kakao SDK)
- URL 복사 (클립보드)

---

## 6. 리드 수집 시스템

### API: `POST /api/leads`

**요청 Body**
```json
{
  "name": "홍길동",
  "phone": "01012345678",
  "type_code": "HALF",
  "result_id": "uuid-...",
  "source": "bootcamp_modal"
}
```

**자동 파생 필드**
- `interest`: type_code → bootcamp 매핑으로 자동 설정 (AI LLM / 데이터 분석 / 데이터 엔지니어 / AI 서비스 개발자)

**중복 처리**
- phone + source 조합으로 중복 체크 (maybeSingle)
- 중복 시 200 OK 반환 (사용자에게 에러 없음)

**유효성 검사**
- phone: 숫자만 추출 후 9~11자리
- name: 비어있으면 400 반환

### 개인정보 처리방침
- 수집 항목: 이름, 전화번호
- 처리 목적: 부트캠프 상담 연결
- 동의 방식: 체크박스 + /privacy 링크 (전문 토글 없음, 별도 페이지로 충분)

---

## 7. 기술 스택

| 영역 | 기술 |
|---|---|
| 프레임워크 | Next.js App Router |
| 스타일 | Tailwind CSS (모바일 퍼스트, max-w-[480px]) |
| DB | Supabase (PostgreSQL) |
| 배포 | Vercel (GitHub 자동 배포) |
| 분석 | Google Analytics 4 |
| 공유 | Kakao SDK |

---

## 8. DB 스키마

### `results_v2` — 진단 결과 저장
```sql
id          uuid primary key default gen_random_uuid()
type_code   text not null
ai_score    int
answers     jsonb
created_at  timestamptz default now()
```

### `leads` — 리드 정보 (컬럼 순서: 업무용)
```sql
name        text not null
phone       text not null
interest    text           -- 부트캠프 유형 (자동 파생)
type_code   text           -- 진단 유형
source      text           -- 'bootcamp_modal' | 'coupon_gate'
result_id   uuid references results_v2(id)
created_at  timestamptz default now()
id          uuid primary key default gen_random_uuid()
```

### `coupons` — 쿠폰 발급
```sql
id          uuid primary key default gen_random_uuid()
result_id   uuid references results_v2(id)
code        text
used        boolean default false
created_at  timestamptz default now()
```

---

## 9. GA4 이벤트 추적

| 이벤트 | 발생 시점 | 주요 파라미터 |
|---|---|---|
| `cta_click` | CTA 버튼 클릭 | `location`: 'header' / 'hero' / 'type_preview' / 'viral' |
| `test_start` | 테스트 첫 문항 진입 | — |
| `test_complete` | 결과 페이지 도달 | `type_code` |
| `share_click` | 공유 버튼 클릭 | `method`: 'kakao' / 'copy' |
| `lead_submit` | 리드 폼 제출 완료 | `source`, `type_code` |
| `bootcamp_click` | 부트캠프 URL 클릭 | `bootcamp`: 부트캠프 유형 |
| `coupon_unlock` | 쿠폰 섹션 노출 | `type_code` |

**페이지 타이틀 추적**: `page_title: document.title` 포함 → GA에서 페이지별 구분 가능

---

## 10. 환경변수

| 변수 | 설명 | 필수 |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase publishable key | ✅ |
| `SUPABASE_SECRET_KEY` | Supabase secret key (서버 전용, /api/leads) | ✅ |
| `NEXT_PUBLIC_GA_ID` | GA4 측정 ID | 권장 |
| `NEXT_PUBLIC_KAKAO_APP_KEY` | 카카오 JS 키 (공유용) | 선택 |

> **주의**: 부트캠프 URL은 환경변수 미사용, 코드에 직접 하드코딩 → `https://metacodes.co.kr/`

---

## 11. SEO

| 파일 | 역할 |
|---|---|
| `app/layout.tsx` | 공통 메타태그, OG |
| `app/page.tsx` | 랜딩 메타태그 + canonical |
| `app/result/[id]/page.tsx` | 동적 OG (유형별 제목) |
| `app/sitemap.ts` | `/sitemap.xml` 자동 생성 |
| `app/robots.ts` | `/robots.txt` 자동 생성 |

---

## 12. 진행 상태

### 완료
- [x] 랜딩 페이지 (16유형 미리보기 카드 포함)
- [x] 20문항 테스트 플로우
- [x] 분석 화면 % 진행바 애니메이션
- [x] 결과 페이지 (16유형, AI 점수, 직업 추천)
- [x] 부트캠프 4종 + 유형 매핑 (AI 서비스 개발자 포함)
- [x] 리드 수집 (이름 + 전화번호 → Supabase leads)
- [x] 개인정보 수집 동의 (체크박스 + /privacy 링크)
- [x] 중복 리드 방지 (phone + source 체크)
- [x] 쿠폰 섹션 UI
- [x] 카카오톡 공유 / URL 복사
- [x] Supabase 결과 저장 + fallback (로컬 처리)
- [x] GA4 연동 + 이벤트 추적
- [x] Vercel 배포
- [x] 파비콘 커스텀 (ai_mbti_icon_final.png)

### 미완성 / 향후 과제
- [ ] GA `page_title` 전송 추가 (GAPageView.tsx — 현재 page_path만 전송)
- [ ] 쿠폰 실제 발급 로직 (현재 UI만)
- [ ] 대시보드 페이지 (`/dashboard`) — 폴더만 생성됨
- [ ] 이메일 수집 활성화 (필드는 존재, UI 미노출)
- [ ] 카카오 로그인 기반 결과 저장

---

## 13. 비기능 요구사항

- 모바일 퍼스트 (max-width: 480px, 웹에서는 중앙 정렬)
- Supabase RLS 활성화
- 서버 사이드: SUPABASE_SECRET_KEY로만 leads 삽입 (클라이언트 노출 금지)
- Supabase 연결 실패 시 로컬 결과 페이지로 fallback
