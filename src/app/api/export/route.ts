import { getSupabaseServer } from '@/lib/supabase'
import { todayKst, daysAgoKst, rangeDates, nowIso } from '@/lib/date'

const PASS = '720972'
const EBOOK_EFFECTIVE_RATE = 0.7

type FunnelRow = {
  date: string
  total_users: number
  cta_clicks: number
  test_starts: number
  test_completes: number
  result_views: number
  openchat_clicks: number
  ebook_clicks: number
  share_clicks: number
}
type AdsRow = {
  date: string
  platform: string
  impressions: number
  clicks: number
  spend: number
  ctr: number
  cpc: number
}
type EbookSnap = { date: string; ebook_id: string; title: string; students: number }
type EbookLive = { ebooks: Array<{ id: string | number; title: string; students: number }>; fetchedAt: string }
type ABVariant = {
  variant: string
  pageView: number
  ctaClick: number
  testStart: number
  testComplete: number
  resultView: number
  openchatClick: number
  ebookClick: number
  shareClick: number
}
type ResultRow = { type_code: string; ai_score: number }

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  if (searchParams.get('pass') !== PASS) {
    return new Response('unauthorized', { status: 401 })
  }

  const since = searchParams.get('since') ?? '2026-03-03'
  const until = searchParams.get('until') ?? todayKst()

  const supabase = getSupabaseServer()
  if (!supabase) {
    return new Response('Supabase not configured', { status: 500 })
  }

  const baseUrl = new URL(req.url).origin

  const [funnelRes, adsRes, ebookSnapRes, ebookLiveRes, abTestRes, resultsRes] = await Promise.allSettled([
    supabase.from('daily_funnel_metrics').select('*').gte('date', since).lte('date', until).order('date'),
    supabase.from('daily_ads_metrics').select('*').gte('date', since).lte('date', until).order('date'),
    supabase.from('daily_ebook_metrics').select('*').gte('date', since).lte('date', until).order('date'),
    fetch(`${baseUrl}/api/metacode-ebooks?pass=${PASS}`).then((r) => (r.ok ? r.json() : null)),
    fetch(`${baseUrl}/api/ab-test?pass=${PASS}&start=${since}&end=${until}`).then((r) => (r.ok ? r.json() : null)),
    supabase
      .from('results_v2')
      .select('type_code, ai_score')
      .gte('created_at', `${since}T00:00:00`)
      .lte('created_at', `${until}T23:59:59`),
  ])

  const funnel: FunnelRow[] = funnelRes.status === 'fulfilled' ? (funnelRes.value.data ?? []) : []
  const ads: AdsRow[] = adsRes.status === 'fulfilled' ? (adsRes.value.data ?? []) : []
  const ebookSnaps: EbookSnap[] = ebookSnapRes.status === 'fulfilled' ? (ebookSnapRes.value.data ?? []) : []
  const ebookLive: EbookLive | null = ebookLiveRes.status === 'fulfilled' ? ebookLiveRes.value : null
  const abTest: ABVariant[] = abTestRes.status === 'fulfilled' ? (abTestRes.value?.variants ?? []) : []
  const results: ResultRow[] = resultsRes.status === 'fulfilled' ? (resultsRes.value.data ?? []) : []

  // 날짜 축 구성 (since ~ until)
  const allDates: string[] = rangeDates(since, until)

  const funnelByDate = new Map(funnel.map((f) => [f.date, f]))
  const metaByDate = new Map(ads.filter((a) => a.platform === 'meta').map((a) => [a.date, a]))
  const googleByDate = new Map(ads.filter((a) => a.platform === 'google').map((a) => [a.date, a]))

  const ebookByDate = new Map<string, number>()
  for (const s of ebookSnaps) {
    ebookByDate.set(s.date, (ebookByDate.get(s.date) ?? 0) + Number(s.students ?? 0))
  }

  // ===== Section: Daily Metrics =====
  const dailyHeader = [
    'date',
    'total_users',
    'cta_clicks',
    'test_starts',
    'test_completes',
    'result_views',
    'completion_rate_pct',
    'openchat_clicks',
    'ebook_clicks',
    'share_clicks',
    'secondary_total',
    'e2e_pct',
    'meta_impressions',
    'meta_clicks',
    'meta_spend_krw',
    'meta_ctr_pct',
    'meta_cpc_krw',
    'google_impressions',
    'google_clicks',
    'google_spend_krw',
    'google_ctr_pct',
    'google_cpc_krw',
    'total_spend_krw',
    'effective_cpa_krw',
    'ebook_students_raw',
    'ebook_students_effective',
  ]
  const dailyRows = allDates.map((d) => {
    const f = funnelByDate.get(d)
    const m = metaByDate.get(d)
    const g = googleByDate.get(d)
    const totalUsers = f?.total_users ?? 0
    const testStarts = f?.test_starts ?? 0
    const testCompletes = f?.test_completes ?? 0
    const completionPct = testStarts > 0 ? (testCompletes / testStarts) * 100 : 0
    const openchat = f?.openchat_clicks ?? 0
    const ebookClick = f?.ebook_clicks ?? 0
    const shareClick = f?.share_clicks ?? 0
    const secondary = openchat + ebookClick + shareClick
    const e2e = totalUsers > 0 ? (secondary / totalUsers) * 100 : 0
    const totalSpend = (m?.spend ?? 0) + (g?.spend ?? 0)
    const cpa = secondary > 0 ? Math.round(totalSpend / secondary) : 0
    const ebookRaw = ebookByDate.get(d) ?? 0
    const ebookEff = Math.floor(ebookRaw * EBOOK_EFFECTIVE_RATE)
    return [
      d,
      totalUsers,
      f?.cta_clicks ?? 0,
      testStarts,
      testCompletes,
      f?.result_views ?? 0,
      completionPct.toFixed(2),
      openchat,
      ebookClick,
      shareClick,
      secondary,
      e2e.toFixed(2),
      m?.impressions ?? 0,
      m?.clicks ?? 0,
      m?.spend ?? 0,
      (m?.ctr ?? 0).toString(),
      m?.cpc ?? 0,
      g?.impressions ?? 0,
      g?.clicks ?? 0,
      g?.spend ?? 0,
      (g?.ctr ?? 0).toString(),
      g?.cpc ?? 0,
      totalSpend,
      cpa,
      ebookRaw,
      ebookEff,
    ]
  })

  // ===== Section: Ebook Latest + Deltas =====
  const ebookHeader = ['ebook_id', 'title', 'students_current', 'students_1d_ago', 'students_7d_ago', 'delta_1d', 'delta_7d']
  const ebookMap: Record<string, Map<string, number>> = {}
  for (const s of ebookSnaps) {
    if (!ebookMap[s.ebook_id]) ebookMap[s.ebook_id] = new Map()
    ebookMap[s.ebook_id].set(s.date, s.students)
  }
  const lookupBefore = (id: string, targetDate: string): number | null => {
    const m = ebookMap[id]
    if (!m) return null
    const dates = Array.from(m.keys())
      .filter((dd) => dd <= targetDate)
      .sort()
    if (dates.length === 0) return null
    return m.get(dates[dates.length - 1]) ?? null
  }
  const today = todayKst()
  const yesterday = daysAgoKst(1, today)
  const weekAgo = daysAgoKst(7, today)
  const ebookRows = (ebookLive?.ebooks ?? []).map((e) => {
    const id = String(e.id)
    const prev1 = lookupBefore(id, yesterday)
    const prev7 = lookupBefore(id, weekAgo)
    return [
      id,
      e.title,
      e.students,
      prev1 ?? '',
      prev7 ?? '',
      prev1 !== null ? e.students - prev1 : '',
      prev7 !== null ? e.students - prev7 : '',
    ]
  })

  // ===== Section: AB Test =====
  const abHeader = [
    'variant',
    'page_view',
    'cta_click',
    'test_start',
    'test_complete',
    'result_view',
    'openchat_click',
    'ebook_click',
    'share_click',
    'secondary_total',
    'completion_rate_pct',
    'e2e_rate_pct',
  ]
  const abRows = abTest.map((v) => {
    const secondary = v.openchatClick + v.ebookClick + v.shareClick
    const completion = v.testStart > 0 ? (v.testComplete / v.testStart) * 100 : 0
    const e2e = v.pageView > 0 ? (secondary / v.pageView) * 100 : 0
    return [
      v.variant,
      v.pageView,
      v.ctaClick,
      v.testStart,
      v.testComplete,
      v.resultView,
      v.openchatClick,
      v.ebookClick,
      v.shareClick,
      secondary,
      completion.toFixed(2),
      e2e.toFixed(2),
    ]
  })

  // ===== Section: Type Distribution =====
  const typeHeader = ['type_code', 'count', 'pct', 'avg_ai_score']
  const typeAgg: Record<string, { count: number; sumScore: number }> = {}
  for (const r of results) {
    if (!typeAgg[r.type_code]) typeAgg[r.type_code] = { count: 0, sumScore: 0 }
    typeAgg[r.type_code].count++
    typeAgg[r.type_code].sumScore += r.ai_score
  }
  const totalResults = results.length
  const typeRows = Object.entries(typeAgg)
    .sort((a, b) => b[1].count - a[1].count)
    .map(([code, { count, sumScore }]) => [
      code,
      count,
      totalResults > 0 ? ((count / totalResults) * 100).toFixed(2) : '0.00',
      count > 0 ? (sumScore / count).toFixed(1) : '0',
    ])

  // ===== Section: Summary =====
  const totalSpend = ads.reduce((s, a) => s + (a.spend ?? 0), 0)
  const totalUsers = funnel.reduce((s, f) => s + (f.total_users ?? 0), 0)
  const totalTestStart = funnel.reduce((s, f) => s + (f.test_starts ?? 0), 0)
  const totalTestComplete = funnel.reduce((s, f) => s + (f.test_completes ?? 0), 0)
  const totalResultView = funnel.reduce((s, f) => s + (f.result_views ?? 0), 0)
  const totalOpenchat = funnel.reduce((s, f) => s + (f.openchat_clicks ?? 0), 0)
  const totalEbookClick = funnel.reduce((s, f) => s + (f.ebook_clicks ?? 0), 0)
  const totalShare = funnel.reduce((s, f) => s + (f.share_clicks ?? 0), 0)
  const totalSecondary = totalOpenchat + totalEbookClick + totalShare
  const summaryRows: Array<[string, string | number]> = [
    ['period_since', since],
    ['period_until', until],
    ['days_count', allDates.length],
    ['total_users', totalUsers],
    ['total_test_starts', totalTestStart],
    ['total_test_completes', totalTestComplete],
    ['total_result_views', totalResultView],
    ['total_openchat_clicks', totalOpenchat],
    ['total_ebook_clicks', totalEbookClick],
    ['total_share_clicks', totalShare],
    ['total_secondary_conversions', totalSecondary],
    ['total_ad_spend_krw', totalSpend],
    ['avg_completion_rate_pct', totalTestStart > 0 ? ((totalTestComplete / totalTestStart) * 100).toFixed(2) : '0.00'],
    ['avg_e2e_pct', totalUsers > 0 ? ((totalSecondary / totalUsers) * 100).toFixed(2) : '0.00'],
    ['overall_cpa_krw', totalSecondary > 0 ? Math.round(totalSpend / totalSecondary) : 0],
    ['ebook_students_current_raw', ebookLive?.ebooks.reduce((s, e) => s + (e.students ?? 0), 0) ?? 0],
    ['ebook_students_current_effective', Math.floor((ebookLive?.ebooks.reduce((s, e) => s + (e.students ?? 0), 0) ?? 0) * EBOOK_EFFECTIVE_RATE)],
    ['results_count_in_period', totalResults],
  ]

  // ===== CSV 조립 =====
  const generatedAt = nowIso()
  const lines: string[] = []
  lines.push(`# AIMBTI Dashboard Export`)
  lines.push(`# period: ${since} ~ ${until}`)
  lines.push(`# generated: ${generatedAt}`)
  lines.push(`# ebook_effective_rate: ${EBOOK_EFFECTIVE_RATE} (중복·이탈 보정용 상수, 실질인원 = raw * rate)`)
  lines.push(`# monetary values in KRW. percentages are raw numbers (e.g. 3.25 means 3.25%).`)
  lines.push(``)

  lines.push(`===== SECTION 1: SUMMARY =====`)
  lines.push(csvRow(['metric', 'value']))
  for (const r of summaryRows) lines.push(csvRow(r))
  lines.push(``)

  lines.push(`===== SECTION 2: DAILY METRICS =====`)
  lines.push(csvRow(dailyHeader))
  for (const r of dailyRows) lines.push(csvRow(r))
  lines.push(``)

  lines.push(`===== SECTION 3: EBOOK DETAIL (current + deltas) =====`)
  lines.push(csvRow(ebookHeader))
  for (const r of ebookRows) lines.push(csvRow(r))
  lines.push(``)

  lines.push(`===== SECTION 4: AB TEST BY VARIANT =====`)
  lines.push(csvRow(abHeader))
  for (const r of abRows) lines.push(csvRow(r))
  lines.push(``)

  lines.push(`===== SECTION 5: RESULT TYPE DISTRIBUTION =====`)
  lines.push(csvRow(typeHeader))
  for (const r of typeRows) lines.push(csvRow(r))
  lines.push(``)

  const BOM = '\uFEFF'
  const body = BOM + lines.join('\n')
  const filename = `aimbti_export_${since}_to_${until}.csv`

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  })
}

function csvEscape(v: unknown): string {
  if (v === null || v === undefined) return ''
  const s = String(v)
  if (s.includes(',') || s.includes('"') || s.includes('\n') || s.includes('\r')) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

function csvRow(values: unknown[]): string {
  return values.map(csvEscape).join(',')
}

