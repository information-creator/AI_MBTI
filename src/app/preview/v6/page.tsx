import type { Metadata } from 'next'
import CTAButton from '@/components/CTAButton'
import PageViewTracker from '@/components/PageViewTracker'
import VariantAnalysis from '@/components/VariantAnalysis'

export const metadata: Metadata = {
  title: 'AI-MBTI | V6 게이미피케이션',
  description: '랜딩 변형 V6 — 게임화 UI',
}

export default function V6() {
  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-b from-emerald-950 to-slate-950 text-white">
      <VariantAnalysis
        id="v6"
        label="V6 게이미피케이션"
        color="#10b981"
        oneLiner="프로그레스 바 하나로 완료율 28~40% 상승, 게임 요소로 참여 48% 증가"
        strategy="게임 메커닉으로 참여 동기 부여"
        desc="게임UI + 미션/레벨/스탯"
        evidence={[
          '프로그레스 바 — 폼 완료율 28~40% 상승 (LinkedIn / ConversionXL)',
          '게이미피케이션 요소(배지, 포인트, 레벨) — 참여 48% 상승, 전환 15~20% 상승 (Gigya)',
          '멀티스텝 폼 + 진행 표시 — 단일 긴 폼 대비 전환 14% 상승 (Venture Harbour)',
          '"80% 완료!" 마일스톤 메시지 — 이탈 20~30% 감소 (Nir Eyal Hooked)',
          '스크래치/공개 메커닉 — 일반 CTA 대비 참여율 20~30% vs 2~5% (Gamify)',
        ]}
        caveat="과도한 게이미피케이션은 '유치하다' 인식 유발. 타깃 연령대 고려 필요."
        fit="★★★★ — AIMBTI의 20문항 테스트와 게임 메커닉이 자연스럽게 결합. 완료율 향상 기대."
      />
      <PageViewTracker />

      <header className="px-5 py-4 flex items-center justify-between">
        <span className="font-bold text-lg text-emerald-400">AI-MBTI</span>
        <div className="flex items-center gap-2 text-xs text-white/40">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          ONLINE
        </div>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center px-5 py-12 text-center">
        <div className="space-y-6 max-w-sm w-full">
          {/* 레벨 카드 */}
          <div className="bg-white/5 border border-emerald-500/30 rounded-2xl p-6 backdrop-blur">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-emerald-400 font-bold">MISSION BRIEFING</span>
              <span className="text-xs text-white/30">LV.???</span>
            </div>

            <h1 className="text-3xl font-black leading-tight mb-3">
              AI 시대 생존
              <br />
              <span className="text-emerald-400">당신의 레벨은?</span>
            </h1>

            <p className="text-white/50 text-sm mb-4">
              20개의 미션을 클리어하고
              <br />
              당신의 AI 생존 등급을 확인하세요
            </p>

            {/* 스탯 미리보기 */}
            <div className="space-y-2 mb-6">
              {[
                { stat: 'AI 활용력', value: '???' },
                { stat: '업무 방식', value: '???' },
                { stat: '핵심 강점', value: '???' },
                { stat: '실행력', value: '???' },
              ].map(s => (
                <div key={s.stat} className="flex items-center justify-between">
                  <span className="text-xs text-white/40">{s.stat}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-emerald-500/30 w-0" />
                    </div>
                    <span className="text-xs text-emerald-400 font-mono w-8">{s.value}</span>
                  </div>
                </div>
              ))}
            </div>

            <CTAButton
              location="hero_v6"
              className="block bg-emerald-500 hover:bg-emerald-400 text-white font-black text-base px-6 py-4 rounded-xl transition-all w-full text-center"
            >
              ▶ START MISSION
            </CTAButton>
          </div>

          {/* 보상 */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: '🏆', label: '16 유형 중\n내 등급' },
              { icon: '📊', label: 'AI 대체\n위험도' },
              { icon: '🗺️', label: '미래 직업\n로드맵' },
            ].map(r => (
              <div key={r.label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                <span className="text-xl">{r.icon}</span>
                <p className="text-xs text-white/40 mt-1 whitespace-pre-line">{r.label}</p>
              </div>
            ))}
          </div>

          <p className="text-white/20 text-xs">⏱ 예상 클리어 타임: 1분</p>
        </div>
      </section>

      <footer className="px-5 py-6 border-t border-white/10 text-center text-white/20 text-xs">
        © 2026 AI-MBTI · <a href="https://metacodes.co.kr/" className="hover:text-white/40">metacodes.co.kr</a>
      </footer>
    </main>
  )
}
