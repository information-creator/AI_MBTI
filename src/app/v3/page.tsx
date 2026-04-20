import type { Metadata } from 'next'
import CTAButton from '@/components/CTAButton'
import PageViewTracker from '@/components/PageViewTracker'
import VariantTracker from '@/components/VariantTracker'
import LiveCounterBadge from '@/components/LiveCounterBadge'

export const metadata: Metadata = {
  title: 'AI-역량진단',
  description: '직장인들이 가장 많이 공유한 AI 테스트. 1분 무료 진단.',
}

export default function V3() {
  return (
    <main className="flex flex-col min-h-screen bg-black text-white">
      <VariantTracker variant="v3" />
      <PageViewTracker />

      {/* 상단 알림 배너 */}
      <div className="bg-red-600 text-center py-2.5 px-4 text-sm font-bold">
        🔥 이미 수천 명이 자신의 AI 대체 위험도를 확인했습니다
      </div>

      {/* 헤더 */}
      <header className="px-5 py-4 flex items-center justify-between border-b border-white/10">
        <span className="font-bold text-lg">
          <span className="text-red-400">AI</span>-역량진단
        </span>
        <CTAButton location="header_v3" className="bg-red-500 hover:bg-red-400 text-white text-sm font-bold px-4 py-2 rounded-full transition-colors">
          무료 진단 →
        </CTAButton>
      </header>

      {/* 히어로 */}
      <section className="px-5 py-12 text-center">
        <div className="space-y-5">
          <LiveCounterBadge />

          <h1 className="text-3xl font-black text-white leading-tight">
            직장인들이
            <br />
            <span className="text-red-400 text-4xl">가장 많이 공유한</span>
            <br />
            AI 테스트
          </h1>

          <p className="text-white/60 text-sm">
            &ldquo;생각보다 정확해서 소름&rdquo; — 실제 참여자 반응
          </p>
        </div>
      </section>

      {/* 후기 카드 */}
      <section className="px-5 pb-8">
        <div className="space-y-3">
          {[
            { name: '이O영', job: '개발자 5년차', text: '개발자라 안전할 줄 알았는데 대체 위험이 높다고 나와서 충격... 근데 솔직히 맞는 것 같아요.', type: 'ASLF' },
            { name: '박O수', job: '기획자 2년차', text: '1분도 안 걸렸는데 결과가 너무 자세해서 캡처해서 팀원들한테 다 보냈어요 ㅋㅋ', type: 'TSCF' },
          ].map(r => (
            <div key={r.name} className="rounded-2xl p-4 bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 text-xs font-bold">{r.name[0]}</div>
                <div>
                  <p className="text-sm font-bold text-white">{r.name}</p>
                  <p className="text-xs text-white/50">{r.job} · {r.type}유형</p>
                </div>
              </div>
              <p className="text-sm text-white/80 leading-relaxed">&ldquo;{r.text}&rdquo;</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-12">
        <div className="bg-gradient-to-br from-red-600 to-red-500 rounded-2xl p-6 text-center text-white shadow-lg shadow-red-500/30">
          <p className="text-sm font-bold mb-1 opacity-90">1분 · 로그인 불필요</p>
          <h2 className="text-xl font-black mb-4">나도 AI 생존유형 확인하기</h2>
          <CTAButton
            location="hero_v3"
            className="block bg-white text-red-600 font-black text-base px-6 py-4 rounded-xl transition-all hover:bg-red-50"
          >
            테스트 시작하기 (무료) →
          </CTAButton>
        </div>
      </section>

      {/* 통계 */}
      <section className="px-5 pb-10">
        <div className="grid grid-cols-3 gap-3">
          {[
            { num: '16가지', label: 'AI 유형 분류' },
            { num: '20문항', label: '정밀 진단' },
            { num: '무료', label: '비용 부담 없음' },
          ].map(i => (
            <div key={i.label} className="rounded-xl p-3 text-center bg-white/5 border border-white/10">
              <div className="text-lg font-black text-red-400">{i.num}</div>
              <div className="text-white/50 text-xs mt-0.5">{i.label}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="px-5 py-6 border-t border-white/10 text-center text-white/30 text-xs">
        © 2026 AI-역량진단 · <a href="https://metacodes.co.kr/" className="hover:text-white/60">metacodes.co.kr</a>
      </footer>
    </main>
  )
}
