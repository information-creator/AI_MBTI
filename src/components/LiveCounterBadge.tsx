import { getSupabaseAdmin } from '@/lib/supabase'

const BASELINE = 4066

async function fetchCount(): Promise<number> {
  try {
    const supabase = getSupabaseAdmin()
    if (!supabase) return BASELINE
    const { count } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true })
      .eq('event_name', 'test_complete')
    return BASELINE + (count ?? 0)
  } catch {
    return BASELINE
  }
}

export default async function LiveCounterBadge() {
  const n = await fetchCount()

  return (
    <div className="relative inline-flex">
      <span className="absolute inset-0 rounded-full bg-red-500/40 animate-ping" />
      <span className="relative inline-flex items-center gap-2 bg-red-500/20 border border-red-500/40 rounded-full px-4 py-1.5 text-red-400 text-xs font-bold">
        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
        <span className="tabular-nums">{n.toLocaleString()}</span>명 참여 🔥
      </span>
    </div>
  )
}
