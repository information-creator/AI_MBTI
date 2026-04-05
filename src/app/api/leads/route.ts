import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { phone, type_code, result_id, source } = body

  const cleaned = String(phone ?? '').replace(/\D/g, '')
  if (cleaned.length < 9 || cleaned.length > 11) {
    return NextResponse.json({ error: '전화번호를 확인해주세요.' }, { status: 400 })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SECRET_KEY
  if (!url || !key) {
    return NextResponse.json({ ok: true })
  }

  const db = createClient(url, key)
  const { error } = await db.from('leads').insert({
    phone: cleaned,
    type_code: type_code ?? null,
    result_id: result_id && result_id !== 'local' ? result_id : null,
    source: source ?? 'unknown',
  })

  if (error) {
    console.error('[leads] insert error:', error)
    return NextResponse.json({ error: 'DB 오류' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
