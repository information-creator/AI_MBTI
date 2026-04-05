export function gtagEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  if (!(window as any).gtag) return
  ;(window as any).gtag('event', name, params)
}
