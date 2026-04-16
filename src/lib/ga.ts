export function gtagEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  window.gtag?.('event', name, params)
}

export function gtagConversion(label: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
  if (!adsId) return
  window.gtag?.('event', 'conversion', {
    send_to: `${adsId}/${label}`,
    ...params,
  })
}
