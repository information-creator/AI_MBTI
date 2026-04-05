import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'AI 시대 생존력 진단 | 나는 AI에 대체될까?',
  description: 'MBTI 기반 AI 시대 생존 역량 진단. 12문항으로 알아보는 나의 AI 대체 가능성과 미래 직업 추천.',
  alternates: {
    canonical: 'https://aimbti.vercel.app',
  },
}

export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* 무료 쿠폰 배너 */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center py-2 px-4 text-sm font-medium">
        🎁 테스트 완료하면 <strong>무료 쿠폰</strong> 즉시 발급!
      </div>

      {/* 헤더 */}
      <header className="px-5 py-4 flex items-center justify-between">
        <span className="text-white font-bold text-lg tracking-tight">
          AI<span className="text-indigo-400">mbti</span>
        </span>
        <Link
          href="/test"
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors"
        >
          테스트 시작 →
        </Link>
      </header>

      {/* 히어로 섹션 */}
      <section className="flex-1 flex flex-col items-center justify-center px-5 py-12 text-center">
        <div className="w-full space-y-5 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full px-4 py-1.5 text-indigo-300 text-xs font-medium">
            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></span>
            2026년 가장 많이 물어보는 질문
          </div>

          <h1 className="text-4xl font-black text-white leading-tight">
            나는 AI에
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              대체될까?
            </span>
          </h1>

          <p className="text-gray-400 text-base leading-relaxed">
            MBTI 기반 12문항으로 알아보는
            <br />
            <strong className="text-white">AI 대체 가능성 + 미래 직업 추천</strong>
          </p>

          <Link
            href="/test"
            className="block bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-base px-6 py-4 rounded-2xl transition-all shadow-lg shadow-indigo-500/25"
          >
            지금 바로 진단하기 (무료) →
          </Link>

          <p className="text-gray-500 text-xs">
            ⏱ 약 2분 · 로그인 불필요 · 완전 무료
          </p>
        </div>

        {/* 통계 배지 */}
        <div className="mt-10 grid grid-cols-3 gap-3 w-full">
          {[
            { num: '8가지', label: '유형 결과' },
            { num: '12문항', label: '빠른 진단' },
            { num: '무료', label: '쿠폰 제공' },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl p-3 text-center"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <div className="text-xl font-black text-white">{item.num}</div>
              <div className="text-gray-400 text-xs mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 결과 유형 미리보기 */}
      <section className="px-5 py-10">
        <h2 className="text-xl font-bold text-center text-white mb-1">
          당신의 유형은?
        </h2>
        <p className="text-gray-400 text-center text-sm mb-6">총 8가지 AI 시대 생존 유형</p>

        <div className="grid grid-cols-2 gap-2.5">
          {[
            { emoji: '🚀', title: 'AI를 부려먹는 사람', bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.3)' },
            { emoji: '🏢', title: '조직에서 살아남는 사람', bg: 'rgba(14,165,233,0.1)', border: 'rgba(14,165,233,0.3)' },
            { emoji: '🎨', title: 'AI가 절대 못 베끼는 사람', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)' },
            { emoji: '📊', title: '숫자로 모든 걸 증명하는 사람', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)' },
            { emoji: '🤝', title: '사람이 곧 스펙인 사람', bg: 'rgba(236,72,153,0.1)', border: 'rgba(236,72,153,0.3)' },
            { emoji: '♟️', title: '3수 앞을 보는 사람', bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.3)' },
            { emoji: '⚙️', title: '말 없이 다 해버리는 사람', bg: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.3)' },
            { emoji: '🃏', title: 'AI도 예측 못 하는 사람', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.3)' },
          ].map((type) => (
            <div
              key={type.title}
              className="rounded-2xl p-3 text-center"
              style={{ background: type.bg, border: `1px solid ${type.border}` }}
            >
              <div className="text-2xl mb-1">{type.emoji}</div>
              <div className="text-white text-xs font-semibold leading-tight">{type.title}</div>
            </div>
          ))}
        </div>

        <Link
          href="/test"
          className="block mt-6 text-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-base px-6 py-4 rounded-2xl transition-all"
        >
          내 유형 확인하기 →
        </Link>
      </section>

      {/* 바이럴 카피 섹션 */}
      <section className="px-5 py-10" style={{ background: 'rgba(99,102,241,0.05)' }}>
        <div className="text-center space-y-4">
          <h2 className="text-xl font-bold text-white">
            친구에게 공유하면{' '}
            <span className="text-indigo-400">같이 불안해집니다</span> 😅
          </h2>
          <p className="text-gray-400 text-sm">
            결과 카드를 카카오톡·인스타에 공유하고
            <br />
            친구도 테스트 해보게 만드세요
          </p>
          <Link
            href="/test"
            className="inline-block bg-white text-indigo-900 font-bold text-base px-8 py-3 rounded-2xl hover:bg-gray-100 transition-colors"
          >
            테스트 시작하기 →
          </Link>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="px-5 py-6 border-t border-white/5 text-center text-gray-600 text-xs">
        <p>
          © 2026 AImBTI ·{' '}
          <a href="https://metacode.kr" className="hover:text-gray-400 transition-colors">
            metacode.kr
          </a>
        </p>
        <p className="mt-1">개인정보 미수집 · 익명 저장</p>
      </footer>
    </main>
  )
}
