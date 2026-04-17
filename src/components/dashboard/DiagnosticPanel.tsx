'use client'

import type { DiagItem } from '@/lib/dashboard/types'
import { diagLevel, getOverallVerdict } from '@/lib/dashboard/diagnostics'

export default function DiagnosticPanel({ title, items }: { title: string; items: DiagItem[] }) {
  if (items.length === 0) return null
  const verdict = getOverallVerdict(items)
  const vs = diagLevel(verdict.level)

  return (
    <section className={`${vs.bg} border ${vs.border} rounded-2xl p-5`}>
      <h3 className={`font-bold text-base mb-2 ${vs.text}`}>{title}</h3>
      <p className={`text-sm font-medium mb-3 ${vs.text}`}>{verdict.summary}</p>
      <div className="space-y-2.5">
        {items.map((item, i) => {
          const s = diagLevel(item.level)
          return (
            <div key={i} className="flex items-start gap-2">
              <span className={`inline-block w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${s.dot}`} />
              <div className="min-w-0">
                <span className="text-slate-700 text-sm font-semibold">{item.label} {item.value}</span>
                <span className="text-slate-500 text-sm"> — {item.comment}</span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
