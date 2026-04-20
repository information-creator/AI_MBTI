import { BetaAnalyticsDataClient } from '@google-analytics/data'
import { NextResponse } from 'next/server'
import path from 'path'

const PROPERTY_ID = '531252719'
const START_DATE = '2026-01-01'

export const revalidate = 300

function getClient() {
  if (process.env.GA4_SERVICE_ACCOUNT_KEY) {
    const credentials = JSON.parse(process.env.GA4_SERVICE_ACCOUNT_KEY)
    return new BetaAnalyticsDataClient({ credentials })
  }
  return new BetaAnalyticsDataClient({
    keyFilename: path.join(process.cwd(), 'cred', 'ga4-key.json'),
  })
}

export async function GET() {
  try {
    const client = getClient()
    const [response] = await client.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate: START_DATE, endDate: 'today' }],
      dimensions: [{ name: 'eventName' }],
      metrics: [{ name: 'totalUsers' }],
      dimensionFilter: {
        filter: {
          fieldName: 'eventName',
          stringFilter: { value: 'test_complete' },
        },
      },
    })
    const users = Number(response.rows?.[0]?.metricValues?.[0]?.value ?? 0)
    return NextResponse.json({ count: users })
  } catch (error) {
    return NextResponse.json({ count: 0, error: String(error) })
  }
}
