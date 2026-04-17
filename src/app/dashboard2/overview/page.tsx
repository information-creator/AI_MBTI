'use client'

import { useState, useEffect, useCallback } from 'react'
import { useDashboardDates } from '../layout'
import { fetchGA4, fetchMetaAds, fetchGoogleAds } from '@/lib/dashboard/api'
import { evaluateAds, evaluateFunnel, getOverallVerdict, diagLevel } from '@/lib/dashboard/diagnostics'
import { BENCHMARKS, compareBenchmark } from '@/lib/dashboard/benchmarks'
import type { GA4Data, MetaAdsData, GoogleAdsData, DiagItem, DiagLevel } from '@/lib/dashboard/types'
import MetricCard from '@/components/dashboard/MetricCard'
import FunnelChart from '@/components/dashboard/FunnelChart'
import DiagnosticPanel from '@/components/dashboard/DiagnosticPanel'

export default function OverviewPage() {
  const { startDate, endDate } = useDashboardDates()
  const [ga4, setGa4] = useState<GA4Data | null>(null)
  const [meta, setMeta] = useState<MetaAdsData | null>(null)
  const [google, setGoogle] = useState<GoogleAdsData | null>(null)
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const [g, m, goog] = await Promise.allSettled([
      fetchGA4(startDate, endDate),
      fetchMetaAds(startDate, endDate),
      fetchGoogleAds(startDate, endDate),
    ])
    if (g.status === 'fulfilled') setGa4(g.value)
    if (m.status === 'fulfilled') setMeta(m.value)
    if (goog.status === 'fulfilled') setGoogle(goog.value)
    setLoading(false)
  }, [startDate, endDate])

  useEffect(() => { load() }, [load])

  if (loading && !ga4) return <p className="text-slate-400 text-center py-10">데이터 불러오는 중...</p>

  // 광고 합산
  const totalSpend = (meta?.totals.spend ?? 0) + (google?.totals.spend ?? 0)
  const totalClicks = (meta?.totals.clicks ?? 0) + (google?.totals.clicks ?? 0)
  const totalImpressions = (meta?.totals.impressions ?? 0) + (google?.totals.impressions ?? 0)
  const blendedCTR = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100) : 0
  const blendedCPC = totalClicks > 0 ? Math.round(totalSpend / totalClicks) : 0

  // 퍼널
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

  // 유효 CPA
  const effectiveCPA = secondaryTotal > 0 ? Math.round(totalSpend / secondaryTotal) : 0
  const cpaCmp = effectiveCPA > 0 ? compareBenchmark(effectiveCPA, BENCHMARKS.overall.cpa_target, false) : null

  // 종합 진단
  const allDiag: DiagItem[] = [
    ...evaluateFunnel(funnel),
    ...(meta ? evaluateAds('Meta', meta.totals) : []),
    ...(google ? evaluateAds('Google', google.totals) : []),
  ]
  // 2차 전환 진단
  if (resultView > 0) {
    const secRate = (secondaryTotal / resultView) * 100
    const secLevel: DiagLevel = secRate >= 15 ? 'good' : secRate >= 5 ? 'warn' : 'bad'
    allDiag.push({ label: '결과→2차 전환', level: secLevel, value: `${secRate.toFixed(1)}%`, comment: secLevel === 'good' ? '전환 양호' : secLevel === 'warn' ? '전환 보통 — CTA 강화 고려' : '전환 낮음 — 노출/문구 개선 필요' })
  }

  return (
    <div className="space-y-4">
      {/* 새로고침 */}
      <div className="flex justify-between items-center">
        <h2 className="text-slate-900 font-bold text-base">전체 대시보드</h2>
        <button onClick={load} disabled={loading} className="text-xs text-slate-500 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-100">
          {loading ? '...' : '↻ 새로고침'}
        </button>
      </div>

      {/* 2줄 종합 평가 */}
      {(() => {
        // 퍼널 전환율
        const e2e = totalUsers > 0 ? ((secondaryTotal / totalUsers) * 100) : 0
        const completionRate = testStart > 0 ? ((testComplete / testStart) * 100) : 0
        const ctaRate = totalUsers > 0 ? ((ctaClick / totalUsers) * 100) : 0

        // 광고 효율
        const adEfficiency = totalSpend > 0 && secondaryTotal > 0
        const cpaOk = effectiveCPA > 0 && effectiveCPA <= BENCHMARKS.overall.cpa_target * 1.5

        // 1줄: 퍼널 상태
        let line1 = ''
        if (e2e >= 5) line1 = `전체 전환율 ${e2e.toFixed(1)}% — 퍼널이 잘 작동하고 있습니다. 트래픽을 늘리면 성과가 비례합니다.`
        else if (e2e >= 1) line1 = `전체 전환율 ${e2e.toFixed(1)}% — 보통 수준입니다. 이탈이 큰 구간을 집중 개선하면 2배 이상 올릴 수 있습니다.`
        else if (totalUsers > 0) line1 = `전체 전환율 ${e2e.toFixed(1)}% — 퍼널 어딘가에서 대량 이탈이 발생하고 있습니다. 아래 진단을 확인하세요.`
        else line1 = '아직 데이터가 부족합니다. 광고 집행 후 다시 확인하세요.'

        // 2줄: 광고 효율 + 핵심 액션 제안
        let line2 = ''
        if (!adEfficiency) {
          line2 = '광고비 대비 2차 전환이 아직 없습니다. 랜딩→결과 퍼널부터 점검해주세요.'
        } else if (cpaOk) {
          line2 = `유효 CPA ₩${effectiveCPA.toLocaleString()} — 목표(₩${BENCHMARKS.overall.cpa_target.toLocaleString()}) 대비 적정. 현재 전략을 유지하며 스케일업하세요.`
        } else {
          line2 = `유효 CPA ₩${effectiveCPA.toLocaleString()} — 목표(₩${BENCHMARKS.overall.cpa_target.toLocaleString()}) 초과. 광고 소재 교체 또는 랜딩 전환율 개선이 우선입니다.`
        }

        const overallLevel = e2e >= 3 && cpaOk ? 'good' : e2e >= 1 ? 'warn' : 'bad'
        const colors = {
          good: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', icon: '✅' },
          warn: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800', icon: '⚠️' },
          bad: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', icon: '🚨' },
        }
        const c = colors[overallLevel]

        return (
          <section className={`${c.bg} border ${c.border} rounded-2xl p-5`}>
            <p className={`text-base font-bold ${c.text} mb-1`}>{c.icon} {line1}</p>
            <p className={`text-sm ${c.text} opacity-80`}>{line2}</p>
          </section>
        )
      })()}

      {/* 광고비 요약 */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5">
        <h3 className="text-slate-500 text-xs font-bold mb-3">총 광고 성과</h3>
        <div className="grid grid-cols-2 gap-3">
          <MetricCard label="총 광고비" value={`₩${totalSpend.toLocaleString()}`} />
          <MetricCard label="총 클릭" value={totalClicks} />
          <MetricCard label="통합 CTR" value={`${blendedCTR.toFixed(2)}%`} />
          <MetricCard label="블렌디드 CPC" value={`₩${blendedCPC.toLocaleString()}`} />
        </div>
      </section>

      {/* 퍼널 */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5">
        <h3 className="text-slate-500 text-xs font-bold mb-3">전체 퍼널 (업종 벤치마크 비교)</h3>
        <FunnelChart steps={funnel} />
      </section>

      {/* 2차 전환 */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5">
        <h3 className="text-slate-500 text-xs font-bold mb-1">2차 전환 (결과 확인 {resultView}명 기준)</h3>
        <div className="grid grid-cols-3 gap-3 mt-3">
          <div className="text-center">
            <div className="text-xl font-black text-slate-900">{openchat}</div>
            <div className="text-slate-400 text-xs">단톡방</div>
            {resultView > 0 && <div className="text-indigo-500 text-xs font-bold">{((openchat / resultView) * 100).toFixed(1)}%</div>}
          </div>
          <div className="text-center">
            <div className="text-xl font-black text-slate-900">{ebook}</div>
            <div className="text-slate-400 text-xs">전자책</div>
            {resultView > 0 && <div className="text-indigo-500 text-xs font-bold">{((ebook / resultView) * 100).toFixed(1)}%</div>}
          </div>
          <div className="text-center">
            <div className="text-xl font-black text-slate-900">{share}</div>
            <div className="text-slate-400 text-xs">공유</div>
            {resultView > 0 && <div className="text-indigo-500 text-xs font-bold">{((share / resultView) * 100).toFixed(1)}%</div>}
          </div>
        </div>
      </section>

      {/* 유효 CPA */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5">
        <h3 className="text-slate-500 text-xs font-bold mb-2">유효 CPA (광고비 / 2차 전환)</h3>
        <div className="text-center">
          <div className="text-3xl font-black text-slate-900">{effectiveCPA > 0 ? `₩${effectiveCPA.toLocaleString()}` : '-'}</div>
          <div className="text-slate-400 text-xs mt-1">₩{totalSpend.toLocaleString()} / {secondaryTotal}건</div>
          {cpaCmp && (
            <div className={`text-sm font-bold mt-2 ${cpaCmp.level === 'good' ? 'text-green-600' : cpaCmp.level === 'bad' ? 'text-red-500' : 'text-yellow-600'}`}>
              목표 ₩{BENCHMARKS.overall.cpa_target.toLocaleString()} 대비 {cpaCmp.label}
            </div>
          )}
        </div>
      </section>

      {/* 종합 진단 */}
      <DiagnosticPanel title="종합 진단" items={allDiag} />
    </div>
  )
}
