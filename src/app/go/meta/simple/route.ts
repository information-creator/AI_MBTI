import type { NextRequest } from 'next/server'
import { redirectWithUtm } from '@/lib/shortlink'

export function GET(req: NextRequest) {
  redirectWithUtm(req, '/v4', { source: 'meta', medium: 'paid', campaign: 'simple' })
}
