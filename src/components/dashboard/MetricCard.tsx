'use client'

import { compareBenchmark } from '@/lib/dashboard/benchmarks'

type Props = {
  label: string
  value: string | number
  benchmark?: { value: number; higherIsBetter?: boolean }
  color?: string
}

export default function MetricCard({ label, value, benchmark, color = 'text-slate-900' }: Props) {
  const cmp = benchmark ? compareBenchmark(typeof value === 'number' ? value : parseFloat(String(value)), benchmark.value, benchmark.higherIsBetter ?? true) : null

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4">
      <div className={`text-2xl font-black ${color}`}>{typeof value === 'number' ? value.toLocaleString() : value}</div>
      <div className="text-slate-400 text-xs mt-1">{label}</div>
      {cmp && (
        <div className={`text-xs font-bold mt-1.5 ${cmp.level === 'good' ? 'text-green-600' : cmp.level === 'bad' ? 'text-red-500' : 'text-yellow-600'}`}>
          {cmp.label}
        </div>
      )}
    </div>
  )
}
