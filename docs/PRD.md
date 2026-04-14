# AI 시대 생존력 진단 서비스 — PRD

**버전**: v3.0 (2026-04-14)  
**스택**: Next.js 16 (App Router) + Tailwind v4 + Vercel + Supabase  
**배포 URL**: https://mcodegc.com  
**운영사**: metacode.kr  
**상태**: 운영 중 · 트래킹 이중화 적용

---

## 1. 서비스 개요

MBTI 형식의 20문항 진단으로 AI 대체 가능성을 측정하고, 결과에 따라 오픈채팅방 입장 + 전자책 다운로드로 연결하는 퍼널형 바이럴 진단 서비스.

**핵심 KPI**
- 테스트 완료율: /test 진입 → /result 도달 비율
- 오픈채팅 클릭률: 결과 페이지 → 단톡방 입장 비율
- 전자책 클릭률: 결과 페이지 → 전자책 다운로드 비율
- 바이럴 확산: 결과 공유 → SNS 자연 유입
- 총 방문자 수 (중복 제거)

**핵심 가설**  
"내가 AI에 대체될까?" 라는 질문은 누구나 궁금하다. 결과를 공유하게 만들면 광고비 없이 바이럴이 가능하고, 위협감으로 부트캠프 전환이 가능하다.

---

## 2. 페이지 구조

| 페이지 | 경로 | 역할 |
|---|---|---|
| 랜딩 | `/` | 훅 카피 + 테스트 시작 CTA + 16유형 미리보기 |
| 테스트 | `/test` | 20문항 스텝 형식 (5차원: A~E 각 4문항) |
| 분석 | `/analyzing` | 프로그레스바 애니메이션 + Supabase 저장 |
| 결과 | `/result/[id]` | 유형 결과 + 레이더차트 + 오픈채팅/전자책 CTA |
| 대시보드 | `/dashboard` | GA4 데이터 기반 퍼널 분석 (비밀번호 보호) |
| 개인정보처리방침 | `/privacy` | 법적 고지 |

---

## 3. 테스트 설계 (20문항, 5차원 점수제)

| 파트 | 차원 | 문항 | 점수 범위 |
|---|---|---|---|
| A | AI 활용도 | Q1-4 | 0-4 |
| B | AI 민감도 | Q5-8 | 0-4 |
| C | 독립성 | Q9-12 | 0-4 |
| D | 논리력 | Q13-16 | 0-4 |
| E | 실행력 | Q17-20 | 0-4 |

**16유형 변환**: A+B 합산(≥5→A), C(≥3→H), D(≥3→L), E(≥3→F) → 4글자 TypeCode

**독려 팝업**: Q5/Q10/Q15 완료 시 토스트 메시지 (2.2초 자동 닫힘)

---

## 4. 16유형 정의

`[업무방식][AI활용][강점][속도]` 4글자 조합

| 코드 | AI 대체 점수 | 추천 부트캠프 |
|---|---|---|
| HALF, HALP, TALF, TALP | 25-31% | AI 서비스 개발자 |
| HACF, HACP, TACF, TACP | 30-33% | AI LLM |
| HSLF, HSLP | 45-48% | 데이터 엔지니어 |
| HSCF, HSCP, TSLF, TSLP, TSCF, TSCP | 35-65% | 데이터 분석 |

---

## 5. 결과 페이지 (`/result/[id]`)

### 섹션 구성 (위→아래 순서)
1. **캐릭터 이미지** + 유형명/코드
2. **레이더 차트** (5차원 성향 시각화, 애니메이션)
3. **AI 대체 점수 게이지** (카운트업 애니메이션)
4. **강점 / 위기 / 방향** (3단 카드)
5. **직무 AI 대체율** (막대 차트)
6. **전환 공식** (from + via = to)
7. **오픈채팅방 입장** (노란 카드, 무료 특강 CTA)
8. **전자책 다운로드** (슬라이더 미리보기 + 다운로드 버튼)
9. **공유** (카카오/인스타/이미지저장/링크복사)
10. **다시 테스트**

---

## 6. DB 스키마 (Supabase)

