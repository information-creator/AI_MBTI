'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  BarChart3,
  TrendingDown,
  TestTube,
  BookOpen,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Globe,
  Ruler,
} from 'lucide-react'

function MetaIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 287.56 191" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="meta-a" x1="62.34" y1="101.45" x2="260.34" y2="91.45" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#0064e1" />
          <stop offset=".4" stopColor="#0064e1" />
          <stop offset=".83" stopColor="#0073ee" />
          <stop offset="1" stopColor="#0082fb" />
        </linearGradient>
        <linearGradient id="meta-b" x1="41.42" y1="53" x2="41.42" y2="126" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#0082fb" />
          <stop offset="1" stopColor="#0064e0" />
        </linearGradient>
      </defs>
      <path d="M31.06,126c0,11,2.41,19.41,5.56,24.51A19,19,0,0,0,53.19,160c8.1,0,15.51-2,29.79-21.76,11.44-15.83,24.92-38,34-52L132.24,62.7c10.67-16.47,23-34.79,37.15-47.22C181,5.4,193.54,0,206.09,0c21.07,0,41.14,12.21,56.5,35.11,16.81,25.08,25,56.67,25,89.27,0,19.38-3.82,33.62-10.32,44.87C271,180.13,258.72,191,238.13,191V160c17.63,0,22-16.2,22-34.74,0-26.42-6.16-55.74-19.73-76.69-9.63-14.86-22.11-23.94-35.84-23.94-14.85,0-26.8,11.2-40.23,31.17-7.14,10.61-14.47,23.54-22.7,38.13L127.6,110.54c-12.54,22.16-15.72,27.22-22,35.58C94.62,160.78,85.25,166,72.74,166c-21.55,0-34.26-10.25-42.13-21.53C24.34,135.5,21,123.31,21,109.55Z" fill="#0081fb" />
      <path d="M24.49,37.3C38.73,15.35,59.28,0,82.85,0c13.65,0,27.22,4,41.39,15.61,15.5,12.65,32,33.48,52.63,67.81l7.39,12.32c17.84,29.72,28,45,33.93,52.22,7.64,9.26,13,12,19.94,12,17.63,0,22-16.2,22-34.74l27.4-.86c0,19.38-3.82,33.62-10.32,44.87C271,180.13,258.72,191,238.13,191c-12.8,0-24.14-2.78-36.68-14.61-9.64-9.08-20.91-25.21-29.58-39.71L146.08,93.6c-12.94-21.62-24.81-37.74-31.68-45C107,40.71,97.51,31.23,82.35,31.23c-12.27,0-22.69,8.61-31.41,21.78Z" fill="url(#meta-a)" />
      <path d="M82.35,31.23c-12.27,0-22.69,8.61-31.41,21.78C38.61,71.62,31.06,99.34,31.06,126c0,11,2.41,19.41,5.56,24.51L10.14,167.67C3.93,157.53,0,143.34,0,123.52,0,92.76,8.44,60.69,24.49,37.3,38.73,15.35,59.28,0,82.85,0Z" fill="url(#meta-b)" />
    </svg>
  )
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  )
}
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Pie,
  PieChart,
  Cell,
  LabelList,
} from 'recharts'
import dynamic from 'next/dynamic'
const WorldMap = dynamic(() => import('@/components/dashboard/WorldMap'), { ssr: false })

import { fetchGA4, fetchMetaAds, fetchGoogleAds, fetchABTest } from '@/lib/dashboard/api'
import { evaluateAds, evaluateFunnel } from '@/lib/dashboard/diagnostics'
import { BENCHMARKS, compareBenchmark } from '@/lib/dashboard/benchmarks'
import type { GA4Data, MetaAdsData, GoogleAdsData, ABTestData, DiagItem, DiagLevel } from '@/lib/dashboard/types'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'

const PASS = '720972'

type View = 'overview' | 'funnel' | 'meta' | 'google' | 'abtest' | 'ebooks' | 'traffic' | 'benchmarks'
type EbookItem = { id: number | string; title: string; students: number }
type EbooksData = { ebooks: EbookItem[]; fetchedAt: string }

type TrafficSource = { source: string; medium: string; users: number; sessions: number; engaged: number }
type TrafficCountry = { country: string; users: number; sessions: number; engaged: number }
type TrafficDevice = { device: string; users: number; sessions: number; engaged: number }
type TrafficPage = { page: string; users: number; sessions: number; engaged: number }
type TrafficData = {
  sources: TrafficSource[]
  countries: TrafficCountry[]
  devices: TrafficDevice[]
  pages: TrafficPage[]
  summary: { totalUsers: number; totalSessions: number; totalEngaged: number; koreaUsers: number }
  startDate: string
  endDate: string
}

const COUNTRY_KR: Record<string, string> = {
  'South Korea': '한국', 'India': '인도', 'Pakistan': '파키스탄', 'Bangladesh': '방글라데시',
  'Nepal': '네팔', 'Egypt': '이집트', 'Ethiopia': '에티오피아', 'Algeria': '알제리',
  'Indonesia': '인도네시아', 'Iraq': '이라크', 'United States': '미국', 'Japan': '일본',
  'China': '중국', 'Vietnam': '베트남', 'Philippines': '필리핀', 'Thailand': '태국',
  'Nigeria': '나이지리아', 'Morocco': '모로코', 'Turkey': '터키', '(not set)': '(미확인)',
}
const SUSPECT_COUNTRIES = new Set(['India', 'Pakistan', 'Bangladesh', 'Nepal', 'Egypt', 'Ethiopia', 'Algeria', 'Indonesia', 'Iraq', 'Nigeria', 'Morocco', 'Vietnam', 'Philippines'])

const VARIANT_LABELS: Record<string, { name: string; color: string }> = {
  v1: { name: 'V1 공포소구', color: 'var(--chart-1)' },
  v3: { name: 'V3 사회적 증거', color: 'var(--chart-2)' },
  v4: { name: 'V4 극심플', color: 'var(--chart-3)' },
}

function daysAgo(dateStr: string, days: number) {
  const d = new Date(dateStr)
  d.setDate(d.getDate() - days)
  return d.toISOString().slice(0, 10)
}

export default function Dashboard3Page() {
  const [authed, setAuthed] = useState(false)
  const [checked, setChecked] = useState(false)
  const [input, setInput] = useState('')

  useEffect(() => {
    const saved = sessionStorage.getItem('dashboard3_auth') === 'true'
    if (saved) setAuthed(true)
    setChecked(true)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (input === PASS) {
      sessionStorage.setItem('dashboard3_auth', 'true')
      setAuthed(true)
    }
  }

  if (!checked) return <main className="min-h-screen bg-background" />

  if (!authed) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>AIMBTI 대시보드 v3</CardTitle>
            <CardDescription>비밀번호를 입력하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-3">
              <Input
                type="password"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="비밀번호"
                autoFocus
                className="text-center tracking-widest text-lg"
              />
              <Button type="submit" className="w-full">확인</Button>
            </form>
          </CardContent>
        </Card>
      </main>
    )
  }

  return <DashboardShell />
}

