'use client'

import dynamic from 'next/dynamic'

const TrafficClient = dynamic(() => import('./TrafficClient'), { ssr: false })

export default function TrafficPage() {
  return <TrafficClient />
}
