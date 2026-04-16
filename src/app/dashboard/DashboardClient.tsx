'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'

const PASS = '720972'

type EbookItem = {
  id: number
  title: string
  students: number
}

type EbooksData = {
  ebooks: EbookItem[]
  fetchedAt: string
}

type GA4Data = {
  events: Record<string, { events: number; users: number }>
  totalUsers: number
  startDate: string
  endDate: string
}

type MetaCampaign = {
  name: string
  impressions: number
  clicks: number
  spend: number
  ctr: number
  cpc: number
  cpm: number
  conversions: number
  linkClicks: number
  pageViews: number
}

type MetaAdsData = {
  campaigns: MetaCampaign[]
  totals: {
    impressions: number
    clicks: number
    spend: number
    ctr: number
    cpc: number
    cpm: number
    conversions: number
    linkClicks: number
    pageViews: number
  }
  since: string
  until: string
}

type GoogleAdsCampaign = {
  name: string
  impressions: number
  clicks: number
  spend: number
  ctr: number
  cpc: number
  conversions: number
}

type GoogleAdsData = {
  campaigns: GoogleAdsCampaign[]
  totals: {
    impressions: number
    clicks: number
    spend: number
    ctr: number
    cpc: number
    cpm: number
    conversions: number
  }
  since: string
  until: string
}

/* ─── 광고 성과 자동 진단 ─── */
type DiagLevel = 'good' | 'warn' | 'bad'
type DiagItem = { label: string; level: DiagLevel; value: string; comment: string }

function diagLevel(level: DiagLevel) {
  if (level === 'good') return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', dot: 'bg-green-500', badge: '양호' }
  if (level === 'warn') return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', dot: 'bg-yellow-500', badge: '주의' }
  return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', dot: 'bg-red-500', badge: '위험' }
}

function evaluateAds(label: string, totals: { impressions: number; clicks: number; spend: number; ctr: number; cpc: number; cpm: number; conversions: number }): DiagItem[] {
  const items: DiagItem[] = []
  const { impressions, clicks, spend, ctr, cpc, cpm, conversions } = totals
  if (spend === 0 && impressions === 0) return []

  // CPM
  const cpmLevel: DiagLevel = cpm < 10000 ? 'good' : cpm < 20000 ? 'warn' : 'bad'
  items.push({
    label: `${label} CPM`,
    level: cpmLevel,
    value: `${cpm.toLocaleString()}원`,
    comment: cpmLevel === 'good' ? '노출 단가 효율적' : cpmLevel === 'warn' ? '노출 단가 보통 — 타겟 확장 고려' : '노출 단가 높음 — 타겟이 너무 좁거나 경쟁 과열',
  })

  // CTR
  const ctrLevel: DiagLevel = ctr >= 2 ? 'good' : ctr >= 1 ? 'warn' : 'bad'
  items.push({
    label: `${label} CTR`,
    level: ctrLevel,
    value: `${ctr}%`,
    comment: ctrLevel === 'good' ? '광고 소재 반응 좋음' : ctrLevel === 'warn' ? '소재 반응 보통 — A/B 테스트 권장' : '소재 반응 낮음 — 문구/이미지 교체 필요',
  })

  // CPC
  const cpcLevel: DiagLevel = cpc < 500 ? 'good' : cpc < 1500 ? 'warn' : 'bad'
  items.push({
    label: `${label} CPC`,
    level: cpcLevel,
    value: `${cpc.toLocaleString()}원`,
    comment: cpcLevel === 'good' ? '클릭 단가 저렴' : cpcLevel === 'warn' ? '클릭 단가 보통' : '클릭 단가 높음 — 소재 또는 타겟 개선 필요',
  })

  // Conversion rate
  if (clicks > 0) {
    const cvr = (conversions / clicks) * 100
    const cvrLevel: DiagLevel = cvr >= 5 ? 'good' : cvr >= 2 ? 'warn' : 'bad'
    items.push({
      label: `${label} 전환율`,
      level: cvrLevel,
      value: `${cvr.toFixed(1)}%`,
      comment: cvrLevel === 'good' ? '랜딩→전환 잘 되고 있음' : cvrLevel === 'warn' ? '전환 보통 — 랜딩페이지 개선 여지' : '전환 낮음 — 랜딩/오퍼 점검 필수',
    })
  }

  return items
}

