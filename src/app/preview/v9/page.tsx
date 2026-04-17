import type { Metadata } from 'next'
import CTAButton from '@/components/CTAButton'
import PageViewTracker from '@/components/PageViewTracker'
import VariantAnalysis from '@/components/VariantAnalysis'

export const metadata: Metadata = {
  title: 'AI-MBTI | V9 대화형',
  description: '랜딩 변형 V9 — 챗봇 대화형 UI',
}

export default function V9() {
  return (
    <main className="flex flex-col min-h-screen bg-slate-100">
      <VariantAnalysis
        id="v9"
        label="V9 대화형"
        color="#6366f1"
        oneLiner="챗봇 기반 랜딩은 일반 폼 대비 전환 2~3배, 완료율 40% 상승"
        strategy="대화형 마케팅 + 즉각적 응답 기대감"
        desc="AI 상담사 채팅 UI"
        evidence={[
          '챗봇 기반 랜딩 — 일반 폼 대비 전환 2~3배 (Drift 2023)',
          '대화형 폼(한 번에 하나씩) — 기존 폼 대비 완료율 40% 상승 (Typeform)',
          '라이브 채팅 — 전환 20% 상승, 만족도 73% 상승 (Forrester)',
          '즉시 응답 기대 — 소비자 82%가 즉각 응답 기대 (HubSpot 2024)',
          '메시지 CTA vs 폼 — 아시아 시장에서 응답률 35~45% 상승 (Meta Business)',
        ]}
        caveat="실제 대화가 아니면 기대와 현실의 괴리. 클릭 후 일반 테스트로 전환 시 이질감."
        fit="★★★★ — 카카오톡 익숙한 한국 사용자에게 친숙. 챗봇 느낌이 AI 서비스와 맥락 일치."
      />
      <PageViewTracker />

      <header className="px-5 py-3 flex items-center gap-3 bg-white border-b border-slate-200">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">AI</div>
        <div>
          <p className="text-sm font-bold text-slate-800">AI 커리어 상담사</p>
          <p className="text-xs text-emerald-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            온라인
          </p>
        </div>
      </header>

      <section className="flex-1 px-4 py-6 space-y-4 max-w-sm mx-auto w-full">
        {/* AI 메시지 */}
        <div className="flex gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-1">AI</div>
          <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-slate-200 max-w-[85%]">
            <p className="text-sm text-slate-700 leading-relaxed">
              안녕하세요! AI 커리어 상담사입니다.
              <br /><br />
              요즘 AI 때문에 내 직업이 괜찮을지 걱정되시죠? 저도 매일 그런 질문을 받아요.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-1">AI</div>
          <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-slate-200 max-w-[85%]">
            <p className="text-sm text-slate-700 leading-relaxed">
              사실 중요한 건 직업이 아니라
              <br />
              <strong className="text-indigo-600">당신이 어떤 유형인가</strong>입니다.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-1">AI</div>
          <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-slate-200 max-w-[85%]">
            <p className="text-sm text-slate-700 leading-relaxed">
              같은 마케터라도
              <br />
              <span className="text-red-500 font-bold">대체될 유형</span>이 있고
              <br />
              <span className="text-emerald-600 font-bold">살아남을 유형</span>이 있어요.
            </p>
          </div>
        </div>

        {/* 데이터 카드 */}
        <div className="flex gap-2">
          <div className="w-6 h-6 shrink-0 mt-1" />
          <div className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl px-4 py-4 max-w-[85%] text-white">
            <p className="text-xs font-bold opacity-80 mb-2">AI 생존유형 진단</p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm">
                <span>📊</span>
                <span>16가지 유형 분류</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span>⏱</span>
                <span>20문항 · 약 1분</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span>💰</span>
                <span>완전 무료</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-1">AI</div>
          <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-slate-200 max-w-[85%]">
            <p className="text-sm text-slate-700">
              간단한 질문 20개만 답하면
              <br />
              바로 결과를 알려드릴게요.
              <br /><br />
              <strong className="text-indigo-600">시작해볼까요?</strong>
            </p>
          </div>
        </div>

        {/* CTA (답장 형태) */}
        <div className="flex justify-end">
          <CTAButton
            location="hero_v9"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm px-6 py-3 rounded-2xl rounded-br-sm transition-all shadow-sm"
          >
            네, 시작할게요! →
          </CTAButton>
        </div>

        <div className="flex justify-end">
          <CTAButton
            location="hero_v9_alt"
            className="bg-white hover:bg-slate-50 text-slate-600 font-medium text-sm px-6 py-3 rounded-2xl rounded-br-sm transition-all shadow-sm border border-slate-200"
          >
            유형이 뭔지 더 알려줘
          </CTAButton>
        </div>
      </section>

      <footer className="px-5 py-4 bg-white border-t border-slate-200 text-center text-slate-400 text-xs">
        © 2026 AI-MBTI · <a href="https://metacodes.co.kr/" className="hover:text-slate-600">metacodes.co.kr</a>
      </footer>
    </main>
  )
}