function DashboardShell() {
  const [view, setView] = useState<View>('overview')
  const [startDate, setStartDate] = useState('2026-03-03')
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10))
  const [sidebarWidth, setSidebarWidth] = useState(320) // px

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault()
    const handleMove = (ev: MouseEvent) => {
      const w = Math.max(200, Math.min(600, ev.clientX))
      setSidebarWidth(w)
    }
    const handleUp = () => {
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', handleUp)
  }

  const [ga4, setGa4] = useState<GA4Data | null>(null)
  const [meta, setMeta] = useState<MetaAdsData | null>(null)
  const [google, setGoogle] = useState<GoogleAdsData | null>(null)
  const [ab, setAb] = useState<ABTestData[] | null>(null)
  const [ebooks, setEbooks] = useState<EbooksData | null>(null)
  const [traffic, setTraffic] = useState<TrafficData | null>(null)
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const [g, m, goog, abr, eb, tr] = await Promise.allSettled([
      fetchGA4(startDate, endDate),
      fetchMetaAds(startDate, endDate),
      fetchGoogleAds(startDate, endDate),
      fetchABTest(startDate, endDate),
      fetch(`/api/metacode-ebooks?pass=${PASS}`).then(r => (r.ok ? r.json() : null)),
      fetch(`/api/ga4-traffic?pass=${PASS}&start=${startDate}&end=${endDate}`).then(r => (r.ok ? r.json() : null)),
    ])
    if (g.status === 'fulfilled') setGa4(g.value)
    if (m.status === 'fulfilled') setMeta(m.value)
    if (goog.status === 'fulfilled') setGoogle(goog.value)
    if (abr.status === 'fulfilled') setAb(abr.value.variants)
    if (eb.status === 'fulfilled' && eb.value) setEbooks(eb.value)
    if (tr.status === 'fulfilled' && tr.value) setTraffic(tr.value)
    setLoading(false)
  }, [startDate, endDate])

  useEffect(() => { load() }, [load])

  const setPreset = (days: number) => {
    const now = new Date().toISOString().slice(0, 10)
    setEndDate(now)
    setStartDate(daysAgo(now, days - 1))
  }

  const ev = ga4?.events ?? {}
  const getEv = (n: string) => ev[n]?.users ?? 0
  const totalUsers = ga4?.totalUsers ?? 0
  const ctaClick = getEv('cta_click')
  const testStart = getEv('test_start')
  const testComplete = getEv('test_complete')
  const resultView = getEv('result_view')
  const openchat = getEv('openchat_click')
  const ebookClick = getEv('ebook_click')
  const share = getEv('share_click')
  const secondaryTotal = openchat + ebookClick + share
  const ebooksTotal = ebooks?.ebooks.reduce((s, e) => s + e.students, 0) ?? 0

  const totalSpend = (meta?.totals.spend ?? 0) + (google?.totals.spend ?? 0)
  const totalClicks = (meta?.totals.clicks ?? 0) + (google?.totals.clicks ?? 0)
  const blendedCPC = totalClicks > 0 ? Math.round(totalSpend / totalClicks) : 0
  const effectiveCPA = secondaryTotal > 0 ? Math.round(totalSpend / secondaryTotal) : 0
  const cpaCmp = effectiveCPA > 0 ? compareBenchmark(effectiveCPA, BENCHMARKS.overall.cpa_target, false) : null
  const e2e = totalUsers > 0 ? (secondaryTotal / totalUsers) * 100 : 0
  const completionRate = testStart > 0 ? (testComplete / testStart) * 100 : 0

  const funnel = [
    { label: '방문', value: totalUsers },
    { label: 'CTA 클릭', value: ctaClick },
    { label: '테스트 시작', value: testStart },
    { label: '테스트 완료', value: testComplete },
    { label: '결과 확인', value: resultView },
    { label: '2차 전환', value: secondaryTotal },
  ]

  const diag: DiagItem[] = [
    ...evaluateFunnel(funnel),
    ...(meta ? evaluateAds('Meta', meta.totals) : []),
    ...(google ? evaluateAds('Google', google.totals) : []),
  ]
  if (resultView > 0) {
    const secRate = (secondaryTotal / resultView) * 100
    const secLevel: DiagLevel = secRate >= 15 ? 'good' : secRate >= 5 ? 'warn' : 'bad'
    diag.push({
      label: '결과→2차 전환',
      level: secLevel,
      value: `${secRate.toFixed(1)}%`,
      comment: secLevel === 'good' ? '전환 양호' : secLevel === 'warn' ? '전환 보통 — CTA 강화 고려' : '전환 낮음 — 노출/문구 개선 필요',
    })
  }

  const cpaOk = effectiveCPA > 0 && effectiveCPA <= BENCHMARKS.overall.cpa_target * 1.5
  const overallLevel: DiagLevel = e2e >= 3 && cpaOk ? 'good' : e2e >= 1 ? 'warn' : 'bad'
  const badCount = diag.filter(i => i.level === 'bad').length
  const warnCount = diag.filter(i => i.level === 'warn').length
  const goodCount = diag.filter(i => i.level === 'good').length

  const navItems: { id: View; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: '종합', icon: BarChart3 },
    { id: 'funnel', label: '퍼널', icon: TrendingDown },
    { id: 'traffic', label: '트래픽 분석', icon: Globe },
    { id: 'meta', label: 'Meta Ads', icon: MetaIcon },
    { id: 'google', label: 'Google Ads', icon: GoogleIcon },
    { id: 'abtest', label: 'A/B 테스트', icon: TestTube },
    { id: 'ebooks', label: '전자책 수강', icon: BookOpen },
    { id: 'benchmarks', label: '지표 기준', icon: Ruler },
  ]

  const viewTitle: Record<View, string> = {
    overview: '종합 대시보드',
    funnel: '퍼널 분석',
    traffic: '트래픽 분석',
    meta: 'Meta Ads',
    google: 'Google Ads',
    abtest: 'A/B 테스트',
    ebooks: '전자책 수강생',
    benchmarks: '지표 기준',
  }

  return (
    <SidebarProvider style={{ '--sidebar-width': `${sidebarWidth}px` } as React.CSSProperties}>
      <Sidebar collapsible="icon">
        {/* 드래그 리사이저 */}
        <div
          onMouseDown={startResize}
          className="absolute top-0 right-0 z-20 h-full w-1 cursor-col-resize bg-transparent hover:bg-primary/40 transition-colors group-data-[collapsible=icon]:hidden"
          title="드래그해서 사이드바 크기 조절"
        />
        <SidebarHeader className="px-4 py-4 border-b">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/favicon.png" alt="AIMBTI" className="w-10 h-10 rounded-lg shrink-0 object-cover" />
            <div className="group-data-[collapsible=icon]:hidden">
              <p className="text-base font-black leading-none">AIMBTI</p>
              <p className="text-sm text-muted-foreground mt-1">대시보드 v3</p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-sm font-bold">메뉴</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map(item => {
                  const active = view === item.id
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        isActive={active}
                        onClick={() => setView(item.id)}
                        tooltip={item.label}
                        className={`text-base h-11 ${active ? 'bg-primary text-primary-foreground font-black hover:bg-primary hover:text-primary-foreground shadow-sm' : 'font-semibold'}`}
                      >
                        <item.icon className={`${active ? 'h-5 w-5' : 'h-5 w-5'}`} />
                        <span>{item.label}</span>
                        {active && <span className="ml-auto text-xs">●</span>}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        {/* 상단 헤더 */}
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 sticky top-0 bg-background z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-black">{viewTitle[view]}</h1>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1 border rounded-md p-0.5">
              {[{ label: '오늘', days: 1 }, { label: '7일', days: 7 }, { label: '30일', days: 30 }].map(p => (
                <Button key={p.label} variant="ghost" size="sm" onClick={() => setPreset(p.days)} className="h-7 px-2 text-xs">
                  {p.label}
                </Button>
              ))}
            </div>
            <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="h-8 w-36 text-xs" />
            <span className="text-xs text-muted-foreground">~</span>
            <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="h-8 w-36 text-xs" />
            <Button size="sm" onClick={load} disabled={loading}>
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              새로고침
            </Button>
          </div>
          <span className="text-sm font-mono text-muted-foreground">{startDate} ~ {endDate}</span>
        </header>

        <div className="flex-1 p-4 md:p-6 max-w-5xl w-full">
          {view === 'overview' && (
            <OverviewTab
              overallLevel={overallLevel}
              badCount={badCount}
              warnCount={warnCount}
              goodCount={goodCount}
              totalUsers={totalUsers}
              testComplete={testComplete}
              resultView={resultView}
              secondaryTotal={secondaryTotal}
              ebooksTotal={ebooksTotal}
              totalSpend={totalSpend}
              blendedCPC={blendedCPC}
              effectiveCPA={effectiveCPA}
              cpaCmp={cpaCmp}
              e2e={e2e}
              completionRate={completionRate}
              funnel={funnel}
              diag={diag}
              meta={meta}
              google={google}
              resultViewCount={resultView}
              openchat={openchat}
              ebookClick={ebookClick}
              share={share}
              startDate={startDate}
              endDate={endDate}
            />
          )}
          {view === 'funnel' && <FunnelTab funnel={funnel} />}
          {view === 'traffic' && <TrafficTab data={traffic} />}
          {view === 'meta' && <AdsTab title="Meta" totals={meta?.totals} campaigns={meta?.campaigns ?? []} benchmark={BENCHMARKS.ads.meta} />}
          {view === 'google' && <AdsTab title="Google" totals={google?.totals} campaigns={google?.campaigns ?? []} benchmark={BENCHMARKS.ads.google} />}
          {view === 'abtest' && <ABTestTab variants={ab ?? []} />}
          {view === 'ebooks' && <EbooksTab ebooks={ebooks} total={ebooksTotal} />}
          {view === 'benchmarks' && <BenchmarksTab />}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

/* ========== 종합 뷰 ========== */
type AdTotalsLite = {
  spend: number
  impressions: number
  clicks: number
  ctr: number
  cpc: number
  cpm: number
  conversions: number
}

function OverviewTab(p: {
  overallLevel: DiagLevel
  badCount: number; warnCount: number; goodCount: number
  totalUsers: number; testComplete: number; resultView: number
  secondaryTotal: number; ebooksTotal: number
  totalSpend: number; blendedCPC: number; effectiveCPA: number
  cpaCmp: ReturnType<typeof compareBenchmark> | null
  e2e: number; completionRate: number
  funnel: { label: string; value: number }[]
  diag: DiagItem[]
  meta: MetaAdsData | null
  google: GoogleAdsData | null
  resultViewCount: number; openchat: number; ebookClick: number; share: number
  startDate: string; endDate: string
}) {
  const verdictIcon = p.overallLevel === 'good' ? CheckCircle2 : p.overallLevel === 'warn' ? AlertTriangle : AlertCircle
  const VerdictIcon = verdictIcon
  const verdictVariant = p.overallLevel === 'good' ? 'default' : p.overallLevel === 'warn' ? 'secondary' : 'destructive'
  const worst = p.diag.find(i => i.level === 'bad') ?? p.diag.find(i => i.level === 'warn')

  return (
    <div className="space-y-4">
      {/* 요약 배너 */}
      <Card>
        <CardContent className="flex items-center gap-3 py-2">
          <VerdictIcon className={`h-8 w-8 shrink-0 ${p.overallLevel === 'good' ? 'text-green-600' : p.overallLevel === 'warn' ? 'text-yellow-600' : 'text-red-600'}`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={verdictVariant as 'default' | 'secondary' | 'destructive'}>
                {p.overallLevel === 'good' ? '양호' : p.overallLevel === 'warn' ? '주의' : '위험'}
              </Badge>
              <span className="text-base text-muted-foreground">전체 전환율 {p.e2e.toFixed(2)}% · 완료율 {p.completionRate.toFixed(0)}%</span>
            </div>
            <p className="text-base font-semibold leading-snug">
              {worst ? `가장 큰 병목: ${worst.label} ${worst.value} — ${worst.comment}` : '병목 없음 — 스케일업 준비 완료'}
            </p>
          </div>
          <div className="hidden md:flex gap-1.5 text-xs">
            <Badge variant="destructive" className="font-mono">위험 {p.badCount}</Badge>
            <Badge variant="secondary" className="font-mono">주의 {p.warnCount}</Badge>
            <Badge variant="outline" className="font-mono">양호 {p.goodCount}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* KPI 4개 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="총 방문" value={p.totalUsers.toLocaleString()} sub={`결과 확인 ${p.resultView.toLocaleString()}명`} />
        <KpiCard label={<><span>2차 전환</span><span className="block text-xs font-normal text-muted-foreground">(단톡·전자책·공유 클릭)</span></>} value={p.secondaryTotal.toLocaleString()} sub={`E2E ${p.e2e.toFixed(2)}%`} highlight />
        <KpiCard label="유효 CPA (전환당 비용)" value={p.effectiveCPA > 0 ? `₩${p.effectiveCPA.toLocaleString()}` : '-'} sub={p.cpaCmp ? `목표 대비 ${p.cpaCmp.label}` : '목표 ₩5,000'} statusColor={p.cpaCmp?.level} />
        <KpiCard label="전자책 수강" value={p.ebooksTotal.toLocaleString()} sub="메타코드 실등록" />
      </div>

      {/* 3컬럼: 퍼널 차트 | 광고 요약 | 진단 */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">퍼널</CardTitle>
            <CardDescription className="text-sm">단계별 전환 흐름</CardDescription>
          </CardHeader>
          <CardContent>
            <FunnelMiniChart data={p.funnel} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">광고 성과</CardTitle>
            <CardDescription className="text-sm">Meta · Google · 통합</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <AdRow title="Meta" totals={p.meta?.totals} benchmark={BENCHMARKS.ads.meta} />
            <Separator />
            <AdRow title="Google" totals={p.google?.totals} benchmark={BENCHMARKS.ads.google} />
            <Separator />
            <div className="flex justify-between text-base">
              <span className="text-muted-foreground">통합 CPC (클릭당)</span>
              <span className="font-mono font-bold">₩{p.blendedCPC.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-base">
              <span className="text-muted-foreground">총 광고비</span>
              <span className="font-mono font-bold">₩{p.totalSpend.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">진단</CardTitle>
            <CardDescription className="text-sm">지표별 상태</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {p.diag
              .slice()
              .sort((a, b) => ({ bad: 0, warn: 1, good: 2 }[a.level] - { bad: 0, warn: 1, good: 2 }[b.level]))
              .slice(0, 8)
              .map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-base">
                  <span className={`w-2 h-2 rounded-full mt-2 shrink-0 ${item.level === 'good' ? 'bg-green-500' : item.level === 'warn' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline gap-2">
                      <span className="truncate font-semibold">{item.label}</span>
                      <span className="font-mono font-bold text-sm shrink-0">{item.value}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.comment}</p>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>

      {/* 2차 전환 분해 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            2차 전환 분해
            <span className="block text-sm font-normal text-muted-foreground">(단톡·전자책·공유 클릭)</span>
          </CardTitle>
          <CardDescription className="text-sm">결과 확인 {p.resultViewCount.toLocaleString()}명 중 각 채널 클릭 비율</CardDescription>
        </CardHeader>
        <CardContent>
          <SecondaryChart openchat={p.openchat} ebook={p.ebookClick} share={p.share} resultView={p.resultViewCount} />
        </CardContent>
      </Card>

    </div>
  )
}

function DeviceChart({ devices, total }: { devices: TrafficDevice[]; total: number }) {
  const COLORS: Record<string, string> = {
    mobile: 'var(--chart-1)',
    desktop: 'var(--chart-2)',
    tablet: 'var(--chart-3)',
  }
  const DEVICE_KR: Record<string, string> = { mobile: '모바일', desktop: '데스크탑', tablet: '태블릿' }
  const chartData = devices.map(d => ({
    device: DEVICE_KR[d.device] ?? d.device,
    users: d.users,
    fill: COLORS[d.device] ?? 'var(--chart-4)',
  }))
  const chartConfig: ChartConfig = Object.fromEntries(
    chartData.map(d => [d.device, { label: d.device, color: d.fill }]),
  )
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">📱 디바이스 비율</CardTitle>
        <CardDescription className="text-sm">총 {total.toLocaleString()}명</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[180px] w-full">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="device" />} />
            <Pie data={chartData} dataKey="users" nameKey="device" innerRadius={40} outerRadius={70} strokeWidth={2}>
              {chartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="space-y-1 mt-2">
          {chartData.map(d => {
            const pct = total > 0 ? Math.round((d.users / total) * 100) : 0
            return (
              <div key={d.device} className="flex items-center gap-2 text-sm">
                <span className="w-3 h-3 rounded-sm shrink-0" style={{ background: d.fill }} />
                <span className="flex-1">{d.device}</span>
                <span className="font-mono font-bold">{d.users.toLocaleString()}</span>
                <span className="font-mono text-muted-foreground text-xs w-10 text-right">{pct}%</span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

function GeoChart({ korea, overseas }: { korea: number; overseas: number }) {
  const total = korea + overseas
  const chartData = [
    { label: '한국', users: korea, fill: 'var(--chart-2)' },
    { label: '해외', users: overseas, fill: overseas > korea * 0.3 ? 'var(--destructive)' : 'var(--chart-4)' },
  ]
  const chartConfig: ChartConfig = {
    한국: { label: '한국', color: 'var(--chart-2)' },
    해외: { label: '해외', color: 'var(--chart-4)' },
  }
  const overseasPct = total > 0 ? Math.round((overseas / total) * 100) : 0
  const overseasLevel: DiagLevel = overseasPct > 30 ? 'bad' : overseasPct > 15 ? 'warn' : 'good'
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">🌏 한국 vs 해외</CardTitle>
        <CardDescription className="text-sm">해외 비율 {overseasPct}% ({overseasLevel === 'bad' ? '봇 의심' : overseasLevel === 'warn' ? '주의' : '양호'})</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[180px] w-full">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="label" />} />
            <Pie data={chartData} dataKey="users" nameKey="label" innerRadius={40} outerRadius={70} strokeWidth={2}>
              {chartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="space-y-1 mt-2">
          {chartData.map(d => {
            const pct = total > 0 ? Math.round((d.users / total) * 100) : 0
            return (
              <div key={d.label} className="flex items-center gap-2 text-sm">
                <span className="w-3 h-3 rounded-sm shrink-0" style={{ background: d.fill }} />
                <span className="flex-1">{d.label}</span>
                <span className="font-mono font-bold">{d.users.toLocaleString()}</span>
                <span className="font-mono text-muted-foreground text-xs w-10 text-right">{pct}%</span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

function SourcesChart({ sources }: { sources: TrafficSource[] }) {
  const top = sources
    .slice(0, 5)
    .map((r, i) => ({
      label: (r.source === '(not set)' || r.source === '(data not available)' ? '(미확인)' : r.source).slice(0, 12),
      users: r.users,
      engaged: r.engaged > 0,
      fill: r.sessions > 10 && r.engaged === 0 ? 'var(--destructive)' : `var(--chart-${(i % 5) + 1})`,
    }))
  const chartConfig: ChartConfig = { users: { label: '사용자' } }
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">🚪 유입 소스 Top 5</CardTitle>
        <CardDescription className="text-sm">빨간 막대는 참여율 0 (봇 의심)</CardDescription>
      </CardHeader>
      <CardContent>
        {top.length === 0 ? (
          <p className="text-sm text-muted-foreground">데이터 없음</p>
        ) : (
          <ChartContainer config={chartConfig} className="h-[260px] w-full">
            <BarChart data={top} layout="vertical" margin={{ left: 8, right: 24 }}>
              <CartesianGrid horizontal={false} />
              <XAxis type="number" hide />
              <YAxis dataKey="label" type="category" tickLine={false} axisLine={false} width={80} className="text-xs" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="users" radius={4}>
                {top.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                <LabelList dataKey="users" position="right" className="text-xs font-bold" />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

function TrafficTab({ data }: { data: TrafficData | null }) {
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>트래픽 분석</CardTitle>
          <CardDescription>데이터 불러오는 중...</CardDescription>
        </CardHeader>
      </Card>
    )
  }
  const s = data.summary
  const botUsers = s.totalUsers - s.koreaUsers
  const botPct = s.totalUsers > 0 ? Math.round((botUsers / s.totalUsers) * 100) : 0
  const engagePct = s.totalSessions > 0 ? Math.round((s.totalEngaged / s.totalSessions) * 100) : 0
  const engageRate = (engaged: number, sessions: number) => {
    if (sessions === 0) return '0%'
    return Math.round((engaged / sessions) * 100) + '%'
  }

  // 상태 평가
  const overallLevel: DiagLevel = botPct > 30 ? 'bad' : botPct > 15 ? 'warn' : 'good'
  const OverallIcon = overallLevel === 'good' ? CheckCircle2 : overallLevel === 'warn' ? AlertTriangle : AlertCircle
  const overallColor = overallLevel === 'good' ? 'text-green-600' : overallLevel === 'warn' ? 'text-yellow-600' : 'text-red-600'
  const headline = botPct > 30
    ? `해외 트래픽 ${botPct}% — 봇 트래픽 의심 수준입니다`
    : botPct > 15
    ? `해외 트래픽 ${botPct}% — 주의 필요`
    : `해외 트래픽 ${botPct}% — 타겟팅 양호`
  const action = botPct > 30
    ? `${botUsers.toLocaleString()}명이 해외 유입입니다. Google Ads 지역 타겟을 한국으로 제한하고 디스플레이 네트워크(GDN)를 끄세요.`
    : botPct > 15
    ? '해외 유입 비율이 높습니다. 광고 타겟 지역 확인 권장.'
    : `참여율 ${engagePct}% · 한국 사용자 ${s.koreaUsers.toLocaleString()}명으로 타겟팅이 잘 되고 있습니다.`

  return (
    <div className="space-y-4">
      {/* 상단 평가 배너 */}
      <Card>
        <CardContent className="flex items-start gap-3 py-3">
          <OverallIcon className={`h-8 w-8 shrink-0 mt-0.5 ${overallColor}`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={overallLevel === 'good' ? 'default' : overallLevel === 'warn' ? 'secondary' : 'destructive'}>
                {overallLevel === 'good' ? '양호' : overallLevel === 'warn' ? '주의' : '위험'}
              </Badge>
              <span className="text-base text-muted-foreground">
                방문 {s.totalUsers.toLocaleString()} · 세션 {s.totalSessions.toLocaleString()} · 참여율 {engagePct}%
              </span>
            </div>
            <p className="text-base font-semibold leading-snug">{headline}</p>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{action}</p>
          </div>
        </CardContent>
      </Card>

      {/* 4개 KPI */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="총 방문자" value={s.totalUsers.toLocaleString()} sub={`세션 ${s.totalSessions.toLocaleString()}`} />
        <KpiCard label="한국 사용자" value={s.koreaUsers.toLocaleString()} sub={`전체의 ${s.totalUsers > 0 ? Math.round((s.koreaUsers / s.totalUsers) * 100) : 0}%`} highlight />
        <KpiCard label="참여율" value={`${engagePct}%`} sub={`${s.totalEngaged.toLocaleString()} / ${s.totalSessions.toLocaleString()}`} statusColor={engagePct >= 40 ? 'good' : engagePct >= 20 ? 'warn' : 'bad'} />
        <KpiCard label="해외 트래픽" value={`${botPct}%`} sub={`${botUsers.toLocaleString()}명`} statusColor={botPct > 30 ? 'bad' : botPct > 15 ? 'warn' : 'good'} />
      </div>

      {/* 시각화 3컬럼: 디바이스 / 한국 vs 해외 / 유입 소스 Top5 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DeviceChart devices={data.devices} total={s.totalUsers} />
        <GeoChart korea={s.koreaUsers} overseas={botUsers} />
        <SourcesChart sources={data.sources} />
      </div>

      {/* 유입 소스 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">유입 소스별</CardTitle>
          <CardDescription className="text-sm">어디서 들어왔는지 — 참여율이 0이면 봇 의심</CardDescription>
        </CardHeader>
        <CardContent>
          <Table className="text-base">
            <TableHeader>
              <TableRow>
                <TableHead>소스 / 매체</TableHead>
                <TableHead className="text-right">사용자</TableHead>
                <TableHead className="text-right">비중</TableHead>
                <TableHead className="text-right">참여율</TableHead>
                <TableHead className="text-right">상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.sources.map((r, i) => {
                const label = r.source === '(not set)' || r.source === '(data not available)' ? '(미확인)' : `${r.source}/${r.medium}`
                const pct = s.totalUsers > 0 ? Math.round((r.users / s.totalUsers) * 100) : 0
                const isLow = r.sessions > 10 && r.engaged === 0
                return (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{label}</TableCell>
                    <TableCell className="text-right font-mono">{r.users.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono">{pct}%</TableCell>
                    <TableCell className="text-right font-mono">{engageRate(r.engaged, r.sessions)}</TableCell>
                    <TableCell className="text-right">
                      {isLow ? <Badge variant="destructive">봇 의심</Badge> : r.engaged > 0 ? <Badge variant="default">OK</Badge> : <Badge variant="secondary">-</Badge>}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 세계 지도 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">🗺️ 국가별 분포 (세계 지도)</CardTitle>
          <CardDescription className="text-sm">색이 진할수록 유입이 많음 · 한국은 파랑 · 스크롤·드래그로 확대/이동 · 마우스 올리면 수치 표시</CardDescription>
        </CardHeader>
        <CardContent>
          <WorldMap data={data.countries} />
        </CardContent>
      </Card>

      {/* 국가별 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">국가별 상세</CardTitle>
          <CardDescription className="text-sm">한국 외 국가 유입이 많으면 광고 지역 타겟 확인 필요</CardDescription>
        </CardHeader>
        <CardContent>
          <Table className="text-base">
            <TableHeader>
              <TableRow>
                <TableHead>국가</TableHead>
                <TableHead className="text-right">사용자</TableHead>
                <TableHead className="text-right">비중</TableHead>
                <TableHead className="text-right">참여율</TableHead>
                <TableHead className="text-right">상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.countries.map((r, i) => {
                const name = COUNTRY_KR[r.country] ?? r.country
                const pct = s.totalUsers > 0 ? Math.round((r.users / s.totalUsers) * 100) : 0
                const isSuspect = SUSPECT_COUNTRIES.has(r.country)
                const isKorea = r.country === 'South Korea'
                return (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{name}</TableCell>
                    <TableCell className="text-right font-mono">{r.users.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono">{pct}%</TableCell>
                    <TableCell className="text-right font-mono">{engageRate(r.engaged, r.sessions)}</TableCell>
                    <TableCell className="text-right">
                      {isKorea ? <Badge variant="default">타겟</Badge> : isSuspect ? <Badge variant="destructive">봇 의심</Badge> : <Badge variant="secondary">기타</Badge>}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 랜딩 페이지별 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">랜딩 페이지별</CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="text-base">
            <TableHeader>
              <TableRow>
                <TableHead>페이지</TableHead>
                <TableHead className="text-right">사용자</TableHead>
                <TableHead className="text-right">참여율</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.pages.filter(r => r.page).map((r, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium max-w-md truncate">{r.page || '/'}</TableCell>
                  <TableCell className="text-right font-mono">{r.users.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono">{engageRate(r.engaged, r.sessions)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function AdsGlossary({ platform }: { platform: string }) {
  const common: { term: string; desc: string }[] = [
    { term: '광고비 (Spend)', desc: '기간 내 지출한 광고 비용 총액' },
    { term: '노출 (Impressions)', desc: '광고가 사용자 화면에 표시된 총 횟수' },
    { term: '클릭 (Clicks)', desc: '광고를 클릭한 총 횟수' },
    { term: 'CTR (Click-Through Rate, 클릭률)', desc: '노출 대비 클릭 비율 = 클릭 ÷ 노출 × 100. 광고 소재 반응도를 나타냄. 높을수록 좋음' },
    { term: 'CPC (Cost Per Click, 클릭당 비용)', desc: '클릭 1회당 평균 지출 = 광고비 ÷ 클릭. 낮을수록 효율적' },
    { term: 'CPM (Cost Per Mille, 1,000회 노출당 비용)', desc: '노출 1,000회 달성 비용 = 광고비 ÷ 노출 × 1,000. 타겟 경쟁도 지표. 낮을수록 좋음' },
    { term: '전환 (Conversion)', desc: '광고를 통해 설정한 목표 행동이 일어난 횟수 (가입·구매·Lead 등)' },
    { term: '전환율 (CVR, Conversion Rate)', desc: '클릭 대비 전환 비율 = 전환 ÷ 클릭 × 100. 랜딩페이지 설득력을 나타냄. 높을수록 좋음' },
  ]
  const metaSpecific: { term: string; desc: string }[] = [
    { term: 'Meta Pixel (픽셀)', desc: '웹사이트에 심어 방문·전환을 추적하는 Meta의 스크립트' },
    { term: 'Lead 이벤트', desc: 'Meta Pixel에 설정한 "리드(유입) 완료" 이벤트 — 이 사이트에선 전환 기준' },
    { term: 'Link Click (링크 클릭)', desc: '광고 내 링크를 실제로 눌러 외부로 이동한 횟수 (클릭과 구분)' },
    { term: 'Landing Page View', desc: '광고 클릭 후 랜딩 페이지가 완전히 로드된 횟수. 이 수치와 Link Click 차이가 큰 경우 로딩 이탈이 많다는 뜻' },
  ]
  const googleSpecific: { term: string; desc: string }[] = [
    { term: '전환 액션 (Conversion Action)', desc: 'Google Ads에 직접 등록한 전환 추적 규칙 (폼 제출·결제 등)' },
    { term: '품질 점수 (Quality Score)', desc: 'Google이 1–10으로 매기는 광고·키워드 품질. 높을수록 CPC 할인' },
    { term: '검색 광고 vs 디스플레이', desc: '검색은 키워드 입력 시 노출, 디스플레이는 웹사이트·앱 지면에 노출' },
  ]
  const extras = platform === 'Meta' ? metaSpecific : googleSpecific

  return (
    <Card className="bg-muted/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">🔤 {platform} Ads 용어 설명</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-2 md:grid-cols-2 text-sm">
          {common.map(({ term, desc }) => (
            <div key={term} className="flex gap-2">
              <dt className="font-bold text-foreground shrink-0 min-w-0">{term}</dt>
              <dd className="text-muted-foreground">— {desc}</dd>
            </div>
          ))}
        </dl>
        <p className="text-xs font-bold text-foreground mt-4 mb-2 pt-3 border-t">{platform} 고유 용어</p>
        <dl className="grid gap-2 md:grid-cols-2 text-sm">
          {extras.map(({ term, desc }) => (
            <div key={term} className="flex gap-2">
              <dt className="font-bold text-foreground shrink-0 min-w-0">{term}</dt>
              <dd className="text-muted-foreground">— {desc}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}

function BenchmarksTab() {
  const sections: {
    title: string
    intro: string
    rows: { name: string; value: string; source: string; why: string }[]
  }[] = [
    {
      title: '퍼널 단계',
      intro: '방문 → 결과 확인 → 2차 전환까지 각 구간의 업종 평균',
      rows: [
        { name: '방문 → CTA 클릭', value: '40%', source: 'LeadQuizzes · 업계 경험치', why: '퀴즈 랜딩(단일 CTA 구조) 기준. 30% 미만이면 헤드라인·타겟 품질 점검 필요' },
        { name: 'CTA → 테스트 시작', value: '90%', source: '자동 전환 구조', why: 'CTA를 누르면 /test로 곧바로 이동. 90% 미만이면 로딩 지연·라우팅 오류 의심' },
        { name: '테스트 시작 → 완료', value: '70%', source: 'LeadQuizzes 2024', why: '20문항을 끝까지 응답. 60% 미만이면 문항 수·난이도·질문 카피 검토' },
        { name: '테스트 완료 → 결과 확인', value: '95%', source: '리다이렉트 자동 전환', why: '저장+리다이렉트가 자동이라 95%+ 정상. 미만이면 저장 실패·라우팅 의심' },
        { name: '결과 확인 → 2차 전환', value: '8%', source: '리드젠 CTA 평균', why: '단톡/전자책/공유 중 1개 이상 클릭. 15%+면 양호, 5% 미만이면 CTA 개선 필요' },
      ],
    },
    {
      title: 'Meta Ads',
      intro: 'WordStream 2025 교육 업종 + 국내 Meta 시장 추정치',
      rows: [
        { name: 'CTR (클릭률)', value: '0.9%', source: 'WordStream 2025', why: '노출 대비 클릭률. 2%+ 양호, 0.5% 미만이면 소재 교체 우선' },
        { name: 'CPC (클릭당 비용)', value: '₩1,100', source: '국내 추정치', why: '500원 미만 우수, 1,500원 초과는 타겟·경쟁 재검토' },
        { name: 'CPM (1,000회 노출당)', value: '₩9,800', source: '국내 추정치', why: '타겟 경쟁도. 20,000원+이면 타겟 과도하게 좁거나 고경쟁' },
        { name: 'CVR (전환율)', value: '2.5%', source: 'Meta 리드젠 평균', why: '클릭→전환. 5%+ 우수, 2% 미만이면 랜딩 카피·오퍼 점검' },
      ],
    },
    {
      title: 'Google Ads',
      intro: 'WordStream 2025 교육 업종 + 국내 Google 시장 추정치',
      rows: [
        { name: 'CTR (검색 광고)', value: '3.17%', source: 'WordStream 2025', why: '검색 의도 매칭도. 1.5% 미만이면 키워드·문구 매칭 개선' },
        { name: 'CPC (클릭당 비용)', value: '₩800', source: '국내 추정치', why: '1,500원 초과면 품질점수·입찰 재검토' },
        { name: 'CPM (디스플레이)', value: '₩15,000', source: '국내 GDN', why: 'GDN은 노출 단가가 검색보다 높음' },
        { name: 'CVR (전환율)', value: '3.6%', source: 'WordStream 교육', why: '검색 광고가 Meta보다 전환율 높음 (의도 기반)' },
      ],
    },
    {
      title: '통합 목표',
      intro: '내부 KPI — 전체 채널 통합 기준',
      rows: [
        { name: '유효 CPA', value: '₩5,000', source: '내부 목표치', why: '2차 전환 1건당 허용 광고비. 초과 시 ROAS 악화' },
        { name: 'E2E 전환율', value: '3%+', source: '내부 양호 기준', why: '방문 → 2차 전환까지 전체 비율. 1~3%는 보통, 3%+ 양호' },
      ],
    },
  ]

  return (
    <div className="space-y-4">
      {/* 개요 */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-lg">📘 지표 기준 · 어디서 가져왔나?</CardTitle>
          <CardDescription className="text-base leading-relaxed">
            모든 기준값은 <span className="font-bold text-foreground">교육·온라인강의 업종</span> 평균입니다.
            3개 외부 자료 + 내부 목표치를 조합했습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-3 md:grid-cols-2 text-sm">
            <div className="flex gap-2">
              <dt className="font-bold shrink-0">Unbounce 2024</dt>
              <dd className="text-muted-foreground">— 랜딩 페이지 전환 벤치마크 리포트 (교육 업종 평균)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-bold shrink-0">WordStream 2025</dt>
              <dd className="text-muted-foreground">— Meta·Google 광고 벤치마크 (교육 업종 CTR·CPC·CVR)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-bold shrink-0">LeadQuizzes</dt>
              <dd className="text-muted-foreground">— 퀴즈형 리드젠 플랫폼. 완료율·퍼널 수치 기준</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-bold shrink-0">국내 시장 추정치</dt>
              <dd className="text-muted-foreground">— 국내 Meta·Google 교육 광고의 CPC·CPM (원화 기준)</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* 각 섹션별 상세 테이블 */}
      {sections.map(s => (
        <Card key={s.title}>
          <CardHeader>
            <CardTitle className="text-lg">{s.title}</CardTitle>
            <CardDescription className="text-sm">{s.intro}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table className="text-base">
              <TableHeader>
                <TableRow>
                  <TableHead>지표</TableHead>
                  <TableHead className="text-right">기준값</TableHead>
                  <TableHead>출처</TableHead>
                  <TableHead>판정 기준</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {s.rows.map(r => (
                  <TableRow key={r.name}>
                    <TableCell className="font-bold">{r.name}</TableCell>
                    <TableCell className="text-right font-mono font-black text-lg">{r.value}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{r.source}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{r.why}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}

      {/* 판정 규칙 */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-lg">🎚️ 색 판정 규칙</CardTitle>
          <CardDescription className="text-base">
            현재 값과 기준값의 편차를 <span className="font-bold text-foreground">퍼센트</span>로 계산해 색상 배정
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="font-black text-green-700">🟢 양호</span>
              </div>
              <p className="text-sm text-green-800">기준보다 <span className="font-bold">+10% 이상 우위</span>일 때. 현재 전략 유지</p>
            </div>
            <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span className="font-black text-yellow-700">🟡 주의</span>
              </div>
              <p className="text-sm text-yellow-800">편차 <span className="font-bold">±10% 이내</span>. 개선 여지 있음</p>
            </div>
            <div className="p-4 rounded-lg bg-red-50 border border-red-200">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span className="font-black text-red-700">🔴 위험</span>
              </div>
              <p className="text-sm text-red-800"><span className="font-bold">-20% 이상 열위</span>. 즉시 개선 필요</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// 사이드바 용 컴팩트 버전 (현재 미사용 — 필요시 SidebarContent에 추가)
function _BenchmarkSidebarUnused() {
  const sections: {
    title: string
    intro: string
    rows: { name: string; value: string; source: string }[]
  }[] = [
    {
      title: '퍼널 단계',
      intro: '교육·퀴즈 리드젠 평균',
      rows: [
        { name: '방문 → CTA 클릭', value: '40%', source: 'LeadQuizzes 퀴즈 랜딩 + 업계 경험치 (단일 CTA 기준)' },
        { name: 'CTA → 테스트 시작', value: '90%', source: '자동 전환 구조 · 로딩 이탈만 차감' },
        { name: '테스트 시작 → 완료', value: '70%', source: 'LeadQuizzes 퀴즈 완료율 평균' },
        { name: '테스트 완료 → 결과', value: '95%', source: '리다이렉트 자동 전환 기준' },
        { name: '결과 → 2차 전환', value: '8%', source: '리드젠 CTA 평균 (단톡/전자책/공유)' },
      ],
    },
    {
      title: 'Meta Ads',
      intro: 'WordStream 2025 · 국내 교육 시장',
      rows: [
        { name: 'CTR (클릭률)', value: '0.9%', source: 'WordStream 2025 Meta 교육 평균' },
        { name: 'CPC (클릭당)', value: '₩1,100', source: '국내 Meta 교육 광고 추정치' },
        { name: 'CPM (1,000회 노출)', value: '₩9,800', source: '국내 Meta 교육 CPM 추정' },
        { name: 'CVR (전환율)', value: '2.5%', source: 'Meta 리드젠 평균' },
      ],
    },
    {
      title: 'Google Ads',
      intro: 'WordStream 2025 · 국내 교육 시장',
      rows: [
        { name: 'CTR (검색 광고)', value: '3.17%', source: 'WordStream 2025 Google Search 교육' },
        { name: 'CPC (클릭당)', value: '₩800', source: '국내 Google 교육 광고 추정치' },
        { name: 'CPM (디스플레이)', value: '₩15,000', source: '국내 GDN 추정치' },
        { name: 'CVR (전환율)', value: '3.6%', source: 'WordStream 교육 전환율' },
      ],
    },
    {
      title: '통합 목표',
      intro: '내부 KPI',
      rows: [
        { name: '유효 CPA', value: '₩5,000', source: '2차 전환 1건당 허용 광고비 — 내부 목표' },
        { name: 'E2E 전환율', value: '3%+', source: '양호 기준 · 1%~3%는 보통' },
      ],
    },
  ]

  return (
    <div className="px-2 space-y-3.5 text-sm">
      {sections.map(s => (
        <div key={s.title}>
          <p className="text-xs font-black text-foreground px-2 mb-0.5">{s.title}</p>
          <p className="text-[11px] text-muted-foreground px-2 mb-1.5">{s.intro}</p>
          <div className="space-y-1.5">
            {s.rows.map(r => (
              <div key={r.name} className="px-2 py-1 rounded-md hover:bg-sidebar-accent/60">
                <div className="flex justify-between items-baseline gap-2">
                  <span className="text-xs font-semibold truncate">{r.name}</span>
                  <span className="text-xs font-mono font-black shrink-0">{r.value}</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{r.source}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="px-2 pt-2 border-t text-[10px] text-muted-foreground leading-relaxed">
        <p className="font-bold text-foreground mb-1">판정 기준</p>
        <p>편차 ±10% 이상에서 색 강조</p>
        <p>🟢 양호 (+10% 이상 우위)</p>
        <p>🟡 주의 (±10% 이내)</p>
        <p>🔴 위험 (-20% 이상 열위)</p>
      </div>
    </div>
  )
}

function KpiCard({ label, value, sub, highlight, statusColor }: { label: React.ReactNode; value: string; sub?: string; highlight?: boolean; statusColor?: DiagLevel | null }) {
  return (
    <Card className={highlight ? 'ring-primary/50' : ''}>
      <CardHeader className="pb-2">
        <CardDescription className="text-base font-semibold">{label}</CardDescription>
        <CardTitle className="text-4xl font-black tabular-nums">{value}</CardTitle>
      </CardHeader>
      {sub && (
        <CardContent>
          <p className={`text-sm font-semibold ${statusColor === 'good' ? 'text-green-600' : statusColor === 'warn' ? 'text-yellow-600' : statusColor === 'bad' ? 'text-red-600' : 'text-muted-foreground'}`}>
            {sub}
          </p>
        </CardContent>
      )}
    </Card>
  )
}

function FunnelMiniChart({ data }: { data: { label: string; value: number }[] }) {
  const chartConfig = { value: { label: '사용자', color: 'var(--chart-1)' } } satisfies ChartConfig
  return (
    <ChartContainer config={chartConfig} className="h-[260px] w-full">
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 8 }}>
        <CartesianGrid horizontal={false} />
        <XAxis type="number" hide />
        <YAxis dataKey="label" type="category" tickLine={false} axisLine={false} width={70} className="text-xs" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="value" fill="var(--color-value)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}

function SecondaryChart({ openchat, ebook, share, resultView }: { openchat: number; ebook: number; share: number; resultView: number }) {
  const data = [
    { channel: '단톡방', value: openchat, rate: resultView > 0 ? (openchat / resultView) * 100 : 0 },
    { channel: '전자책', value: ebook, rate: resultView > 0 ? (ebook / resultView) * 100 : 0 },
    { channel: '공유', value: share, rate: resultView > 0 ? (share / resultView) * 100 : 0 },
  ]
  const chartConfig = { value: { label: '클릭', color: 'var(--chart-2)' } } satisfies ChartConfig
  return (
    <ChartContainer config={chartConfig} className="h-[200px] w-full">
      <BarChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="channel" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} className="text-xs" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="value" fill="var(--color-value)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}

function AdRow({ title, totals, benchmark }: { title: string; totals?: AdTotalsLite; benchmark: { ctr: number; cpc: number; cpm: number; cvr: number } }) {
  if (!totals || totals.spend === 0) {
    return (
      <div className="flex justify-between text-base">
        <span className="font-semibold">{title}</span>
        <span className="text-muted-foreground">집행 없음</span>
      </div>
    )
  }
  const ctrCmp = compareBenchmark(totals.ctr, benchmark.ctr, true)
  const cpcCmp = compareBenchmark(totals.cpc, benchmark.cpc, false)
  return (
    <div>
      <div className="flex justify-between items-baseline mb-2">
        <span className="font-bold text-base">{title}</span>
        <span className="text-sm text-muted-foreground font-mono">₩{totals.spend.toLocaleString()}</span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">CTR (클릭률)</span>
          <span className={`font-mono font-bold ${ctrCmp.level === 'good' ? 'text-green-600' : ctrCmp.level === 'bad' ? 'text-red-600' : ''}`}>{totals.ctr}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">CPC (클릭당)</span>
          <span className={`font-mono font-bold ${cpcCmp.level === 'good' ? 'text-green-600' : cpcCmp.level === 'bad' ? 'text-red-600' : ''}`}>₩{totals.cpc.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}

/* ========== 퍼널 뷰 ========== */
function FunnelTab({ funnel }: { funnel: { label: string; value: number }[] }) {
  const BENCH_MAP: Record<string, keyof typeof BENCHMARKS.funnel> = {
    '방문 → CTA 클릭': 'landing_to_cta',
    'CTA 클릭 → 테스트 시작': 'cta_to_test_start',
    '테스트 시작 → 테스트 완료': 'test_start_to_complete',
    '테스트 완료 → 결과 확인': 'complete_to_result',
    '결과 확인 → 2차 전환': 'result_to_secondary',
  }

  const chartData = funnel.map(s => ({ step: s.label, users: s.value }))
  const chartConfig = { users: { label: '사용자', color: 'var(--chart-1)' } } satisfies ChartConfig

  // 단계별 설명
  const STEP_DESC: Record<string, string> = {
    '방문': '랜딩 페이지에 들어온 순방문자',
    'CTA 클릭': '"AI 생존유형 진단하기" 버튼 클릭 (Call-To-Action)',
    '테스트 시작': '첫 문항 화면 진입',
    '테스트 완료': '20문항 모두 응답',
    '결과 확인': '결과 페이지 진입',
    '2차 전환': '단톡방·전자책·공유 중 1개 이상 클릭',
  }
  const TRANSITION_NOTE: Record<string, string> = {
    '방문 → CTA 클릭': '퀴즈 랜딩(단일 CTA 구조) 기준 40%가 합격선. 30% 미만이면 헤드라인·오퍼·트래픽 품질 점검 필요.',
    'CTA 클릭 → 테스트 시작': 'CTA를 누르면 곧바로 테스트로 이동. 90% 미만이면 로딩 지연·라우팅 오류 의심.',
    '테스트 시작 → 테스트 완료': '20문항을 끝까지 풀었는지 — 70% 미만이면 문항 수·난이도·질문 카피 검토 필요.',
    '테스트 완료 → 결과 확인': '저장+리다이렉트가 자동이라 95%+ 정상. 미만이면 저장 실패·라우팅 오류 가능성.',
    '결과 확인 → 2차 전환': '단톡/전자책/공유 중 하나라도 클릭한 비율. 8% 이상이면 양호.',
  }

  // 각 단계 평가
  type StepEval = {
    from: string
    to: string
    fromValue: number
    toValue: number
    convRate: number
    bench: number | null
    cmp: ReturnType<typeof compareBenchmark> | null
    dropoff: number
    dropoffUsers: number
    note: string
    toDesc: string
  }
  const stepEvals: StepEval[] = funnel.slice(1).map((step, i) => {
    const prev = funnel[i]
    const convRate = prev.value > 0 ? (step.value / prev.value) * 100 : 0
    const benchKey = BENCH_MAP[`${prev.label} → ${step.label}`]
    const benchVal = benchKey ? BENCHMARKS.funnel[benchKey] : null
    const cmp = benchVal !== null ? compareBenchmark(convRate, benchVal, true) : null
    const transitionKey = `${prev.label} → ${step.label}`
    return {
      from: prev.label,
      to: step.label,
      fromValue: prev.value,
      toValue: step.value,
      convRate,
      bench: benchVal,
      cmp,
      dropoff: prev.value > 0 ? ((prev.value - step.value) / prev.value) * 100 : 0,
      dropoffUsers: prev.value - step.value,
      note: TRANSITION_NOTE[transitionKey] ?? '',
      toDesc: STEP_DESC[step.label] ?? '',
    }
  })

  // E2E + 병목
  const e2eRate = funnel[0].value > 0 ? (funnel[funnel.length - 1].value / funnel[0].value) * 100 : 0
  const bottleneck = stepEvals.find(s => s.cmp?.level === 'bad') ?? stepEvals.find(s => s.cmp?.level === 'warn')
  const badCount = stepEvals.filter(s => s.cmp?.level === 'bad').length
  const warnCount = stepEvals.filter(s => s.cmp?.level === 'warn').length
  const goodCount = stepEvals.filter(s => s.cmp?.level === 'good').length

  // 전체 상태
  const overallLevel: DiagLevel = badCount > 0 ? 'bad' : warnCount >= 2 ? 'warn' : 'good'
  const OverallIcon = overallLevel === 'good' ? CheckCircle2 : overallLevel === 'warn' ? AlertTriangle : AlertCircle
  const overallColor = overallLevel === 'good' ? 'text-green-600' : overallLevel === 'warn' ? 'text-yellow-600' : 'text-red-600'

  let headline = ''
  let action = ''
  if (funnel[0].value === 0) {
    headline = '방문 데이터가 없습니다. 기간을 넓혀주세요.'
    action = ''
  } else if (bottleneck) {
    headline = `병목: ${bottleneck.from} → ${bottleneck.to} (${bottleneck.convRate.toFixed(1)}%)`
    action = `업종 평균 ${bottleneck.bench}% 대비 ${bottleneck.cmp?.label}. ${bottleneck.dropoffUsers.toLocaleString()}명이 이 구간에서 이탈했습니다. 이 구간만 업종 평균까지 올려도 전환이 크게 증가합니다.`
  } else {
    headline = '모든 구간이 업종 평균 이상입니다'
    action = `E2E 전환율 ${e2eRate.toFixed(2)}% — 현재 퍼널은 건강합니다. 트래픽을 늘리면 성과가 비례해서 증가합니다.`
  }

  return (
    <div className="space-y-4">
      {/* 상단 평가 배너 */}
      <Card>
        <CardContent className="flex items-start gap-3 py-3">
          <OverallIcon className={`h-8 w-8 shrink-0 mt-0.5 ${overallColor}`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={overallLevel === 'good' ? 'default' : overallLevel === 'warn' ? 'secondary' : 'destructive'}>
                {overallLevel === 'good' ? '양호' : overallLevel === 'warn' ? '주의' : '위험'}
              </Badge>
              <span className="text-base text-muted-foreground">
                E2E {e2eRate.toFixed(2)}% · {funnel[0].value.toLocaleString()}명 → {funnel[funnel.length - 1].value.toLocaleString()}명
              </span>
            </div>
            <p className="text-base font-semibold leading-snug">{headline}</p>
            {action && <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{action}</p>}
          </div>
          <div className="hidden md:flex gap-1.5 text-xs shrink-0">
            <Badge variant="destructive" className="font-mono">위험 {badCount}</Badge>
            <Badge variant="secondary" className="font-mono">주의 {warnCount}</Badge>
            <Badge variant="outline" className="font-mono">양호 {goodCount}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* 각 단계 카드 */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
        {stepEvals.map((s, i) => {
          const level = s.cmp?.level
          const colorClass = level === 'good' ? 'text-green-600' : level === 'warn' ? 'text-yellow-600' : level === 'bad' ? 'text-red-600' : ''
          const ringClass = level === 'bad' ? 'ring-red-400/50' : level === 'warn' ? 'ring-yellow-400/50' : level === 'good' ? 'ring-green-400/50' : ''
          return (
            <Card key={i} className={ringClass}>
              <CardHeader className="pb-2">
                <CardDescription className="text-xs font-semibold leading-tight">{s.from} →<br />{s.to}</CardDescription>
                <CardTitle className={`text-3xl font-black tabular-nums ${colorClass}`}>{s.convRate.toFixed(1)}%</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <p className="text-xs text-muted-foreground">업종 {s.bench ?? '-'}% · 이탈 {s.dropoffUsers.toLocaleString()}명</p>
                {s.cmp && (
                  <Badge variant={level === 'good' ? 'default' : level === 'bad' ? 'destructive' : 'secondary'} className="text-xs">
                    {s.cmp.label}
                  </Badge>
                )}
                {s.note && <p className="text-[11px] text-muted-foreground leading-snug pt-1 border-t mt-2">{s.note}</p>}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 차트 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">단계별 사용자 수</CardTitle>
          <CardDescription className="text-sm">각 단계에서 얼마나 이탈하는지 시각적으로 확인</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[320px] w-full">
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="step" tickLine={false} axisLine={false} className="text-xs" />
              <YAxis tickLine={false} axisLine={false} className="text-xs" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="users" fill="var(--color-users)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* 상세 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">단계별 전환율 상세</CardTitle>
          <CardDescription className="text-sm">
            업종 벤치마크: Unbounce 2024 · WordStream 2025 · LeadQuizzes 교육 업종 평균
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table className="text-base">
            <TableHeader>
              <TableRow>
                <TableHead>구간</TableHead>
                <TableHead className="text-right">이전</TableHead>
                <TableHead className="text-right">현재</TableHead>
                <TableHead className="text-right">전환율</TableHead>
                <TableHead className="text-right">업종</TableHead>
                <TableHead className="text-right">평가</TableHead>
                <TableHead className="text-right">이탈</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stepEvals.map((s, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{s.from} → {s.to}</TableCell>
                  <TableCell className="text-right font-mono">{s.fromValue.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono">{s.toValue.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono font-bold">{s.convRate.toFixed(1)}%</TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">{s.bench ?? '-'}%</TableCell>
                  <TableCell className="text-right">
                    {s.cmp ? (
                      <Badge variant={s.cmp.level === 'good' ? 'default' : s.cmp.level === 'bad' ? 'destructive' : 'secondary'}>
                        {s.cmp.label}
                      </Badge>
                    ) : '-'}
                  </TableCell>
                  <TableCell className="text-right font-mono text-red-500">-{s.dropoffUsers.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 단계 용어 설명 — 하단 */}
      <Card className="bg-muted/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">🔤 퍼널 단계 용어</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 text-sm">
            {Object.entries(STEP_DESC).map(([k, v]) => (
              <div key={k} className="flex gap-2">
                <dt className="font-bold text-foreground shrink-0">{k}</dt>
                <dd className="text-muted-foreground">— {v}</dd>
              </div>
            ))}
          </dl>
          <p className="text-xs text-muted-foreground mt-3 pt-3 border-t leading-relaxed">
            <span className="font-bold text-foreground">CTA</span>는 <span className="font-bold">Call-To-Action</span>의 약자로 사용자의 다음 행동을 유도하는 버튼·링크입니다. 이 사이트에서는 랜딩 페이지의 <span className="font-bold">&quot;AI 생존유형 진단하기&quot;</span> 버튼이 CTA입니다.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

/* ========== 광고 뷰 ========== */
type Campaign = {
  name: string
  impressions: number
  clicks: number
  spend: number
  ctr: number
  cpc: number
  conversions: number
  [k: string]: unknown
}

function AdsTab({ title, totals, campaigns, benchmark }: { title: string; totals?: AdTotalsLite; campaigns: Campaign[]; benchmark: { ctr: number; cpc: number; cpm: number; cvr: number } }) {
  if (!totals || totals.spend === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>아직 집행 데이터가 없습니다</CardDescription>
        </CardHeader>
      </Card>
    )
  }
  const cvr = totals.clicks > 0 ? (totals.conversions / totals.clicks) * 100 : 0
  const ctrCmp = compareBenchmark(totals.ctr, benchmark.ctr, true)
  const cpcCmp = compareBenchmark(totals.cpc, benchmark.cpc, false)
  const cpmCmp = compareBenchmark(totals.cpm, benchmark.cpm, false)
  const cvrCmp = compareBenchmark(cvr, benchmark.cvr, true)

  const rows: { label: string; value: string; desc: string; bench?: string; cmp?: ReturnType<typeof compareBenchmark> }[] = [
    { label: '광고비', value: `₩${totals.spend.toLocaleString()}`, desc: '기간 내 지출한 광고 비용' },
    { label: '노출', value: totals.impressions.toLocaleString(), desc: '광고가 화면에 표시된 총 횟수' },
    { label: '클릭', value: totals.clicks.toLocaleString(), desc: '광고를 클릭한 총 횟수' },
    { label: 'CTR (클릭률)', value: `${totals.ctr}%`, desc: '노출 대비 클릭률 (클릭 ÷ 노출). 소재 반응도 지표', bench: `업종 ${benchmark.ctr}%`, cmp: ctrCmp },
    { label: 'CPC (클릭당 비용)', value: `₩${totals.cpc.toLocaleString()}`, desc: '클릭 1회당 평균 비용 (광고비 ÷ 클릭). 낮을수록 좋음', bench: `업종 ₩${benchmark.cpc.toLocaleString()}`, cmp: cpcCmp },
    { label: 'CPM (1,000회 노출당 비용)', value: `₩${totals.cpm.toLocaleString()}`, desc: '노출 1,000회당 비용. 타겟 경쟁도 지표. 낮을수록 좋음', bench: `업종 ₩${benchmark.cpm.toLocaleString()}`, cmp: cpmCmp },
    { label: '전환', value: totals.conversions.toLocaleString(), desc: title === 'Meta' ? 'Meta Pixel에 설정한 Lead 이벤트 발생 수' : 'Google Ads에 설정한 전환 액션 발생 수' },
    { label: '전환율 (CVR)', value: `${cvr.toFixed(1)}%`, desc: '클릭 대비 전환율 (전환 ÷ 클릭). 랜딩 설득력 지표', bench: `업종 ${benchmark.cvr}%`, cmp: cvrCmp },
  ]

  // 상단 평가
  const evals = [
    { name: 'CTR', cmp: ctrCmp },
    { name: 'CPC', cmp: cpcCmp },
    { name: 'CPM', cmp: cpmCmp },
    { name: '전환율', cmp: cvrCmp },
  ]
  const badMetrics = evals.filter(e => e.cmp.level === 'bad')
  const warnMetrics = evals.filter(e => e.cmp.level === 'warn')
  const goodMetrics = evals.filter(e => e.cmp.level === 'good')
  const overallLevel: DiagLevel = badMetrics.length > 0 ? 'bad' : warnMetrics.length >= 2 ? 'warn' : 'good'
  const OverallIcon = overallLevel === 'good' ? CheckCircle2 : overallLevel === 'warn' ? AlertTriangle : AlertCircle
  const overallColor = overallLevel === 'good' ? 'text-green-600' : overallLevel === 'warn' ? 'text-yellow-600' : 'text-red-600'

  let headline = ''
  let action = ''
  if (badMetrics.length > 0) {
    const worst = badMetrics[0]
    headline = `${worst.name} 지표가 업종 평균 대비 ${worst.cmp.label}`
    if (worst.name === 'CTR') action = '소재 반응이 낮습니다. 광고 문구·이미지 교체가 우선입니다.'
    else if (worst.name === 'CPC') action = '클릭 단가가 높습니다. 타겟 정밀도 또는 품질점수 개선이 필요합니다.'
    else if (worst.name === 'CPM') action = '노출 단가가 높습니다. 타겟이 좁거나 경쟁이 과열된 상태입니다.'
    else if (worst.name === '전환율') action = '랜딩→전환이 약합니다. 랜딩페이지 카피·오퍼 점검이 우선입니다.'
  } else if (warnMetrics.length > 0) {
    headline = `양호하지만 ${warnMetrics.map(m => m.name).join(', ')} 개선 여지 있음`
    action = '현재 성과 유지하면서 주의 지표를 단계적으로 개선하세요.'
  } else {
    headline = '모든 핵심 지표가 업종 평균 이상입니다'
    action = `CTR ${totals.ctr}% · CPC ₩${totals.cpc.toLocaleString()} · 전환율 ${cvr.toFixed(1)}% — 현재 전략 유지하며 예산 확대 가능.`
  }

  // Meta 한정 세분화 데이터
  const metaExtra = title === 'Meta' && totals ? {
    pageViews: (totals as AdTotalsLite & { pageViews?: number }).pageViews ?? 0,
    linkClicks: (totals as AdTotalsLite & { linkClicks?: number }).linkClicks ?? 0,
  } : null

  return (
    <div className="space-y-4">
      {/* 상단 평가 배너 */}
      <Card>
        <CardContent className="flex items-start gap-3 py-3">
          <OverallIcon className={`h-8 w-8 shrink-0 mt-0.5 ${overallColor}`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={overallLevel === 'good' ? 'default' : overallLevel === 'warn' ? 'secondary' : 'destructive'}>
                {overallLevel === 'good' ? '양호' : overallLevel === 'warn' ? '주의' : '위험'}
              </Badge>
              <span className="text-base text-muted-foreground">
                광고비 ₩{totals.spend.toLocaleString()} · 클릭 {totals.clicks.toLocaleString()} · 전환 {totals.conversions.toLocaleString()}
              </span>
            </div>
            <p className="text-base font-semibold leading-snug">{headline}</p>
            {action && <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{action}</p>}
          </div>
          <div className="hidden md:flex gap-1.5 text-xs shrink-0">
            <Badge variant="destructive" className="font-mono">위험 {badMetrics.length}</Badge>
            <Badge variant="secondary" className="font-mono">주의 {warnMetrics.length}</Badge>
            <Badge variant="outline" className="font-mono">양호 {goodMetrics.length}</Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-4">
        {rows.map(r => (
          <Card key={r.label}>
            <CardHeader className="pb-2">
              <CardDescription className="text-base font-semibold">{r.label}</CardDescription>
              <CardTitle className="text-3xl font-black tabular-nums">{r.value}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <p className="text-xs text-muted-foreground leading-snug">{r.desc}</p>
              {r.bench && <p className="text-sm text-muted-foreground">{r.bench}</p>}
              {r.cmp && (
                <Badge variant={r.cmp.level === 'good' ? 'default' : r.cmp.level === 'bad' ? 'destructive' : 'secondary'} className="text-sm">
                  {r.cmp.label}
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 전환 세분화 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">전환 세분화</CardTitle>
          <CardDescription className="text-sm">
            {title === 'Meta'
              ? '광고 클릭 후 일어난 단계별 이벤트 (Meta Pixel 기준)'
              : '광고로 유입된 사용자의 행동 지표 (Google Ads 기준)'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <Card className="bg-muted/30">
              <CardHeader className="pb-1">
                <CardDescription className="text-sm font-semibold">광고 클릭</CardDescription>
                <CardTitle className="text-2xl font-black tabular-nums">{totals.clicks.toLocaleString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">광고를 클릭한 총 횟수 (링크 클릭 포함 전체)</p>
              </CardContent>
            </Card>
            {metaExtra && (
              <>
                <Card className="bg-muted/30">
                  <CardHeader className="pb-1">
                    <CardDescription className="text-sm font-semibold">랜딩 페이지 방문</CardDescription>
                    <CardTitle className="text-2xl font-black tabular-nums">{metaExtra.pageViews.toLocaleString()}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">광고 클릭 후 랜딩 페이지 로딩까지 성공한 수 ({totals.clicks > 0 ? ((metaExtra.pageViews / totals.clicks) * 100).toFixed(1) : '-'}%)</p>
                  </CardContent>
                </Card>
                <Card className="bg-muted/30">
                  <CardHeader className="pb-1">
                    <CardDescription className="text-sm font-semibold">링크 클릭</CardDescription>
                    <CardTitle className="text-2xl font-black tabular-nums">{metaExtra.linkClicks.toLocaleString()}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">외부 링크 이동 횟수</p>
                  </CardContent>
                </Card>
              </>
            )}
            <Card className="ring-primary/30">
              <CardHeader className="pb-1">
                <CardDescription className="text-sm font-semibold">리드 전환 (최종)</CardDescription>
                <CardTitle className="text-2xl font-black tabular-nums text-primary">{totals.conversions.toLocaleString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  {title === 'Meta' ? 'Pixel Lead 이벤트 발생 수' : '전환 액션 발생 수'} (전환율 {cvr.toFixed(1)}%)
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{title} 캠페인별 성과</CardTitle>
        </CardHeader>
        <CardContent>
          {campaigns.length === 0 ? <p className="text-sm text-muted-foreground">캠페인 데이터 없음</p> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>캠페인</TableHead>
                  <TableHead className="text-right">노출</TableHead>
                  <TableHead className="text-right">클릭</TableHead>
                  <TableHead className="text-right">CTR</TableHead>
                  <TableHead className="text-right">CPC</TableHead>
                  <TableHead className="text-right">비용</TableHead>
                  <TableHead className="text-right">전환</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map(c => (
                  <TableRow key={c.name}>
                    <TableCell className="font-medium max-w-xs truncate">{c.name}</TableCell>
                    <TableCell className="text-right font-mono">{c.impressions.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono">{c.clicks.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono">{c.ctr}%</TableCell>
                    <TableCell className="text-right font-mono">₩{c.cpc.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono">₩{c.spend.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono font-bold">{c.conversions}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* 용어 설명 — 하단 */}
      <AdsGlossary platform={title} />
    </div>
  )
}

/* ========== A/B 테스트 뷰 ========== */
function ABTestTab({ variants }: { variants: ABTestData[] }) {
  if (variants.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>A/B 테스트</CardTitle>
          <CardDescription>데이터가 아직 없습니다</CardDescription>
        </CardHeader>
      </Card>
    )
  }
  const e2eRates = variants.map(v => ({ variant: v.variant, rate: v.pageView > 0 ? (v.resultView / v.pageView) * 100 : 0 }))
  const winner = e2eRates.reduce((a, b) => (a.rate > b.rate ? a : b))

  const chartData = variants.map(v => ({
    label: VARIANT_LABELS[v.variant]?.name ?? v.variant,
    방문: v.pageView,
    결과확인: v.resultView,
  }))

  const chartConfig = {
    방문: { label: '방문', color: 'var(--chart-1)' },
    결과확인: { label: '결과 확인', color: 'var(--chart-2)' },
  } satisfies ChartConfig

  return (
    <div className="space-y-4">
      {winner.rate > 0 && (
        <Card className="border-primary/50">
          <CardContent className="flex items-center gap-3 py-4">
            <CheckCircle2 className="h-6 w-6 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground font-semibold">E2E 기준 승자</p>
              <p className="font-bold">{VARIANT_LABELS[winner.variant]?.name ?? winner.variant} — {winner.rate.toFixed(1)}%</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>변형별 성과</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[280px] w-full">
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} className="text-xs" />
              <YAxis tickLine={false} axisLine={false} className="text-xs" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="방문" fill="var(--color-방문)" radius={4} />
              <Bar dataKey="결과확인" fill="var(--color-결과확인)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>전환율 비교</CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="text-base">
            <TableHeader>
              <TableRow>
                <TableHead>구간</TableHead>
                {variants.map(v => (
                  <TableHead key={v.variant} className="text-right">
                    {VARIANT_LABELS[v.variant]?.name ?? v.variant}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { label: '방문', calc: (d: ABTestData) => d.pageView.toLocaleString() },
                { label: '결과 확인', calc: (d: ABTestData) => d.resultView.toLocaleString() },
                { label: '방문→CTA', calc: (d: ABTestData) => (d.pageView > 0 ? ((d.ctaClick / d.pageView) * 100).toFixed(1) + '%' : '-') },
                { label: '완료→결과', calc: (d: ABTestData) => (d.testComplete > 0 ? ((d.resultView / d.testComplete) * 100).toFixed(1) + '%' : '-') },
                { label: 'E2E', calc: (d: ABTestData) => (d.pageView > 0 ? ((d.resultView / d.pageView) * 100).toFixed(1) + '%' : '-') },
              ].map(row => (
                <TableRow key={row.label}>
                  <TableCell className="font-medium">{row.label}</TableCell>
                  {variants.map(v => (
                    <TableCell key={v.variant} className="text-right font-mono">{row.calc(v)}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

/* ========== 전자책 뷰 ========== */
function EbooksTab({ ebooks, total }: { ebooks: EbooksData | null; total: number }) {
  if (!ebooks) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>전자책 수강생</CardTitle>
          <CardDescription>데이터를 불러오는 중...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardDescription className="text-base font-semibold">총 전자책 수강생</CardDescription>
          <CardTitle className="text-6xl font-black tabular-nums">{total.toLocaleString()}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            메타코드 공식 API에서 크롤링 · 조회 {new Date(ebooks.fetchedAt).toLocaleString('ko-KR')}
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {ebooks.ebooks.map(e => {
          const title = String(e.title).replace(/\[무료\/26년 최신버전\]\s*/g, '')
          return (
            <Card key={e.id}>
              <CardHeader className="pb-2">
                <CardDescription className="line-clamp-2 leading-snug text-sm">{title}</CardDescription>
                <CardTitle className="text-4xl font-black tabular-nums">{e.students.toLocaleString()}</CardTitle>
              </CardHeader>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
