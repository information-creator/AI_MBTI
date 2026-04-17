'use client'

import { useState, useEffect, useCallback } from 'react'
import { useDashboardDates } from '../layout'
import { fetchGA4 } from '@/lib/dashboard/api'
import { evaluateFunnel } from '@/lib/dashboard/diagnostics'
import { BENCHMARKS, compareBenchmark } from '@/lib/dashboard/benchmarks'
import type { GA4Data, DiagItem, DiagLevel } from '@/lib/dashboard/types'
import FunnelChart from '@/components/dashboard/FunnelChart'
import DiagnosticPanel from '@/components/dashboard/DiagnosticPanel'

function daysAgo(dateStr: string, days: number) {
  const d = new Date(dateStr)
  d.setDate(d.getDate() - days)
  return d.toISOString().slice(0, 10)
}

export default function FunnelPage() {
  const { startDate, endDate, setStartDate, setEndDate } = useDashboardDates()
  const [current, setCurrent] = useState<GA4Data | null>(null)
  const [previous, setPrevious] = useState<GA4Data | null>(null)
  const [loading, setLoading] = useState(false)

  const daysDiff = Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000) + 1)

  const load = useCallback(async () => {
    setLoading(true)
    const prevStart = daysAgo(startDate, daysDiff)
    const prevEnd = daysAgo(startDate, 1)
    const [cur, prev] = await Promise.allSettled([
      fetchGA4(startDate, endDate),
      fetchGA4(prevStart, prevEnd),
    ])
    if (cur.status === 'fulfilled') setCurrent(cur.value)
    if (prev.status === 'fulfilled') setPrevious(prev.value)
    setLoading(false)
  }, [startDate, endDate, daysDiff])

  useEffect(() => { load() }, [load])

  // 프리셋
  const setPreset = (days: number) => {
    const now = new Date().toISOString().slice(0, 10)
    setEndDate(now)
    setStartDate(daysAgo(now, days - 1))
  }

  if (loading && !current) return <p className="text-slate-400 text-center py-10">퍼널 데이터 불러오는 중...</p>

  const extract = (data: GA4Data | null) => {
    if (!data) return null
    const ev = data.events
    const get = (name: string) => ev[name]?.users ?? 0
    return {
      totalUsers: data.totalUsers,
      ctaClick: get('cta_click'),
      testStart: get('test_start'),
      testComplete: get('test_complete'),
      resultView: get('result_view'),
      openchat: get('openchat_click'),
      ebook: get('ebook_click'),
      share: get('share_click'),
    }
  }

  const cur = extract(current)
  const prev = extract(previous)

  if (!cur) return null

  const curSecondary = cur.openchat + cur.ebook + cur.share
  const prevSecondary = prev ? prev.openchat + prev.ebook + prev.share : 0

  const curFunnel = [
    { label: '페이지 방문', value: cur.totalUsers },
    { label: 'CTA 클릭', value: cur.ctaClick },
    { label: '테스트 시작', value: cur.testStart },
    { label: '테스트 완료', value: cur.testComplete },
    { label: '결과 확인', value: cur.resultView },
    { label: '2차 전환', value: curSecondary },
  ]

  // 기간 비교 데이터
  type CompRow = { label: string; cur: number; prev: number; curRate: string; prevRate: string; delta: string; benchmark: number | null }
  const compRows: CompRow[] = prev ? [
    { label: '방문', cur: cur.totalUsers, prev: prev.totalUsers, curRate: '-', prevRate: '-', delta: pctDelta(cur.totalUsers, prev.totalUsers), benchmark: null },
    { label: '→CTA', cur: cur.ctaClick, prev: prev.ctaClick, curRate: r(cur.ctaClick, cur.totalUsers), prevRate: r(prev.ctaClick, prev.totalUsers), delta: pctDelta(cur.ctaClick, prev.ctaClick), benchmark: BENCHMARKS.funnel.landing_to_cta },
    { label: '→시작', cur: cur.testStart, prev: prev.testStart, curRate: r(cur.testStart, cur.ctaClick), prevRate: r(prev.testStart, prev.ctaClick), delta: pctDelta(cur.testStart, prev.testStart), benchmark: BENCHMARKS.funnel.cta_to_test_start },
    { label: '→완료', cur: cur.testComplete, prev: prev.testComplete, curRate: r(cur.testComplete, cur.testStart), prevRate: r(prev.testComplete, prev.testStart), delta: pctDelta(cur.testComplete, prev.testComplete), benchmark: BENCHMARKS.funnel.test_start_to_complete },
    { label: '→결과', cur: cur.resultView, prev: prev.resultView, curRate: r(cur.resultView, cur.testComplete), prevRate: r(prev.resultView, prev.testComplete), delta: pctDelta(cur.resultView, prev.resultView), benchmark: BENCHMARKS.funnel.complete_to_result },
    { label: '→2차', cur: curSecondary, prev: prevSecondary, curRate: r(curSecondary, cur.resultView), prevRate: r(prevSecondary, prev.resultView), delta: pctDelta(curSecondary, prevSecondary), benchmark: BENCHMARKS.funnel.result_to_secondary },
  ] : []

  // 진단
  const diagItems: DiagItem[] = evaluateFunnel(curFunnel)
  if (cur.resultView > 0) {
    const secRate = (curSecondary / cur.resultView) * 100
    const secLevel: DiagLevel = secRate >= 15 ? 'good' : secRate >= 5 ? 'warn' : 'bad'
    diagItems.push({ label: '결과→2차 전환', level: secLevel, value: `${secRate.toFixed(1)}%`, comment: secLevel === 'good' ? '전환 양호' : secLevel === 'warn' ? '전환 보통 — CTA 강화 고려' : '전환 낮음 — 노출/문구 개선 필요' })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-slate-900 font-bold text-base">기간별 퍼널</h2>
        <button onClick={load} disabled={loading} className="text-xs text-slate-500 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-100">
          {loading ? '...' : '↻ 새로고침'}
        </button>
      </div>

      {/* 프리셋 버튼 */}
      <div className="flex gap-2">
        {[
          { label: '오늘', days: 1 },
          { label: '7일', days: 7 },
          { label: '30일', days: 30 },
        ].map(p => (
          <button key={p.label} onClick={() => setPreset(p.days)} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100">
            {p.label}
          </button>
        ))}
      </div>

      {/* 퍼널 차트 */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5">
        <h3 className="text-slate-500 text-xs font-bold mb-3">퍼널 (업종 벤치마크 비교)</h3>
        <FunnelChart steps={curFunnel} />
      </section>

      {/* 기간 비교 */}
      {compRows.length > 0 && (
        <section className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="text-slate-500 text-xs font-bold mb-1">기간 비교</h3>
          <p className="text-slate-300 text-[10px] mb-3">이번: {startDate}~{endDate} ({daysDiff}일) vs 이전 {daysDiff}일</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="text-left py-1.5 font-medium">단계</th>
                  <th className="text-right py-1.5 font-medium">이번</th>
                  <th className="text-right py-1.5 font-medium">이전</th>
                  <th className="text-right py-1.5 font-medium">변화</th>
                  <th className="text-right py-1.5 font-medium">업종</th>
                </tr>
              </thead>
              <tbody>
                {compRows.map(row => {
                  const isUp = row.delta.startsWith('+')
                  const cmp = row.benchmark !== null && row.curRate !== '-' ? compareBenchmark(parseFloat(row.curRate), row.benchmark, true) : null
                  return (
                    <tr key={row.label} className="border-b border-slate-100">
                      <td className="py-1.5 text-slate-600">{row.label}</td>
                      <td className="text-right py-1.5 text-slate-900 font-bold">{row.cur.toLocaleString()}<span className="text-slate-400 font-normal ml-0.5">{row.curRate !== '-' ? ` (${row.curRate})` : ''}</span></td>
                      <td className="text-right py-1.5 text-slate-400">{row.prev.toLocaleString()}</td>
                      <td className={`text-right py-1.5 font-bold ${isUp ? 'text-green-600' : 'text-red-500'}`}>{row.delta}</td>
                      <td className="text-right py-1.5">
                        {cmp ? (
                          <span className={`font-bold ${cmp.level === 'good' ? 'text-green-600' : cmp.level === 'bad' ? 'text-red-500' : 'text-yellow-600'}`}>{row.benchmark}%</span>
                        ) : <span className="text-slate-300">-</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 진단 */}
      <DiagnosticPanel title="퍼널 진단" items={diagItems} />
    </div>
  )
}

function r(a: number, b: number) {
  if (b === 0) return '-'
  return `${((a / b) * 100).toFixed(1)}%`
}

function pctDelta(cur: number, prev: number) {
  if (prev === 0) return cur > 0 ? '+∞' : '0%'
  const d = Math.round(((cur - prev) / prev) * 100)
  return `${d >= 0 ? '+' : ''}${d}%`
}
