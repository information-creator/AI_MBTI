'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'

const PASS = '720972'

type SourceRow = { source: string; medium: string; users: number; sessions: number; engaged: number }
type CountryRow = { country: string; users: number; sessions: number; engaged: number }
type DeviceRow = { device: string; users: number; sessions: number; engaged: number }
type PageRow = { page: string; users: number; sessions: number; engaged: number }

type TrafficData = {
  sources: SourceRow[]
  countries: CountryRow[]
  devices: DeviceRow[]
  pages: PageRow[]
  summary: { totalUsers: number; totalSessions: number; totalEngaged: number; koreaUsers: number }
  startDate: string
  endDate: string
}

const COUNTRY_KR: Record<string, string> = {
  'South Korea': '한국',
  'India': '인도',
  'Pakistan': '파키스탄',
  'Bangladesh': '방글라데시',
  'Nepal': '네팔',
  'Egypt': '이집트',
  'Ethiopia': '에티오피아',
  'Algeria': '알제리',
  'Indonesia': '인도네시아',
  'Iraq': '이라크',
  'United States': '미국',
  'Japan': '일본',
  'China': '중국',
  'Vietnam': '베트남',
  'Philippines': '필리핀',
  'Thailand': '태국',
  'Nigeria': '나이지리아',
  'Morocco': '모로코',
  'Turkey': '터키',
  '(not set)': '(미확인)',
}

const SUSPECT_COUNTRIES = new Set([
  'India', 'Pakistan', 'Bangladesh', 'Nepal', 'Egypt', 'Ethiopia',
  'Algeria', 'Indonesia', 'Iraq', 'Nigeria', 'Morocco', 'Vietnam', 'Philippines',
])

function engageRate(engaged: number, sessions: number) {
  if (sessions === 0) return '0%'
  return Math.round((engaged / sessions) * 100) + '%'
}

