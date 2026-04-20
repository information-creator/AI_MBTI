import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Suspense } from 'react'
import GAPageView from '@/components/GAPageView'
import KakaoInit from '@/components/KakaoInit'
import LayoutContainer from '@/components/LayoutContainer'
import './globals.css'
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  icons: {
    icon: '/favicon.png',
  },
  title: 'AI-역량진단',
  description:
    'AI 시대 역량진단. 20문항으로 알아보는 나의 AI 대체 가능성과 미래 직업 추천.',
  keywords: ['AI 역량진단', 'AI 직업 추천', '나 대체될까', 'AI 시대 직업', 'ChatGPT 대체'],
  openGraph: {
    title: 'AI 시대 생존력 진단',
    description: '20문항으로 알아보는 나의 AI 대체 가능성 (AI-역량진단)',
    type: 'website',
    locale: 'ko_KR',
  },
  other: {
    'facebook-domain-verification': 'kzgiof2kuzedxeo2x0o7pcxr5oki58',
  },
}

const GA_ID = process.env.NEXT_PUBLIC_GA_ID
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
const KAKAO_KEY = process.env.NEXT_PUBLIC_KAKAO_APP_KEY
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={cn("h-full", "font-sans", geist.variable)}>
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
                ${GOOGLE_ADS_ID ? `gtag('config', '${GOOGLE_ADS_ID}');` : ''}
              `}
            </Script>
          </>
        )}
        {GA_ID && (
          <Suspense fallback={null}>
            <GAPageView gaId={GA_ID} />
          </Suspense>
        )}
        {META_PIXEL_ID && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window,document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${META_PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}
        {KAKAO_KEY && <KakaoInit kakaoKey={KAKAO_KEY} />}
        <Script id="clarity-init" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","w6vmprm75l");`}
        </Script>
        {/* 데스크탑에서도 모바일 폭으로 중앙 정렬 (dashboard3는 예외) */}
        <LayoutContainer>{children}</LayoutContainer>
      </body>
    </html>
  )
}
