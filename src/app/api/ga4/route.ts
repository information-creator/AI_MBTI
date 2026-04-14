import { BetaAnalyticsDataClient } from '@google-analytics/data'
import { NextResponse } from 'next/server'

const PROPERTY_ID = '531252719'

function getClient() {
  // Vercel: 환경변수에서 읽기
  if (process.env.GA4_SERVICE_ACCOUNT_KEY) {
    const credentials = JSON.parse(process.env.GA4_SERVICE_ACCOUNT_KEY)
    return new BetaAnalyticsDataClient({ credentials })
  }
  // 로컬: 파일에서 읽기
  const path = require('path')
  return new BetaAnalyticsDataClient({
    keyFilename: path.join(process.cwd(), 'ga4-key.json'),
  })
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const pass = searchParams.get('pass')
  if (pass !== '720972') {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const startDate = searchParams.get('start') || '2026-03-03'
  const endDate = searchParams.get('end') || 'today'

  try {
    const client = getClient()

    const [response] = await client.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'eventName' }],
      metrics: [
        { name: 'eventCount' },
        { name: 'totalUsers' },
      ],
    })

    const events: Record<string, { events: number; users: number }> = {}
    for (const row of response.rows ?? []) {
      const name = row.dimensionValues?.[0]?.value ?? ''
      events[name] = {
        events: Number(row.metricValues?.[0]?.value ?? 0),
        users: Number(row.metricValues?.[1]?.value ?? 0),
      }
    }

    const [totalResponse] = await client.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate }],
      metrics: [{ name: 'totalUsers' }],
    })
    const totalUsers = Number(totalResponse.rows?.[0]?.metricValues?.[0]?.value ?? 0)

    return NextResponse.json({ events, totalUsers, startDate, endDate })
  } catch (err) {
    console.error('[GA4 API]', err)
    return NextResponse.json({ error: 'GA4 API error' }, { status: 500 })
  }
}
