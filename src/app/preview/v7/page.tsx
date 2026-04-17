import type { Metadata } from 'next'
import CTAButton from '@/components/CTAButton'
import PageViewTracker from '@/components/PageViewTracker'
import VariantAnalysis from '@/components/VariantAnalysis'

export const metadata: Metadata = {
  title: 'AI-MBTI | V7 비교형',
  description: '랜딩 변형 V7 — Before/After 비교',
}

export default function V7() {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      <VariantAnalysis
        id="v7"
        label="V7 비교형"
        color="#f59e0b"
        oneLiner="Before/After 비교는 참여 50~70% 상승 + 전환 25% 상승"
        strategy="대비 효과(Contrast Effect)로 가치 인식 극대화"
        desc="Before/After + '어느 쪽인가요?'"
        evidence={[
          'Before/After 비주얼 — 참여 50~70% 상승, 전환 25% 상승 (VWO)',
          '비교표 — 사용자 42%가 제품 평가 시 비교표 선호 (Baymard Institute)',
          '"우리 vs 없이" 프레이밍 — 일반 베네핏 리스트 대비 전환 10~20% 상승 (CXL)',
          '추천 플랜 하이라이트 — 해당 플랜 선택률 30~40% 상승 (Price Intelligently)',
          '인터랙티브 슬라이더(Before/After) — 체류시간 40~60% 증가 (CXL)',
        ]}
        caveat="비교 대상이 현실적이어야 효과적. 비현실적 비교는 신뢰 저하."
        fit="★★★☆ — 'AI 아는 사람 vs 모르는 사람' 프레이밍이 직관적. 직업별 구체적 비교가 설득력."
      />
      <PageViewTracker />

      <header className="px-5 py-4 flex items-center justify-between border-b border-slate-100">
        <span className="text-slate-900 font-bold text-lg">
          <span className="text-amber-500">AI</span>-MBTI
        </span>
        <CTAButton location="header_v7" className="bg-amber-500 hover:bg-amber-400 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors">
          진단하기 →
        </CTAButton>
      </header>

      <section className="px-5 py-10 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5 text-amber-600 text-xs font-bold mb-5">
          같은 직업, 다른 미래
        </div>

        <h1 className="text-3xl font-black text-slate-900 leading-tight mb-2">
          AI를 아는 사람과
          <br />
          <span className="text-amber-500">모르는 사람의 차이</span>
        </h1>
        <p className="text-slate-400 text-sm mb-8">같은 직업이라도 결과가 완전히 다릅니다</p>
      </section>

      {/* 비교 카드들 */}
      <section className="px-5 pb-10 space-y-4">
        {[
          {
            job: '마케터',
            before: { title: 'AI 모르는 마케터', items: ['보고서 수동 작성', '감에 의존하는 타겟팅', '3시간짜리 콘텐츠 제작'], risk: '대체 위험 82%' },
            after: { title: 'AI 활용 마케터', items: ['자동 리포트 + 인사이트', 'AI 기반 정밀 타겟팅', '30분 콘텐츠 + 최적화'], future: '데이터 마케터로 전환' },
          },
          {
            job: '기획자',
            before: { title: 'AI 모르는 기획자', items: ['수동 기획서 작성', '경험 기반 의사결정', '반복적인 자료 정리'], risk: '대체 위험 78%' },
            after: { title: 'AI 활용 기획자', items: ['AI 자동 기획서 + 편집', '데이터 기반 의사결정', 'AI 서비스 설계'], future: 'AI 서비스 기획자로 전환' },
          },
        ].map(c => (
          <div key={c.job} className="rounded-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-4 py-2.5 text-center">
              <span className="text-sm font-bold text-slate-700">{c.job}</span>
            </div>
            <div className="grid grid-cols-2 divide-x divide-slate-200">
              <div className="p-4 bg-red-50/50">
                <p className="text-xs font-bold text-red-400 mb-2">{c.before.title}</p>
                {c.before.items.map(i => (
                  <p key={i} className="text-xs text-slate-500 mb-1">• {i}</p>
                ))}
                <p className="mt-2 text-xs font-black text-red-500">{c.before.risk}</p>
              </div>
              <div className="p-4">
                <p className="text-xs font-bold text-amber-500 mb-2">{c.after.title}</p>
                {c.after.items.map(i => (
                  <p key={i} className="text-xs text-slate-600 mb-1">• {i}</p>
                ))}
                <p className="mt-2 text-xs font-black text-amber-500">{c.after.future}</p>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="px-5 pb-12">
        <div className="text-center mb-4">
          <p className="text-lg font-black text-slate-900">당신은 어느 쪽인가요?</p>
          <p className="text-sm text-slate-400">20문항으로 1분 만에 확인하세요</p>
        </div>
        <CTAButton
          location="hero_v7"
          className="block bg-amber-500 hover:bg-amber-400 text-white font-black text-base px-6 py-5 rounded-2xl transition-all text-center shadow-lg shadow-amber-200"
        >
          무료 진단 시작하기 →
        </CTAButton>
      </section>

      <footer className="px-5 py-6 border-t border-slate-100 text-center text-slate-400 text-xs">
        © 2026 AI-MBTI · <a href="https://metacodes.co.kr/" className="hover:text-slate-600">metacodes.co.kr</a>
      </footer>
    </main>
  )
}
