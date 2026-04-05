import { createClient, SupabaseClient } from '@supabase/supabase-js'

function createSupabaseClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key || url === 'your_supabase_url') return null
  return createClient(url, key)
}

let _client: SupabaseClient | null | undefined = undefined

function getClient(): SupabaseClient | null {
  if (_client !== undefined) return _client
  _client = createSupabaseClient()
  return _client
}

// 클라이언트 컴포넌트에서 직접 사용
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getClient()
    if (!client) {
      // 환경변수 미설정 시 noop 반환
      if (prop === 'from') {
        return () => ({
          insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }) }) }),
          select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }) }) }),
        })
      }
      return undefined
    }
    return (client as any)[prop]
  },
})

export function getSupabaseServer(): SupabaseClient | null {
  return getClient()
}

export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SECRET_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export type Result = {
  id: string
  type_code: string
  type_name: string
  ai_score: number
  work_style: string
  ai_usage: string
  strength: string
  speed: string
  overtime_result: string
  shared: boolean
  created_at: string
}

export type Coupon = {
  id: string
  code: string
  used: boolean
  result_id: string
  created_at: string
}
