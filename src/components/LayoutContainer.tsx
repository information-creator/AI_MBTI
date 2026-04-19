'use client'

import { usePathname } from 'next/navigation'

export default function LayoutContainer({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? ''
  const fullWidth = pathname.startsWith('/dashboard3')

  if (fullWidth) return <>{children}</>

  return (
    <div className="min-h-screen mx-auto w-full max-w-[480px] bg-white shadow-xl shadow-slate-200">
      {children}
    </div>
  )
}
