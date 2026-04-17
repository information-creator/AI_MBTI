import type { Metadata } from 'next'
import CTAButton from '@/components/CTAButton'
import PageViewTracker from '@/components/PageViewTracker'
import VariantAnalysis from '@/components/VariantAnalysis'

export const metadata: Metadata = {
  title: 'AI-MBTI | V2 호기심',
  description: '랜딩 변형 V2 — 호기심 유발 퀴즈형',
}

export default function V2() {
  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950 text-white">
      <VariantAnalysis
        id="v2"
        label="V2 호기심"
        color="#a855f7"
        oneLiner="퀴즈형 랜딩은 일반 랜딩 대비 전환율 10배 (30~50% vs 3~5%)"
        strategy="호기심 갭(Curiosity Gap) + 퀴즈 심리 활용"
        desc="보라-핑크 그라데이션 + '나는 어떤 유형?' + 이모지 그리드"
        evidence={[
          '퀴즈형 랜딩 — 일반 랜딩 전환율 3~5% vs 퀴즈형 30~50% (LeadQuizzes / Outgrow)',
          '인터랙티브 콘텐츠 — 정적 콘텐츠 대비 전환 2배 (Demand Metric)',
          '호기심 갭 헤드라인 — 직접적 헤드라인 대비 CTR 5~25% 상승 (Conductor)',
          '퀴즈 완료율 — 잘 설계된 퀴즈는 60~85% 완료 (Typeform / Outgrow)',
          '체류시간 — 퀴즈 페이지 체류시간 정적 페이지 대비 2~3배 (CMI)',
        ]}
        caveat="없음 — 퀴즈 서비스와 가장 자연스러운 조합."
        fit="★★★★★ — AIMBTI가 퀴즈 서비스이므로 가장 적합. '나는 어떤 유형?' 질문이 핵심 후크."
      />
      <PageViewTracker />

      {/* 헤더 */}
      <header className="px-5 py-4 flex items-center justify-between">
        <span className="font-bold text-lg">
          <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">AI-MBTI</span>
        </span>
        <CTAButton location="header_v2" className="bg-white/10 hover:bg-white/20 backdrop-blur text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors border border-white/20">
          시작하기 →
        </CTAButton>
      </header>

      {/* 히어로 */}
      <section className="flex-1 flex flex-col items-center justify-center px-5 py-12 text-center">
        <div className="space-y-6 max-w-sm">
          {/* 이모지 그리드 */}
          <div className="grid grid-cols-4 gap-2 max-w-[200px] mx-auto">
            {['🧠', '🤖', '🚀', '💡', '📊', '🎯', '⚡', '🔮'].map((e, i) => (
              <div key={i} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg">
                {e}
              </div>
            ))}
          </div>

          <h1 className="text-3xl font-black leading-tight">
            AI 시대,
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent text-4xl">
              나는 어떤 유형?
            </span>
          </h1>

          <p className="text-white/50 text-sm leading-relaxed">
            16가지 AI 생존유형 중 당신은?
            <br />
            20문항으로 정확하게 진단합니다
          </p>

          {/* 유형 미리보기 */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: '🛡️', name: '수호자형', desc: 'AI와 공존하는' },
              { icon: '⚔️', name: '개척자형', desc: 'AI를 이끄는' },
              { icon: '🔬', name: '분석가형', desc: 'AI를 활용하는' },
              { icon: '❓', name: '당신은?', desc: '지금 확인하기' },
            ].map(t => (
              <div key={t.name} className="rounded-xl p-3 bg-white/5 border border-white/10 text-left">
                <span className="text-lg">{t.icon}</span>
                <p className="text-sm font-bold mt-1">{t.name}</p>
                <p className="text-xs text-white/40">{t.desc}</p>
              </div>
            ))}
          </div>

          <CTAButton
            location="hero_v2"
            className="block bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-400 hover:to-pink-400 text-white font-black text-base px-8 py-5 rounded-2xl transition-all shadow-lg shadow-purple-500/30"
          >
            내 AI 유형 알아보기 →
          </CTAButton>

          <p className="text-white/30 text-xs">
            ⏱ 1분 · 완전 무료 · 바로 결과 확인
          </p>
        </div>
      </section>

      {/* 소셜 프루프 */}
      <section className="px-5 py-8 border-t border-white/10">
        <div className="flex items-center justify-center gap-6 text-center">
          {[
            { num: '16가지', label: '유형 분류' },
            { num: '20문항', label: '정밀 진단' },
            { num: '1분', label: '소요 시간' },
          ].map(i => (
            <div key={i.label}>
              <div className="text-lg font-black bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">{i.num}</div>
              <div className="text-white/30 text-xs">{i.label}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="px-5 py-6 border-t border-white/10 text-center text-white/20 text-xs">
        © 2026 AI-MBTI · <a href="https://metacodes.co.kr/" className="hover:text-white/40">metacodes.co.kr</a>
      </footer>
    </main>
  )
}
