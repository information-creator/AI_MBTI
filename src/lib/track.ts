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

function getAbVariant(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|; )ab_variant=([^;]+)/)
  return match ? match[1] : null
}

export function trackEvent(
  eventName: string,
  typeCode?: string | null,
  metadata?: Record<string, unknown> | null,
) {
  const utm = getUtmParams()
  const abVariant = getAbVariant()
  const extra: Record<string, unknown> = { ...metadata, ...utm }
  if (abVariant) extra.ab_variant = abVariant
  supabase
    .from('events')
    .insert({
      event_name: eventName,
      type_code: typeCode ?? null,
      metadata: Object.keys(extra).length > 0 ? extra : null,
    })
    .then(() => {})
}
