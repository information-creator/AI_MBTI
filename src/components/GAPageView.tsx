'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function GAPageView({ gaId }: { gaId: string }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const url = pathname + (searchParams.toString() ? `?${searchParams}` : '')
    ;(window as any).gtag?.('config', gaId, { page_path: url })
  }, [pathname, searchParams, gaId])

  return null
}
