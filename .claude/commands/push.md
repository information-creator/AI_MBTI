---
description: 변경사항을 lint·build 검증 후 commit·push
---

다음 순서로 실행하세요:

## 1. 현재 상태 확인
```bash
git status
git diff --stat
```

## 2. Lint + Build 검증 (병렬)
두 명령을 병렬로 실행해서 시간 절약:
- `npm run lint` — ESLint 검사
- `npm run build` — TypeScript 타입체크 + Next.js 프로덕션 빌드

**하나라도 실패하면 중단하고 사용자에게 에러 내용 보고.** 자동 수정 시도 금지 — 사용자가 판단해야 함.

## 3. 커밋 메시지 작성
- `git log --oneline -5`로 최근 커밋 스타일 확인
- 변경사항 요약해서 Conventional Commits 형식:
  - `feat:` 새 기능
  - `fix:` 버그 수정
  - `docs:` 문서만 변경
  - `refactor:` 리팩토링
  - `style:` 포맷팅만
  - `chore:` 빌드/의존성
- 한국어 본문 OK, 타입 접두사는 영어

## 4. 커밋
- `.env`, `credentials.json` 등 민감 파일 스테이징 여부 확인 — 발견 시 경고 후 중단
- `git add` 는 변경된 파일 명시적으로 추가 (`-A`보단 파일 지정 선호)
- Co-Authored-By trailer 포함

## 5. 푸시
- `git push` — 현재 브랜치를 origin으로
- `main` 브랜치일 경우 그냥 push (force push는 절대 금지)

## 6. 보고
푸시 성공 시 커밋 해시와 메시지 한 줄 요약해서 사용자에게 알림.

## 실패 처리
- Lint 실패 → 에러 메시지 요약 후 "수정 필요" 안내 (자동 수정 X)
- Build 실패 → 에러 메시지 요약 후 중단
- Pre-commit hook 실패 → 훅이 수정한 내용 재스테이징 후 재커밋 (NEW 커밋, 절대 --amend 금지)
- Push 실패 → pull 먼저 필요한지 확인 후 사용자에게 판단 위임
