export function fbqEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  window.fbq?.('track', name, params)
}

// Lead 이벤트는 세션당 1회만 발사 (Meta Ads Manager 카운트와 일치시키기 위함)
export function fbqLeadOnce(params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  if (sessionStorage.getItem('lead_fired') === '1') return
  window.fbq?.('track', 'Lead', params)
  sessionStorage.setItem('lead_fired', '1')
}
