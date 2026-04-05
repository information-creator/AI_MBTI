import { createClient } from '@supabase/supabase-js'
import type { Result } from '@/lib/supabase'

async function getResults(): Promise<Result[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return []
  const sb = createClient(url, key)
  const { data } = await sb
    .from('results_v2')
    .select('*')
    .order('created_at', { ascending: true })
  return data ?? []
}

function Bar({ value, max, color = 'bg-indigo-500' }: { value: number; max: number; color?: string }) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100)
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-slate-100 rounded-full h-2.5">
        <div className={`${color} h-2.5 rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-slate-500 w-8 text-right">{value}</span>
    </div>
  )
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4">
      <div className="text-slate-500 text-xs mb-1">{label}</div>
      <div className="text-2xl font-black text-slate-900">{value}</div>
      {sub && <div className="text-slate-400 text-xs mt-0.5">{sub}</div>}
    </div>
  )
}

const TYPE_LABEL: Record<string, string> = {
  HALF: 'AI 시대 지휘관', HALP: '완벽주의 AI 설계자',
  HACF: '데이터로 판치는 크리에이터', HACP: '느린 듯 정확한 AI 예술가',
  HSLF: '조용한 논리 장인', HSLP: '철저한 혼자형 전략가',
  HSCF: '감성 독립군', HSCP: '나만의 세계 완성형',
  TALF: '팀 이끄는 AI 선봉장', TALP: '함께 만드는 AI 설계자',
  TACF: 'AI 부리는 크리에이터', TACP: '협력형 AI 아티스트',
  TSLF: '사람으로 굴러가는 분석가', TSLP: '신중한 팀 전략가',
  TSCF: '감성으로 팀 살리는 사람', TSCP: '완벽한 팀의 완성자',
}

export default async function DashboardPage() {
  const results = await getResults()
  const total = results.length

  // 오늘 / 이번 주
  const now = new Date()
  const todayStr = now.toISOString().slice(0, 10)
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const today = results.filter(r => r.created_at.startsWith(todayStr)).length
  const thisWeek = results.filter(r => new Date(r.created_at) >= weekAgo).length
  const shared = results.filter(r => r.shared).length
  const shareRate = total === 0 ? 0 : Math.round((shared / total) * 100)

  // 일별 추이 (최근 14일)
  const dailyMap: Record<string, number> = {}
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    dailyMap[d.toISOString().slice(0, 10)] = 0
  }
  results.forEach(r => {
    const d = r.created_at.slice(0, 10)
    if (d in dailyMap) dailyMap[d]++
  })
  const dailyEntries = Object.entries(dailyMap)
  const dailyMax = Math.max(...dailyEntries.map(([, v]) => v), 1)

  // 유형 분포
  const typeMap: Record<string, number> = {}
  results.forEach(r => { typeMap[r.type_code] = (typeMap[r.type_code] ?? 0) + 1 })
  const typeSorted = Object.entries(typeMap).sort((a, b) => b[1] - a[1])

  // 특성 분포
  const ws = { H: 0, T: 0 }
  const au = { A: 0, S: 0 }
  const st = { L: 0, C: 0 }
  const sp = { F: 0, P: 0 }
  results.forEach(r => {
    if (r.work_style === 'H') ws.H++; else ws.T++
    if (r.ai_usage === 'A') au.A++; else au.S++
    if (r.strength === 'L') st.L++; else st.C++
    if (r.speed === 'F') sp.F++; else sp.P++
  })

  // AI 점수 구간
  const scoreMap: Record<number, number> = {}
  results.forEach(r => { scoreMap[r.ai_score] = (scoreMap[r.ai_score] ?? 0) + 1 })
  const scoreEntries = Object.entries(scoreMap)
    .map(([k, v]) => ({ score: Number(k), count: v }))
    .sort((a, b) => a.score - b.score)
  const scoreMax = Math.max(...scoreEntries.map(e => e.count), 1)

  // 퍼널 단계 (Supabase 기준)
  const funnelSteps = [
    { label: '랜딩 방문', value: null, note: 'GA4', color: 'bg-slate-200' },
    { label: 'CTA 클릭', value: null, note: 'GA4', color: 'bg-slate-200' },
    { label: '테스트 완주', value: total, note: null, color: 'bg-indigo-500' },
    { label: '결과 공유', value: shared, note: null, color: shared > 0 ? 'bg-purple-500' : 'bg-slate-300' },
  ]

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-black text-slate-900">AImBTI 대시보드</h1>
        <p className="text-slate-500 text-xs mt-1">Supabase 기준 · 실시간</p>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard label="총 완주" value={total} sub="누적" />
        <StatCard label="오늘" value={today} sub={todayStr} />
        <StatCard label="이번 주 (7일)" value={thisWeek} />
        <StatCard label="공유율" value={`${shareRate}%`} sub={`${shared}명 공유`} />
      </div>

      {/* 퍼널 */}
      <section className="bg-white rounded-2xl border border-slate-200 p-4 mb-4">
        <h2 className="text-sm font-bold text-slate-700 mb-4">퍼널</h2>
        <div className="space-y-2">
          {funnelSteps.map((step, i) => {
            const width = step.value === null ? 100
              : total === 0 ? 0
              : Math.max(Math.round((step.value / total) * 100), step.value > 0 ? 4 : 0)
            return (
              <div key={i}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-slate-600 font-medium">{step.label}</span>
                  {step.note ? (
                    <span className="text-xs text-slate-400">{step.note} 필요</span>
                  ) : (
                    <span className="text-xs font-bold text-slate-900">{step.value?.toLocaleString()}</span>
                  )}
                </div>
                <div className="bg-slate-100 rounded-full h-6 relative overflow-hidden">
                  <div
                    className={`${step.color} h-6 rounded-full flex items-center justify-end pr-2 transition-all`}
                    style={{ width: `${width}%` }}
                  >
                    {step.value !== null && step.value > 0 && (
                      <span className="text-white text-xs font-bold">{width}%</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <p className="text-slate-400 text-xs mt-3">* 방문·CTA 클릭은 GA4 연동 시 표시</p>
      </section>

      {/* 일별 추이 */}
      <section className="bg-white rounded-2xl border border-slate-200 p-4 mb-4">
        <h2 className="text-sm font-bold text-slate-700 mb-4">일별 완주 추이 (14일)</h2>
        <div className="flex items-end gap-1 h-24">
          {dailyEntries.map(([date, count]) => {
            const heightPct = Math.round((count / dailyMax) * 100)
            const isToday = date === todayStr
            return (
              <div key={date} className="flex-1 flex flex-col items-center gap-1" title={`${date}: ${count}명`}>
                <span className="text-slate-500 text-[9px]">{count > 0 ? count : ''}</span>
                <div
                  className={`w-full rounded-t ${isToday ? 'bg-indigo-500' : 'bg-indigo-200'} transition-all`}
                  style={{ height: `${Math.max(heightPct, count > 0 ? 8 : 2)}%`, minHeight: count > 0 ? '4px' : '2px' }}
                />
                <span className="text-slate-400 text-[9px]">{date.slice(5)}</span>
              </div>
            )
          })}
        </div>
      </section>

      {/* 유형 분포 */}
      <section className="bg-white rounded-2xl border border-slate-200 p-4 mb-4">
        <h2 className="text-sm font-bold text-slate-700 mb-3">유형 분포 (상위)</h2>
        <div className="space-y-2.5">
          {typeSorted.slice(0, 8).map(([code, count]) => (
            <div key={code}>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-mono text-slate-700">{code} <span className="text-slate-400 font-sans">{TYPE_LABEL[code]}</span></span>
                <span className="text-slate-500">{Math.round((count / total) * 100)}%</span>
              </div>
              <Bar value={count} max={typeSorted[0][1]} color="bg-indigo-400" />
            </div>
          ))}
        </div>
      </section>

      {/* 특성 분포 */}
      <section className="bg-white rounded-2xl border border-slate-200 p-4 mb-4">
        <h2 className="text-sm font-bold text-slate-700 mb-3">특성 분포</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { title: '업무 방식', a: { label: '혼자 (H)', v: ws.H }, b: { label: '팀 (T)', v: ws.T } },
            { title: 'AI 활용', a: { label: '적극 (A)', v: au.A }, b: { label: '신중 (S)', v: au.S } },
            { title: '강점', a: { label: '논리 (L)', v: st.L }, b: { label: '창의 (C)', v: st.C } },
            { title: '속도', a: { label: '빠름 (F)', v: sp.F }, b: { label: '신중 (P)', v: sp.P } },
          ].map(({ title, a, b }) => {
            const tot = a.v + b.v || 1
            return (
              <div key={title}>
                <div className="text-xs text-slate-500 mb-1.5">{title}</div>
                <div className="flex rounded-full overflow-hidden h-5 text-[10px] font-bold">
                  <div
                    className="bg-indigo-500 flex items-center justify-center text-white"
                    style={{ width: `${Math.round((a.v / tot) * 100)}%` }}
                  >
                    {Math.round((a.v / tot) * 100) > 20 ? `${a.label.split(' ')[0]}` : ''}
                  </div>
                  <div
                    className="bg-purple-400 flex items-center justify-center text-white"
                    style={{ width: `${Math.round((b.v / tot) * 100)}%` }}
                  >
                    {Math.round((b.v / tot) * 100) > 20 ? `${b.label.split(' ')[0]}` : ''}
                  </div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>{a.label} {a.v}</span>
                  <span>{b.label} {b.v}</span>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* AI 점수 분포 */}
      <section className="bg-white rounded-2xl border border-slate-200 p-4 mb-4">
        <h2 className="text-sm font-bold text-slate-700 mb-3">AI 점수 분포</h2>
        <div className="flex items-end gap-1.5 h-20">
          {scoreEntries.map(({ score, count }) => (
            <div key={score} className="flex-1 flex flex-col items-center gap-1" title={`${score}점: ${count}명`}>
              <span className="text-slate-500 text-[10px]">{count}</span>
              <div
                className="w-full bg-gradient-to-t from-indigo-500 to-purple-400 rounded-t"
                style={{ height: `${Math.max(Math.round((count / scoreMax) * 100), 8)}%` }}
              />
              <span className="text-slate-400 text-[10px]">{score}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 mt-1 px-1">
          <span>← AI 대체 위험</span>
          <span>AI 생존 강자 →</span>
        </div>
      </section>

      <p className="text-center text-slate-300 text-xs pb-4">
        마지막 갱신: 페이지 로드 시 · SSR
      </p>
    </main>
  )
}
