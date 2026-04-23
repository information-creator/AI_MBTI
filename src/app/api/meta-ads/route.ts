import { NextResponse } from 'next/server'

const PASS = '720972'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const pass = searchParams.get('pass')
  if (pass !== PASS) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const accessToken = process.env.META_ADS_ACCESS_TOKEN
  const accountId = process.env.META_ADS_ACCOUNT_ID

  if (!accessToken || !accountId) {
    return NextResponse.json({ error: 'Meta Ads 환경변수 미설정 (META_ADS_ACCESS_TOKEN, META_ADS_ACCOUNT_ID)' }, { status: 500 })
  }

  const since = searchParams.get('since') || '2026-03-03'
  const until = searchParams.get('until') || new Date().toISOString().slice(0, 10)

  try {
    // 캠페인별 성과 조회 (서버측 CONTAIN은 대소문자 구분 → 클라이언트측에서 필터)
    const url = `https://graph.facebook.com/v21.0/act_${accountId}/insights?` + new URLSearchParams({
      access_token: accessToken,
      level: 'campaign',
      fields: 'campaign_name,impressions,clicks,spend,ctr,cpc,cpm,actions',
      time_range: JSON.stringify({ since, until }),
      limit: '100',
    })

    const res = await fetch(url)
    if (!res.ok) {
      const err = await res.json()
      console.error('[Meta Ads API]', err)
      return NextResponse.json({ error: 'Meta API error', detail: err.error?.message }, { status: 500 })
    }

    const json = await res.json()
    const campaigns = (json.data ?? [])
      .filter((row: Record<string, unknown>) => {
        const name = String(row.campaign_name ?? '').toLowerCase()
        return name.includes('mbti') || name.includes('aimbti')
      })
      .map((row: Record<string, unknown>) => {
      const actions = (row.actions as Array<{ action_type: string; value: string }>) ?? []
      const getAction = (type: string) => Number(actions.find(a => a.action_type === type)?.value ?? 0)

      return {
        name: row.campaign_name,
        impressions: Number(row.impressions ?? 0),
        clicks: Number(row.clicks ?? 0),
        spend: Number(Number(row.spend ?? 0).toFixed(0)),
        ctr: Number(Number(row.ctr ?? 0).toFixed(2)),
        cpc: Number(Number(row.cpc ?? 0).toFixed(0)),
        cpm: Number(Number(row.cpm ?? 0).toFixed(0)),
        conversions: getAction('lead'),
        linkClicks: getAction('link_click'),
        pageViews: getAction('landing_page_view'),
      }
    })

    // 합계
    const totals = campaigns.reduce(
      (acc: Record<string, number>, c: Record<string, number>) => ({
        impressions: acc.impressions + c.impressions,
        clicks: acc.clicks + c.clicks,
        spend: acc.spend + c.spend,
        conversions: acc.conversions + c.conversions,
        linkClicks: acc.linkClicks + c.linkClicks,
        pageViews: acc.pageViews + c.pageViews,
      }),
      { impressions: 0, clicks: 0, spend: 0, conversions: 0, linkClicks: 0, pageViews: 0 },
    )

    const totalClicks = totals.clicks || 1
    const totalImpressions = totals.impressions || 1

    return NextResponse.json({
      campaigns,
      totals: {
        ...totals,
        ctr: Number(((totals.clicks / totalImpressions) * 100).toFixed(2)),
        cpc: Number((totals.spend / totalClicks).toFixed(0)),
        cpm: Number(((totals.spend / totalImpressions) * 1000).toFixed(0)),
      },
      since,
      until,
    })
  } catch (err) {
    console.error('[Meta Ads API]', err)
    return NextResponse.json({ error: 'Meta Ads API error' }, { status: 500 })
  }
}
