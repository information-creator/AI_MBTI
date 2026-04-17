'use client'

import { useState, useEffect, useCallback } from 'react'
import { useDashboardDates } from '../layout'
import { fetchGoogleAds } from '@/lib/dashboard/api'
import { evaluateAds } from '@/lib/dashboard/diagnostics'
import { BENCHMARKS } from '@/lib/dashboard/benchmarks'
import type { GoogleAdsData } from '@/lib/dashboard/types'
import MetricCard from '@/components/dashboard/MetricCard'
import CampaignTable from '@/components/dashboard/CampaignTable'
import DiagnosticPanel from '@/components/dashboard/DiagnosticPanel'

export default function GooglePage() {
  const { startDate, endDate } = useDashboardDates()
  const [data, setData] = useState<GoogleAdsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setData(await fetchGoogleAds(startDate, endDate))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Google Ads 데이터를 불러올 수 없습니다')
    }
    setLoading(false)
  }, [startDate, endDate])

  useEffect(() => { load() }, [load])

  if (loading && !data) return <p className="text-slate-400 text-center py-10">Google Ads 데이터 불러오는 중...</p>
  if (error && !data) return <p className="text-red-400 text-center py-10">{error}</p>
  if (!data) return null

  const t = data.totals
  const b = BENCHMARKS.ads.google
  const diag = evaluateAds('Google', t)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-slate-900 font-bold text-base">Google Ads 대시보드</h2>
        <button onClick={load} disabled={loading} className="text-xs text-slate-500 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-100">
          {loading ? '...' : '↻ 새로고침'}
        </button>
      </div>

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

      <section className="bg-white rounded-2xl border border-slate-200 p-5">
        <h3 className="text-slate-500 text-xs font-bold mb-3">캠페인별 성과</h3>
        <CampaignTable campaigns={data.campaigns} />
      </section>

      <DiagnosticPanel title="Google Ads 진단" items={diag} />
    </div>
  )
}
