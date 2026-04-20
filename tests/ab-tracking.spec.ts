import { test, expect } from '@playwright/test'

const PASS = '720972'

async function getCookie(context: import('@playwright/test').BrowserContext, name: string) {
  const cookies = await context.cookies()
  return cookies.find((c) => c.name === name)?.value
}

async function fetchAbTestSummary(startDate: string, endDate: string) {
  const res = await fetch(`http://localhost:3000/api/ab-test?pass=${PASS}&start=${startDate}&end=${endDate}`)
  expect(res.ok).toBeTruthy()
  const json = (await res.json()) as {
    variants: Array<{
      variant: string
      pageView: number
      ctaClick: number
      testStart: number
      testComplete: number
      resultView: number
      openchatClick: number
      ebookClick: number
      shareClick: number
    }>
  }
  return json.variants
}

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

test.describe('AB variant 쿠키', () => {
  test('/v1 방문 시 ab_variant=v1 쿠키가 세팅된다', async ({ page, context }) => {
    await page.goto('/v1')
    await page.waitForLoadState('networkidle')
    const variant = await getCookie(context, 'ab_variant')
    expect(variant).toBe('v1')
  })

  test('/v3 방문 시 ab_variant=v3 쿠키가 세팅된다', async ({ page, context }) => {
    await page.goto('/v3')
    await page.waitForLoadState('networkidle')
    const variant = await getCookie(context, 'ab_variant')
    expect(variant).toBe('v3')
  })

  test('/v4 방문 시 ab_variant=v4 쿠키가 세팅된다', async ({ page, context }) => {
    await page.goto('/v4')
    await page.waitForLoadState('networkidle')
    const variant = await getCookie(context, 'ab_variant')
    expect(variant).toBe('v4')
  })

  test('랜딩 간 이동 시 ab_variant 쿠키가 덮어씌워진다', async ({ page, context }) => {
    await page.goto('/v1')
    await page.waitForLoadState('networkidle')
    expect(await getCookie(context, 'ab_variant')).toBe('v1')
    await page.goto('/v4')
    await page.waitForLoadState('networkidle')
    expect(await getCookie(context, 'ab_variant')).toBe('v4')
  })
})

test.describe('단축 URL 리다이렉트', () => {
  test('/go/meta/fear → /v1?utm_campaign=fear', async ({ page }) => {
    await page.goto('/go/meta/fear')
    await page.waitForURL(/\/v1\?/)
    const url = new URL(page.url())
    expect(url.pathname).toBe('/v1')
    expect(url.searchParams.get('utm_source')).toBe('meta')
    expect(url.searchParams.get('utm_medium')).toBe('paid')
    expect(url.searchParams.get('utm_campaign')).toBe('fear')
  })

  test('/go/meta/social → /v3?utm_campaign=social', async ({ page }) => {
    await page.goto('/go/meta/social')
    await page.waitForURL(/\/v3\?/)
    const url = new URL(page.url())
    expect(url.pathname).toBe('/v3')
    expect(url.searchParams.get('utm_campaign')).toBe('social')
  })

  test('/go/meta/simple → /v4?utm_campaign=simple', async ({ page }) => {
    await page.goto('/go/meta/simple')
    await page.waitForURL(/\/v4\?/)
    const url = new URL(page.url())
    expect(url.pathname).toBe('/v4')
    expect(url.searchParams.get('utm_campaign')).toBe('simple')
  })

  test('fbclid가 리다이렉트 시 통과된다', async ({ page }) => {
    await page.goto('/go/meta/fear?fbclid=IwAR0TEST123')
    await page.waitForURL(/\/v1\?/)
    const url = new URL(page.url())
    expect(url.searchParams.get('fbclid')).toBe('IwAR0TEST123')
    expect(url.searchParams.get('utm_campaign')).toBe('fear')
  })
})

test.describe('UTM 쿠키 퍼시스턴스', () => {
  test('첫 방문 URL의 utm_campaign이 쿠키에 저장된다', async ({ page, context }) => {
    await page.goto('/v1?utm_source=meta&utm_campaign=fear')
    await page.waitForLoadState('networkidle')
    // 이벤트 발화 대기 (PageViewTracker useEffect)
    await page.waitForTimeout(500)
    expect(await getCookie(context, 'utm_campaign')).toBe('fear')
    expect(await getCookie(context, 'utm_source')).toBe('meta')
  })

  test('랜딩→/test 이동 후에도 utm_campaign이 유지된다', async ({ page, context }) => {
    await page.goto('/v3?utm_source=meta&utm_campaign=social')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)
    await page.goto('/test')
    await page.waitForLoadState('networkidle')
    expect(await getCookie(context, 'utm_campaign')).toBe('social')
  })
})

test.describe('Supabase 이벤트 적재', () => {
  test('/v1 방문 후 page_view 이벤트가 Supabase에 쌓인다', async ({ page }) => {
    const before = await fetchAbTestSummary(today(), today())
    const v1Before = before.find((v) => v.variant === 'v1')?.pageView ?? 0

    await page.goto('/v1')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1500) // Supabase insert 반영 대기

    const after = await fetchAbTestSummary(today(), today())
    const v1After = after.find((v) => v.variant === 'v1')?.pageView ?? 0
    expect(v1After).toBeGreaterThan(v1Before)
  })

  test('CTA 클릭 시 cta_click 이벤트가 Supabase에 쌓인다', async ({ page }) => {
    const before = await fetchAbTestSummary(today(), today())
    const v1Before = before.find((v) => v.variant === 'v1')?.ctaClick ?? 0

    await page.goto('/v1')
    await page.waitForLoadState('networkidle')
    // 랜딩 CTA 버튼 중 하나 클릭 (히어로 or 헤더)
    const cta = page.locator('a[href="/test"]').first()
    await cta.click()
    await page.waitForURL('**/test')
    await page.waitForTimeout(1500)

    const after = await fetchAbTestSummary(today(), today())
    const v1After = after.find((v) => v.variant === 'v1')?.ctaClick ?? 0
    expect(v1After).toBeGreaterThan(v1Before)
  })
})
