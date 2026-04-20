import { NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase'
import { todayKst } from '@/lib/date'

const PASS = '720972'

// Vercel Cron 또는 수동 호출로 오늘의 스냅샷 저장
export async function POST(req: Request) {
  const { searchParams } = new URL(req.url)
  const pass = searchParams.get('pass')

  // Vercel Cron은 CRON_SECRET 헤더로 인증
  const cronSecret = req.headers.get('authorization')?.replace('Bearer ', '')
  const isCron = cronSecret && cronSecret === process.env.CRON_SECRET

  if (pass !== PASS && !isCron) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const supabase = getSupabaseServer()
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
  }

  const today = todayKst()
  const baseUrl = new URL(req.url).origin
  const errors: string[] = []
  const saved: string[] = []

  // 1. GA4 퍼널 데이터 수집 & 저장
  try {
    const ga4Res = await fetch(`${baseUrl}/api/ga4?pass=${PASS}&start=${today}&end=${today}`)
    if (ga4Res.ok) {
      const ga4 = await ga4Res.json()
      const ev = ga4.events || {}
      const get = (name: string) => ev[name]?.users ?? 0

      const { error } = await supabase
        .from('daily_funnel_metrics')
        .upsert({
          date: today,
          total_users: ga4.totalUsers ?? 0,
          cta_clicks: get('cta_click'),
          test_starts: get('test_start'),
          test_completes: get('test_complete'),
          result_views: get('result_view'),
          openchat_clicks: get('openchat_click'),
          ebook_clicks: get('ebook_click'),
          share_clicks: get('share_click'),
        }, { onConflict: 'date' })

      if (error) errors.push(`funnel: ${error.message}`)
      else saved.push('funnel')
    } else {
      errors.push('GA4 API failed')
    }
  } catch (err) {
    errors.push(`GA4: ${err instanceof Error ? err.message : 'unknown'}`)
  }

  // 2. Meta Ads 데이터 수집 & 저장
  try {
    const metaRes = await fetch(`${baseUrl}/api/meta-ads?pass=${PASS}&since=${today}&until=${today}`)
    if (metaRes.ok) {
      const meta = await metaRes.json()
      const t = meta.totals

      const { error } = await supabase
        .from('daily_ads_metrics')
        .upsert({
          date: today,
          platform: 'meta',
          impressions: t.impressions ?? 0,
          clicks: t.clicks ?? 0,
          spend: t.spend ?? 0,
          conversions: t.conversions ?? 0,
          ctr: t.ctr ?? 0,
          cpc: t.cpc ?? 0,
          cpm: t.cpm ?? 0,
        }, { onConflict: 'date,platform' })

      if (error) errors.push(`meta: ${error.message}`)
      else saved.push('meta')
    } else {
      errors.push('Meta Ads API failed')
    }
  } catch (err) {
    errors.push(`Meta: ${err instanceof Error ? err.message : 'unknown'}`)
  }

  // 3. Google Ads 데이터 수집 & 저장
  try {
    const gadsRes = await fetch(`${baseUrl}/api/google-ads?pass=${PASS}&since=${today}&until=${today}`)
    if (gadsRes.ok) {
      const gads = await gadsRes.json()
      const t = gads.totals

      const { error } = await supabase
        .from('daily_ads_metrics')
        .upsert({
          date: today,
          platform: 'google',
          impressions: t.impressions ?? 0,
          clicks: t.clicks ?? 0,
          spend: t.spend ?? 0,
          conversions: t.conversions ?? 0,
          ctr: t.ctr ?? 0,
          cpc: t.cpc ?? 0,
          cpm: t.cpm ?? 0,
        }, { onConflict: 'date,platform' })

      if (error) errors.push(`google: ${error.message}`)
      else saved.push('google')
    }
    // Google Ads 실패는 무시 (아직 승인 대기 중일 수 있음)
  } catch {
    // Google Ads 실패 무시
  }

  // 4. 메타코드 전자책 수강생 스냅샷
  try {
    const ebRes = await fetch(`${baseUrl}/api/metacode-ebooks?pass=${PASS}`)
    if (ebRes.ok) {
      const eb = await ebRes.json()
      const rows = (eb.ebooks ?? []).map((e: { id: string | number; title: string; students: number }) => ({
        date: today,
        ebook_id: String(e.id),
        title: String(e.title ?? ''),
        students: Number(e.students ?? 0),
      }))

      if (rows.length > 0) {
        const { error } = await supabase
          .from('daily_ebook_metrics')
          .upsert(rows, { onConflict: 'date,ebook_id' })

        if (error) errors.push(`ebooks: ${error.message}`)
        else saved.push(`ebooks(${rows.length})`)
      }
    } else {
      errors.push('metacode-ebooks API failed')
    }
  } catch (err) {
    errors.push(`ebooks: ${err instanceof Error ? err.message : 'unknown'}`)
  }

  return NextResponse.json({
    date: today,
    saved,
    errors: errors.length > 0 ? errors : undefined,
  })
}

// 과거 스냅샷 조회
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const pass = searchParams.get('pass')
  if (pass !== PASS) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const supabase = getSupabaseServer()
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
  }

  const since = searchParams.get('since') || '2026-03-03'
  const until = searchParams.get('until') || todayKst()

  const [adsResult, funnelResult, ebooksResult] = await Promise.all([
    supabase
      .from('daily_ads_metrics')
      .select('*')
      .gte('date', since)
      .lte('date', until)
      .order('date', { ascending: true }),
    supabase
      .from('daily_funnel_metrics')
      .select('*')
      .gte('date', since)
      .lte('date', until)
      .order('date', { ascending: true }),
    supabase
      .from('daily_ebook_metrics')
      .select('*')
      .gte('date', since)
      .lte('date', until)
      .order('date', { ascending: true }),
  ])

  return NextResponse.json({
    ads: adsResult.data ?? [],
    funnel: funnelResult.data ?? [],
    ebooks: ebooksResult.data ?? [],
    since,
    until,
  })
}
