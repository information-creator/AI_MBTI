import { BetaAnalyticsDataClient } from '@google-analytics/data'
import { NextResponse } from 'next/server'
import path from 'path'

const PROPERTY_ID = '531252719'

const client = new BetaAnalyticsDataClient({
  keyFilename: path.join(process.cwd(), 'ga4-key.json'),
})

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const pass = searchParams.get('pass')
  if (pass !== '720972') {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const startDate = searchParams.get('start') || '2026-03-03'
  const endDate = searchParams.get('end') || 'today'

  try {
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

    // 총 사용자 수 조회
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
