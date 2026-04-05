import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import CTAButton from '@/components/CTAButton'

export const metadata: Metadata = {
  title: 'AI 시대 생존력 진단 | 나는 AI에 대체될까?',
  description: 'MBTI 기반 AI 시대 생존 역량 진단. 12문항으로 알아보는 나의 AI 대체 가능성과 미래 직업 추천.',
  alternates: {
    canonical: 'https://aimbti.vercel.app',
  },
}

export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* 상단 경고 배너 */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white text-center py-2 px-4 text-sm font-medium">
        ⚠️ 직장인 10명 중 6명, 본인 직업 위험성 모른 채 출근 중
      </div>

      {/* 헤더 */}
      <header className="px-5 py-4 flex items-center justify-between border-b border-slate-100">
        <span className="text-slate-900 font-bold text-lg tracking-tight">
          AI<span className="text-indigo-600">mbti</span>
        </span>
        <CTAButton
          location="header"
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors"
        >
          테스트 시작 →
        </CTAButton>
      </header>

      {/* 히어로 섹션 */}
      <section className="flex-1 flex flex-col items-center justify-center px-5 py-12 text-center">
        <div className="w-full space-y-5 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-full px-4 py-1.5 text-indigo-600 text-xs font-medium">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
            2026년 가장 무서운 질문
          </div>

          <h1 className="text-4xl font-black text-slate-900 leading-tight">
            AI가 당신 월급을
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              노리고 있습니다
            </span>
          </h1>

          <p className="text-slate-500 text-base leading-relaxed">
            AI 대체 가능성 진단 — 16가지 유형으로 알아보는
            <br />
            <strong className="text-slate-900">나의 생존 전략</strong>
          </p>

          <CTAButton
            location="hero"
            className="block bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-base px-6 py-4 rounded-2xl transition-all shadow-lg shadow-indigo-200"
          >
            내 직업 생존 가능성 확인하기 (무료) →
          </CTAButton>

          <p className="text-slate-400 text-xs">
            ⏱ 약 3분 · 로그인 불필요 · 완전 무료
          </p>
        </div>

        {/* 통계 배지 */}
        <div className="mt-10 grid grid-cols-3 gap-3 w-full">
          {[
            { num: '16가지', label: '생존 유형' },
            { num: '20문항', label: '정밀 진단' },
            { num: '무료', label: '쿠폰 제공' },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl p-3 text-center bg-slate-50 border border-slate-200"
            >
              <div className="text-xl font-black text-slate-900">{item.num}</div>
              <div className="text-slate-500 text-xs mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 결과 유형 미리보기 */}
      <section className="px-5 py-10 bg-slate-50">
        <h2 className="text-xl font-bold text-center text-slate-900 mb-1">
          당신은 어느 유형인가요?
        </h2>
        <p className="text-slate-500 text-center text-sm mb-6">16가지 AI 시대 생존 유형 — 당신의 코드는?</p>

        <div className="grid grid-cols-2 gap-2.5">
          {[
            { emoji: '🚀', title: 'AI 시대 지휘관', code: 'HALF', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.2)' },
            { emoji: '🔭', title: '완벽주의 AI 설계자', code: 'HALP', bg: 'rgba(14,165,233,0.08)', border: 'rgba(14,165,233,0.2)' },
            { emoji: '🎨', title: '데이터로 판치는 크리에이터', code: 'HACF', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
            { emoji: '🌙', title: '느린 듯 정확한 AI 예술가', code: 'HACP', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)' },
            { emoji: '⚙️', title: '조용한 논리 장인', code: 'HSLF', bg: 'rgba(100,116,139,0.08)', border: 'rgba(100,116,139,0.2)' },
            { emoji: '♟️', title: '철저한 혼자형 전략가', code: 'HSLP', bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.2)' },
            { emoji: '🎭', title: '감성 독립군', code: 'HSCF', bg: 'rgba(236,72,153,0.08)', border: 'rgba(236,72,153,0.2)' },
            { emoji: '🌸', title: '나만의 세계 완성형', code: 'HSCP', bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.2)' },
            { emoji: '⚡', title: '팀 이끄는 AI 선봉장', code: 'TALF', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.2)' },
            { emoji: '🏗️', title: '함께 만드는 AI 설계자', code: 'TALP', bg: 'rgba(14,165,233,0.08)', border: 'rgba(14,165,233,0.2)' },
            { emoji: '🎙️', title: 'AI 부리는 크리에이터', code: 'TACF', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
            { emoji: '🎭', title: '협력형 AI 아티스트', code: 'TACP', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)' },
            { emoji: '📊', title: '사람으로 굴러가는 분석가', code: 'TSLF', bg: 'rgba(100,116,139,0.08)', border: 'rgba(100,116,139,0.2)' },
            { emoji: '🏢', title: '신중한 팀 전략가', code: 'TSLP', bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.2)' },
            { emoji: '🤝', title: '감성으로 팀 살리는 사람', code: 'TSCF', bg: 'rgba(236,72,153,0.08)', border: 'rgba(236,72,153,0.2)' },
            { emoji: '🛡️', title: '완벽한 팀의 완성자', code: 'TSCP', bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.2)' },
          ].map((type) => (
            <div
              key={type.code}
              className="rounded-2xl p-3 text-center bg-white"
              style={{ border: `1px solid ${type.border}`, background: type.bg }}
            >
              <div className="mb-1 flex justify-center">
                <Image
                  src={['HACF','HACP','HALF','HALP'].includes(type.code) ? `/character/${type.code}.png` : `/characters/${type.code}.svg`}
                  alt={type.title} width={48} height={48} className="object-contain" unoptimized
                />
              </div>
              <div className="text-slate-800 text-xs font-semibold leading-tight">{type.title}</div>
              <div className="text-slate-400 text-xs mt-0.5 font-mono">{type.code}</div>
            </div>
          ))}
        </div>

        <CTAButton
          location="type_preview"
          className="block mt-6 text-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-base px-6 py-4 rounded-2xl transition-all"
        >
          내 생존 유형 확인하기 →
        </CTAButton>
      </section>

      {/* 바이럴 카피 섹션 */}
      <section className="px-5 py-10 bg-indigo-50">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-bold text-slate-900">
            친구 대체 가능성이 궁금하지 않나요? 😏
          </h2>
          <p className="text-slate-500 text-sm">
            결과 공유하면 친구도 불안해집니다 ㅋㅋ
          </p>
          <CTAButton
            location="viral"
            className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base px-8 py-3 rounded-2xl transition-colors"
          >
            내 생존 유형 확인하기 →
          </CTAButton>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="px-5 py-6 border-t border-slate-100 text-center text-slate-400 text-xs">
        <p>
          © 2026 AImBTI ·{' '}
          <a href="https://metacode.kr" className="hover:text-slate-600 transition-colors">
            metacode.kr
          </a>
        </p>
        <p className="mt-1">개인정보 미수집 · 익명 저장</p>
      </footer>
    </main>
  )
}
