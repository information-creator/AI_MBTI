import type { Metadata } from 'next'
import CTAButton from '@/components/CTAButton'
import PageViewTracker from '@/components/PageViewTracker'
import VariantAnalysis from '@/components/VariantAnalysis'

export const metadata: Metadata = {
  title: 'AI-MBTI | V5 스토리텔링',
  description: '랜딩 변형 V5 — 스토리텔링 기반',
}

export default function V5() {
  return (
    <main className="flex flex-col min-h-screen bg-slate-50">
      <VariantAnalysis
        id="v5"
        label="V5 스토리텔링"
        color="#f97316"
        oneLiner="스토리를 읽은 사람은 행동할 확률이 2~3배 높다"
        strategy="내러티브 몰입 + 감정적 동일시"
        desc="실화 기반 마케터 전환 스토리"
        evidence={[
          '내러티브 랜딩 — 체류시간 30~50% 증가, 전환 5~20% 상승 (Stanford Web Credibility)',
          '감정적 스토리텔링 — 행동 의지 2~3배 증가 (Carnegie Mellon, 식별 가능한 피해자 효과)',
          '브랜드 스토리 — 55%의 소비자가 스토리에 공감하면 구매 의향 상승 (Headstream)',
          'PAS 프레임워크(문제→자극→해결) — 피처 리스트 대비 전환 15~30% 우위 (Copy Hackers)',
          '영상 스토리 — 스토리 기반 영상 포함 시 전환 80~86% 상승 (EyeView)',
        ]}
        caveat="스토리가 길면 모바일 이탈 증가. 스크롤 깊이 모니터링 필요."
        fit="★★★☆ — 감정적 공감이 강하지만 스크롤이 길어 모바일 이탈 위험. 타깃이 명확할 때 효과적."
      />
      <PageViewTracker />

      <header className="px-5 py-4 flex items-center justify-between bg-white border-b border-slate-100">
        <span className="text-slate-900 font-bold text-lg">
          <span className="text-orange-500">AI</span>-MBTI
        </span>
        <CTAButton location="header_v5" className="bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors">
          테스트 시작 →
        </CTAButton>
      </header>

      <section className="px-5 py-10">
        <div className="max-w-sm mx-auto space-y-6">
          {/* 스토리 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
            <p className="text-xs text-orange-500 font-bold mb-3">실화입니다</p>
            <p className="text-sm text-slate-700 leading-relaxed">
              "5년차 마케터였습니다.
              <br /><br />
              어느 날 팀장이 말했어요.
              <br />
              <strong className="text-slate-900">"이거 ChatGPT로 하면 10분이면 되는데, 왜 하루 걸려요?"</strong>
              <br /><br />
              그날 밤, 진지하게 고민했습니다.
              <br />
              <span className="text-orange-500 font-bold">나는 AI 시대에 어떤 사람일까?</span>"
            </p>
          </div>

          {/* 전환 포인트 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
            <p className="text-xs text-slate-400 font-bold mb-3">그래서 만들었습니다</p>
            <h2 className="text-2xl font-black text-slate-900 mb-2">
              AI 시대 생존유형 진단
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              20문항으로 당신이 AI 시대에
              <br />
              어떤 유형인지 정확하게 알려드립니다.
            </p>

            <div className="mt-4 space-y-2">
              {[
                '나의 AI 대체 위험도',
                '16가지 유형 중 나의 포지션',
                'AI 시대 추천 직업 & 전환 방향',
              ].map(t => (
                <div key={t} className="flex items-center gap-2 text-sm">
                  <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                  <span className="text-slate-600">{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <CTAButton
            location="hero_v5"
            className="block bg-orange-500 hover:bg-orange-400 text-white font-black text-base px-6 py-5 rounded-2xl transition-all text-center shadow-lg shadow-orange-200"
          >
            나도 진단받기 (무료 · 1분) →
          </CTAButton>

          {/* 추가 스토리 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
            <p className="text-xs text-orange-500 font-bold mb-3">그 마케터는 지금</p>
            <p className="text-sm text-slate-700 leading-relaxed">
              진단 결과를 보고 <strong>데이터 마케터</strong>로 전환했습니다.
              <br /><br />
              AI가 못 하는 영역을 찾았고,
              <br />
              거기에 AI를 도구로 더했습니다.
              <br /><br />
              <span className="text-orange-500 font-bold">당신의 이야기는 어떤가요?</span>
            </p>
          </div>
        </div>
      </section>

      <footer className="px-5 py-6 border-t border-slate-200 text-center text-slate-400 text-xs bg-white">
        © 2026 AI-MBTI · <a href="https://metacodes.co.kr/" className="hover:text-slate-600">metacodes.co.kr</a>
      </footer>
    </main>
  )
}
