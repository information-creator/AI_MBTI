import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { typeInfo } from '@/lib/quiz'

export const metadata: Metadata = {
  title: 'AIMBTI — 버전 C: AI 생존가능성 진단',
  robots: { index: false },
}

export default function PreviewC() {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* 버전 표시 배너 */}
      <div className="bg-slate-800 text-white text-center py-1.5 px-4 text-xs font-medium">
        🔖 버전 C — AI 생존가능성 진단 (내부 검토용)
      </div>

      {/* 상단 배너 */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center py-2 px-4 text-sm font-medium">
        🤖 AI 시대, 나는 살아남을 수 있을까?
      </div>

      {/* 헤더 */}
      <header className="px-5 py-4 flex items-center justify-between border-b border-slate-100">
        <span className="text-slate-900 font-bold text-lg tracking-tight">
          AI<span className="text-purple-600">MBTI</span>
        </span>
        <Link
          href="/test"
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors"
        >
          테스트 시작 →
        </Link>
      </header>

      {/* 히어로 섹션 */}
      <section className="flex-1 flex flex-col items-center justify-center px-5 py-12 text-center">
        <div className="w-full space-y-5">
          <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-full px-4 py-1.5 text-purple-600 text-xs font-medium">
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></span>
            나의 AI 생존가능성
          </div>

          <h1 className="text-4xl font-black text-slate-900 leading-tight">
            AI 시대,
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              나는 살아남을 수 있을까?
            </span>
          </h1>

          <p className="text-slate-500 text-base leading-relaxed">
            16가지 AI 유형으로 알아보는
            <br />
            <strong className="text-slate-900">나의 AI 생존가능성과 생존 전략</strong>
          </p>

          <Link
            href="/test"
            className="block bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-base px-6 py-4 rounded-2xl transition-all shadow-lg shadow-indigo-100"
          >
            나의 AI 생존가능성 확인하기 (무료) →
          </Link>

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
        <h2 className="text-xl font-bold text-center text-slate-900 mb-1">
          당신의 AI 유형은?
        </h2>
        <p className="text-slate-500 text-center text-sm mb-6">
          16가지 AI 유형 — 유형마다 생존가능성이 다릅니다
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
                <div className="font-bold text-[17px] leading-snug line-clamp-2" style={{ color: info.color }}>
                  {info.title}
                </div>
              </div>
            </div>
          ))}
        </div>

        <Link
          href="/test"
          className="block mt-6 text-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-base px-6 py-4 rounded-2xl transition-all"
        >
          나의 AI 생존 유형 확인하기 →
        </Link>
      </section>


      {/* 푸터 */}
      <footer className="px-5 py-6 border-t border-slate-100 text-center text-slate-400 text-xs">
        <p>© 2026 AIMBTI · <a href="https://metacode.kr" className="hover:text-slate-600">metacode.kr</a></p>
        <p className="mt-1">개인정보 미수집 · 익명 저장</p>
      </footer>
    </main>
  )
}
