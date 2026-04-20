import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

const PASS = '720972'

function checkAuth(req: Request): boolean {
  const { searchParams } = new URL(req.url)
  return searchParams.get('pass') === PASS
}

export async function GET(req: Request) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const supabase = getSupabaseAdmin()
  if (!supabase) return NextResponse.json({ memos: [] })

  const { data, error } = await supabase
    .from('dashboard_memos')
    .select('id, memo_date, content, created_at')
    .order('memo_date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(200)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ memos: data ?? [] })
}

export async function POST(req: Request) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const supabase = getSupabaseAdmin()
  if (!supabase) return NextResponse.json({ error: 'supabase not configured' }, { status: 500 })

  const body = await req.json()
  const content = String(body?.content ?? '').trim()
  if (!content) return NextResponse.json({ error: 'content required' }, { status: 400 })

  const memoDate: string = body?.memo_date ?? new Date().toISOString().slice(0, 10)

  const { data, error } = await supabase
    .from('dashboard_memos')
    .insert({ content, memo_date: memoDate })
    .select('id, memo_date, content, created_at')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ memo: data })
}

export async function DELETE(req: Request) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const supabase = getSupabaseAdmin()
  if (!supabase) return NextResponse.json({ error: 'supabase not configured' }, { status: 500 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const { error } = await supabase.from('dashboard_memos').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
