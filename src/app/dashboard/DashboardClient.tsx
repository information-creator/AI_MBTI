'use client'

import { useState, useCallback, useEffect } from 'react'

const PASS = '720972'

type GA4Data = {
  events: Record<string, { events: number; users: number }>
  totalUsers: number
  startDate: string
  endDate: string
}

export default function DashboardPage() {
  const [authed, setAuthed] = useState(false)
  const [checked, setChecked] = useState(false)
  const [input, setInput] = useState('')
  const [data, setData] = useState<GA4Data | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/ga4?pass=${PASS}&start=2026-03-03&end=today`)
      if (!res.ok) throw new Error('API 오류')
      const json = await res.json()
      setData(json)
    } catch {
      setError('데이터를 불러올 수 없습니다')
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    const saved = sessionStorage.getItem('dashboard_auth') === 'true'
    if (saved) {
      setAuthed(true)
      fetchData()
    }
    setChecked(true)
  }, [fetchData])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (input === PASS) {
      sessionStorage.setItem('dashboard_auth', 'true')
      setAuthed(true)
      fetchData()
    }
  }

  if (!checked) {
    return <main className="min-h-screen bg-slate-50" />
  }

  if (!authed) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="w-full max-w-xs text-center">
          <h1 className="text-slate-900 text-lg font-bold mb-6">AIMBTI 대시보드</h1>
          <input
            type="password" value={input} onChange={e => setInput(e.target.value)}
            placeholder="비밀번호" autoFocus
            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-center text-slate-900 text-lg tracking-widest mb-3 focus:outline-none focus:border-indigo-500"
          />
          <button type="submit" className="w-full bg-indigo-500 text-white rounded-xl py-3 font-bold">확인</button>
        </form>
      </main>
    )
  }

  if (loading && !data) {
    return <main className="min-h-screen bg-slate-50 flex items-center justify-center"><p className="text-slate-400">GA4 데이터 불러오는 중...</p></main>
  }

  if (error && !data) {
    return <main className="min-h-screen bg-slate-50 flex items-center justify-center"><p className="text-red-400">{error}</p></main>
  }

  if (!data) return null

  const ev = data.events
  const get = (name: string) => ev[name] ?? { events: 0, users: 0 }
  const pct = (v: number, base: number) => base === 0 ? '-' : `${Math.round((v / base) * 100)}%`

  const totalUsers = data.totalUsers
  const testStart = get('test_start').users
  const testComplete = get('test_complete').users
  const resultView = get('result_view').users
  const openchat = get('openchat_click').users
  const ebook = get('ebook_click').users
  const share = get('share_click').users
  const ctaClick = get('cta_click').users

  const funnel = [
    { label: '페이지 방문', value: totalUsers },
    { label: '시작 버튼 클릭', value: ctaClick },
    { label: '첫 문항 응답', value: testStart },
    { label: '20문항 완료', value: testComplete },
    { label: '결과 확인', value: resultView },
    { label: '오픈채팅 클릭', value: openchat },
    { label: '전자책 클릭', value: ebook },
  ]

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-slate-900 font-bold">AIMBTI 대시보드</h1>
          <p className="text-slate-400 text-xs mt-1">GA4 실시간 · {data.startDate} ~ today</p>
        </div>
        <button onClick={fetchData} disabled={loading} className="text-xs text-slate-500 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-100">
          {loading ? '...' : '↻ 새로고침'}
        </button>
      </div>

      {/* 핵심 숫자 */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
          <div className="text-3xl font-black text-slate-900">{totalUsers}</div>
          <div className="text-slate-400 text-xs mt-1">총 방문자</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
          <div className="text-3xl font-black text-indigo-500">{testComplete}</div>
          <div className="text-slate-400 text-xs mt-1">테스트 완료</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
          <div className="text-3xl font-black text-purple-500">{resultView}</div>
          <div className="text-slate-400 text-xs mt-1">결과 확인</div>
        </div>
      </div>

      {/* 전체 퍼널 */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 mb-4">
        <h2 className="text-slate-900 font-bold text-sm mb-4">전체 퍼널</h2>
        <div className="space-y-3">
          {funnel.map((step, i) => {
            const width = Math.max(Math.round((step.value / funnel[0].value) * 100), step.value > 0 ? 3 : 0)
            const dropoff = i > 0 && funnel[i - 1].value > 0
              ? Math.round(((funnel[i - 1].value - step.value) / funnel[i - 1].value) * 100)
              : 0
            return (
              <div key={i}>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-slate-600 text-xs">{step.label}</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-slate-900 text-sm font-bold">{step.value}명</span>
                    {i > 0 && dropoff > 0 && (
                      <span className="text-red-500 text-xs font-medium">-{dropoff}%</span>
                    )}
                  </div>
                </div>
                <div className="bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 결과 페이지 전환 */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 mb-4">
        <h2 className="text-slate-900 font-bold text-sm mb-1">결과 본 사람이 뭘 했나?</h2>
        <p className="text-slate-400 text-xs mb-4">결과 확인 {resultView}명 기준</p>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-center">
            <div className="text-xl font-black text-yellow-600">{openchat}</div>
            <div className="text-slate-500 text-[10px] mt-1">오픈채팅</div>
            <div className="text-yellow-600 text-xs font-bold">{pct(openchat, resultView)}</div>
          </div>
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 text-center">
            <div className="text-xl font-black text-indigo-600">{ebook}</div>
            <div className="text-slate-500 text-[10px] mt-1">전자책</div>
            <div className="text-indigo-600 text-xs font-bold">{pct(ebook, resultView)}</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
            <div className="text-xl font-black text-green-600">{share}</div>
            <div className="text-slate-500 text-[10px] mt-1">공유</div>
            <div className="text-green-600 text-xs font-bold">{pct(share, resultView)}</div>
          </div>
        </div>
      </section>

      <p className="text-center text-slate-400 text-xs pb-4">
        GA4 API 실시간 · 새로고침 시 최신 반영
      </p>
    </main>
  )
}
