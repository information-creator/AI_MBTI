import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Suspense } from 'react'
import GAPageView from '@/components/GAPageView'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'AI 시대 생존력 진단',
  description:
    'MBTI 기반 AI 시대 생존 역량 진단. 12문항으로 알아보는 나의 AI 대체 가능성과 미래 직업 추천.',
  keywords: ['MBTI 테스트', 'AI 직업 추천', '나 대체될까', 'AI 시대 직업', 'ChatGPT 대체'],
  openGraph: {
    title: 'AI 시대 생존력 진단',
    description: '12문항으로 알아보는 나의 AI 대체 가능성과 미래 직업 추천',
    type: 'website',
    locale: 'ko_KR',
  },
}

const GA_ID = process.env.NEXT_PUBLIC_GA_ID
const KAKAO_KEY = process.env.NEXT_PUBLIC_KAKAO_APP_KEY

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full bg-slate-100 text-slate-900">
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
        {GA_ID && (
          <Suspense fallback={null}>
            <GAPageView gaId={GA_ID} />
          </Suspense>
        )}
        {KAKAO_KEY && (
          <>
            <Script
              src="https://developers.kakao.com/sdk/js/kakao.js"
              strategy="afterInteractive"
            />
            <Script
              id="kakao-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `(function tryInit(){if(window.Kakao){if(!window.Kakao.isInitialized())window.Kakao.init('${KAKAO_KEY}');}else{setTimeout(tryInit,50);}})();`,
              }}
            />
          </>
        )}
        {/* 데스크탑에서도 모바일 폭으로 중앙 정렬 */}
        <div className="min-h-screen mx-auto w-full max-w-[480px] bg-white shadow-xl shadow-slate-200">
          {children}
        </div>
      </body>
    </html>
  )
}
