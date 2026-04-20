import type { Metadata } from 'next'
import Image from 'next/image'
import CTAButton from '@/components/CTAButton'
import PageViewTracker from '@/components/PageViewTracker'
import VariantAnalysis from '@/components/VariantAnalysis'
import VariantTracker from '@/components/VariantTracker'
import { typeInfo } from '@/lib/quiz'

export const metadata: Metadata = {
  title: 'AI-역량진단',
  description: '랜딩 변형 V2 — 기존안 (인디고/퍼플 그라디언트 + 16유형 미리보기)',
}

export default function V2() {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      <VariantAnalysis
        id="v2"
        label="V2 기본안"
        color="#6366f1"
        oneLiner="밸런스형 — 경고 배너 + 그라디언트 + 16유형 미리보기"
        strategy="중립 톤 + 유형 카드로 호기심 유발"
        desc="상단 경고 배너 + 인디고/퍼플 그라디언트 + 16유형 카드 그리드"
        evidence={[
          '그라디언트 CTA — 단색 대비 클릭율 평균 6~8% 상승 (HubSpot A/B)',
          '유형 미리보기(카드 그리드) — 호기심 기반 참여율 증가 (BuzzFeed 퀴즈 패턴)',
          '경고 배너 + 밝은 본문 조합 — 공포 단독 대비 이탈률 낮음 (Nielsen Norman)',
          '통계 배지(숫자 강조) — 신뢰도 지각 15~20% 상승 (CXL Institute)',
        ]}
        caveat="메시지가 분산될 수 있음 — 단일 포인트(위험/증거/심플)만큼의 강한 기억 잔상은 약함"
        fit="★★★☆ — 중립적이라 어떤 타깃에도 통하지만, 극단 소구 대비 전환 스파이크는 낮을 수 있음"
      />
      <VariantTracker variant="v2" />
      <PageViewTracker />

      {/* 상단 경고 배너 */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white text-center py-2 px-4 text-sm font-medium">
        ⚠️ 직장인 10명 중 8명 AI 대체 위험
      </div>

      {/* 헤더 */}
      <header className="px-5 py-4 flex items-center justify-between border-b border-slate-100">
        <a href="https://mcodegc.com/" className="text-slate-900 font-bold text-lg tracking-tight">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">AI-역량진단</span>
        </a>
        <CTAButton
          location="header_v2"
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

          <p className="text-slate-500 text-base">
            16가지 AI 생존유형
          </p>

          <CTAButton
            location="hero_v2"
            className="block bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-base px-6 py-4 rounded-2xl transition-all shadow-lg shadow-indigo-200"
          >
            AI 대체 가능성 진단하기 (무료) →
          </CTAButton>

          <p className="text-slate-400 text-xs">
            ⏱ 약 1분 · 로그인 불필요 · 비용 무료
          </p>
        </div>

        {/* 통계 배지 */}
        <div className="mt-10 grid grid-cols-3 gap-3 w-full">
          {[
            { num: '16가지', label: 'AI 생존유형' },
            { num: '20문항', label: '정밀 진단' },
            { num: '무료', label: '비용 무료' },
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
        <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-full px-4 py-1.5 text-indigo-600 text-xs font-medium">
          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
          AI 유형 미리보기
        </div>
        </div>
        <h2 className="text-2xl font-black text-slate-900 leading-tight mb-2 text-center">
          유형마다{' '}
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            대체 가능성
          </span>
          이 다릅니다
        </h2>
        <p className="text-slate-500 text-sm mb-6 text-center">
          AI 생존유형 총 16가지 — 지금 바로 확인해보세요
        </p>

        <div className="grid grid-cols-2 gap-2.5">
          {(Object.entries(typeInfo) as [string, typeof typeInfo[keyof typeof typeInfo]][]).map(([code, info]) => (
            <div
              key={code}
              className="rounded-2xl p-3 flex items-center gap-2.5"
              style={{ border: `1px solid ${info.color}30`, background: info.color + '10' }}
            >
              <Image
                src={`/characters/${info.title}.png`}
                alt={info.title} width={52} height={52} className="object-contain shrink-0" unoptimized
                style={{ mixBlendMode: 'multiply' }}
              />
              <div className="min-w-0">
                <div className="font-bold text-[18px] leading-tight" style={{ color: info.color }}>
                  <span className="block">{info.title.split(' ')[0]}</span>
                  <span className="block">{info.title.split(' ').slice(1).join(' ')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <CTAButton
          location="type_preview_v2"
          className="block mt-6 text-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-base px-6 py-4 rounded-2xl transition-all"
        >
          AI 대체 가능성 진단하기 (무료) →
        </CTAButton>
      </section>

      {/* 푸터 */}
      <footer className="px-5 py-6 border-t border-slate-100 text-center text-slate-400 text-xs">
        <p>
          © 2026 AI-역량진단 ·{' '}
          <a href="https://metacodes.co.kr/" className="hover:text-slate-600 transition-colors">
            metacodes.co.kr
          </a>
        </p>
      </footer>
    </main>
  )
}
