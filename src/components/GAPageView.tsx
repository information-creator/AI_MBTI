'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const PAGE_TITLES: Record<string, string> = {
  '/': '랜딩',
  '/test': '테스트',
  '/privacy': '개인정보처리방침',
  '/guide': '가이드',
}

export default function GAPageView({ gaId }: { gaId: string }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const url = pathname + (searchParams.toString() ? `?${searchParams}` : '')
    const title = pathname.startsWith('/result/') ? '결과' : (PAGE_TITLES[pathname] ?? pathname)
    ;(window as any).gtag?.('config', gaId, { page_path: url, page_title: title })
  }, [pathname, searchParams, gaId])

  return null
}
