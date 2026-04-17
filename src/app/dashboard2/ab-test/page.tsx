'use client'

import { useState, useEffect, useCallback } from 'react'
import { useDashboardDates } from '../layout'
import { fetchABTest } from '@/lib/dashboard/api'
import type { ABTestData } from '@/lib/dashboard/types'

const VARIANT_LABELS: Record<string, { name: string; color: string }> = {
  v1: { name: 'V1 공포소구', color: '#ef4444' },
  v3: { name: 'V3 사회적 증거', color: '#3b82f6' },
  v4: { name: 'V4 극심플', color: '#0f172a' },
}

const STEPS = [
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

export default function ABTestPage() {
  const { startDate, endDate } = useDashboardDates()
  const [data, setData] = useState<ABTestData[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetchABTest(startDate, endDate)
      setData(res.variants)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'A/B 테스트 데이터를 불러올 수 없습니다')
    }
    setLoading(false)
  }, [startDate, endDate])

  useEffect(() => { load() }, [load])

  if (loading && !data) return <p className="text-slate-400 text-center py-10">A/B 테스트 데이터 불러오는 중...</p>
  if (error) return <p className="text-red-400 text-center py-10">{error}</p>
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-slate-400 mb-2">A/B 테스트 데이터가 아직 없습니다</p>
        <p className="text-slate-300 text-xs">/preview/v1, v3, v4 페이지를 통해 유입된 데이터가 필요합니다</p>
      </div>
    )
  }

  // E2E 전환율 기준 승자 찾기
  const e2eRates = data.map(d => ({
    variant: d.variant,
    rate: d.pageView > 0 ? (d.resultView / d.pageView) * 100 : 0,
  }))
  const winner = e2eRates.reduce((a, b) => a.rate > b.rate ? a : b)

  // 2차 전환 합계
  const secondaryRates = data.map(d => ({
    variant: d.variant,
    total: d.openchatClick + d.ebookClick + d.shareClick,
    rate: d.resultView > 0 ? ((d.openchatClick + d.ebookClick + d.shareClick) / d.resultView) * 100 : 0,
  }))

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-slate-900 font-bold text-base">A/B 테스트</h2>
        <button onClick={load} disabled={loading} className="text-xs text-slate-500 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-100">
          {loading ? '...' : '↻ 새로고침'}
        </button>
      </div>

      {/* 승자 배너 */}
      {winner.rate > 0 && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-4 text-white text-center">
          <p className="text-xs opacity-80 mb-1">E2E 전환율 기준 승자</p>
          <p className="text-lg font-black">{VARIANT_LABELS[winner.variant]?.name ?? winner.variant}</p>
          <p className="text-sm font-bold opacity-90">{winner.rate.toFixed(1)}%</p>
        </div>
      )}

      {/* 퍼널 비교 테이블 */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5">
        <h3 className="text-slate-500 text-xs font-bold mb-3">변형별 퍼널 (절대값)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="text-left py-2 font-medium">단계</th>
                {data.map(d => (
                  <th key={d.variant} className="text-right py-2 px-1 font-medium">
                    <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: VARIANT_LABELS[d.variant]?.color }} />
                    {VARIANT_LABELS[d.variant]?.name ?? d.variant}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {STEPS.map(step => {
                const values = data.map(d => d[step.key] as number)
                const max = Math.max(...values)
                return (
                  <tr key={step.key} className="border-b border-slate-100">
                    <td className="py-2 text-slate-600">{step.label}</td>
                    {data.map((d, i) => (
                      <td key={d.variant} className={`text-right py-2 px-1 ${values[i] === max && max > 0 ? 'text-indigo-600 font-black' : 'text-slate-700'}`}>
                        {(d[step.key] as number).toLocaleString()}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 전환율 비교 */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5">
        <h3 className="text-slate-500 text-xs font-bold mb-3">단계별 전환율</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="text-left py-2 font-medium">구간</th>
                {data.map(d => (
                  <th key={d.variant} className="text-right py-2 px-1 font-medium">{VARIANT_LABELS[d.variant]?.name ?? d.variant}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: '방문→CTA', calc: (d: ABTestData) => rate(d.ctaClick, d.pageView) },
                { label: 'CTA→시작', calc: (d: ABTestData) => rate(d.testStart, d.ctaClick) },
                { label: '시작→완료', calc: (d: ABTestData) => rate(d.testComplete, d.testStart) },
                { label: '완료→결과', calc: (d: ABTestData) => rate(d.resultView, d.testComplete) },
                { label: '결과→2차', calc: (d: ABTestData) => rate(d.openchatClick + d.ebookClick + d.shareClick, d.resultView) },
                { label: 'E2E', calc: (d: ABTestData) => rate(d.resultView, d.pageView) },
              ].map(row => {
                const vals = data.map(d => row.calc(d))
                const numVals = vals.map(v => v === '-' ? 0 : parseFloat(v))
                const maxIdx = numVals.indexOf(Math.max(...numVals))
                return (
                  <tr key={row.label} className="border-b border-slate-100">
                    <td className="py-2 text-slate-600">{row.label}</td>
                    {vals.map((v, i) => (
                      <td key={data[i].variant} className={`text-right py-2 px-1 ${i === maxIdx && v !== '-' ? 'text-green-600 font-black' : 'text-slate-700'}`}>
                        {v} {i === maxIdx && v !== '-' ? '🏆' : ''}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 2차 전환 상세 */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5">
        <h3 className="text-slate-500 text-xs font-bold mb-3">2차 전환 상세</h3>
        <div className="space-y-3">
          {data.map(d => {
            const sec = secondaryRates.find(s => s.variant === d.variant)!
            return (
              <div key={d.variant} className="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ background: VARIANT_LABELS[d.variant]?.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-700">{VARIANT_LABELS[d.variant]?.name}</p>
                  <div className="flex gap-3 text-xs text-slate-500 mt-1">
                    <span>단톡 {d.openchatClick}</span>
                    <span>전자책 {d.ebookClick}</span>
                    <span>공유 {d.shareClick}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900">{sec.total}건</p>
                  <p className="text-xs text-indigo-500 font-bold">{sec.rate.toFixed(1)}%</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
