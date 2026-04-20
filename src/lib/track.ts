import { supabase } from './supabase'

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const
const UTM_COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30일

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]+)`))
  return match ? decodeURIComponent(match[1]) : null
}

function writeCookie(name: string, value: string) {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${UTM_COOKIE_MAX_AGE}; SameSite=Lax`
}

/**
 * 현재 URL에 UTM이 있으면 쿠키에 저장하고 반환.
 * 없으면 쿠키에서 불러옴. (세션 내 모든 이벤트에 같은 캠페인 태그 유지)
 */
function resolveUtm(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  const params = new URLSearchParams(window.location.search)
  const fresh: Record<string, string> = {}
  for (const key of UTM_KEYS) {
    const val = params.get(key)
    if (val) fresh[key] = val
  }
  // URL에 utm이 하나라도 있으면 전부 덮어씌움 (새 캠페인 유입 우선)
  if (Object.keys(fresh).length > 0) {
    for (const key of UTM_KEYS) {
      if (fresh[key]) writeCookie(key, fresh[key])
    }
    return fresh
  }
  // URL에 없으면 쿠키에서 복원
  const fromCookie: Record<string, string> = {}
  for (const key of UTM_KEYS) {
    const val = readCookie(key)
    if (val) fromCookie[key] = val
  }
  return fromCookie
}

function getAbVariant(): string | null {
  return readCookie('ab_variant')
}

export function trackEvent(
  eventName: string,
  typeCode?: string | null,
  metadata?: Record<string, unknown> | null,
) {
  const utm = resolveUtm()
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
