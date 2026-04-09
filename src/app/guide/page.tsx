import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'AI 자동화 가이드 | AIMBTI',
  description: 'AI 시대에 살아남는 자동화 도구 활용법. ChatGPT, Notion AI 등 직군별 맞춤 가이드.',
  alternates: {
    canonical: 'https://aimbti-seven.vercel.app/guide',
  },
}

const tools = [
  {
    name: 'ChatGPT',
    icon: '🤖',
    use: '보고서 초안 작성, 이메일 드래프트, 아이디어 브레인스토밍',
    tip: '프롬프트: "나는 [직무]야. [상황]에 맞는 [결과물]을 작성해줘."',
  },
  {
    name: 'Claude',
    icon: '✨',
    use: '긴 문서 요약, 코드 리뷰, 전략 분석, 계약서 검토',
    tip: '200K 토큰 컨텍스트로 긴 문서 한 번에 처리 가능',
  },
  {
    name: 'Perplexity',
    icon: '🔍',
    use: '실시간 시장 조사, 경쟁사 분석, 최신 뉴스 리서치',
    tip: '구글 검색 대신 쓰면 리서치 시간 70% 단축',
  },
  {
    name: 'Notion AI',
    icon: '📝',
    use: '회의록 자동 정리, 프로젝트 문서화, 위키 생성',
    tip: '회의 후 음성 녹음 → Notion AI로 요약 → 액션 아이템 자동 추출',
  },
  {
    name: 'Canva AI',
    icon: '🎨',
    use: '프레젠테이션, SNS 카드뉴스, 썸네일, 마케팅 이미지 제작',
    tip: '템플릿 + AI로 디자이너 없어도 퀄리티 결과물 5분 만에 완성',
  },
  {
    name: 'Copilot',
    icon: '💻',
    use: '코드 자동 완성, 버그 수정, 테스트 코드 생성',
    tip: '개발자라면 월 $10으로 코딩 속도 2배 가능',
  },
]

const steps = [
  { step: '1', title: '현재 업무 목록 작성', desc: '매일 반복하는 업무 5가지를 적어보세요' },
  { step: '2', title: 'AI 대체 가능성 체크', desc: '각 업무를 ChatGPT로 테스트해보세요' },
  { step: '3', title: '자동화 1개 구현', desc: '가장 쉬운 것 하나부터 AI로 대체해보세요' },
  { step: '4', title: '나만의 프롬프트 저장', desc: '효과적인 프롬프트를 Notion에 모아두세요' },
  { step: '5', title: 'AI 협업 루틴 만들기', desc: '매일 AI와 함께하는 업무 루틴을 만드세요' },
]

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
        <Link href="/" className="text-slate-900 font-bold text-lg">
          AI<span className="text-indigo-600">MBTI</span>
        </Link>
        <Link href="/test" className="text-sm text-slate-400 hover:text-slate-700 transition-colors">
          테스트 하기 →
        </Link>
      </header>

      <main className="px-6 py-8 max-w-3xl mx-auto space-y-10">
        {/* 히어로 */}
        <div className="text-center space-y-4 py-8">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
            AI 시대 <span className="text-indigo-600">자동화 가이드</span>
          </h1>
          <p className="text-slate-500 text-lg">
            지금 당장 업무에 적용할 수 있는 AI 툴 & 전략
          </p>
        </div>

        {/* 5단계 가이드 */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-5">🗺️ AI 시대 생존 5단계</h2>
          <div className="space-y-3">
            {steps.map((s) => (
              <div
                key={s.step}
                className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff' }}
                >
                  {s.step}
                </div>
                <div>
                  <p className="text-slate-900 font-semibold text-sm">{s.title}</p>
                  <p className="text-slate-500 text-sm mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AI 툴 소개 */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-5">🛠️ 지금 바로 써야 할 AI 툴</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tools.map((tool) => (
              <div
                key={tool.name}
                className="p-5 rounded-2xl space-y-2 bg-white border border-slate-200"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{tool.icon}</span>
                  <span className="text-slate-900 font-bold">{tool.name}</span>
                </div>
                <p className="text-slate-600 text-sm">{tool.use}</p>
                <div
                  className="text-xs text-indigo-600 p-2 rounded-lg leading-relaxed bg-indigo-50"
                >
                  💡 {tool.tip}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 오픈채팅방 CTA */}
        <section
          className="rounded-3xl p-8 text-center space-y-4 bg-indigo-50 border border-indigo-100"
        >
          <div className="text-4xl">💬</div>
          <h2 className="text-2xl font-black text-slate-900">같은 유형끼리 모여요</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            AI 시대를 함께 헤쳐나갈 커뮤니티에 입장하세요.
            <br />
            무료 쿠폰 코드로 특별 혜택도 받을 수 있어요!
          </p>
          <a
            href={process.env.NEXT_PUBLIC_OPENCHAT_URL ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block py-3 px-8 rounded-2xl font-bold text-sm transition-colors"
            style={{ background: '#FEE500', color: '#3C1E1E' }}
          >
            카카오 오픈채팅 입장하기 →
          </a>
          <p className="text-slate-400 text-xs">아직 결과가 없다면 테스트 먼저 해주세요!</p>
          <Link
            href="/test"
            className="inline-block text-indigo-600 text-sm hover:text-indigo-500 transition-colors"
          >
            AI 대체 가능성 테스트 →
          </Link>
        </section>

        {/* 전자책 섹션 */}
        <section
          className="rounded-3xl p-8 space-y-4 bg-amber-50 border border-amber-100"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">📚</span>
            <h2 className="text-xl font-black text-slate-900">AI 시대 자동화 완전 정복 전자책</h2>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed">
            직무별 AI 자동화 케이스 50가지를 담은 실전 가이드.
            오픈채팅방 멤버에게 무료 제공됩니다.
          </p>
          <div className="flex flex-wrap gap-2">
            {['직무별 프롬프트 100선', 'AI 툴 비교 분석', '자동화 ROI 계산법', '실전 케이스 스터디'].map(
              (tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-700"
                >
                  {tag}
                </span>
              )
            )}
          </div>
        </section>
      </main>

      <footer className="px-6 py-8 border-t border-slate-100 text-center text-slate-400 text-sm mt-10">
        <p>
          © 2026 AIMBTI ·{' '}
          <a href="https://metacode.kr" className="hover:text-slate-600 transition-colors">
            metacode.kr
          </a>
        </p>
      </footer>
    </div>
  )
}
