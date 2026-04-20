import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'AI-역량진단' }
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
