import Link from 'next/link'

const variants = [
  { id: 'v1', label: 'V1 공포소구', color: '#ef4444' },
  { id: 'v3', label: 'V3 사회적 증거', color: '#3b82f6' },
  { id: 'v4', label: 'V4 극심플', color: '#0f172a' },
]

type Props = {
  id: string
  label: string
  color: string
  oneLiner: string
  strategy: string
  desc: string
  evidence: string[]
  caveat: string
  fit: string
}

export default function VariantAnalysis({ id, label, color, oneLiner, strategy, desc, evidence, caveat, fit }: Props) {
  return (
    <div className="bg-slate-100 border-b-4 border-slate-300">
      <div className="max-w-lg mx-auto px-5 py-6 space-y-4">
        {/* 네비게이션 */}
        <div className="flex flex-wrap gap-1.5">
          {variants.map(v => (
            <Link
              key={v.id}
              href={`/preview/${v.id}`}
              className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-full transition-colors ${
                v.id === id
                  ? 'bg-slate-800 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: v.id === id ? '#fff' : v.color }} />
              {v.label}
            </Link>
          ))}
        </div>

        {/* 헤더 + 1줄 정리 */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-4 h-4 rounded-full shrink-0" style={{ background: color }} />
            <p className="text-xl font-black text-slate-800">{label}</p>
          </div>
          <p className="text-lg font-black text-slate-900 leading-snug">{oneLiner}</p>
          <p className="text-sm text-slate-400 mt-1">{desc}</p>
        </div>

        {/* 전략 */}
        <div className="bg-white rounded-xl px-4 py-3">
          <p className="text-base font-bold text-slate-800">전략: {strategy}</p>
        </div>

        {/* 데이터 근거 */}
        <div className="bg-white rounded-xl px-4 py-3">
          <p className="text-sm font-bold text-indigo-600 mb-2">데이터 근거</p>
          <ul className="space-y-2">
            {evidence.map((e, i) => (
              <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                <span className="text-indigo-500 shrink-0 mt-0.5 font-bold">•</span>
                <span>{e}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 주의점 */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <p className="text-sm text-amber-800"><strong>주의:</strong> {caveat}</p>
        </div>

        {/* 적합도 */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3">
          <p className="text-sm text-indigo-800"><strong>AIMBTI 적합도:</strong> {fit}</p>
        </div>
      </div>
    </div>
  )
}
