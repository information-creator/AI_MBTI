import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'

const PASSTHROUGH_KEYS = ['fbclid', 'gclid', 'utm_content', 'utm_term']

export function redirectWithUtm(
  req: NextRequest,
  path: string,
  utm: { source: string; medium: string; campaign: string },
) {
  const dest = new URL(path, req.nextUrl.origin)
  dest.searchParams.set('utm_source', utm.source)
  dest.searchParams.set('utm_medium', utm.medium)
  dest.searchParams.set('utm_campaign', utm.campaign)
  for (const key of PASSTHROUGH_KEYS) {
    const v = req.nextUrl.searchParams.get(key)
    if (v) dest.searchParams.set(key, v)
  }
  redirect(dest.pathname + dest.search)
}
