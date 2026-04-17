import { NextResponse } from 'next/server'

const PASS = '720972'

async function getAccessToken(): Promise<string> {
  const clientId = process.env.GOOGLE_ADS_CLIENT_ID
  const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET
  const refreshToken = process.env.GOOGLE_ADS_REFRESH_TOKEN
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Google OAuth 환경변수 미설정 (CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN)')
  }
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Refresh token 갱신 실패: ${err}`)
  }
  const json = await res.json()
  return json.access_token as string
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const pass = searchParams.get('pass')
  if (pass !== PASS) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN
  const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID

  if (!developerToken || !customerId) {
    return NextResponse.json({ error: 'Google Ads 환경변수 미설정 (GOOGLE_ADS_DEVELOPER_TOKEN, GOOGLE_ADS_CUSTOMER_ID)' }, { status: 500 })
  }

  let accessToken: string
  try {
    accessToken = await getAccessToken()
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'OAuth 토큰 갱신 실패' }, { status: 500 })
  }

  const since = searchParams.get('since') || '2026-03-03'
  const until = searchParams.get('until') || new Date().toISOString().slice(0, 10)

  try {
    const query = `
      SELECT
        campaign.name,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.ctr,
        metrics.average_cpc,
        metrics.conversions
      FROM campaign
      WHERE segments.date BETWEEN '${since}' AND '${until}'
        AND campaign.status != 'REMOVED'
        AND campaign.name LIKE '%MBTI%'
    `

    const url = `https://googleads.googleapis.com/v20/customers/${customerId}/googleAds:searchStream`
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'developer-token': developerToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    })

    if (!res.ok) {
      const err = await res.json()
      console.error('[Google Ads API]', err)
      return NextResponse.json({ error: 'Google Ads API error', detail: err.error?.message }, { status: 500 })
    }

    const json = await res.json()
    const rows = json[0]?.results ?? []

    const campaigns = rows.map((row: Record<string, Record<string, unknown>>) => {
      const costMicros = Number(row.metrics?.costMicros ?? 0)
      return {
        name: row.campaign?.name ?? '',
        impressions: Number(row.metrics?.impressions ?? 0),
        clicks: Number(row.metrics?.clicks ?? 0),
        spend: Math.round(costMicros / 1_000_000),
        ctr: Number((Number(row.metrics?.ctr ?? 0) * 100).toFixed(2)),
        cpc: Math.round(Number(row.metrics?.averageCpc ?? 0) / 1_000_000),
        conversions: Number(Number(row.metrics?.conversions ?? 0).toFixed(0)),
      }
    })

    const totals = campaigns.reduce(
      (acc: Record<string, number>, c: Record<string, number>) => ({
        impressions: acc.impressions + c.impressions,
        clicks: acc.clicks + c.clicks,
        spend: acc.spend + c.spend,
        conversions: acc.conversions + c.conversions,
      }),
      { impressions: 0, clicks: 0, spend: 0, conversions: 0 },
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
    console.error('[Google Ads API]', err)
    return NextResponse.json({ error: 'Google Ads API error' }, { status: 500 })
  }
}
