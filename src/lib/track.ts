import { supabase } from './supabase'

export function trackEvent(
  eventName: string,
  typeCode?: string | null,
  metadata?: Record<string, unknown> | null,
) {
  supabase
    .from('events')
    .insert({
      event_name: eventName,
      type_code: typeCode ?? null,
      metadata: metadata ?? null,
    })
    .then(() => {})
}