function evaluateFunnel(funnelSteps: { label: string; value: number }[]): DiagItem[] {
  const items: DiagItem[] = []
  for (let i = 1; i < funnelSteps.length; i++) {
    const prev = funnelSteps[i - 1].value
    if (prev === 0) continue
    const drop = ((prev - funnelSteps[i].value) / prev) * 100
    if (drop <= 0) continue
    const level: DiagLevel = drop < 30 ? 'good' : drop < 60 ? 'warn' : 'bad'
    items.push({
      label: `${funnelSteps[i - 1].label} → ${funnelSteps[i].label}`,
      level,
      value: `-${Math.round(drop)}%`,
      comment: level === 'good' ? '이탈 적음' : level === 'warn' ? '이탈 보통 — 개선 여지 있음' : '이탈 심각 — 이 구간 집중 개선 필요',
    })
  }
  return items
}

function getOverallVerdict(items: DiagItem[]): { level: DiagLevel; summary: string } {
  if (items.length === 0) return { level: 'warn', summary: '데이터 부족 — 광고 집행 후 다시 확인하세요' }
  const bad = items.filter(i => i.level === 'bad').length
  const warn = items.filter(i => i.level === 'warn').length
  const good = items.filter(i => i.level === 'good').length

  // Pattern detection
  const ctrOk = items.some(i => i.label.includes('CTR') && i.level !== 'bad')
  const cvrBad = items.some(i => i.label.includes('전환율') && i.level === 'bad')
  const cpmBad = items.some(i => i.label.includes('CPM') && i.level === 'bad')

  if (ctrOk && cvrBad) return { level: 'bad', summary: '광고 소재는 괜찮지만 랜딩/전환 구조에 문제 — 랜딩페이지 개선 우선' }
  if (cpmBad && ctrOk) return { level: 'warn', summary: '소재 반응은 OK, 노출 단가가 높음 — 타겟 확장 필요' }
  if (bad >= 3) return { level: 'bad', summary: '전반적으로 성과 부진 — 소재·타겟·랜딩 전면 점검 필요' }
  if (bad === 0 && warn <= 2) return { level: 'good', summary: '전반적으로 양호 — 현재 전략 유지하며 세부 최적화' }
  return { level: 'warn', summary: `양호 ${good}개 / 주의 ${warn}개 / 위험 ${bad}개 — 위험 항목 우선 개선` }
}

