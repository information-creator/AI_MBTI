import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { typeInfo, TypeCode } from '@/lib/quiz'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { phone, name, email, type_code, result_id, source } = body

  const cleaned = String(phone ?? '').replace(/\D/g, '')
  if (cleaned.length < 9 || cleaned.length > 11) {
    return NextResponse.json({ error: '전화번호를 확인해주세요.' }, { status: 400 })
  }

  if (!name || String(name).trim().length === 0) {
    return NextResponse.json({ error: '이름을 입력해주세요.' }, { status: 400 })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SECRET_KEY
  if (!url || !key) {
    return NextResponse.json({ ok: true })
  }

  const interest = type_code && typeInfo[type_code as TypeCode]
    ? typeInfo[type_code as TypeCode].bootcamp
    : null

  const db = createClient(url, key)

  // 동일 전화번호 + source 중복 체크
  const { data: existing } = await db
    .from('leads')
    .select('id')
    .eq('phone', cleaned)
    .eq('source', source ?? 'unknown')
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ ok: true }) // 중복이지만 사용자에게는 정상 처리
  }

  const { error } = await db.from('leads').insert({
    phone: cleaned,
    name: String(name).trim(),
    email: email ? String(email).trim() : null,
    type_code: type_code ?? null,
    result_id: result_id && result_id !== 'local' ? result_id : null,
    source: source ?? 'unknown',
    interest,
  })

  if (error) {
    console.error('[leads] insert error:', error)
    return NextResponse.json({ error: 'DB 오류' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
