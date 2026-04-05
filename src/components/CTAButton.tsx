'use client'

import Link from 'next/link'
import { gtagEvent } from '@/lib/ga'

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
      onClick={() => gtagEvent('cta_click', { location })}
    >
      {children}
    </Link>
  )
}
