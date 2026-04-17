import type { GA4Data, MetaAdsData, GoogleAdsData } from './types'

const PASS = '720972'

export async function fetchGA4(start: string, end: string): Promise<GA4Data> {
  const res = await fetch(`/api/ga4?pass=${PASS}&start=${start}&end=${end}`)
  if (!res.ok) throw new Error('GA4 API 오류')
  return res.json()
}

export async function fetchMetaAds(start: string, end: string): Promise<MetaAdsData> {
  const res = await fetch(`/api/meta-ads?pass=${PASS}&since=${start}&until=${end}`)
  if (!res.ok) {
    const json = await res.json()
    throw new Error(json.detail || json.error || 'Meta API 오류')
  }
  return res.json()
}

export async function fetchGoogleAds(start: string, end: string): Promise<GoogleAdsData> {
  const res = await fetch(`/api/google-ads?pass=${PASS}&since=${start}&until=${end}`)
  if (!res.ok) {
    const json = await res.json()
    throw new Error(json.detail || json.error || 'Google Ads API 오류')
  }
  return res.json()
}

export async function fetchABTest(start: string, end: string) {
  const res = await fetch(`/api/ab-test?pass=${PASS}&start=${start}&end=${end}`)
  if (!res.ok) throw new Error('A/B 테스트 API 오류')
  return res.json()
}

export async function fetchSnapshot(start: string, end: string) {
  const res = await fetch(`/api/snapshot?pass=${PASS}&since=${start}&until=${end}`)
  if (!res.ok) throw new Error('스냅샷 API 오류')
  return res.json()
}