export default function TrafficClient() {
  const today = new Date().toISOString().split('T')[0]
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState(today)
  const [data, setData] = useState<TrafficData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/ga4-traffic?pass=${PASS}&start=${startDate}&end=${endDate}`)
      if (!res.ok) throw new Error('API error')
      setData(await res.json())
    } catch {
      setError('데이터 로딩 실패')
    }
    setLoading(false)
  }, [startDate, endDate])

  const s = data?.summary
  const botUsers = s ? s.totalUsers - s.koreaUsers : 0
  const botPct = s && s.totalUsers > 0 ? Math.round((botUsers / s.totalUsers) * 100) : 0
  const engagePct = s && s.totalSessions > 0 ? Math.round((s.totalEngaged / s.totalSessions) * 100) : 0

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 max-w-lg mx-auto">
      {/* 탭 */}
      <div className="flex gap-2 mb-4">
        <Link href="/dashboard" className="px-4 py-2 rounded-xl text-sm font-medium bg-white border border-slate-200 text-slate-500 hover:bg-slate-100">
          퍼널 · 광고
        </Link>
        <div className="px-4 py-2 rounded-xl text-sm font-bold bg-indigo-600 text-white">
          트래픽 분석
        </div>
      </div>

      <h1 className="text-slate-900 font-bold text-lg mb-4">트래픽 분석</h1>

      {/* 날짜 선택 */}
      <div className="flex items-center gap-2 mb-6">
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white" />
        <span className="text-slate-400">~</span>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white" />
        <button onClick={fetchData} disabled={loading}
          className="bg-indigo-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-indigo-500 disabled:opacity-50">
          {loading ? '...' : '조회'}
        </button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600 mb-4">{error}</div>}

      {!data && !loading && (
        <div className="text-center text-slate-400 py-20">날짜 선택 후 조회를 눌러주세요</div>
      )}

      {data && s && (
        <>
          {/* 요약 카드 */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center">
              <div className="text-3xl font-black text-slate-900">{s.totalUsers.toLocaleString()}</div>
              <div className="text-slate-400 text-sm mt-1">총 방문자</div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center">
              <div className="text-3xl font-black text-blue-500">{s.koreaUsers.toLocaleString()}</div>
              <div className="text-slate-400 text-sm mt-1">한국 사용자</div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center">
              <div className="text-3xl font-black text-green-500">{engagePct}%</div>
              <div className="text-slate-400 text-sm mt-1">참여율</div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center">
              <div className={`text-3xl font-black ${botPct > 30 ? 'text-red-500' : 'text-slate-900'}`}>{botPct}%</div>
              <div className="text-slate-400 text-sm mt-1">해외 트래픽</div>
            </div>
          </div>

          {/* 봇 경고 */}
          {botPct > 30 && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-6">
              <h3 className="font-bold text-red-600 text-base mb-1">봇 트래픽 의심</h3>
              <p className="text-red-600 text-sm">
                해외 트래픽 {botPct}% ({botUsers.toLocaleString()}명) — 한국 서비스인데 해외 유입이 비정상적으로 높습니다.
                Google Ads 지역 타겟을 한국으로 제한하고, 디스플레이 네트워크(GDN)를 끄세요.
              </p>
            </div>
          )}

          {/* 디바이스별 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-4">
            <h2 className="font-bold text-slate-900 mb-3">디바이스별</h2>
            <div className="grid grid-cols-3 gap-3">
              {data.devices.map((r) => (
                <div key={r.device} className="text-center">
                  <div className="text-2xl mb-1">
                    {r.device === 'mobile' ? '📱' : r.device === 'desktop' ? '💻' : '📟'}
                  </div>
                  <div className="text-xl font-black text-slate-900">{r.users}</div>
                  <div className="text-slate-400 text-xs">{r.device}</div>
                  <div className="text-slate-400 text-xs">참여 {engageRate(r.engaged, r.sessions)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 소스/매체별 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-4">
            <h2 className="font-bold text-slate-900 mb-3">유입 소스별</h2>
            <div className="space-y-2">
              {data.sources.map((r, i) => {
                const label = r.source === '(not set)' || r.source === '(data not available)' ? '(미확인)' : `${r.source}/${r.medium}`
                const pct = s.totalUsers > 0 ? Math.round((r.users / s.totalUsers) * 100) : 0
                const isLowEngage = r.sessions > 10 && r.engaged === 0
                return (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className={`font-medium ${isLowEngage ? 'text-red-600' : 'text-slate-700'}`}>
                        {label} {isLowEngage && '⚠️'}
                      </span>
                      <span className="text-slate-500">{r.users}명 ({pct}%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${isLowEngage ? 'bg-red-400' : 'bg-indigo-400'}`}
                          style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-slate-400 w-16 text-right">참여 {engageRate(r.engaged, r.sessions)}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 국가별 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-4">
            <h2 className="font-bold text-slate-900 mb-3">국가별</h2>
            <div className="space-y-2">
              {data.countries.map((r, i) => {
                const name = COUNTRY_KR[r.country] ?? r.country
                const pct = s.totalUsers > 0 ? Math.round((r.users / s.totalUsers) * 100) : 0
                const isSuspect = SUSPECT_COUNTRIES.has(r.country)
                const isKorea = r.country === 'South Korea'
                return (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className={`font-medium ${isKorea ? 'text-blue-600' : isSuspect ? 'text-red-600' : 'text-slate-700'}`}>
                        {name} {isSuspect && '⚠️'} {isKorea && '✅'}
                      </span>
                      <span className="text-slate-500">{r.users}명 ({pct}%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${isKorea ? 'bg-blue-400' : isSuspect ? 'bg-red-400' : 'bg-slate-300'}`}
                          style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-slate-400 w-16 text-right">참여 {engageRate(r.engaged, r.sessions)}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 랜딩페이지별 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-4">
            <h2 className="font-bold text-slate-900 mb-3">랜딩페이지별</h2>
            <div className="space-y-2">
              {data.pages.filter((r) => r.page).map((r, i) => {
                const pct = s.totalUsers > 0 ? Math.round((r.users / s.totalUsers) * 100) : 0
                return (
                  <div key={i} className="flex justify-between items-center text-sm py-1.5 border-b border-slate-50 last:border-0">
                    <span className="text-slate-700 font-medium truncate mr-2">{r.page || '/'}</span>
                    <div className="text-right shrink-0">
                      <span className="text-slate-900 font-bold">{r.users}명</span>
                      <span className="text-slate-400 ml-2">참여 {engageRate(r.engaged, r.sessions)}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Claude 분석 버튼 */}
          <button
            onClick={() => {
              const prompt = `아래는 우리 서비스의 GA4 트래픽 데이터야. 딱 3줄로 분석해줘.

[서비스] AI 시대 생존력 진단 (한국 타겟) | mcodegc.com

[트래픽] (${data.startDate} ~ ${data.endDate})
총 방문자 ${s.totalUsers} | 한국 ${s.koreaUsers} | 참여세션 ${s.totalEngaged}/${s.totalSessions} (${engagePct}%) | 해외 ${botPct}%

[소스별] ${data.sources.slice(0, 5).map(r => `${r.source}/${r.medium}: ${r.users}명(참여${engageRate(r.engaged, r.sessions)})`).join(' | ')}

[국가별] ${data.countries.slice(0, 5).map(r => `${r.country}: ${r.users}명`).join(' | ')}

[답변 형식] 반드시 아래 3줄만 답변해:
1줄: 트래픽 품질 한줄 진단
2줄: 가장 큰 문제점 + 원인
3줄: 지금 바로 해야 할 액션 1가지`
              navigator.clipboard.writeText(prompt)
              alert('Claude에 붙여넣기하세요! (프롬프트가 복사되었습니다)')
            }}
            className="w-full bg-white border border-slate-300 rounded-xl py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100 transition mb-8"
          >
            Claude에게 심층 분석 요청하기 (복사)
          </button>
        </>
      )}
    </main>
  )
}
