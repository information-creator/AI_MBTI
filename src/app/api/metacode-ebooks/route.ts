import { NextRequest, NextResponse } from 'next/server'

const METACODE_API = 'https://www.metacodes.co.kr/api/v1/edu'
const METACODE_KEY = 'pag5t8eqse3ulzhm5j88gghzwjly31e7'
const MENU2_IDX = '30656' // Super Event

// 전자책 EP_IDX 목록
const EBOOK_IDS = new Set(['27433', '27427', '27426', '27422'])

export async function GET(req: NextRequest) {
  const pass = req.nextUrl.searchParams.get('pass')
  if (pass !== '720972') {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  try {
    const params = new URLSearchParams({
      img_size: '432x260',
      menu2_id: MENU2_IDX,
      page: '1',
      pa: '50',
    })

    const res = await fetch(`${METACODE_API}?${params}`, {
      headers: { Authorization: `Basic ${METACODE_KEY}` },
      next: { revalidate: 0 },
    })

    if (!res.ok) {
      throw new Error(`metacode API ${res.status}`)
    }

    const json = await res.json()
    const items = (json.items ?? []) as Array<{
      primaryKey: number | string
      title: string
      cnt_join: number | string
      [key: string]: unknown
    }>

    const ebooks = items
      .filter((item) => EBOOK_IDS.has(String(item.primaryKey)))
      .map((item) => ({
        id: item.primaryKey,
        title: String(item.title ?? ''),
        students: Number(item.cnt_join ?? 0),
      }))

    return NextResponse.json({ ebooks, fetchedAt: new Date().toISOString() })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'fetch failed' },
      { status: 500 },
    )
  }
}