### `results_v2`
```sql
id uuid PK, type_code text, type_name text, ai_score int,
work_style text, ai_usage text, strength text, speed text,
overtime_result text, shared boolean,
score_a int, score_b int, score_c int, score_d int, score_e int,
created_at timestamptz
```

### `coupons`
```sql
id uuid PK, result_id uuid FK, code text, used boolean, created_at timestamptz
```

### `events` (신규)
```sql
id uuid PK, event_name text, type_code text, metadata jsonb, created_at timestamptz
```

---

## 7. 트래킹 시스템 (이중화)

### GA4 (`gtagEvent`) + Supabase (`trackEvent`) 동시 전송

| 이벤트 | GA4 | Supabase | 발생 위치 |
|---|---|---|---|
| `page_view` | 자동 | ✅ | 랜딩 페이지 마운트 |
| `test_start` | ✅ | ✅ | 첫 문항 응답 |
| `test_progress` | ✅ | ✅ | 파트 완료 시 (Q4,Q8,Q12,Q16) |
| `test_complete` | ✅ | ✅ | 결과 생성 |
| `result_view` | ✅ | ✅ | 결과 페이지 마운트 |
| `openchat_click` | ✅ | ✅ | 단톡방 클릭 |
| `ebook_click` | ✅ | ✅ | 전자책 클릭 (unlock/download) |
| `page_exit` | ✅ | — | pagehide (체류시간) |
| `exit_click` | ✅ | — | 이탈 링크 클릭 |
| `share_click` | ✅ | — | 공유 버튼 |
| `cta_click` | ✅ | — | CTA 버튼 |

### 추가 분석 도구
- **Microsoft Clarity**: 히트맵, 세션 리코딩 (무료)
- **GA4 대시보드**: `/dashboard` 페이지에서 퍼널 시각화 (GCP 서비스 계정 키 필요)

---

## 8. 대시보드 (`/dashboard`)

- 비밀번호 보호 (세션 기반)
- GA4 Data API 조회 (`/api/ga4`)
- 핵심 숫자: 총 방문자 / 테스트 완료 / 결과 확인
- 전체 퍼널: 방문 → 시작 → 완료 → 결과 → 오픈채팅/전자책 (이탈률 표시)
- "결과 본 사람이 뭘 했나?" 섹션: 오픈채팅/전자책/공유 클릭 비율

---

## 9. 환경변수

| 변수 | 설명 | 필수 |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase publishable key | ✅ |
| `SUPABASE_SECRET_KEY` | Supabase secret key (서버 전용) | 선택 |
| `NEXT_PUBLIC_GA_ID` | GA4 측정 ID | ✅ |
| `NEXT_PUBLIC_KAKAO_APP_KEY` | 카카오 JS 키 (공유용) | ✅ |
| `NEXT_PUBLIC_OPENCHAT_URL` | 오픈채팅 URL | ✅ |
| `NEXT_PUBLIC_OPENCHAT_SURVEY_URL` | AImBTI 전용 단톡방 URL | ✅ |

---

## 10. 진행 상태

### 완료
- [x] 랜딩 페이지 (16유형 미리보기)
- [x] 20문항 테스트 (5차원 점수제)
- [x] 독려 팝업 (Q5/10/15)
- [x] 분석 화면 프로그레스바
- [x] 결과 페이지 (레이더차트, AI점수 카운트업, 직무추천)
- [x] 오픈채팅방 + 전자책 CTA
- [x] 카카오/인스타/이미지저장/링크복사 공유
- [x] Supabase 결과 저장 + fallback
- [x] GA4 이벤트 추적
- [x] Supabase events 이벤트 이중화 (백업)
- [x] GA4 대시보드 (`/dashboard`)
- [x] OG 이미지 동적 생성
- [x] Vercel 배포 (mcodegc.com)
- [x] 쿠폰/상담모달/리드수집 제거 (불필요)

### 미완성 / 향후 과제
- [ ] Supabase events 테이블 생성 (SQL 실행 필요)
- [ ] Vercel 환경변수 설정 (Supabase URL/KEY)
- [ ] 대시보드 Supabase 기반 데이터 추가
- [ ] 캐릭터 이미지 교체 (에셋 필요)
