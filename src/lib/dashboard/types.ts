export type GA4Data = {
  events: Record<string, { events: number; users: number }>
  totalUsers: number
  startDate: string
  endDate: string
}

export type MetaCampaign = {
  name: string
  impressions: number
  clicks: number
  spend: number
  ctr: number
  cpc: number
  cpm: number
  conversions: number
  linkClicks: number
  pageViews: number
}

export type MetaAdsData = {
  campaigns: MetaCampaign[]
  totals: {
    impressions: number
    clicks: number
    spend: number
    ctr: number
    cpc: number
    cpm: number
    conversions: number
    linkClicks: number
    pageViews: number
  }
  since: string
  until: string
}

export type GoogleAdsCampaign = {
  name: string
  impressions: number
  clicks: number
  spend: number
  ctr: number
  cpc: number
  conversions: number
}

export type GoogleAdsData = {
  campaigns: GoogleAdsCampaign[]
  totals: {
    impressions: number
    clicks: number
    spend: number
    ctr: number
    cpc: number
    cpm: number
    conversions: number
  }
  since: string
  until: string
}

export type DiagLevel = 'good' | 'warn' | 'bad'
export type DiagItem = { label: string; level: DiagLevel; value: string; comment: string }

export type ABVariant = 'v1' | 'v3' | 'v4'

export type ABTestData = {
  variant: ABVariant
  pageView: number
  ctaClick: number
  testStart: number
  testComplete: number
  resultView: number
  openchatClick: number
  ebookClick: number
  shareClick: number
}
