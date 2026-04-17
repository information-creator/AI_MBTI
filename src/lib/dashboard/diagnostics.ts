import type { DiagLevel, DiagItem } from './types'

export function diagLevel(level: DiagLevel) {
  if (level === 'good') return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', dot: 'bg-green-500', badge: '양호' }
  if (level === 'warn') return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', dot: 'bg-yellow-500', badge: '주의' }
  return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', dot: 'bg-red-500', badge: '위험' }
}

export function evaluateAds(label: string, totals: { impressions: number; clicks: number; spend: number; ctr: number; cpc: number; cpm: number; conversions: number }): DiagItem[] {
  const items: DiagItem[] = []
  const { impressions, clicks, spend, ctr, cpc, cpm, conversions } = totals
  if (spend === 0 && impressions === 0) return []

  const cpmLevel: DiagLevel = cpm < 10000 ? 'good' : cpm < 20000 ? 'warn' : 'bad'
  items.push({ label: `${label} CPM`, level: cpmLevel, value: `${cpm.toLocaleString()}원`, comment: cpmLevel === 'good' ? '노출 단가 효율적' : cpmLevel === 'warn' ? '노출 단가 보통 — 타겟 확장 고려' : '노출 단가 높음 — 타겟이 너무 좁거나 경쟁 과열' })

  const ctrLevel: DiagLevel = ctr >= 2 ? 'good' : ctr >= 1 ? 'warn' : 'bad'
  items.push({ label: `${label} CTR`, level: ctrLevel, value: `${ctr}%`, comment: ctrLevel === 'good' ? '광고 소재 반응 좋음' : ctrLevel === 'warn' ? '소재 반응 보통 — A/B 테스트 권장' : '소재 반응 낮음 — 문구/이미지 교체 필요' })

  const cpcLevel: DiagLevel = cpc < 500 ? 'good' : cpc < 1500 ? 'warn' : 'bad'
  items.push({ label: `${label} CPC`, level: cpcLevel, value: `${cpc.toLocaleString()}원`, comment: cpcLevel === 'good' ? '클릭 단가 저렴' : cpcLevel === 'warn' ? '클릭 단가 보통' : '클릭 단가 높음 — 소재 또는 타겟 개선 필요' })

  if (clicks > 0) {
    const cvr = (conversions / clicks) * 100
    const cvrLevel: DiagLevel = cvr >= 5 ? 'good' : cvr >= 2 ? 'warn' : 'bad'
    items.push({ label: `${label} 전환율`, level: cvrLevel, value: `${cvr.toFixed(1)}%`, comment: cvrLevel === 'good' ? '랜딩→전환 잘 되고 있음' : cvrLevel === 'warn' ? '전환 보통 — 랜딩페이지 개선 여지' : '전환 낮음 — 랜딩/오퍼 점검 필수' })
  }

  return items
}

export function evaluateFunnel(funnelSteps: { label: string; value: number }[]): DiagItem[] {
  const items: DiagItem[] = []
  for (let i = 1; i < funnelSteps.length; i++) {
    const prev = funnelSteps[i - 1].value
    if (prev === 0) continue
    const drop = ((prev - funnelSteps[i].value) / prev) * 100
    if (drop <= 0) continue
    const level: DiagLevel = drop < 30 ? 'good' : drop < 60 ? 'warn' : 'bad'
    items.push({ label: `${funnelSteps[i - 1].label} → ${funnelSteps[i].label}`, level, value: `-${Math.round(drop)}%`, comment: level === 'good' ? '이탈 적음' : level === 'warn' ? '이탈 보통 — 개선 여지 있음' : '이탈 심각 — 이 구간 집중 개선 필요' })
  }
  return items
}

export function getOverallVerdict(items: DiagItem[]): { level: DiagLevel; summary: string } {
  if (items.length === 0) return { level: 'warn', summary: '데이터 부족 — 광고 집행 후 다시 확인하세요' }
  const bad = items.filter(i => i.level === 'bad').length
  const warn = items.filter(i => i.level === 'warn').length
  const good = items.filter(i => i.level === 'good').length

  const ctrOk = items.some(i => i.label.includes('CTR') && i.level !== 'bad')
  const cvrBad = items.some(i => i.label.includes('전환율') && i.level === 'bad')
  const cpmBad = items.some(i => i.label.includes('CPM') && i.level === 'bad')

  if (ctrOk && cvrBad) return { level: 'bad', summary: '광고 소재는 괜찮지만 랜딩/전환 구조에 문제 — 랜딩페이지 개선 우선' }
  if (cpmBad && ctrOk) return { level: 'warn', summary: '소재 반응은 OK, 노출 단가가 높음 — 타겟 확장 필요' }
  if (bad >= 3) return { level: 'bad', summary: '전반적으로 성과 부진 — 소재·타겟·랜딩 전면 점검 필요' }
  if (bad === 0 && warn <= 2) return { level: 'good', summary: '전반적으로 양호 — 현재 전략 유지하며 세부 최적화' }
  return { level: 'warn', summary: `양호 ${good}개 / 주의 ${warn}개 / 위험 ${bad}개 — 위험 항목 우선 개선` }
}
