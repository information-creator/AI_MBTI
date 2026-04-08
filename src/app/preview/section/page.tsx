import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '섹션 디자인 비교 (내부 검토용)',
  robots: { index: false },
}

export default function SectionPreview() {
  return (
    <main className="flex flex-col min-h-screen bg-slate-100 py-10 px-5 gap-8">
      <div className="text-center">
        <p className="text-slate-500 text-sm font-medium">섹션 타이틀 디자인 비교 (내부 검토용)</p>
      </div>

      {/* A. 배지 + 타이틀 */}
      <div className="bg-white rounded-3xl overflow-hidden">
        <div className="bg-slate-800 text-white text-center py-1.5 text-xs font-medium">A안</div>
        <section className="px-5 py-10 bg-slate-50">
          <div className="flex justify-center mb-3">
            <span className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-full px-3 py-1 text-red-600 text-xs font-bold">
              🔴 16가지 유형
            </span>
          </div>
          <h2 className="text-xl font-bold text-center text-slate-900 mb-6">
            유형마다 대체 가능성이 다릅니다
          </h2>
        </section>
      </div>

      {/* B. 그라디언트 텍스트 */}
      <div className="bg-white rounded-3xl overflow-hidden">
        <div className="bg-slate-800 text-white text-center py-1.5 text-xs font-medium">B안</div>
        <section className="px-5 py-10 bg-slate-50 text-center">
          <h2 className="text-2xl font-black text-slate-900 leading-tight mb-6">
            유형마다
            <br />
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              대체 가능성이 다릅니다
            </span>
          </h2>
        </section>
      </div>

      {/* C. 카드형 강조 */}
      <div className="bg-white rounded-3xl overflow-hidden">
        <div className="bg-slate-800 text-white text-center py-1.5 text-xs font-medium">C안</div>
        <section className="px-5 py-10 bg-slate-50">
          <div className="rounded-2xl p-4 mb-6 text-center" style={{ background: 'linear-gradient(135deg, #fef2f2 0%, #fff7ed 100%)', border: '1px solid #fecaca' }}>
            <p className="text-3xl font-black text-red-500 mb-0.5">16가지</p>
            <p className="text-base font-bold text-slate-700">유형마다 대체 가능성이 다릅니다</p>
          </div>
        </section>
      </div>

      {/* D. 히어로 스타일 통일 */}
      <div className="bg-white rounded-3xl overflow-hidden">
        <div className="bg-slate-800 text-white text-center py-1.5 text-xs font-medium">D안 (추천)</div>
        <section className="px-5 py-10 bg-slate-50 text-center">
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-4 py-1.5 text-red-600 text-xs font-medium mb-4">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            AI 유형 미리보기
          </div>
          <h2 className="text-2xl font-black text-slate-900 leading-tight mb-2">
            유형마다{' '}
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              대체 가능성
            </span>
            이 다릅니다
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            내 유형은 총 16가지 — 지금 바로 확인해보세요
          </p>
        </section>
      </div>
    </main>
  )
}
