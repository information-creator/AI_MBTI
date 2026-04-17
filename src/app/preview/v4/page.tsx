import type { Metadata } from 'next'
import CTAButton from '@/components/CTAButton'
import PageViewTracker from '@/components/PageViewTracker'
import VariantAnalysis from '@/components/VariantAnalysis'

export const metadata: Metadata = {
  title: 'AI-MBTI | V4 심플',
  description: '랜딩 변형 V4 — 극도로 심플한 미니멀',
}

export default function V4() {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      <VariantAnalysis
        id="v4"
        label="V4 극심플"
        color="#0f172a"
        oneLiner="CTA 하나만 남기면 전환율 266% 상승, GNB 제거하면 +100%"
        strategy="선택의 역설 제거 + 인지 부하 최소화"
        desc="화이트 + 텍스트만 + '나는 살아남을까?'"
        evidence={[
          'GNB 제거 — 전환율 28~100% 상승 (VWO / HubSpot)',
          '단일 CTA vs 다중 — 단일 CTA 전환 266% 우위 (Unbounce)',
          '요소 축소(10개→3~5개) — 전환 20~30% 상승 (Unbounce 벤치마크)',
          'CTA 주변 여백 20% 확대 — 클릭률 20% 상승 (Google 내부 연구)',
          'B2C 리드젠 100단어 미만 — 500단어 이상 대비 전환 50% 우위 (Unbounce 2024)',
        ]}
        caveat="정보가 너무 적으면 신뢰 부족. 고관여 상품에는 부적합할 수 있음."
        fit="★★★★ — 1분짜리 무료 테스트에 최적. 모바일에서 로딩 빠르고 즉시 행동 유도."
      />
      <PageViewTracker />

      <section className="flex-1 flex flex-col items-center justify-center px-5 py-16 text-center">
        <div className="space-y-8 max-w-sm">
          <p className="text-slate-400 text-sm">20문항 · 1분 · 무료</p>

          <h1 className="text-4xl font-black text-slate-900 leading-tight">
            AI 시대,
            <br />
            나는 살아남을까?
          </h1>

          <p className="text-slate-500 text-base leading-relaxed">
            16가지 AI 생존유형으로 알아보는
            <br />
            당신의 미래 직업 경쟁력
          </p>

          <CTAButton
            location="hero_v4"
            className="block bg-slate-900 hover:bg-slate-800 text-white font-black text-lg px-8 py-5 rounded-2xl transition-all"
          >
            진단 시작
          </CTAButton>

          <div className="flex items-center justify-center gap-1 text-slate-300 text-xs">
            <span>로그인 불필요</span>
            <span>·</span>
            <span>즉시 결과 확인</span>
          </div>
        </div>
      </section>

      <footer className="px-5 py-6 text-center text-slate-300 text-xs">
        © 2026 AI-MBTI
      </footer>
    </main>
  )
}
