import type { Metadata } from 'next'
import CTAButton from '@/components/CTAButton'
import PageViewTracker from '@/components/PageViewTracker'

export const metadata: Metadata = {
  title: 'AI-MBTI',
  description: 'MBTI 기반 AI 시대 생존 역량 진단. 20문항으로 알아보는 나의 AI 대체 가능성과 미래 직업 추천.',
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mcodegc.com',
  },
}

export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen bg-black text-white">
      <PageViewTracker />

      {/* 경고 배너 */}
      <div className="bg-red-600 text-center py-2.5 px-4 text-sm font-bold animate-pulse">
        🚨 2026년, AI가 대체할 직업 목록이 공개되었습니다
      </div>

      {/* 헤더 */}
      <header className="px-5 py-4 flex items-center justify-between border-b border-white/10">
        <a href="https://mcodegc.com/" className="font-bold text-lg">
          <span className="text-red-400">AI</span>-MBTI
        </a>
        <CTAButton location="header" className="bg-red-500 hover:bg-red-400 text-white text-sm font-bold px-4 py-2 rounded-full transition-colors">
          긴급 진단 →
        </CTAButton>
      </header>

      {/* 히어로 */}
      <section className="flex-1 flex flex-col items-center justify-center px-5 py-16 text-center">
        <div className="space-y-6">
          <div className="relative inline-flex items-center gap-2 bg-red-500/20 border border-red-500/40 rounded-full px-4 py-1.5 text-red-400 text-xs font-bold overflow-hidden">
            <span className="relative w-2 h-2 flex items-center justify-center">
              <span className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75" />
              <span className="relative w-2 h-2 bg-red-500 rounded-full" />
            </span>
            <span>실시간 대체 위험 분석 중</span>
            <span className="inline-flex gap-[2px]">
              <span className="w-1 h-1 bg-red-400 rounded-full animate-dot-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-1 bg-red-400 rounded-full animate-dot-bounce" style={{ animationDelay: '160ms' }} />
              <span className="w-1 h-1 bg-red-400 rounded-full animate-dot-bounce" style={{ animationDelay: '320ms' }} />
            </span>
            <span className="pointer-events-none absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-red-400/30 to-transparent animate-shimmer-sweep" />
          </div>

          <h1 className="text-4xl font-black leading-tight">
            당신의 직업,
            <br />
            <span className="text-red-400 text-5xl">2년 안에</span>
            <br />
            사라질 수 있습니다
          </h1>

          <p className="text-white/60 text-sm max-w-xs mx-auto">
            이미 직장인 10명 중 8명이 AI 대체 위험군.
            <br />
            당신은 안전할까요?
          </p>

          {/* 위험도 미터 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 max-w-xs mx-auto">
            <p className="text-xs text-white/40 mb-3">평균 AI 대체 위험도</p>
            <div className="h-3 rounded-full bg-white/10 overflow-hidden mb-2">
              <div className="h-full rounded-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500" style={{ width: '78%' }} />
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/30">안전</span>
              <span className="text-red-400 font-bold">78% 위험</span>
            </div>
          </div>

          <CTAButton
            location="hero"
            className="block bg-red-500 hover:bg-red-400 text-white font-black text-lg px-8 py-5 rounded-2xl transition-all shadow-lg shadow-red-500/30"
          >
            내 위험도 확인 (무료) →
          </CTAButton>

          <p className="text-white/30 text-xs">
            ⏱ 1분 · 로그인 불필요
          </p>
        </div>

        {/* 통계 */}
        <div className="mt-12 grid grid-cols-3 gap-3 w-full max-w-sm">
          {[
            { num: '78%', label: '평균 대체 위험' },
            { num: '16유형', label: '정밀 분류' },
            { num: '1분', label: '소요 시간' },
          ].map(i => (
            <div key={i.label} className="rounded-xl p-3 text-center bg-white/5 border border-white/10">
              <div className="text-xl font-black text-red-400">{i.num}</div>
              <div className="text-white/40 text-xs mt-0.5">{i.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 푸터 */}
      <footer className="px-5 py-6 border-t border-white/10 text-center text-white/30 text-xs">
        © 2026 AI-MBTI · <a href="https://metacodes.co.kr/" className="hover:text-white/60">metacodes.co.kr</a>
      </footer>
    </main>
  )
}
