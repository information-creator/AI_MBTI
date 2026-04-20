'use client'

import Link from 'next/link'
import { gtagEvent } from '@/lib/ga'
import { trackEvent } from '@/lib/track'

type Props = {
  location: string
  className?: string
  children: React.ReactNode
}

export default function CTAButton({ location, className, children }: Props) {
  return (
    <Link
      href="/test"
      className={className}
      onClick={() => {
        gtagEvent('cta_click', { location })
        trackEvent('cta_click', null, { location })
      }}
    >
      {children}
    </Link>
  )
}
