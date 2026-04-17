// 교육/온라인강의 업종 벤치마크
// Sources: Unbounce 2024, WordStream 2025, LeadQuizzes, KR market estimates

export const BENCHMARKS = {
  funnel: {
    landing_to_cta: 3.5,        // 3.5% — 랜딩 CTA 클릭률 (Unbounce 2024 교육업종)
    cta_to_test_start: 65,      // 65% — CTA 클릭→테스트 시작
    test_start_to_complete: 70,  // 70% — 퀴즈 완료율 (LeadQuizzes 평균)
    complete_to_result: 95,      // 95% — 거의 자동 리다이렉트
    result_to_secondary: 8,      // 8% — 결과→2차 행동 (리드젠 CTA 평균)
  },
  ads: {
    meta: {
      ctr: 0.90,     // % — Meta 교육업종 평균 CTR (WordStream 2025)
      cpc: 1100,     // 원 — Meta 교육업종 평균 CPC (KR)
      cpm: 9800,     // 원 — Meta 교육업종 평균 CPM
      cvr: 2.5,      // % — Meta 리드젠 전환율
    },
    google: {
      ctr: 3.17,     // % — Google Search 교육업종 평균 CTR (WordStream)
      cpc: 800,      // 원 — Google 교육업종 평균 CPC (KR)
      cpm: 15000,    // 원 — Google Display 교육업종 평균 CPM
      cvr: 3.6,      // % — Google 교육업종 전환율
    },
  },
  overall: {
    cpa_target: 5000,  // 원 — 목표 CPA
    bounce_rate: 55,   // % — 교육업종 이탈률
  },
} as const

// 벤치마크 비교 유틸
export function compareBenchmark(actual: number, benchmark: number, higherIsBetter = true): {
  diff: number
  diffPct: number
  level: 'good' | 'warn' | 'bad'
  label: string
} {
  const diff = actual - benchmark
  const diffPct = benchmark === 0 ? 0 : Math.round((diff / benchmark) * 100)
  const isPositive = higherIsBetter ? diff > 0 : diff < 0

  let level: 'good' | 'warn' | 'bad'
  if (isPositive) {
    level = Math.abs(diffPct) >= 10 ? 'good' : 'warn'
  } else {
    level = Math.abs(diffPct) >= 20 ? 'bad' : 'warn'
  }

  const sign = diffPct >= 0 ? '+' : ''
  const label = `업종 대비 ${sign}${diffPct}%`

  return { diff, diffPct, level, label }
}
