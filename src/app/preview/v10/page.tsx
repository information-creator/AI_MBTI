import type { Metadata } from 'next'
import CTAButton from '@/components/CTAButton'
import PageViewTracker from '@/components/PageViewTracker'
import VariantAnalysis from '@/components/VariantAnalysis'
import Image from 'next/image'
import { typeInfo } from '@/lib/quiz'

export const metadata: Metadata = {
  title: 'AI-MBTI | V10 카드형',
  description: '랜딩 변형 V10 — 유형 카드 먼저 보여주기',
}

const previewTypes = Object.entries(typeInfo).slice(0, 4) as [string, typeof typeInfo[keyof typeof typeInfo]][]

export default function V10() {
  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-b from-slate-900 to-indigo-950 text-white">
      <VariantAnalysis
        id="v10"
        label="V10 카드형"
        color="#06b6d4"
        oneLiner="결과를 먼저 보여주면 테스트 시작률 30~50% 상승"
        strategy="결과 미리보기로 호기심 극대화 (Zeigarnik 효과)"
        desc="캐릭터 선공개 + '이 중에 당신은?'"
        evidence={[
          '결과 미리보기 — 퀴즈/테스트 시작률 30~50% 상승 (Outgrow / Interact)',
          '카드 기반 레이아웃 — 리스트 대비 모바일 CTR 17% 상승 (Google Material Design)',
          '비주얼 미리보기/썸네일 — 텍스트 대비 참여 94% 상승 (MDG Advertising)',
          '4~6개 결과 유형 티저 — 테스트 시작률 20~35% 상승 (BuzzFeed 내부 데이터)',
          '이미지 포함 랜딩 — 이미지 없는 랜딩 대비 전환 40% 우위 (VWO)',
        ]}
        caveat="너무 많은 유형을 보여주면 선택 마비. 4~6개가 최적."
        fit="★★★★★ — AIMBTI의 16유형 캐릭터 자산 활용. '이 중에 나는?' 호기심이 테스트 시작 직결."
      />
      <PageViewTracker />

      <header className="px-5 py-4 flex items-center justify-between">
        <span className="font-bold text-lg">
          <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">AI-MBTI</span>
        </span>
        <CTAButton location="header_v10" className="bg-cyan-500 hover:bg-cyan-400 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors">
          내 유형은? →
        </CTAButton>
      </header>

      {/* 질문으로 시작 */}
      <section className="px-5 py-10 text-center">
        <h1 className="text-3xl font-black leading-tight mb-2">
          이 중에
          <br />
          <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">당신은 누구</span>인가요?
        </h1>
        <p className="text-white/40 text-sm">AI 시대 16가지 생존유형</p>
      </section>

      {/* 유형 카드 4개 미리보기 */}
      <section className="px-5 pb-6">
        <div className="grid grid-cols-2 gap-3">
          {previewTypes.map(([code, info]) => (
            <div
              key={code}
              className="rounded-2xl p-4 text-center backdrop-blur"
              style={{ background: info.color + '15', border: `1px solid ${info.color}30` }}
            >
              <Image
                src={`/characters/${info.title}.png`}
                alt={info.title}
                width={64}
                height={64}
                className="mx-auto mb-2 object-contain"
                unoptimized
                style={{ mixBlendMode: 'screen' }}
              />
              <p className="text-sm font-black" style={{ color: info.color }}>
                {info.title}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-3 text-center">
          <p className="text-white/30 text-sm">+ 12가지 유형 더 있습니다</p>
        </div>
      </section>

      {/* 궁금증 유발 */}
      <section className="px-5 py-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
          <p className="text-sm font-bold text-cyan-400">나는 어떤 유형일까?</p>

          <div className="space-y-3">
            {[
              { q: 'AI를 얼마나 활용하나요?', hint: 'AI 활용도 측정' },
              { q: '일하는 스타일은?', hint: '업무 방식 분석' },
              { q: '나의 핵심 강점은?', hint: '강점 매핑' },
              { q: '실행력은 어떤 편?', hint: '실행력 진단' },
            ].map(item => (
              <div key={item.q} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-sm text-white/70">{item.q}</span>
                <span className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded-full">{item.hint}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-white/30">이 4가지 축으로 16가지 유형을 정밀 분류합니다</p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-12">
        <CTAButton
          location="hero_v10"
          className="block bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-black text-base px-6 py-5 rounded-2xl transition-all text-center shadow-lg shadow-cyan-500/20"
        >
          내 유형 확인하기 (무료 · 1분) →
        </CTAButton>
        <p className="text-center text-white/20 text-xs mt-3">로그인 불필요 · 즉시 결과 확인</p>
      </section>

      <footer className="px-5 py-6 border-t border-white/10 text-center text-white/20 text-xs">
        © 2026 AI-MBTI · <a href="https://metacodes.co.kr/" className="hover:text-white/40">metacodes.co.kr</a>
      </footer>
    </main>
  )
}
