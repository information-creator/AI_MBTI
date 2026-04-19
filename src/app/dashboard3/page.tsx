'use client'

import { useState, useEffect, useCallback } from 'react'
import { fetchGA4, fetchMetaAds, fetchGoogleAds, fetchABTest } from '@/lib/dashboard/api'
import { evaluateAds, evaluateFunnel, diagLevel, getOverallVerdict } from '@/lib/dashboard/diagnostics'
import { BENCHMARKS, compareBenchmark } from '@/lib/dashboard/benchmarks'
import type { GA4Data, MetaAdsData, GoogleAdsData, ABTestData, DiagItem, DiagLevel } from '@/lib/dashboard/types'

const PASS = '720972'

const VARIANT_LABELS: Record<string, { name: string; color: string }> = {
  v1: { name: 'V1 공포소구', color: '#ef4444' },
  v3: { name: 'V3 사회적 증거', color: '#3b82f6' },
  v4: { name: 'V4 극심플', color: '#0f172a' },
}

function daysAgo(dateStr: string, days: number) {
  const d = new Date(dateStr)
  d.setDate(d.getDate() - days)
  return d.toISOString().slice(0, 10)
}

type View = 'overview' | 'funnel' | 'meta' | 'google' | 'abtest' | 'ebooks'

type EbookItem = { id: number | string; title: string; students: number }
type EbooksData = { ebooks: EbookItem[]; fetchedAt: string }

const BENCHMARK_SOURCE = '교육·온라인강의 업종 평균 (Unbounce 2024 · WordStream 2025 · LeadQuizzes · 국내 시장 추정치 기준)'

