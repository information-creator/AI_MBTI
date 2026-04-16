import { BetaAnalyticsDataClient } from '@google-analytics/data'
import { NextResponse } from 'next/server'

const PROPERTY_ID = '531252719'

function getClient() {
  if (process.env.GA4_SERVICE_ACCOUNT_KEY) {
    const credentials = JSON.parse(process.env.GA4_SERVICE_ACCOUNT_KEY)
    return new BetaAnalyticsDataClient({ credentials })
  }
  const path = require('path')
  return new BetaAnalyticsDataClient({
    keyFilename: path.join(process.cwd(), 'cred', 'ga4-key.json'),
  })
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const pass = searchParams.get('pass')
  if (pass !== '720972') {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const startDate = searchParams.get('start') || '2026-04-16'
  const endDate = searchParams.get('end') || 'today'

  try {
    const client = getClient()

    // 소스/매체별
    const [srcRes] = await client.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'sessionSource' }, { name: 'sessionMedium' }],
      metrics: [{ name: 'totalUsers' }, { name: 'sessions' }, { name: 'engagedSessions' }],
      orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }],
      limit: 20,
    })

    const sources = (srcRes.rows ?? []).map((row) => ({
      source: row.dimensionValues?.[0]?.value ?? '',
      medium: row.dimensionValues?.[1]?.value ?? '',
      users: Number(row.metricValues?.[0]?.value ?? 0),
      sessions: Number(row.metricValues?.[1]?.value ?? 0),
      engaged: Number(row.metricValues?.[2]?.value ?? 0),
    }))

    // 국가별
    const [countryRes] = await client.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'country' }],
      metrics: [{ name: 'totalUsers' }, { name: 'sessions' }, { name: 'engagedSessions' }],
      orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }],
      limit: 20,
    })

    const countries = (countryRes.rows ?? []).map((row) => ({
      country: row.dimensionValues?.[0]?.value ?? '',
      users: Number(row.metricValues?.[0]?.value ?? 0),
      sessions: Number(row.metricValues?.[1]?.value ?? 0),
      engaged: Number(row.metricValues?.[2]?.value ?? 0),
    }))

    // 디바이스별
    const [devRes] = await client.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'deviceCategory' }],
      metrics: [{ name: 'totalUsers' }, { name: 'sessions' }, { name: 'engagedSessions' }],
      orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }],
    })

    const devices = (devRes.rows ?? []).map((row) => ({
      device: row.dimensionValues?.[0]?.value ?? '',
      users: Number(row.metricValues?.[0]?.value ?? 0),
      sessions: Number(row.metricValues?.[1]?.value ?? 0),
      engaged: Number(row.metricValues?.[2]?.value ?? 0),
    }))

    // 랜딩페이지별
    const [pageRes] = await client.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'landingPage' }],
      metrics: [{ name: 'totalUsers' }, { name: 'sessions' }, { name: 'engagedSessions' }],
      orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }],
      limit: 10,
    })

    const pages = (pageRes.rows ?? []).map((row) => ({
      page: row.dimensionValues?.[0]?.value ?? '',
      users: Number(row.metricValues?.[0]?.value ?? 0),
      sessions: Number(row.metricValues?.[1]?.value ?? 0),
      engaged: Number(row.metricValues?.[2]?.value ?? 0),
    }))

    // 전체 합계
    const totalUsers = sources.reduce((s, r) => s + r.users, 0)
    const totalSessions = sources.reduce((s, r) => s + r.sessions, 0)
    const totalEngaged = sources.reduce((s, r) => s + r.engaged, 0)
    const koreaUsers = countries.find((c) => c.country === 'South Korea')?.users ?? 0

    return NextResponse.json({
      sources,
      countries,
      devices,
      pages,
      summary: { totalUsers, totalSessions, totalEngaged, koreaUsers },
      startDate,
      endDate,
    })
  } catch (err) {
    console.error('[GA4 Traffic API]', err)
    return NextResponse.json({ error: 'GA4 API error' }, { status: 500 })
  }
}
