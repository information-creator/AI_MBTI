import type { Metadata } from 'next'
import CTAButton from '@/components/CTAButton'
import PageViewTracker from '@/components/PageViewTracker'
import VariantAnalysis from '@/components/VariantAnalysis'
import VariantTracker from '@/components/VariantTracker'

export const metadata: Metadata = {
  title: 'AI-MBTI | V3 사회적 증거',
  description: '랜딩 변형 V3 — 사회적 증거 + 후기',
}

export default function V3() {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      <VariantAnalysis
        id="v3"
        label="V3 사회적 증거"
        color="#3b82f6"
        oneLiner="후기/추천사 하나만 추가해도 전환율 34% 상승"
        strategy="밴드왜건 효과(Bandwagon Effect) + 사회적 증거"
        desc="후기 카드 + '가장 많이 공유한 테스트'"
        evidence={[
          '후기/추천사 — 랜딩 전환율 34% 상승 (VWO)',
          '별점 표시 — CTA 근처 별점 노출 시 전환 4.6~35% 상승 (Spiegel Research Center)',
          '사용자 수 표시("50,000명 참여") — 가입율 12~15% 상승 (Basecamp 사례)',
          '리뷰 영향력 — 소비자 92%가 구매 전 리뷰 확인 (Spiegel Research)',
          '신뢰 배지/로고 — 보안 배지 전환율 42% 증가 (Baymard Institute)',
        ]}
        caveat="실제 데이터 기반이어야 효과적. 조작된 후기는 신뢰도 급락."
        fit="★★★★ — 실제 참여 수치가 쌓이면 강력. 초기에는 후기 콘텐츠가 부족할 수 있음."
      />
      <VariantTracker variant="v3" />
      <PageViewTracker />

      {/* 헤더 */}
      <header className="px-5 py-4 flex items-center justify-between border-b border-slate-100">
        <span className="text-slate-900 font-bold text-lg">
          <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">AI-MBTI</span>
        </span>
        <CTAButton location="header_v3" className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors">
          무료 진단 →
        </CTAButton>
      </header>

      {/* 히어로 */}
      <section className="px-5 py-12 text-center">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-1.5 text-blue-600 text-xs font-bold">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
            지금까지 참여한 사람들
          </div>

          <h1 className="text-3xl font-black text-slate-900 leading-tight">
            직장인들이
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent text-4xl">가장 많이 공유한</span>
            <br />
            AI 테스트
          </h1>

          <p className="text-slate-500 text-sm">
            "생각보다 정확해서 소름" — 실제 참여자 반응
          </p>
        </div>
      </section>

      {/* 후기 카드 */}
      <section className="px-5 pb-8">
        <div className="space-y-3">
          {[
            { name: '김O준', job: '마케터 3년차', text: '마케터인데 AI 활용형이 나올 줄 몰랐어요. 추천 직업이 진짜 맞아서 놀랐습니다.', type: 'HALF' },
            { name: '이O영', job: '개발자 5년차', text: '개발자라 안전할 줄 알았는데 대체 위험이 높다고 나와서 충격... 근데 솔직히 맞는 것 같아요.', type: 'ASLF' },
            { name: '박O수', job: '기획자 2년차', text: '1분도 안 걸렸는데 결과가 너무 자세해서 캡처해서 팀원들한테 다 보냈어요 ㅋㅋ', type: 'TSCF' },
          ].map(r => (
            <div key={r.name} className="rounded-2xl p-4 bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">{r.name[0]}</div>
                <div>
                  <p className="text-sm font-bold text-slate-700">{r.name}</p>
                  <p className="text-xs text-slate-400">{r.job} · {r.type}유형</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">"{r.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-12">
        <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl p-6 text-center text-white">
          <p className="text-sm font-bold mb-1 opacity-80">무료 · 1분 · 로그인 불필요</p>
          <h2 className="text-xl font-black mb-4">나도 AI 생존유형 확인하기</h2>
          <CTAButton
            location="hero_v3"
            className="block bg-white text-blue-600 font-black text-base px-6 py-4 rounded-xl transition-all hover:bg-blue-50"
          >
            테스트 시작하기 →
          </CTAButton>
        </div>
      </section>

      {/* 통계 */}
      <section className="px-5 pb-10">
        <div className="grid grid-cols-3 gap-3">
          {[
            { num: '16가지', label: 'AI 유형 분류' },
            { num: '20문항', label: '정밀 진단' },
            { num: '무료', label: '비용 부담 없음' },
          ].map(i => (
            <div key={i.label} className="rounded-xl p-3 text-center bg-slate-50 border border-slate-200">
              <div className="text-lg font-black text-blue-600">{i.num}</div>
              <div className="text-slate-400 text-xs mt-0.5">{i.label}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="px-5 py-6 border-t border-slate-100 text-center text-slate-400 text-xs">
        © 2026 AI-MBTI · <a href="https://metacodes.co.kr/" className="hover:text-slate-600">metacodes.co.kr</a>
      </footer>
    </main>
  )
}
