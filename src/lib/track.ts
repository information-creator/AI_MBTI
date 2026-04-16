import { supabase } from './supabase'

function getUtmParams(): Record<string, string> | null {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  const utm: Record<string, string> = {}
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign']) {
    const val = params.get(key)
    if (val) utm[key] = val
  }
  return Object.keys(utm).length > 0 ? utm : null
}

export function trackEvent(
  eventName: string,
  typeCode?: string | null,
  metadata?: Record<string, unknown> | null,
) {
  const utm = getUtmParams()
  supabase
    .from('events')
    .insert({
      event_name: eventName,
      type_code: typeCode ?? null,
      metadata: metadata || utm ? { ...metadata, ...utm } : null,
    })
    .then(() => {})
}
