'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type DashboardCtx = {
  startDate: string
  endDate: string
  setStartDate: (d: string) => void
  setEndDate: (d: string) => void
}

const DashboardContext = createContext<DashboardCtx | null>(null)
export function useDashboardDates() {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error('useDashboardDates must be used within dashboard2 layout')
  return ctx
}

const PASS = '720972'
const tabs = [
  { href: '/dashboard2/overview', label: '전체' },
  { href: '/dashboard2/meta', label: 'Meta' },
  { href: '/dashboard2/google', label: 'Google' },
  { href: '/dashboard2/ab-test', label: 'A/B 테스트' },
  { href: '/dashboard2/funnel', label: '퍼널' },
]

export default function Dashboard2Layout({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false)
  const [checked, setChecked] = useState(false)
  const [input, setInput] = useState('')
  const [startDate, setStartDate] = useState('2026-03-03')
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10))
  const pathname = usePathname()

  useEffect(() => {
    const saved = sessionStorage.getItem('dashboard2_auth') === 'true'
    if (saved) setAuthed(true)
    setChecked(true)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (input === PASS) {
      sessionStorage.setItem('dashboard2_auth', 'true')
      setAuthed(true)
    }
  }

  if (!checked) return <main className="min-h-screen bg-slate-50" />

  if (!authed) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="w-full max-w-xs text-center">
          <h1 className="text-slate-900 text-lg font-bold mb-6">AIMBTI 대시보드 v2</h1>
          <input type="password" value={input} onChange={e => setInput(e.target.value)} placeholder="비밀번호" autoFocus className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-center text-slate-900 text-lg tracking-widest mb-3 focus:outline-none focus:border-indigo-500" />
          <button type="submit" className="w-full bg-indigo-500 text-white rounded-xl py-3 font-bold">확인</button>
        </form>
      </main>
    )
  }

  return (
    <DashboardContext value={{ startDate, endDate, setStartDate, setEndDate }}>
      <main className="min-h-screen bg-slate-50">
        <div className="max-w-lg mx-auto px-4 pt-4 pb-20">
          {/* 탭 */}
          <nav className="flex gap-1.5 mb-3 overflow-x-auto no-scrollbar">
            {tabs.map(tab => {
              const active = pathname === tab.href
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 ${active ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-100'}`}
                >
                  {tab.label}
                </Link>
              )
            })}
          </nav>

          {/* 날짜 */}
          <div className="flex items-center gap-2 mb-5">
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="flex-1 min-w-0 bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-sm focus:outline-none focus:border-indigo-500" />
            <span className="text-slate-400 text-sm shrink-0">~</span>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="flex-1 min-w-0 bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-sm focus:outline-none focus:border-indigo-500" />
          </div>

          {/* 콘텐츠 */}
          {children}
        </div>
      </main>
    </DashboardContext>
  )
}
