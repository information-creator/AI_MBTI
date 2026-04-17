'use client'

import { BENCHMARKS, compareBenchmark } from '@/lib/dashboard/benchmarks'

type Step = { label: string; value: number }
type BenchmarkKey = keyof typeof BENCHMARKS.funnel

const FUNNEL_BENCHMARK_MAP: Record<string, BenchmarkKey> = {
  '페이지 방문 → CTA 클릭': 'landing_to_cta',
  'CTA 클릭 → 테스트 시작': 'cta_to_test_start',
  '테스트 시작 → 테스트 완료': 'test_start_to_complete',
  '테스트 완료 → 결과 확인': 'complete_to_result',
  '결과 확인 → 2차 전환': 'result_to_secondary',
}

export default function FunnelChart({ steps }: { steps: Step[] }) {
  return (
    <div className="space-y-3">
      {steps.map((step, i) => {
        const width = steps[0].value > 0 ? Math.max(Math.round((step.value / steps[0].value) * 100), step.value > 0 ? 3 : 0) : 0
        const prev = i > 0 ? steps[i - 1].value : 0
        const dropoff = i > 0 && prev > 0 ? Math.round(((prev - step.value) / prev) * 100) : 0
        const convRate = i > 0 && prev > 0 ? ((step.value / prev) * 100) : 0

        // 벤치마크 매칭
        const benchKey = i > 0 ? `${steps[i - 1].label} → ${step.label}` : null
        const benchmarkKey = benchKey ? FUNNEL_BENCHMARK_MAP[benchKey] : null
        const benchVal = benchmarkKey ? BENCHMARKS.funnel[benchmarkKey] : null
        const cmp = benchVal !== null && i > 0 ? compareBenchmark(convRate, benchVal, true) : null

        return (
          <div key={i}>
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-slate-600 text-xs">{step.label}</span>
              <div className="flex items-baseline gap-2">
                <span className="text-slate-900 text-sm font-bold">{step.value.toLocaleString()}명</span>
                {i > 0 && dropoff > 0 && (
                  <span className="text-red-500 text-xs font-medium">-{dropoff}%</span>
                )}
              </div>
            </div>
            <div className="bg-slate-100 rounded-full h-3 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: `${width}%` }} />
            </div>
            {cmp && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-slate-400 text-[10px]">전환 {convRate.toFixed(1)}%</span>
                <span className={`text-[10px] font-bold ${cmp.level === 'good' ? 'text-green-600' : cmp.level === 'bad' ? 'text-red-500' : 'text-yellow-600'}`}>
                  (업종 {benchVal}% | {cmp.label})
                </span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
