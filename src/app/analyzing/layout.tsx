import type { Metadata } from 'next'
export const metadata: Metadata = { title: '분석중' }
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
