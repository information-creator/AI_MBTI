import { NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase'

const PASS = '720972'
const VARIANTS = ['v1', 'v3', 'v4']
const EVENT_NAMES = ['page_view', 'cta_click', 'test_start', 'test_complete', 'result_view', 'openchat_click', 'ebook_click', 'share_click']

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  if (searchParams.get('pass') !== PASS) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const supabase = getSupabaseServer()
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
  }

  const start = searchParams.get('start') ?? '2026-01-01'
  const end = searchParams.get('end') ?? new Date().toISOString().slice(0, 10)

  const variants = await Promise.all(
    VARIANTS.map(async (variant) => {
      // metadata 컬럼에서 ab_variant 값으로 필터
      const { data, error } = await supabase
        .from('events')
        .select('event_name')
        .gte('created_at', `${start}T00:00:00`)
        .lte('created_at', `${end}T23:59:59`)
        .eq('metadata->>ab_variant', variant)

      if (error || !data) {
        return {
          variant,
          pageView: 0,
          ctaClick: 0,
          testStart: 0,
          testComplete: 0,
          resultView: 0,
          openchatClick: 0,
          ebookClick: 0,
          shareClick: 0,
        }
      }

      const counts: Record<string, number> = {}
      for (const name of EVENT_NAMES) counts[name] = 0
      for (const row of data) {
        if (row.event_name in counts) counts[row.event_name]++
      }

      return {
        variant,
        pageView: counts['page_view'],
        ctaClick: counts['cta_click'],
        testStart: counts['test_start'],
        testComplete: counts['test_complete'],
        resultView: counts['result_view'],
        openchatClick: counts['openchat_click'],
        ebookClick: counts['ebook_click'],
        shareClick: counts['share_click'],
      }
    })
  )

  return NextResponse.json({ variants })
}
