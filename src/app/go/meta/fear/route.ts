import type { NextRequest } from 'next/server'
import { redirectWithUtm } from '@/lib/shortlink'

export function GET(req: NextRequest) {
  redirectWithUtm(req, '/v1', { source: 'meta', medium: 'paid', campaign: 'fear' })
}
