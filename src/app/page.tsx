import type { Metadata } from 'next'
import CTAButton from '@/components/CTAButton'
import PageViewTracker from '@/components/PageViewTracker'
import VariantTracker from '@/components/VariantTracker'

export const metadata: Metadata = {
  title: 'AI-역량진단',
  description: 'AI 시대, 나는 살아남을까? 1분 무료 진단.',
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mcodegc.com',
  },
}

export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      <VariantTracker variant="main" />
      <PageViewTracker />

      <section className="flex-1 flex flex-col items-center justify-center px-5 py-16 text-center">
        <div className="space-y-8 max-w-sm">
          <h1 className="text-4xl font-black text-slate-900 leading-tight">
            AI 시대,
            <br />
            나는 살아남을까?
          </h1>

          <p className="text-slate-500 text-base leading-relaxed">
            16가지 AI 생존유형으로 알아보는
            <br />
            당신의 AI 역량 평가
          </p>

          <CTAButton
            location="hero"
            className="block bg-slate-900 hover:bg-slate-800 text-white font-black text-lg px-8 py-5 rounded-2xl transition-all"
          >
            진단 시작 (무료)
          </CTAButton>
        </div>
      </section>
    </main>
  )
}
