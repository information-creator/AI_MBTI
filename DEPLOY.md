# 배포 가이드

## 1. Supabase 설정

1. [supabase.com](https://supabase.com) 에서 새 프로젝트 생성
2. SQL Editor에서 `supabase/schema.sql` 전체 실행
3. Settings > API에서 아래 값 복사:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 2. 환경변수 설정

`.env.local` 파일 수정:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_OPENCHAT_URL=https://open.kakao.com/o/your_channel
```

## 3. Vercel 배포

```bash
npx vercel --prod
```

또는 GitHub 연동:
1. GitHub에 push
2. [vercel.com](https://vercel.com) > New Project > Import
3. Environment Variables 탭에서 위 env 값 모두 추가
4. Deploy

## 4. GA4 설정

1. [analytics.google.com](https://analytics.google.com) 에서 속성 생성
2. 측정 ID (G-XXXXXX) 복사 → `NEXT_PUBLIC_GA_ID`

## 5. 카카오 공유 (선택)

1. [developers.kakao.com](https://developers.kakao.com) 앱 생성
2. 플랫폼 > 웹 → 사이트 도메인 등록
3. JavaScript 키 → `NEXT_PUBLIC_KAKAO_APP_KEY`
4. `src/app/layout.tsx`에 카카오 SDK 스크립트 추가:

```tsx
<Script src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js" strategy="afterInteractive" />
<Script id="kakao-init" strategy="afterInteractive">
  {`Kakao.init('${process.env.NEXT_PUBLIC_KAKAO_APP_KEY}')`}
</Script>
```
