'use client'

import { useState, useEffect, useCallback } from 'react'
import { useDashboardDates } from '../layout'
import { fetchMetaAds } from '@/lib/dashboard/api'
import { evaluateAds } from '@/lib/dashboard/diagnostics'
import { BENCHMARKS } from '@/lib/dashboard/benchmarks'
import type { MetaAdsData } from '@/lib/dashboard/types'
import MetricCard from '@/components/dashboard/MetricCard'
import CampaignTable from '@/components/dashboard/CampaignTable'
import DiagnosticPanel from '@/components/dashboard/DiagnosticPanel'

export default function MetaPage() {
  const { startDate, endDate } = useDashboardDates()
  const [data, setData] = useState<MetaAdsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setData(await fetchMetaAds(startDate, endDate))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Meta 데이터를 불러올 수 없습니다')
    }
    setLoading(false)
  }, [startDate, endDate])

  useEffect(() => { load() }, [load])

  if (loading && !data) return <p className="text-slate-400 text-center py-10">Meta Ads 데이터 불러오는 중...</p>
  if (error && !data) return <p className="text-red-400 text-center py-10">{error}</p>
  if (!data) return null

  const t = data.totals
  const b = BENCHMARKS.ads.meta
  const diag = evaluateAds('Meta', t)

  // 한줄평
  const cvr = t.clicks > 0 ? (t.conversions / t.clicks) * 100 : 0
  let oneLiner = ''
  let oneColor = ''
  if (t.spend === 0) { oneLiner = '아직 Meta 광고 집행 데이터가 없습니다'; oneColor = 'bg-slate-50 border-slate-200 text-slate-600' }
  else if (t.ctr >= 2 && cvr >= 3) { oneLiner = `CTR ${t.ctr}% · 전환율 ${cvr.toFixed(1)}% — 소재와 랜딩 모두 잘 작동 중. 예산 늘려도 됩니다.`; oneColor = 'bg-green-50 border-green-200 text-green-800' }
  else if (t.ctr >= 1) { oneLiner = `CTR ${t.ctr}%로 소재 반응은 괜찮지만, 전환율 ${cvr.toFixed(1)}%가 아쉽습니다. 랜딩 개선 우선.`; oneColor = 'bg-yellow-50 border-yellow-200 text-yellow-800' }
  else { oneLiner = `CTR ${t.ctr}%로 소재 반응이 낮습니다. 광고 문구·이미지를 먼저 교체하세요.`; oneColor = 'bg-red-50 border-red-200 text-red-800' }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-slate-900 font-bold text-base">Meta Ads 대시보드</h2>
        <button onClick={load} disabled={loading} className="text-xs text-slate-500 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-100">
          {loading ? '...' : '↻ 새로고침'}
        </button>
      </div>

      {/* 한줄평 */}
      <div className={`${oneColor} border rounded-2xl px-4 py-3`}>
        <p className="text-sm font-bold">{oneLiner}</p>
      </div>

      {/* 핵심 지표 */}
      <section className="grid grid-cols-2 gap-3">
        <MetricCard label="광고비" value={`₩${t.spend.toLocaleString()}`} />
        <MetricCard label="노출" value={t.impressions} />
        <MetricCard label="클릭" value={t.clicks} />
        <MetricCard label="CTR" value={`${t.ctr}%`} benchmark={{ value: b.ctr }} />
        <MetricCard label="CPC" value={`₩${t.cpc.toLocaleString()}`} benchmark={{ value: b.cpc, higherIsBetter: false }} />
        <MetricCard label="CPM" value={`₩${t.cpm.toLocaleString()}`} benchmark={{ value: b.cpm, higherIsBetter: false }} />
        <MetricCard label="전환" value={t.conversions} color="text-indigo-600" />
        {t.clicks > 0 && (
          <MetricCard label="전환율" value={`${((t.conversions / t.clicks) * 100).toFixed(1)}%`} benchmark={{ value: b.cvr }} />
        )}
      </section>

      {/* 캠페인별 */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5">
        <h3 className="text-slate-500 text-xs font-bold mb-3">캠페인별 성과</h3>
        <CampaignTable campaigns={data.campaigns} />
      </section>

      {/* 진단 */}
      <DiagnosticPanel title="Meta Ads 진단" items={diag} />
    </div>
  )
}
