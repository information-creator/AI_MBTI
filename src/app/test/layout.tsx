import type { Metadata } from 'next'
export const metadata: Metadata = { title: '테스트 진행중' }
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
