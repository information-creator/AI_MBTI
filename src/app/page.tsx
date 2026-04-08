import type { Metadata } from 'next'
import Image from 'next/image'
import CTAButton from '@/components/CTAButton'
import { typeInfo } from '@/lib/quiz'

export const metadata: Metadata = {
  title: 'AIMBTI',
  description: 'MBTI 기반 AI 시대 생존 역량 진단. 20문항으로 알아보는 나의 AI 대체 가능성과 미래 직업 추천.',
  alternates: {
    canonical: 'https://aimbti-seven.vercel.app',
  },
}

export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* 상단 경고 배너 */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white text-center py-2 px-4 text-sm font-medium">
        ⚠️ 직장인 10명 중 6명, 자기 직업 AI 대체 가능성 모른 채 출근 중
      </div>

      {/* 헤더 */}
      <header className="px-5 py-4 flex items-center justify-between border-b border-slate-100">
        <span className="text-slate-900 font-bold text-lg tracking-tight">
          AI<span className="text-red-500">MBTI</span>
        </span>
        <CTAButton
          location="header"
          className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors"
        >
          테스트 시작 →
        </CTAButton>
      </header>

      {/* 히어로 섹션 */}
      <section className="flex-1 flex flex-col items-center justify-center px-5 py-12 text-center">
        <div className="w-full space-y-5 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-4 py-1.5 text-red-600 text-xs font-medium">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
            지금 당신 직업이 위험합니다
          </div>

          <h1 className="text-4xl font-black text-slate-900 leading-tight">
            AI가 당신 월급을
            <br />
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              노리고 있습니다
            </span>
          </h1>

          <p className="text-slate-500 text-base leading-relaxed">
            AI 대체 가능성 진단 — 16가지 AI 유형으로 알아보는
            <br />
            <strong className="text-slate-900">나의 대체 위험도</strong>
          </p>

          <CTAButton
            location="hero"
            className="block bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 text-white font-bold text-base px-6 py-4 rounded-2xl transition-all shadow-lg shadow-red-100"
          >
            나의 AI 대체 가능성 확인하기 (무료) →
          </CTAButton>

          <p className="text-slate-400 text-xs">
            ⏱ 약 1분 · 로그인 불필요 · 완전 무료
          </p>
        </div>

        {/* 통계 배지 */}
        <div className="mt-10 grid grid-cols-3 gap-3 w-full">
          {[
            { num: '16가지', label: 'AI 유형' },
            { num: '20문항', label: '정밀 진단' },
            { num: '무료', label: '완전 무료' },
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

      {/* 유형 미리보기 */}
      <section className="px-5 py-10 bg-slate-50">
        <div className="flex justify-center mb-4">
        <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-4 py-1.5 text-red-600 text-xs font-medium">
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
          AI 유형 미리보기
        </div>
        </div>
        <h2 className="text-2xl font-black text-slate-900 leading-tight mb-2 text-center">
          유형마다{' '}
          <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            대체 가능성
          </span>
          이 다릅니다
        </h2>
        <p className="text-slate-500 text-sm mb-6 text-center">
          내 유형은 총 16가지 — 지금 바로 확인해보세요
        </p>

        <div className="grid grid-cols-2 gap-2.5">
          {(Object.entries(typeInfo) as [string, typeof typeInfo[keyof typeof typeInfo]][]).map(([code, info]) => (
            <div
              key={code}
              className="rounded-2xl p-3 flex items-center gap-2.5"
              style={{ border: `1px solid ${info.color}30`, background: info.color + '10' }}
            >
              <Image
                src={`/reals_ch/${info.title}.png`}
                alt={info.title} width={52} height={52} className="object-contain shrink-0" unoptimized
              />
              <div className="min-w-0">
                <div className="font-bold text-[17px] leading-snug line-clamp-2" style={{ color: info.color }}>{info.title}</div>
              </div>
            </div>
          ))}
        </div>

        <CTAButton
          location="type_preview"
          className="block mt-6 text-center bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 text-white font-bold text-base px-6 py-4 rounded-2xl transition-all"
        >
          내 대체 가능성 확인하기 →
        </CTAButton>
      </section>

      {/* 푸터 */}
      <footer className="px-5 py-6 border-t border-slate-100 text-center text-slate-400 text-xs">
        <p>
          © 2026 AIMBTI ·{' '}
          <a href="https://metacode.kr" className="hover:text-slate-600 transition-colors">
            metacode.kr
          </a>
        </p>
        <p className="mt-1">개인정보 미수집 · 익명 저장</p>
      </footer>
    </main>
  )
}