export default function Dashboard3Page() {
  const [authed, setAuthed] = useState(false)
  const [checked, setChecked] = useState(false)
  const [input, setInput] = useState('')
  const [view, setView] = useState<View>('overview')

  const [startDate, setStartDate] = useState('2026-03-03')
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10))

  const [ga4, setGa4] = useState<GA4Data | null>(null)
  const [meta, setMeta] = useState<MetaAdsData | null>(null)
  const [google, setGoogle] = useState<GoogleAdsData | null>(null)
  const [ab, setAb] = useState<ABTestData[] | null>(null)
  const [ebooks, setEbooks] = useState<EbooksData | null>(null)
  const [ebooksError, setEbooksError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const saved = sessionStorage.getItem('dashboard3_auth') === 'true'
    if (saved) setAuthed(true)
    setChecked(true)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (input === PASS) {
      sessionStorage.setItem('dashboard3_auth', 'true')
      setAuthed(true)
    }
  }

  const load = useCallback(async () => {
    setLoading(true)
    const [g, m, goog, abr] = await Promise.allSettled([
      fetchGA4(startDate, endDate),
      fetchMetaAds(startDate, endDate),
      fetchGoogleAds(startDate, endDate),
      fetchABTest(startDate, endDate),
    ])
    if (g.status === 'fulfilled') setGa4(g.value)
    if (m.status === 'fulfilled') setMeta(m.value)
    if (goog.status === 'fulfilled') setGoogle(goog.value)
    if (abr.status === 'fulfilled') setAb(abr.value.variants)
    setLoading(false)
  }, [startDate, endDate])

  const loadEbooks = useCallback(async () => {
    setEbooksError('')
    try {
      const res = await fetch(`/api/metacode-ebooks?pass=${PASS}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setEbooks(await res.json())
    } catch (e) {
      setEbooksError(e instanceof Error ? e.message : '전자책 데이터를 불러올 수 없습니다')
    }
  }, [])

  useEffect(() => {
    if (authed) loadEbooks()
  }, [authed, loadEbooks])

  useEffect(() => {
    if (authed) load()
  }, [authed, load])

  const setPreset = (days: number) => {
    const now = new Date().toISOString().slice(0, 10)
    setEndDate(now)
    setStartDate(daysAgo(now, days - 1))
  }

  if (!checked) return <main className="min-h-screen bg-slate-50" />

  if (!authed) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm text-center">
          <h1 className="text-slate-900 text-2xl font-black mb-8">AIMBTI 대시보드 v3</h1>
          <input
            type="password"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="비밀번호"
            autoFocus
            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-4 text-center text-slate-900 text-xl tracking-widest mb-4 focus:outline-none focus:border-indigo-500"
          />
          <button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl py-4 font-bold text-lg">확인</button>
        </form>
      </main>
    )
  }

  // ========== 데이터 집계 ==========
  const totalSpend = (meta?.totals.spend ?? 0) + (google?.totals.spend ?? 0)
  const totalClicks = (meta?.totals.clicks ?? 0) + (google?.totals.clicks ?? 0)
  const totalImpressions = (meta?.totals.impressions ?? 0) + (google?.totals.impressions ?? 0)
  const blendedCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0
  const blendedCPC = totalClicks > 0 ? Math.round(totalSpend / totalClicks) : 0

  const ev = ga4?.events ?? {}
  const get = (name: string) => ev[name]?.users ?? 0
  const totalUsers = ga4?.totalUsers ?? 0
  const ctaClick = get('cta_click')
  const testStart = get('test_start')
  const testComplete = get('test_complete')
  const resultView = get('result_view')
  const openchat = get('openchat_click')
  const ebook = get('ebook_click')
  const share = get('share_click')
  const secondaryTotal = openchat + ebook + share

  const funnel = [
    { label: '페이지 방문', value: totalUsers },
    { label: 'CTA 클릭', value: ctaClick },
    { label: '테스트 시작', value: testStart },
    { label: '테스트 완료', value: testComplete },
    { label: '결과 확인', value: resultView },
    { label: '2차 전환', value: secondaryTotal },
  ]

  const effectiveCPA = secondaryTotal > 0 ? Math.round(totalSpend / secondaryTotal) : 0
  const cpaCmp = effectiveCPA > 0 ? compareBenchmark(effectiveCPA, BENCHMARKS.overall.cpa_target, false) : null

  const e2e = totalUsers > 0 ? (secondaryTotal / totalUsers) * 100 : 0
  const completionRate = testStart > 0 ? (testComplete / testStart) * 100 : 0

  // ========== 종합 진단 ==========
  const allDiag: DiagItem[] = [
    ...evaluateFunnel(funnel),
    ...(meta ? evaluateAds('Meta', meta.totals) : []),
    ...(google ? evaluateAds('Google', google.totals) : []),
  ]
  if (resultView > 0) {
    const secRate = (secondaryTotal / resultView) * 100
    const secLevel: DiagLevel = secRate >= 15 ? 'good' : secRate >= 5 ? 'warn' : 'bad'
    allDiag.push({
      label: '결과→2차 전환',
      level: secLevel,
      value: `${secRate.toFixed(1)}%`,
      comment: secLevel === 'good' ? '전환 양호' : secLevel === 'warn' ? '전환 보통 — CTA 강화 고려' : '전환 낮음 — 노출/문구 개선 필요',
    })
  }
  const verdict = allDiag.length > 0 ? getOverallVerdict(allDiag) : null

  // ========== 종합 평가 문구 ==========
  const adEfficiency = totalSpend > 0 && secondaryTotal > 0
  const cpaOk = effectiveCPA > 0 && effectiveCPA <= BENCHMARKS.overall.cpa_target * 1.5
  let headline = ''
  let subline = ''
  if (e2e >= 5) headline = `전체 전환율 ${e2e.toFixed(1)}% — 퍼널이 잘 작동하고 있습니다. 트래픽을 늘리면 성과가 비례합니다.`
  else if (e2e >= 1) headline = `전체 전환율 ${e2e.toFixed(1)}% — 보통 수준입니다. 이탈이 큰 구간을 집중 개선하면 2배 이상 올릴 수 있습니다.`
  else if (totalUsers > 0) headline = `전체 전환율 ${e2e.toFixed(1)}% — 퍼널 어딘가에서 대량 이탈이 발생하고 있습니다. 아래 진단을 확인하세요.`
  else headline = '아직 데이터가 부족합니다. 광고 집행 후 다시 확인하세요.'

  if (!adEfficiency) subline = '광고비 대비 2차 전환이 아직 없습니다. 랜딩→결과 퍼널부터 점검해주세요.'
  else if (cpaOk) subline = `유효 CPA ₩${effectiveCPA.toLocaleString()} — 목표(₩${BENCHMARKS.overall.cpa_target.toLocaleString()}) 대비 적정. 현재 전략을 유지하며 스케일업하세요.`
  else subline = `유효 CPA ₩${effectiveCPA.toLocaleString()} — 목표(₩${BENCHMARKS.overall.cpa_target.toLocaleString()}) 초과. 광고 소재 교체 또는 랜딩 전환율 개선이 우선입니다.`

  const overallLevel: DiagLevel = e2e >= 3 && cpaOk ? 'good' : e2e >= 1 ? 'warn' : 'bad'
  const overallStyle = {
    good: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', icon: '✅' },
    warn: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800', icon: '⚠️' },
    bad: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', icon: '🚨' },
  }[overallLevel]

  // ========== A/B 승자 ==========
  const abWinner = (() => {
    if (!ab || ab.length === 0) return null
    const rates = ab.map(d => ({
      variant: d.variant,
      rate: d.pageView > 0 ? (d.resultView / d.pageView) * 100 : 0,
    }))
    return rates.reduce((a, b) => (a.rate > b.rate ? a : b))
  })()

  const navItems: { id: View; label: string; icon: string }[] = [
    { id: 'overview', label: '종합', icon: '📊' },
    { id: 'funnel', label: '퍼널', icon: '🔻' },
    { id: 'meta', label: 'Meta Ads', icon: '🟦' },
    { id: 'google', label: 'Google Ads', icon: '🟨' },
    { id: 'abtest', label: 'A/B 테스트', icon: '🧪' },
    { id: 'ebooks', label: '전자책 수강생', icon: '📚' },
  ]

  const viewTitle: Record<View, string> = {
    overview: '종합 대시보드',
    funnel: '퍼널 분석',
    meta: 'Meta Ads',
    google: 'Google Ads',
    abtest: 'A/B 테스트',
    ebooks: '전자책 수강생',
  }

  const ebooksTotal = ebooks?.ebooks.reduce((s, e) => s + e.students, 0) ?? 0

  return (
    <main className="min-h-screen bg-slate-50 flex">
      {/* 사이드바 */}
      <aside className="w-52 shrink-0 bg-white border-r border-slate-200 sticky top-0 h-screen flex flex-col">
        <div className="px-4 py-4 border-b border-slate-100 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-sm">A</div>
          <div>
            <h1 className="text-slate-900 text-sm font-black leading-none">AIMBTI</h1>
            <p className="text-slate-400 text-[10px] font-semibold mt-0.5">대시보드 v3</p>
          </div>
        </div>
        <nav className="px-2 py-3 space-y-0.5 flex-1">
          {navItems.map(item => {
            const active = view === item.id
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors text-left ${
                  active
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="text-sm">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
      </aside>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 min-w-0 px-5 py-4">
        {/* 상단 툴바 */}
        <header className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-slate-900 text-lg font-black tracking-tight">{viewTitle[view]}</h2>
            <p className="text-slate-500 text-xs mt-0.5">{startDate} ~ {endDate}</p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 bg-white rounded-lg border border-slate-200 px-2 py-1">
            {[
              { label: '오늘', days: 1 },
              { label: '7일', days: 7 },
              { label: '30일', days: 30 },
            ].map(p => (
              <button key={p.label} onClick={() => setPreset(p.days)} className="text-xs font-bold px-2 py-1 rounded text-slate-600 hover:bg-slate-100">
                {p.label}
              </button>
            ))}
            <div className="w-px h-4 bg-slate-200 mx-0.5" />
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-transparent px-1 py-0.5 text-slate-900 text-xs focus:outline-none" />
            <span className="text-slate-400 text-xs">~</span>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-transparent px-1 py-0.5 text-slate-900 text-xs focus:outline-none" />
            <button onClick={() => { load(); loadEbooks() }} disabled={loading} className="text-xs font-bold px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50">
              {loading ? '...' : '↻'}
            </button>
          </div>
        </header>

        {/* ===== 종합 뷰 — 한눈에 ===== */}
        {view === 'overview' && (
          <div className="space-y-3">
            {/* 한줄 요약 */}
            <section className={`${overallStyle.bg} border ${overallStyle.border} rounded-lg px-4 py-3`}>
              <p className={`text-sm font-bold ${overallStyle.text} leading-snug`}>
                {overallStyle.icon} {headline}
              </p>
              <p className={`text-xs ${overallStyle.text} opacity-80 mt-0.5`}>{subline}</p>
            </section>

            {/* 8개 핵심 지표 (방문/CTA/완료/결과 + 광고비/클릭/CTR/CPA) */}
            <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
              <CompactMetric label="방문" value={totalUsers.toLocaleString()} />
              <CompactMetric label="테스트 완료" value={testComplete.toLocaleString()} />
              <CompactMetric label="결과 확인" value={resultView.toLocaleString()} />
              <CompactMetric label="2차 전환" value={secondaryTotal.toLocaleString()} accent />
              <CompactMetric label="전자책 수강" value={ebooksTotal.toLocaleString()} accent />
              <CompactMetric label="광고비" value={`₩${totalSpend.toLocaleString()}`} />
              <CompactMetric label="CPC" value={`₩${blendedCPC.toLocaleString()}`} />
              <CompactMetric
                label="유효 CPA"
                value={effectiveCPA > 0 ? `₩${effectiveCPA.toLocaleString()}` : '-'}
                sub={cpaCmp?.label}
                subColor={cpaCmp?.level === 'good' ? 'text-green-600' : cpaCmp?.level === 'bad' ? 'text-red-500' : 'text-yellow-600'}
              />
            </section>

            {/* 3컬럼: 퍼널 | 광고 Meta/Google | 진단 */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              {/* 퍼널 */}
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <h3 className="text-slate-900 text-sm font-black mb-3">퍼널</h3>
                <div className="space-y-2">
                  {funnel.map((step, i) => {
                    const width = funnel[0].value > 0 ? Math.max(Math.round((step.value / funnel[0].value) * 100), step.value > 0 ? 3 : 0) : 0
                    const prev = i > 0 ? funnel[i - 1].value : 0
                    const dropoff = i > 0 && prev > 0 ? Math.round(((prev - step.value) / prev) * 100) : 0
                    return (
                      <div key={i}>
                        <div className="flex justify-between items-baseline mb-0.5">
                          <span className="text-slate-600 text-xs font-semibold">{step.label}</span>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-slate-900 text-sm font-black">{step.value.toLocaleString()}</span>
                            {i > 0 && dropoff > 0 && <span className="text-red-500 text-[10px] font-bold">-{dropoff}%</span>}
                          </div>
                        </div>
                        <div className="bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div className="h-full rounded-full bg-indigo-500" style={{ width: `${width}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Meta + Google */}
              <div className="space-y-3">
                <CompactAdsCard title="Meta" data={meta?.totals} benchmark={BENCHMARKS.ads.meta} />
                <CompactAdsCard title="Google" data={google?.totals} benchmark={BENCHMARKS.ads.google} />
              </div>

              {/* 진단 요약 */}
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-slate-900 text-sm font-black">진단</h3>
                  {verdict && (
                    <div className="flex gap-1.5 text-[10px] font-bold">
                      <span className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded">위험 {allDiag.filter(i => i.level === 'bad').length}</span>
                      <span className="bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded">주의 {allDiag.filter(i => i.level === 'warn').length}</span>
                      <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded">양호 {allDiag.filter(i => i.level === 'good').length}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-1">
                  {allDiag
                    .slice()
                    .sort((a, b) => {
                      const order = { bad: 0, warn: 1, good: 2 }
                      return order[a.level] - order[b.level]
                    })
                    .map((item, i) => {
                      const s = diagLevel(item.level)
                      return (
                        <div key={i} className="flex items-start gap-2 text-xs py-1">
                          <span className={`inline-block w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${s.dot}`} />
                          <div className="min-w-0 flex-1">
                            <div className="flex justify-between items-baseline gap-2">
                              <span className="text-slate-700 font-semibold truncate">{item.label}</span>
                              <span className={`font-bold shrink-0 ${s.text}`}>{item.value}</span>
                            </div>
                            <p className="text-slate-500 text-[11px] leading-snug mt-0.5">{item.comment}</p>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            </section>

            {/* 2차 전환 분해 + 전자책 미니 */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <h3 className="text-slate-900 text-sm font-black mb-2">2차 전환 ({resultView}명 기준)</h3>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: '단톡방', value: openchat },
                    { label: '전자책 클릭', value: ebook },
                    { label: '공유', value: share },
                  ].map(row => {
                    const pct = resultView > 0 ? (row.value / resultView) * 100 : 0
                    return (
                      <div key={row.label} className="bg-slate-50 rounded-md px-2 py-1.5 text-center">
                        <div className="text-slate-900 text-lg font-black leading-none">{row.value}</div>
                        <div className="text-slate-500 text-[10px] mt-1">{row.label}</div>
                        <div className="text-indigo-500 text-[10px] font-bold">{pct.toFixed(1)}%</div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-slate-900 text-sm font-black">전자책 수강 (실제 메타코드)</h3>
                  <button onClick={loadEbooks} className="text-[10px] text-slate-400 hover:text-slate-600">↻</button>
                </div>
                {ebooksError && <p className="text-red-500 text-xs">{ebooksError}</p>}
                {ebooks && (
                  <div className="flex items-center gap-3">
                    <div className="text-center pr-3 border-r border-slate-200">
                      <div className="text-indigo-600 text-3xl font-black leading-none">{ebooksTotal}</div>
                      <div className="text-slate-400 text-[10px] mt-1">총 수강생</div>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-1">
                      {ebooks.ebooks.map(e => (
                        <div key={e.id} className="text-[11px] flex justify-between">
                          <span className="text-slate-600 truncate">{String(e.title).replace(/\[무료\/26년 최신버전\]\s*/g, '').slice(0, 14)}</span>
                          <span className="text-slate-900 font-bold shrink-0">{e.students}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* ===== 퍼널 뷰 ===== */}
        {view === 'funnel' && (
          <div className="space-y-6">
            <BenchmarkNote />
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-7 shadow-sm">
                <h2 className="text-slate-900 text-xl font-black mb-1">전체 퍼널</h2>
                <p className="text-slate-500 text-sm mb-6">방문 → 2차 전환 흐름</p>
                <BigFunnelChart steps={funnel} />
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-sm">
                <h2 className="text-slate-900 text-xl font-black mb-1">2차 전환 내역</h2>
                <p className="text-slate-500 text-sm mb-6">결과 확인 {resultView.toLocaleString()}명 기준</p>
                <div className="space-y-4">
                  {[
                    { label: '단톡방', value: openchat, color: 'bg-indigo-500' },
                    { label: '전자책', value: ebook, color: 'bg-purple-500' },
                    { label: '공유', value: share, color: 'bg-pink-500' },
                  ].map(row => {
                    const pct = resultView > 0 ? (row.value / resultView) * 100 : 0
                    return (
                      <div key={row.label}>
                        <div className="flex justify-between items-baseline mb-2">
                          <span className="text-slate-700 font-bold text-base">{row.label}</span>
                          <div className="flex items-baseline gap-2">
                            <span className="text-slate-900 font-black text-2xl">{row.value}</span>
                            <span className="text-indigo-500 font-bold text-sm">{pct.toFixed(1)}%</span>
                          </div>
                        </div>
                        <div className="bg-slate-100 rounded-full h-2.5 overflow-hidden">
                          <div className={`${row.color} h-full rounded-full`} style={{ width: `${Math.min(pct * 3, 100)}%` }} />
                        </div>
                      </div>
                    )
                  })}
                  <div className="border-t border-slate-200 pt-4 mt-4">
                    <div className="flex justify-between items-baseline">
                      <span className="text-slate-900 font-black text-base">총 2차 전환</span>
                      <div>
                        <span className="text-slate-900 font-black text-3xl">{secondaryTotal}</span>
                        <span className="text-slate-500 text-sm ml-1">건</span>
                      </div>
                    </div>
                    <p className="text-slate-400 text-xs mt-1">완료율 {completionRate.toFixed(1)}% · 전체 전환율 {e2e.toFixed(2)}%</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ===== Meta Ads 뷰 ===== */}
        {view === 'meta' && (
          <div className="space-y-6">
            <BenchmarkNote />
            <AdsPanel title="Meta Ads" data={meta?.totals} benchmark={BENCHMARKS.ads.meta} />
            <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-sm">
              <h3 className="text-slate-900 text-xl font-black mb-4">Meta 캠페인별 성과</h3>
              <BigCampaignTable campaigns={meta?.campaigns ?? []} />
            </div>
          </div>
        )}

        {/* ===== Google Ads 뷰 ===== */}
        {view === 'google' && (
          <div className="space-y-6">
            <BenchmarkNote />
            <AdsPanel title="Google Ads" data={google?.totals} benchmark={BENCHMARKS.ads.google} />
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h3 className="text-slate-900 text-base font-black mb-3">Google 캠페인별 성과</h3>
              <BigCampaignTable campaigns={google?.campaigns ?? []} />
            </div>
          </div>
        )}

        {/* ===== 전자책 뷰 ===== */}
        {view === 'ebooks' && (
          <div className="space-y-4">
            <div className="bg-sky-50 border border-sky-200 rounded-lg p-3 text-sky-800 text-xs">
              📚 메타코드 공식 API에서 실제 수강 등록 인원을 실시간 크롤링합니다. 결과 페이지의 전자책 CTA 클릭(GA 이벤트)과는 별개 지표입니다.
            </div>
            {ebooksError && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">{ebooksError}</div>}
            {ebooks && (
              <>
                <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-indigo-600 text-5xl font-black leading-none">{ebooksTotal.toLocaleString()}</div>
                    <div className="text-slate-500 text-xs mt-2 font-semibold">총 전자책 수강생</div>
                  </div>
                  <div className="h-12 w-px bg-slate-200" />
                  <p className="text-slate-500 text-xs">조회: {new Date(ebooks.fetchedAt).toLocaleString('ko-KR')}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {ebooks.ebooks.map(e => {
                    const title = String(e.title).replace(/\[무료\/26년 최신버전\]\s*/g, '')
                    return (
                      <div key={e.id} className="bg-white rounded-xl border border-slate-200 p-4">
                        <div className="text-slate-900 text-3xl font-black">{e.students.toLocaleString()}</div>
                        <div className="text-slate-500 text-xs mt-1 leading-tight line-clamp-2">{title}</div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
            {!ebooks && !ebooksError && <p className="text-slate-400 text-center py-10 text-sm">전자책 데이터 불러오는 중...</p>}
          </div>
        )}

        {/* ===== A/B 테스트 뷰 ===== */}
        {view === 'abtest' && (
          <div className="space-y-6">
            {ab && ab.length > 0 ? (
              <section className="bg-white rounded-2xl border border-slate-200 p-7 shadow-sm">
                <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
                  <div>
                    <h2 className="text-slate-900 text-xl font-black">A/B 테스트 비교</h2>
                    <p className="text-slate-500 text-sm">변형별 퍼널 및 전환율 (최고값 강조)</p>
                  </div>
                  {abWinner && abWinner.rate > 0 && (
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl px-5 py-3 text-white shadow-md shadow-indigo-200">
                      <p className="text-xs opacity-80 font-semibold">E2E 기준 승자</p>
                      <p className="text-base font-black">{VARIANT_LABELS[abWinner.variant]?.name ?? abWinner.variant} — {abWinner.rate.toFixed(1)}%</p>
                    </div>
                  )}
                </div>
                <ABComparisonTable variants={ab} />
              </section>
            ) : (
              <p className="text-slate-400 text-center py-10 text-base">A/B 테스트 데이터가 아직 없습니다</p>
            )}
          </div>
        )}
      </div>
    </main>
  )
}

function DiagnosisSection({ verdict, items }: { verdict: { level: DiagLevel; summary: string }; items: DiagItem[] }) {
  const bad = items.filter(i => i.level === 'bad')
  const warn = items.filter(i => i.level === 'warn')
  const good = items.filter(i => i.level === 'good')

  const topStyle = {
    good: { bg: 'from-green-500 to-emerald-600', icon: '✅', label: '양호' },
    warn: { bg: 'from-yellow-500 to-amber-600', icon: '⚠️', label: '주의' },
    bad: { bg: 'from-red-500 to-rose-600', icon: '🚨', label: '위험' },
  }[verdict.level]

  return (
    <section className="space-y-5">
      {/* 상단 대형 요약 카드 */}
      <div className={`bg-gradient-to-br ${topStyle.bg} rounded-3xl p-8 text-white shadow-lg`}>
        <div className="flex items-start gap-5">
          <div className="text-5xl">{topStyle.icon}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-white/20 rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider">종합 진단</span>
              <span className="bg-white/20 rounded-full px-3 py-1 text-xs font-black">{topStyle.label}</span>
            </div>
            <h2 className="text-2xl font-black leading-tight mb-3">{verdict.summary}</h2>
            <div className="flex gap-4">
              <SummaryStat count={bad.length} label="위험" />
              <SummaryStat count={warn.length} label="주의" />
              <SummaryStat count={good.length} label="양호" />
            </div>
          </div>
        </div>
      </div>

      {/* 섹션별 상세 */}
      {bad.length > 0 && <DiagGroup level="bad" title="🚨 우선 개선이 필요합니다" items={bad} />}
      {warn.length > 0 && <DiagGroup level="warn" title="⚠️ 살펴보세요" items={warn} />}
      {good.length > 0 && <DiagGroup level="good" title="✅ 잘하고 있는 부분" items={good} />}
    </section>
  )
}

function SummaryStat({ count, label }: { count: number; label: string }) {
  return (
    <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
      <span className="text-2xl font-black">{count}</span>
      <span className="text-sm font-semibold ml-1.5 opacity-90">{label}</span>
    </div>
  )
}

function DiagGroup({ level, title, items }: { level: DiagLevel; title: string; items: DiagItem[] }) {
  const style = {
    good: { bar: 'bg-green-500', card: 'border-green-200 bg-green-50/30', badge: 'bg-green-100 text-green-700', label: 'text-green-700' },
    warn: { bar: 'bg-yellow-500', card: 'border-yellow-200 bg-yellow-50/30', badge: 'bg-yellow-100 text-yellow-800', label: 'text-yellow-800' },
    bad: { bar: 'bg-red-500', card: 'border-red-200 bg-red-50/30', badge: 'bg-red-100 text-red-700', label: 'text-red-700' },
  }[level]
  const badgeText = level === 'good' ? '양호' : level === 'warn' ? '주의' : '위험'

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-1.5 h-7 ${style.bar} rounded-full`} />
        <h3 className="text-slate-900 text-xl font-black">{title}</h3>
        <span className="text-slate-400 text-base font-bold">{items.length}건</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((item, i) => (
          <div key={i} className={`bg-white border ${style.card} rounded-2xl p-5 shadow-sm`}>
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className={`${style.badge} text-xs font-black px-2.5 py-1 rounded-full`}>{badgeText}</span>
              <span className={`text-2xl font-black ${style.label}`}>{item.value}</span>
            </div>
            <p className="text-slate-900 font-black text-lg mb-1">{item.label}</p>
            <p className="text-slate-600 text-sm leading-relaxed">{item.comment}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function CompactMetric({ label, value, sub, subColor, accent }: { label: string; value: string | number; sub?: string; subColor?: string; accent?: boolean }) {
  return (
    <div className={`${accent ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-200'} rounded-lg border px-3 py-2`}>
      <div className="text-slate-500 text-[10px] font-bold">{label}</div>
      <div className={`text-lg font-black leading-tight mt-0.5 ${accent ? 'text-indigo-700' : 'text-slate-900'}`}>{value}</div>
      {sub && <div className={`text-[10px] font-bold mt-0.5 ${subColor ?? 'text-slate-500'}`}>{sub}</div>}
    </div>
  )
}

function CompactAdsCard({ title, data, benchmark }: { title: string; data?: AdTotals; benchmark: { ctr: number; cpc: number; cpm: number; cvr: number } }) {
  if (!data || data.spend === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-3">
        <h4 className="text-slate-900 text-xs font-black mb-1">{title}</h4>
        <p className="text-slate-400 text-xs">집행 데이터 없음</p>
      </div>
    )
  }
  const cvr = data.clicks > 0 ? (data.conversions / data.clicks) * 100 : 0
  const ctrCmp = compareBenchmark(data.ctr, benchmark.ctr, true)
  const cpcCmp = compareBenchmark(data.cpc, benchmark.cpc, false)
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-slate-900 text-xs font-black">{title}</h4>
        <span className="text-slate-500 text-[10px] font-bold">₩{data.spend.toLocaleString()}</span>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="text-slate-900 text-sm font-black">{data.ctr}%</div>
          <div className="text-slate-400 text-[10px]">CTR</div>
          <div className={`text-[10px] font-bold ${ctrCmp.level === 'good' ? 'text-green-600' : ctrCmp.level === 'bad' ? 'text-red-500' : 'text-yellow-600'}`}>{ctrCmp.diffPct >= 0 ? '+' : ''}{ctrCmp.diffPct}%</div>
        </div>
        <div>
          <div className="text-slate-900 text-sm font-black">₩{data.cpc.toLocaleString()}</div>
          <div className="text-slate-400 text-[10px]">CPC</div>
          <div className={`text-[10px] font-bold ${cpcCmp.level === 'good' ? 'text-green-600' : cpcCmp.level === 'bad' ? 'text-red-500' : 'text-yellow-600'}`}>{cpcCmp.diffPct >= 0 ? '+' : ''}{cpcCmp.diffPct}%</div>
        </div>
        <div>
          <div className="text-slate-900 text-sm font-black">{cvr.toFixed(1)}%</div>
          <div className="text-slate-400 text-[10px]">전환율</div>
          <div className="text-[10px] text-slate-400">클릭 {data.clicks}</div>
        </div>
      </div>
    </div>
  )
}

function BenchmarkNote() {
  return (
    <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 rounded-2xl p-5 text-sky-900 shadow-sm">
      <p className="text-base font-black mb-1">📘 업종 벤치마크 기준</p>
      <p className="text-sm leading-relaxed opacity-90">
        {BENCHMARK_SOURCE}. 각 지표 옆 <span className="font-bold">업종 대비 ±%</span>는 현재 값과 업종 평균의 차이이며,
        편차 ≥10%(좋음/나쁨 방향)일 때 색으로 강조됩니다.
      </p>
    </div>
  )
}

/* ---------- 서브 컴포넌트 ---------- */

function BigMetric({
  label,
  value,
  subLabel,
  subColor,
  accent,
}: {
  label: string
  value: string | number
  subLabel?: string
  subColor?: string
  accent?: boolean
}) {
  return (
    <div className={`${accent ? 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 shadow-indigo-100' : 'bg-white border-slate-200'} rounded-2xl border p-5 shadow-sm`}>
      <div className="text-slate-500 text-sm font-bold">{label}</div>
      <div className={`text-3xl font-black mt-2 ${accent ? 'text-indigo-700' : 'text-slate-900'}`}>{value}</div>
      {subLabel && <div className={`text-sm font-bold mt-2 ${subColor ?? 'text-slate-500'}`}>{subLabel}</div>}
    </div>
  )
}

function BigFunnelChart({ steps }: { steps: { label: string; value: number }[] }) {
  const BENCH_MAP: Record<string, keyof typeof BENCHMARKS.funnel> = {
    '페이지 방문 → CTA 클릭': 'landing_to_cta',
    'CTA 클릭 → 테스트 시작': 'cta_to_test_start',
    '테스트 시작 → 테스트 완료': 'test_start_to_complete',
    '테스트 완료 → 결과 확인': 'complete_to_result',
    '결과 확인 → 2차 전환': 'result_to_secondary',
  }
  return (
    <div className="space-y-6">
      {steps.map((step, i) => {
        const width = steps[0].value > 0 ? Math.max(Math.round((step.value / steps[0].value) * 100), step.value > 0 ? 3 : 0) : 0
        const prev = i > 0 ? steps[i - 1].value : 0
        const dropoff = i > 0 && prev > 0 ? Math.round(((prev - step.value) / prev) * 100) : 0
        const convRate = i > 0 && prev > 0 ? (step.value / prev) * 100 : 0
        const benchKey = i > 0 ? `${steps[i - 1].label} → ${step.label}` : null
        const benchmarkKey = benchKey ? BENCH_MAP[benchKey] : null
        const benchVal = benchmarkKey ? BENCHMARKS.funnel[benchmarkKey] : null
        const cmp = benchVal !== null && i > 0 ? compareBenchmark(convRate, benchVal, true) : null

        return (
          <div key={i}>
            <div className="flex justify-between items-baseline mb-2.5">
              <span className="text-slate-700 font-bold text-lg">{step.label}</span>
              <div className="flex items-baseline gap-3">
                <span className="text-slate-900 text-2xl font-black">{step.value.toLocaleString()}</span>
                <span className="text-slate-400 text-base">명</span>
                {i > 0 && dropoff > 0 && <span className="text-red-500 font-bold text-base">-{dropoff}%</span>}
              </div>
            </div>
            <div className="bg-slate-100 rounded-full h-6 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: `${width}%` }} />
            </div>
            {cmp && (
              <div className="flex items-center gap-3 mt-2">
                <span className="text-slate-500 text-sm font-semibold">전환 {convRate.toFixed(1)}%</span>
                <span className={`text-sm font-bold ${cmp.level === 'good' ? 'text-green-600' : cmp.level === 'bad' ? 'text-red-500' : 'text-yellow-600'}`}>
                  업종 {benchVal}% · {cmp.label}
                </span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

type AdTotals = {
  spend: number
  impressions: number
  clicks: number
  ctr: number
  cpc: number
  cpm: number
  conversions: number
}

function AdsPanel({
  title,
  data,
  benchmark,
}: {
  title: string
  data?: AdTotals
  benchmark: { ctr: number; cpc: number; cpm: number; cvr: number }
}) {
  if (!data || data.spend === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-sm">
        <h3 className="text-slate-900 text-xl font-black mb-2">{title}</h3>
        <p className="text-slate-400 text-base">아직 집행 데이터가 없습니다</p>
      </div>
    )
  }
  const cvr = data.clicks > 0 ? (data.conversions / data.clicks) * 100 : 0
  const rows: { label: string; value: string; cmp?: ReturnType<typeof compareBenchmark>; bench?: string }[] = [
    { label: '광고비', value: `₩${data.spend.toLocaleString()}` },
    { label: '노출', value: data.impressions.toLocaleString() },
    { label: '클릭', value: data.clicks.toLocaleString() },
    { label: 'CTR', value: `${data.ctr}%`, cmp: compareBenchmark(data.ctr, benchmark.ctr, true), bench: `업종 ${benchmark.ctr}%` },
    { label: 'CPC', value: `₩${data.cpc.toLocaleString()}`, cmp: compareBenchmark(data.cpc, benchmark.cpc, false), bench: `업종 ₩${benchmark.cpc.toLocaleString()}` },
    { label: 'CPM', value: `₩${data.cpm.toLocaleString()}`, cmp: compareBenchmark(data.cpm, benchmark.cpm, false), bench: `업종 ₩${benchmark.cpm.toLocaleString()}` },
    { label: '전환', value: data.conversions.toLocaleString() },
    { label: '전환율', value: `${cvr.toFixed(1)}%`, cmp: compareBenchmark(cvr, benchmark.cvr, true), bench: `업종 ${benchmark.cvr}%` },
  ]

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-sm">
      <h3 className="text-slate-900 text-xl font-black mb-5">{title} · 핵심 지표</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {rows.map(row => (
          <div key={row.label} className="bg-slate-50 rounded-xl p-4">
            <div className="text-slate-500 text-sm font-bold">{row.label}</div>
            <div className="text-slate-900 text-2xl font-black mt-1">{row.value}</div>
            {row.bench && <div className="text-slate-400 text-xs mt-1 font-semibold">{row.bench}</div>}
            {row.cmp && (
              <div className={`text-sm font-bold mt-1 ${row.cmp.level === 'good' ? 'text-green-600' : row.cmp.level === 'bad' ? 'text-red-500' : 'text-yellow-600'}`}>
                {row.cmp.label}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

type Campaign = {
  name: string
  impressions: number
  clicks: number
  spend: number
  ctr: number
  cpc: number
  conversions: number
  [key: string]: unknown
}

function BigCampaignTable({ campaigns }: { campaigns: Campaign[] }) {
  if (campaigns.length === 0) return <p className="text-slate-400 text-base py-4">캠페인 데이터 없음</p>
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-base">
        <thead>
          <tr className="border-b-2 border-slate-200 text-slate-500">
            <th className="text-left py-3.5 pr-3 font-bold">캠페인</th>
            <th className="text-right py-3.5 px-3 font-bold">노출</th>
            <th className="text-right py-3.5 px-3 font-bold">클릭</th>
            <th className="text-right py-3.5 px-3 font-bold">CTR</th>
            <th className="text-right py-3.5 px-3 font-bold">CPC</th>
            <th className="text-right py-3.5 px-3 font-bold">비용</th>
            <th className="text-right py-3.5 pl-3 font-bold">전환</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map(c => (
            <tr key={c.name} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="py-3.5 pr-3 text-slate-800 font-bold truncate max-w-[220px]">{c.name}</td>
              <td className="text-right py-3.5 px-3 text-slate-600">{c.impressions.toLocaleString()}</td>
              <td className="text-right py-3.5 px-3 text-slate-600">{c.clicks.toLocaleString()}</td>
              <td className="text-right py-3.5 px-3 text-slate-600">{c.ctr}%</td>
              <td className="text-right py-3.5 px-3 text-slate-600">₩{c.cpc.toLocaleString()}</td>
              <td className="text-right py-3.5 px-3 text-slate-700 font-bold">₩{c.spend.toLocaleString()}</td>
              <td className="text-right py-3.5 pl-3 text-indigo-600 font-black">{c.conversions}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const AB_STEPS = [
  { key: 'pageView', label: '방문' },
  { key: 'ctaClick', label: 'CTA 클릭' },
  { key: 'testStart', label: '테스트 시작' },
  { key: 'testComplete', label: '테스트 완료' },
  { key: 'resultView', label: '결과 확인' },
] as const

function rate(a: number, b: number) {
  if (b === 0) return '-'
  return `${((a / b) * 100).toFixed(1)}%`
}

function ABComparisonTable({ variants }: { variants: ABTestData[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-base">
        <thead>
          <tr className="border-b-2 border-slate-200 text-slate-500">
            <th className="text-left py-3.5 font-bold">지표</th>
            {variants.map(v => (
              <th key={v.variant} className="text-right py-3.5 px-4 font-bold">
                <span className="inline-block w-3 h-3 rounded-full mr-2 align-middle" style={{ background: VARIANT_LABELS[v.variant]?.color }} />
                {VARIANT_LABELS[v.variant]?.name ?? v.variant}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {AB_STEPS.map(step => {
            const values = variants.map(v => v[step.key] as number)
            const max = Math.max(...values)
            return (
              <tr key={step.key} className="border-b border-slate-100">
                <td className="py-3.5 text-slate-700 font-bold">{step.label}</td>
                {variants.map((v, i) => (
                  <td key={v.variant} className={`text-right py-3.5 px-4 font-bold ${values[i] === max && max > 0 ? 'text-indigo-600 text-lg' : 'text-slate-700'}`}>
                    {(v[step.key] as number).toLocaleString()}
                  </td>
                ))}
              </tr>
            )
          })}
          {[
            { label: '방문→CTA', calc: (d: ABTestData) => rate(d.ctaClick, d.pageView) },
            { label: 'CTA→시작', calc: (d: ABTestData) => rate(d.testStart, d.ctaClick) },
            { label: '시작→완료', calc: (d: ABTestData) => rate(d.testComplete, d.testStart) },
            { label: '완료→결과', calc: (d: ABTestData) => rate(d.resultView, d.testComplete) },
            { label: '결과→2차', calc: (d: ABTestData) => rate(d.openchatClick + d.ebookClick + d.shareClick, d.resultView) },
            { label: 'E2E', calc: (d: ABTestData) => rate(d.resultView, d.pageView) },
          ].map(row => {
            const vals = variants.map(v => row.calc(v))
            const numVals = vals.map(x => (x === '-' ? 0 : parseFloat(x)))
            const maxIdx = numVals.indexOf(Math.max(...numVals))
            return (
              <tr key={row.label} className="border-b border-slate-100 bg-slate-50/60">
                <td className="py-3.5 text-slate-700 font-bold">{row.label}</td>
                {vals.map((x, i) => (
                  <td key={variants[i].variant} className={`text-right py-3.5 px-4 font-bold ${i === maxIdx && x !== '-' ? 'text-green-600 text-lg' : 'text-slate-700'}`}>
                    {x} {i === maxIdx && x !== '-' ? '🏆' : ''}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