export default function DashboardPage() {
  const [authed, setAuthed] = useState(false)
  const [checked, setChecked] = useState(false)
  const [input, setInput] = useState('')
  const [data, setData] = useState<GA4Data | null>(null)
  const [metaData, setMetaData] = useState<MetaAdsData | null>(null)
  const [metaLoading, setMetaLoading] = useState(false)
  const [metaError, setMetaError] = useState('')
  const [gadsData, setGadsData] = useState<GoogleAdsData | null>(null)
  const [gadsLoading, setGadsLoading] = useState(false)
  const [gadsError, setGadsError] = useState('')
  const [ebooksData, setEbooksData] = useState<EbooksData | null>(null)
  const [ebooksLoading, setEbooksLoading] = useState(false)
  const [ebooksError, setEbooksError] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [startDate, setStartDate] = useState('2026-03-03')
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10))

  const fetchEbooks = useCallback(async () => {
    setEbooksLoading(true)
    setEbooksError('')
    try {
      const res = await fetch(`/api/metacode-ebooks?pass=${PASS}`)
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error || '메타코드 API 오류')
      }
      const json = await res.json()
      setEbooksData(json)
    } catch (err) {
      setEbooksError(err instanceof Error ? err.message : '전자책 데이터를 불러올 수 없습니다')
    }
    setEbooksLoading(false)
  }, [])

  const fetchGoogleAds = useCallback(async (start?: string, end?: string) => {
    const s = start ?? startDate
    const e = end ?? endDate
    setGadsLoading(true)
    setGadsError('')
    try {
      const res = await fetch(`/api/google-ads?pass=${PASS}&since=${s}&until=${e}`)
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.detail || json.error || 'Google Ads API 오류')
      }
      const json = await res.json()
      setGadsData(json)
    } catch (err) {
      setGadsError(err instanceof Error ? err.message : 'Google Ads 데이터를 불러올 수 없습니다')
    }
    setGadsLoading(false)
  }, [startDate, endDate])

  const fetchMetaAds = useCallback(async (start?: string, end?: string) => {
    const s = start ?? startDate
    const e = end ?? endDate
    setMetaLoading(true)
    setMetaError('')
    try {
      const res = await fetch(`/api/meta-ads?pass=${PASS}&since=${s}&until=${e}`)
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.detail || json.error || 'Meta API 오류')
      }
      const json = await res.json()
      setMetaData(json)
    } catch (err) {
      setMetaError(err instanceof Error ? err.message : 'Meta 데이터를 불러올 수 없습니다')
    }
    setMetaLoading(false)
  }, [startDate, endDate])

  const fetchData = useCallback(async (start?: string, end?: string) => {
    const s = start ?? startDate
    const e = end ?? endDate
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/ga4?pass=${PASS}&start=${s}&end=${e}`)
      if (!res.ok) throw new Error('API 오류')
      const json = await res.json()
      setData(json)
    } catch {
      setError('데이터를 불러올 수 없습니다')
    }
    setLoading(false)
  }, [startDate, endDate])

  const fetchAll = useCallback((start?: string, end?: string) => {
    fetchData(start, end)
    fetchMetaAds(start, end)
    fetchGoogleAds(start, end)
    fetchEbooks()
  }, [fetchData, fetchMetaAds, fetchGoogleAds, fetchEbooks])

  useEffect(() => {
    const saved = sessionStorage.getItem('dashboard_auth') === 'true'
    if (saved) {
      setAuthed(true)
      fetchAll()
    }
    setChecked(true)
  }, [fetchAll])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (input === PASS) {
      sessionStorage.setItem('dashboard_auth', 'true')
      setAuthed(true)
      fetchAll()
    }
  }

  if (!checked) {
    return <main className="min-h-screen bg-slate-50" />
  }

  if (!authed) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="w-full max-w-xs text-center">
          <h1 className="text-slate-900 text-lg font-bold mb-6">AIMBTI 대시보드</h1>
          <input
            type="password" value={input} onChange={e => setInput(e.target.value)}
            placeholder="비밀번호" autoFocus
            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-center text-slate-900 text-lg tracking-widest mb-3 focus:outline-none focus:border-indigo-500"
          />
          <button type="submit" className="w-full bg-indigo-500 text-white rounded-xl py-3 font-bold">확인</button>
        </form>
      </main>
    )
  }

  if (loading && !data) {
    return <main className="min-h-screen bg-slate-50 flex items-center justify-center"><p className="text-slate-400">GA4 데이터 불러오는 중...</p></main>
  }

  if (error && !data) {
    return <main className="min-h-screen bg-slate-50 flex items-center justify-center"><p className="text-red-400">{error}</p></main>
  }

  if (!data) return null

  const ev = data.events
  const get = (name: string) => ev[name] ?? { events: 0, users: 0 }
  const pct = (v: number, base: number) => base === 0 ? '-' : `${Math.round((v / base) * 100)}%`

  const totalUsers = data.totalUsers
  const testStart = get('test_start').users
  const testComplete = get('test_complete').users
  const resultView = get('result_view').users
  const openchat = get('openchat_click').users
  const ebook = get('ebook_click').users
  const share = get('share_click').users
  const ctaClick = get('cta_click').users

  const funnel = [
    { label: '페이지 방문', value: totalUsers },
    { label: '시작 버튼 클릭', value: ctaClick },
    { label: '첫 문항 응답', value: testStart },
    { label: '20문항 완료', value: testComplete },
    { label: '결과 확인', value: resultView },
  ]

  // 결과 확인 이후 병렬 행동 (퍼널 진단용)
  const resultActions = [
    { label: '전자책 클릭', value: ebook },
    { label: '오픈채팅 클릭', value: openchat },
    { label: '공유 클릭', value: share },
  ]

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 max-w-lg mx-auto">
      {/* 탭 */}
      <div className="flex gap-2 mb-4">
        <div className="px-4 py-2 rounded-xl text-sm font-bold bg-indigo-600 text-white">
          퍼널 · 광고
        </div>
        <Link href="/dashboard/traffic" className="px-4 py-2 rounded-xl text-sm font-medium bg-white border border-slate-200 text-slate-500 hover:bg-slate-100">
          트래픽 분석
        </Link>
        <button onClick={() => fetchAll()} disabled={loading} className="ml-auto text-xs text-slate-500 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-100">
          {loading ? '...' : '↻'}
        </button>
      </div>

      {/* 날짜 선택 */}
      <div className="flex items-center gap-2 mb-6">
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-sm focus:outline-none focus:border-indigo-500"
        />
        <span className="text-slate-400 text-sm">~</span>
        <input
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-sm focus:outline-none focus:border-indigo-500"
        />
        <button
          onClick={() => fetchAll(startDate, endDate)}
          className="bg-indigo-500 text-white rounded-xl px-4 py-2 text-sm font-bold hover:bg-indigo-600"
        >
          조회
        </button>
      </div>

      {/* 핵심 숫자 */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
          <div className="text-3xl font-black text-slate-900">{totalUsers}</div>
          <div className="text-slate-400 text-xs mt-1">총 방문자</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
          <div className="text-3xl font-black text-indigo-500">{testComplete}</div>
          <div className="text-slate-400 text-xs mt-1">테스트 완료</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
          <div className="text-3xl font-black text-purple-500">{resultView}</div>
          <div className="text-slate-400 text-xs mt-1">결과 확인</div>
        </div>
      </div>

      {/* 전체 퍼널 */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 mb-4">
        <h2 className="text-slate-900 font-bold text-sm mb-4">전체 퍼널</h2>
        <div className="space-y-3">
          {funnel.map((step, i) => {
            const width = Math.max(Math.round((step.value / funnel[0].value) * 100), step.value > 0 ? 3 : 0)
            const dropoff = i > 0 && funnel[i - 1].value > 0
              ? Math.round(((funnel[i - 1].value - step.value) / funnel[i - 1].value) * 100)
              : 0
            return (
              <div key={i}>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-slate-600 text-xs">{step.label}</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-slate-900 text-sm font-bold">{step.value}명</span>
                    {i > 0 && dropoff > 0 && (
                      <span className="text-red-500 text-xs font-medium">-{dropoff}%</span>
                    )}
                  </div>
                </div>
                <div className="bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 퍼널 진단 */}
      {(() => {
        const funnelDiag = evaluateFunnel(funnel)
        // 결과 확인 기준 병렬 행동 전환율 진단
        const actionDiag: DiagItem[] = resultView > 0 ? resultActions.map(action => {
          const rate = (action.value / resultView) * 100
          const level: DiagLevel = rate >= 15 ? 'good' : rate >= 5 ? 'warn' : 'bad'
          return {
            label: `결과 확인 → ${action.label}`,
            level,
            value: `${rate.toFixed(1)}%`,
            comment: level === 'good' ? '전환 양호' : level === 'warn' ? '전환 보통 — CTA 강화 고려' : '전환 낮음 — 노출/문구 개선 필요',
          }
        }) : []
        const allDiag = [...funnelDiag, ...actionDiag]
        if (allDiag.length === 0) return null
        const verdict = getOverallVerdict(allDiag)
        const vs = diagLevel(verdict.level)
        return (
          <section className={`${vs.bg} border ${vs.border} rounded-2xl p-5 mb-4`}>
            <h3 className={`font-bold text-base mb-2 ${vs.text}`}>퍼널 진단</h3>
            <p className={`text-base font-medium mb-3 ${vs.text}`}>{verdict.summary}</p>
            <div className="space-y-3">
              {funnelDiag.map((item, i) => {
                const s = diagLevel(item.level)
                return (
                  <div key={i} className="flex items-start gap-2">
                    <span className={`inline-block w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${s.dot}`} />
                    <div className="min-w-0">
                      <span className="text-slate-700 text-sm font-semibold">{item.label} {item.value}</span>
                      <span className="text-slate-500 text-sm"> — {item.comment}</span>
                    </div>
                  </div>
                )
              })}
            </div>
            {actionDiag.length > 0 && (
              <>
                <div className="border-t border-slate-200/50 mt-4 pt-4">
                  <p className="text-slate-600 text-sm font-bold mb-3">결과 페이지 전환 (결과 확인 {resultView}명 기준)</p>
                  <div className="space-y-3">
                    {actionDiag.map((item, i) => {
                      const s = diagLevel(item.level)
                      return (
                        <div key={i} className="flex items-start gap-2">
                          <span className={`inline-block w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${s.dot}`} />
                          <div className="min-w-0">
                            <span className="text-slate-700 text-sm font-semibold">{item.label} {item.value}</span>
                            <span className="text-slate-500 text-sm"> — {item.comment}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </>
            )}
            <p className="text-slate-400 text-sm mt-3">* 교육/AI 업종 벤치마크 기반 참고 지표</p>
          </section>
        )
      })()}

      {/* 결과 페이지 전환 */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 mb-4">
        <h2 className="text-slate-900 font-bold text-sm mb-1">결과 → 행동 전환</h2>
        <p className="text-slate-400 text-xs mb-4">결과 확인 {resultView}명 기준</p>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 text-center">
            <div className="text-3xl font-black text-yellow-600">{openchat}</div>
            <div className="text-slate-500 text-sm mt-1">오픈채팅</div>
            <div className="text-yellow-600 text-base font-bold mt-1">{pct(openchat, resultView)}</div>
          </div>
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 text-center">
            <div className="text-3xl font-black text-indigo-600">{ebook}</div>
            <div className="text-slate-500 text-sm mt-1">전자책</div>
            <div className="text-indigo-600 text-base font-bold mt-1">{pct(ebook, resultView)}</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
            <div className="text-3xl font-black text-green-600">{share}</div>
            <div className="text-slate-500 text-sm mt-1">공유</div>
            <div className="text-green-600 text-base font-bold mt-1">{pct(share, resultView)}</div>
          </div>
        </div>
      </section>

      {/* Meta Ads */}
      <div className="border-t border-slate-200 mt-6 pt-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-slate-900 font-bold">Meta Ads</h2>
            {metaData && <p className="text-slate-400 text-xs mt-0.5">{metaData.since} ~ {metaData.until}</p>}
          </div>
          <button onClick={() => fetchMetaAds()} disabled={metaLoading} className="text-xs text-slate-500 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-100">
            {metaLoading ? '...' : '↻'}
          </button>
        </div>

        {metaError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600 mb-4">{metaError}</div>
        )}

        {(() => {
          const t = metaData?.totals ?? { impressions: 0, clicks: 0, spend: 0, ctr: 0, cpc: 0, cpm: 0, conversions: 0, linkClicks: 0, pageViews: 0 }
          const campaigns = metaData?.campaigns ?? []
          return (
            <>
              {/* 핵심 지표 카드 */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center">
                  <div className="text-2xl font-black text-slate-900">{t.spend.toLocaleString()}</div>
                  <div className="text-slate-400 text-sm mt-1">총 광고비(원)</div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center">
                  <div className="text-3xl font-black text-blue-500">{t.clicks.toLocaleString()}</div>
                  <div className="text-slate-400 text-sm mt-1">클릭</div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center">
                  <div className="text-3xl font-black text-green-500">{t.conversions}</div>
                  <div className="text-slate-400 text-sm mt-1">전환</div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5 text-center">
                  <div className="text-3xl font-black text-purple-600">{t.clicks > 0 ? ((t.conversions / t.clicks) * 100).toFixed(1) : 0}%</div>
                  <div className="text-slate-400 text-sm mt-1">전환율 (전환/클릭)</div>
                </div>
              </div>

              {/* 효율 지표 */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-50 rounded-2xl p-5 text-center">
                  <div className="text-2xl font-black text-slate-900">{t.impressions.toLocaleString()}</div>
                  <div className="text-slate-400 text-sm mt-1">노출</div>
                </div>
                <div className="bg-slate-50 rounded-2xl p-5 text-center">
                  <div className="text-2xl font-black text-slate-900">{t.ctr}%</div>
                  <div className="text-slate-400 text-sm mt-1">CTR (클릭률)</div>
                </div>
                <div className="bg-slate-50 rounded-2xl p-5 text-center">
                  <div className="text-2xl font-black text-slate-900">{t.cpc.toLocaleString()}</div>
                  <div className="text-slate-400 text-sm mt-1">CPC (클릭당비용/원)</div>
                </div>
                <div className="bg-slate-50 rounded-2xl p-5 text-center">
                  <div className="text-2xl font-black text-slate-900">{t.cpm.toLocaleString()}</div>
                  <div className="text-slate-400 text-sm mt-1">CPM (1000노출비용/원)</div>
                </div>
              </div>

              {/* Meta Ads 진단 */}
              {(() => {
                const diagItems = evaluateAds('Meta', t)
                if (diagItems.length === 0) return null
                const verdict = getOverallVerdict(diagItems)
                const vs = diagLevel(verdict.level)
                return (
                  <div className={`${vs.bg} border ${vs.border} rounded-2xl p-5 mb-2`}>
                    <h3 className={`font-bold text-base mb-2 ${vs.text}`}>Meta Ads 진단</h3>
                    <p className={`text-base font-medium mb-3 ${vs.text}`}>{verdict.summary}</p>
                    <div className="space-y-3">
                      {diagItems.map((item, i) => {
                        const s = diagLevel(item.level)
                        return (
                          <div key={i} className="flex items-start gap-2">
                            <span className={`inline-block w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${s.dot}`} />
                            <div className="min-w-0">
                              <span className="text-slate-700 text-sm font-semibold">{item.label} {item.value}</span>
                              <span className="text-slate-500 text-sm"> — {item.comment}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <p className="text-slate-400 text-sm mt-3">* 교육/AI 업종 벤치마크 기반 참고 지표</p>
                    <button
                      onClick={() => {
                        const prompt = `아래는 우리 Meta(Instagram/Facebook) 광고 성과 데이터야. 교육/AI 업종 광고 전문가 관점에서 딱 3줄로 분석해줘.

[서비스] AI 시대 생존력 진단 (무료 테스트 → 결과 → 전자책/오픈채팅 전환) | 타겟: 직장인, 취준생

[Meta Ads] (${metaData?.since} ~ ${metaData?.until})
광고비 ${t.spend.toLocaleString()}원 | 노출 ${t.impressions.toLocaleString()} | 클릭 ${t.clicks} | CTR ${t.ctr}% | CPC ${t.cpc.toLocaleString()}원 | CPM ${t.cpm.toLocaleString()}원 | 전환 ${t.conversions}건 | 전환율 ${t.clicks > 0 ? ((t.conversions / t.clicks) * 100).toFixed(1) : 0}%

[답변 형식] 반드시 아래 3줄만 답변해:
1줄: 현재 상태 한줄 진단 (업종 평균 대비 수준)
2줄: 가장 큰 문제점 + 원인
3줄: 지금 바로 해야 할 액션 1가지`
                        navigator.clipboard.writeText(prompt)
                        alert('Claude에 붙여넣기하세요! (프롬프트가 복사되었습니다)')
                      }}
                      className="w-full mt-3 bg-white/80 border border-slate-300 rounded-xl py-2.5 text-sm font-bold text-slate-700 hover:bg-white transition"
                    >
                      Claude에게 심층 분석 요청하기 (복사)
                    </button>
                  </div>
                )
              })()}
            </>
          )
        })()}
      </div>

      {/* Google Ads */}
      <div className="border-t border-slate-200 mt-6 pt-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-slate-900 font-bold">Google Ads</h2>
            {gadsData && <p className="text-slate-400 text-xs mt-0.5">{gadsData.since} ~ {gadsData.until}</p>}
          </div>
          <button onClick={() => fetchGoogleAds()} disabled={gadsLoading} className="text-xs text-slate-500 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-100">
            {gadsLoading ? '...' : '↻'}
          </button>
        </div>

        {gadsError && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-700 mb-4">신청 완료 — Google Ads API 승인 대기중</div>
        )}

        {(() => {
          const t = gadsData?.totals ?? { impressions: 0, clicks: 0, spend: 0, ctr: 0, cpc: 0, cpm: 0, conversions: 0 }
          const campaigns = gadsData?.campaigns ?? []
          return (
            <>
              {/* 핵심 지표 카드 */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center">
                  <div className="text-2xl font-black text-slate-900">{t.spend.toLocaleString()}</div>
                  <div className="text-slate-400 text-sm mt-1">총 광고비(원)</div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center">
                  <div className="text-3xl font-black text-blue-500">{t.clicks.toLocaleString()}</div>
                  <div className="text-slate-400 text-sm mt-1">클릭</div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center">
                  <div className="text-3xl font-black text-green-500">{t.conversions}</div>
                  <div className="text-slate-400 text-sm mt-1">전환</div>
                </div>
              </div>

              {/* 효율 지표 */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-50 rounded-2xl p-5 text-center">
                  <div className="text-2xl font-black text-slate-900">{t.impressions.toLocaleString()}</div>
                  <div className="text-slate-400 text-sm mt-1">노출</div>
                </div>
                <div className="bg-slate-50 rounded-2xl p-5 text-center">
                  <div className="text-2xl font-black text-slate-900">{t.ctr}%</div>
                  <div className="text-slate-400 text-sm mt-1">CTR (클릭률)</div>
                </div>
                <div className="bg-slate-50 rounded-2xl p-5 text-center">
                  <div className="text-2xl font-black text-slate-900">{t.cpc.toLocaleString()}</div>
                  <div className="text-slate-400 text-sm mt-1">CPC (클릭당비용/원)</div>
                </div>
                <div className="bg-slate-50 rounded-2xl p-5 text-center">
                  <div className="text-2xl font-black text-slate-900">{t.cpm.toLocaleString()}</div>
                  <div className="text-slate-400 text-sm mt-1">CPM (1000노출비용/원)</div>
                </div>
              </div>

              {/* Google Ads 진단 */}
              {(() => {
                const diagItems = evaluateAds('Google', t)
                const hasDiag = diagItems.length > 0
                const verdict = hasDiag ? getOverallVerdict(diagItems) : null
                const vs = verdict ? diagLevel(verdict.level) : { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700', dot: '' }
                return (
                  <div className={`${vs.bg} border ${vs.border} rounded-2xl p-5 mb-2`}>
                    <h3 className={`font-bold text-base mb-2 ${vs.text}`}>Google Ads 진단</h3>
                    {verdict && <p className={`text-base font-medium mb-3 ${vs.text}`}>{verdict.summary}</p>}
                    {!hasDiag && <p className="text-slate-400 text-sm mb-3">데이터가 쌓이면 자동 진단이 표시됩니다.</p>}
                    {hasDiag && (
                      <div className="space-y-3">
                        {diagItems.map((item, i) => {
                          const s = diagLevel(item.level)
                          return (
                            <div key={i} className="flex items-start gap-2">
                              <span className={`inline-block w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${s.dot}`} />
                              <div className="min-w-0">
                                <span className="text-slate-700 text-sm font-semibold">{item.label} {item.value}</span>
                                <span className="text-slate-500 text-sm"> — {item.comment}</span>
                              </div>
                            </div>
                          )
                        })}
                        <p className="text-slate-400 text-sm mt-3">* 교육/AI 업종 벤치마크 기반 참고 지표</p>
                      </div>
                    )}
                    <button
                      onClick={() => {
                        const gt = gadsData?.totals ?? { impressions: 0, clicks: 0, spend: 0, ctr: 0, cpc: 0, cpm: 0, conversions: 0 }
                        const prompt = `아래는 우리 Google Ads 광고 성과 데이터야. 교육/AI 업종 광고 전문가 관점에서 딱 3줄로 분석해줘.

[서비스] AI 시대 생존력 진단 (무료 테스트 → 결과 → 전자책/오픈채팅 전환) | 타겟: 직장인, 취준생

[Google Ads] (${gadsData?.since} ~ ${gadsData?.until})
광고비 ${gt.spend.toLocaleString()}원 | 노출 ${gt.impressions.toLocaleString()} | 클릭 ${gt.clicks} | CTR ${gt.ctr}% | CPC ${gt.cpc.toLocaleString()}원 | CPM ${gt.cpm.toLocaleString()}원 | 전환 ${gt.conversions}건 | 전환율 ${gt.clicks > 0 ? ((gt.conversions / gt.clicks) * 100).toFixed(1) : 0}%

[답변 형식] 반드시 아래 3줄만 답변해:
1줄: 현재 상태 한줄 진단 (업종 평균 대비 수준)
2줄: 가장 큰 문제점 + 원인
3줄: 지금 바로 해야 할 액션 1가지`
                        navigator.clipboard.writeText(prompt)
                        alert('Claude에 붙여넣기하세요! (프롬프트가 복사되었습니다)')
                      }}
                      className="w-full mt-3 bg-white/80 border border-slate-300 rounded-xl py-2.5 text-sm font-bold text-slate-700 hover:bg-white transition"
                    >
                      Claude에게 심층 분석 요청하기 (복사)
                    </button>
                  </div>
                )
              })()}
            </>
          )
        })()}
      </div>

      {/* 메타코드 전자책 수강생 */}
      <div className="border-t border-slate-200 mt-6 pt-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-slate-900 font-bold">메타코드 전자책 수강생 (크롤링)</h2>
            {ebooksData && <p className="text-slate-400 text-xs mt-0.5">조회: {new Date(ebooksData.fetchedAt).toLocaleString('ko-KR')}</p>}
          </div>
          <button onClick={() => fetchEbooks()} disabled={ebooksLoading} className="text-xs text-slate-500 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-100">
            {ebooksLoading ? '...' : '↻'}
          </button>
        </div>

        {ebooksError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600 mb-4">{ebooksError}</div>
        )}

        {ebooksData && (
          <>
            <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center mb-4">
              <div className="text-4xl font-black text-indigo-500">
                {ebooksData.ebooks.reduce((sum, e) => sum + e.students, 0)}
              </div>
              <div className="text-slate-400 text-sm mt-1">총 전자책 수강생</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {ebooksData.ebooks.map((ebook) => {
                const shortTitle = ebook.title
                  .replace(/\[무료\/26년 최신버전\]\s*/g, '')
                  .replace(/\[무료\/26년 최신버전\]\s*/g, '')
                return (
                  <div key={ebook.id} className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
                    <div className="text-3xl font-black text-slate-900">{ebook.students}</div>
                    <div className="text-slate-500 text-xs mt-1 leading-tight">{shortTitle}</div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      <p className="text-center text-slate-400 text-xs pb-4">
        GA4 + Meta Ads + Google Ads + 메타코드 API · 새로고침 시 최신 반영
      </p>
    </main>
  )
}
