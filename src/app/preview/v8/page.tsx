import type { Metadata } from 'next'
import CTAButton from '@/components/CTAButton'
import PageViewTracker from '@/components/PageViewTracker'
import VariantAnalysis from '@/components/VariantAnalysis'

export const metadata: Metadata = {
  title: 'AI-MBTI | V8 뉴스형',
  description: '랜딩 변형 V8 — 뉴스/리포트 스타일',
}

export default function V8() {
  return (
    <main className="flex flex-col min-h-screen bg-slate-50">
      <VariantAnalysis
        id="v8"
        label="V8 뉴스형"
        color="#64748b"
        oneLiner="기사형 랜딩은 일반 세일즈 페이지 대비 CTR 20~50% 상승"
        strategy="에디토리얼 신뢰 + 네이티브 광고 효과"
        desc="속보 스타일 + 기사 레이아웃"
        evidence={[
          '에디토리얼/기사형 랜딩 — 일반 세일즈 페이지 대비 CTR 20~50% 상승 (Taboola / Outbrain)',
          '네이티브 광고 — 배너 대비 조회수 53% 상승, 구매 의향 18% 상승 (Sharethrough / IPG)',
          '데이터/통계 기반 콘텐츠 — 신뢰도 및 공유율 38% 상승 (BuzzSumo)',
          '리포트 형식(차트, 데이터 시각화) — 텍스트만 대비 공유 2.5배 (OkDork / BuzzSumo)',
          '"As seen in" 미디어 로고 — 신뢰 15~25% 상승, 전환 10~15% 상승 (VWO)',
        ]}
        caveat="FTC 광고 표시 규정 준수 필요. 비공개 기사형 광고는 규제 리스크."
        fit="★★★☆ — 뉴스 피드에서 유입되는 트래픽에 효과적. 검색/SNS 트래픽에는 다소 이질감."
      />
      <PageViewTracker />

      {/* 브레이킹 뉴스 스타일 */}
      <div className="bg-red-600 text-white text-center py-1.5 px-4 text-xs font-bold">
        BREAKING — 2026 AI 직업 대체 리포트 발표
      </div>

      <header className="px-5 py-4 flex items-center justify-between bg-white border-b border-slate-200">
        <div>
          <span className="text-slate-900 font-black text-lg">AI-MBTI</span>
          <span className="text-slate-400 text-xs ml-2">REPORT</span>
        </div>
        <CTAButton location="header_v8" className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          내 리포트 받기
        </CTAButton>
      </header>

      {/* 기사 스타일 */}
      <article className="px-5 py-8 max-w-sm mx-auto">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-5">
          <div>
            <p className="text-xs text-red-500 font-bold mb-2">속보</p>
            <h1 className="text-2xl font-black text-slate-900 leading-tight mb-2">
              "직장인 80%, AI에 의해
              <br />
              업무 대체 위험"
            </h1>
            <p className="text-xs text-slate-400">2026.04.17 · AI 직업 연구소</p>
          </div>

          <div className="h-px bg-slate-100" />

          <p className="text-sm text-slate-600 leading-relaxed">
            최신 조사에 따르면 현재 직장인이 수행하는 업무의 평균 <strong className="text-slate-900">78%가 AI로 대체 가능</strong>한 것으로 나타났다.
          </p>

          <p className="text-sm text-slate-600 leading-relaxed">
            특히 <strong className="text-red-500">기획서 작성(82%)</strong>, <strong className="text-red-500">보고서 작성(88%)</strong> 등 문서 기반 업무의 대체율이 가장 높았다.
          </p>

          <p className="text-sm text-slate-600 leading-relaxed">
            반면 <strong className="text-emerald-600">전략 수립(36%)</strong>, <strong className="text-emerald-600">AI 서비스 설계(19%)</strong> 등 고차원 의사결정 영역은 아직 안전한 것으로 분석됐다.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-xs font-bold text-amber-700 mb-1">전문가 의견</p>
            <p className="text-sm text-slate-600 leading-relaxed">
              "본인이 AI 시대에 어떤 유형인지 먼저 파악하는 것이 가장 중요합니다. 16가지 생존유형 중 자신의 위치를 알아야 대응 전략을 세울 수 있습니다."
            </p>
          </div>

          <div className="h-px bg-slate-100" />

          <div className="text-center">
            <p className="text-sm font-bold text-slate-700 mb-1">나의 AI 대체 위험도는?</p>
            <p className="text-xs text-slate-400 mb-4">20문항 · 1분 · 무료 진단</p>
            <CTAButton
              location="hero_v8"
              className="block bg-slate-900 hover:bg-slate-800 text-white font-bold text-base px-6 py-4 rounded-xl transition-all"
            >
              내 리포트 무료로 받기 →
            </CTAButton>
          </div>
        </div>
      </article>

      <footer className="px-5 py-6 border-t border-slate-200 text-center text-slate-400 text-xs">
        © 2026 AI-MBTI · <a href="https://metacodes.co.kr/" className="hover:text-slate-600">metacodes.co.kr</a>
      </footer>
    </main>
  )
}
