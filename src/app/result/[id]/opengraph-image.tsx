import { ImageResponse } from 'next/og'
import { getSupabaseServer } from '@/lib/supabase'
import { TypeCode, typeInfo } from '@/lib/quiz'

export const alt = 'AI 시대 생존력 진단 결과'
export const size = { width: 800, height: 1600 }
export const contentType = 'image/png'

function pentaPoints(cx: number, cy: number, r: number, vals: number[]): string {
  return vals.map((v, i) => {
    const a = -Math.PI / 2 + i * (2 * Math.PI / 5)
    const rv = r * Math.max(v, 0.05)
    return `${cx + rv * Math.cos(a)},${cy + rv * Math.sin(a)}`
  }).join(' ')
}

function pentaGridPoints(cx: number, cy: number, r: number, level: number): string {
  return Array.from({ length: 5 }, (_, i) => {
    const a = -Math.PI / 2 + i * (2 * Math.PI / 5)
    return `${cx + r * level * Math.cos(a)},${cy + r * level * Math.sin(a)}`
  }).join(' ')
}

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  let typeCode: TypeCode = 'TSLF'
  let aiScore = 50
  let scores = { a: 2, b: 2, c: 2, d: 2, e: 3 }

  if (id !== 'local') {
    try {
      const db = getSupabaseServer()
      if (db) {
        const { data } = await db.from('results_v2').select('*').eq('id', id).single()
        if (data) {
          typeCode = (data.type_code as TypeCode) ?? 'TSLF'
          aiScore = data.ai_score
          if (data.score_a != null) scores = {
            a: data.score_a, b: data.score_b, c: data.score_c,
            d: data.score_d, e: data.score_e,
          }
        }
      }
    } catch {}
  }

  const info = typeInfo[typeCode]
  const scoreColor = aiScore >= 70 ? '#ef4444' : aiScore >= 40 ? '#f59e0b' : '#10b981'
  const scoreLabel = aiScore >= 70 ? '⚠️ AI 대체 위험' : aiScore >= 40 ? '🟡 주의 필요' : '✅ 안전 구간'

  const BASE = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000'

  let charImgSrc = ''
  try {
    const res = await fetch(`${BASE}/reals_ch/${encodeURIComponent(info.title)}.png`)
    const buf = await res.arrayBuffer()
    charImgSrc = `data:image/png;base64,${Buffer.from(buf).toString('base64')}`
  } catch {}

  const pVals = [scores.a / 4, scores.b / 4, scores.c / 4, scores.d / 4, scores.e / 6]
  const pLabelsHi = ['혼자', 'AI 활용', '논리형', '빠른 실행', '야근 내성']
  const pLabelsLo = ['함께', '사람 감각', '창의형', '완벽 준비', '']
  const cx = 400, cy = 170, pR = 130

  const insightItems = [
    { emoji: '💪', label: '강점', text: info.insight.strength, bg: '#f0fdf4', border: '#bbf7d0', labelColor: '#15803d', textColor: '#166534' },
    { emoji: '🚨', label: '현실', text: info.insight.crisis, bg: '#fff1f2', border: '#fecdd3', labelColor: '#dc2626', textColor: '#9f1239' },
    { emoji: '🎯', label: '할 것', text: info.insight.direction, bg: info.color + '0d', border: info.color + '50', labelColor: info.color, textColor: info.color },
  ]

  return new ImageResponse(
    (
      <div style={{
        width: 800, height: 1600,
        background: '#ffffff',
        display: 'flex', flexDirection: 'column',
        fontFamily: 'sans-serif',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* 상단 컬러 띠 */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: 800, height: 12,
          background: `linear-gradient(to right, ${info.color}, #6366f1)`,
          display: 'flex',
        }} />

        {/* 장식 원 */}
        <div style={{
          position: 'absolute', top: 140, right: -60,
          width: 320, height: 320, borderRadius: '50%',
          background: info.color + '12', display: 'flex',
        }} />
        <div style={{
          position: 'absolute', bottom: 160, left: -60,
          width: 200, height: 200, borderRadius: '50%',
          background: '#6366f110', display: 'flex',
        }} />

        {/* 로고 */}
        <div style={{ position: 'absolute', top: 36, left: 50, display: 'flex', fontSize: 24, fontWeight: 900, color: '#6366f1' }}>
          AIMBTI
        </div>

        {/* 캐릭터 */}
        {charImgSrc && (
          <img src={charImgSrc} width={220} height={220} alt=""
            style={{ position: 'absolute', top: 60, right: 50, display: 'flex' }} />
        )}

        {/* 유형명 + 서브타이틀 */}
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 90, paddingLeft: 50 }}>
          <div style={{ fontSize: 44, fontWeight: 900, color: '#0f172a', display: 'flex', lineHeight: 1.2 }}>
            {info.title}
          </div>
          <div style={{ fontSize: 20, color: '#64748b', display: 'flex', marginTop: 8 }}>
            {info.subtitle}
          </div>
        </div>

        {/* 구분선 */}
        <div style={{ width: 700, height: 1, background: '#e2e8f0', margin: '24px 50px 0', display: 'flex' }} />

        {/* AI 대체 점수 */}
        <div style={{
          margin: '20px 50px 0', display: 'flex', flexDirection: 'column',
          background: '#f8fafc', borderRadius: 16,
          border: '1px solid #e2e8f0', padding: '20px 28px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ fontSize: 16, color: '#64748b', fontWeight: 600, display: 'flex' }}>AI 대체 가능성</div>
            <div style={{ fontSize: 56, fontWeight: 900, color: scoreColor, display: 'flex', lineHeight: 1 }}>{aiScore}%</div>
            <div style={{
              fontSize: 18, color: scoreColor, fontWeight: 600, display: 'flex',
              background: scoreColor + '15', padding: '6px 16px', borderRadius: 20,
            }}>{scoreLabel}</div>
          </div>
          {/* 게이지 바 */}
          <div style={{ width: '100%', height: 14, background: '#e2e8f0', borderRadius: 7, marginTop: 12, display: 'flex', overflow: 'hidden' }}>
            <div style={{
              width: `${aiScore}%`, height: '100%',
              background: `linear-gradient(to right, #6366f1, ${scoreColor})`,
              borderRadius: 7, display: 'flex',
            }} />
          </div>
        </div>

        {/* 인사이트 카드 3개 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, margin: '20px 50px 0' }}>
          {insightItems.map((item) => (
            <div key={item.label} style={{
              display: 'flex', alignItems: 'flex-start', gap: 16,
              background: item.bg, border: `1.5px solid ${item.border}`,
              borderRadius: 14, padding: '16px 20px',
            }}>
              <div style={{ fontSize: 24, display: 'flex' }}>{item.emoji}</div>
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: item.labelColor, display: 'flex', marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 17, color: item.textColor, display: 'flex', lineHeight: 1.5 }}>{item.text}</div>
              </div>
            </div>
          ))}
        </div>

        {/* 추천 직무 */}
        <div style={{ display: 'flex', flexDirection: 'column', margin: '24px 50px 0' }}>
          <div style={{ fontSize: 16, color: '#94a3b8', fontWeight: 600, display: 'flex' }}>추천 직무</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#1e293b', display: 'flex', marginTop: 6 }}>
            {info.jobs.slice(0, 3).join('  ·  ')}
          </div>
        </div>

        {/* 성향 5각형 (SVG) */}
        <div style={{ display: 'flex', flexDirection: 'column', margin: '20px 50px 0' }}>
          <div style={{ fontSize: 16, color: '#94a3b8', fontWeight: 600, display: 'flex', marginBottom: 4 }}>나의 성향 DNA</div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <svg width="700" height="360" viewBox="0 0 800 360">
              {/* 그리드 */}
              {[0.25, 0.5, 0.75, 1.0].map((level) => (
                <polygon key={level} points={pentaGridPoints(cx, cy, pR, level)}
                  fill="none" stroke="#e2e8f0" strokeWidth="1.5" />
              ))}
              {/* 축선 */}
              {Array.from({ length: 5 }, (_, i) => {
                const a = -Math.PI / 2 + i * (2 * Math.PI / 5)
                return <line key={i} x1={cx} y1={cy}
                  x2={cx + pR * Math.cos(a)} y2={cy + pR * Math.sin(a)}
                  stroke="#e2e8f0" strokeWidth="1.5" />
              })}
              {/* 데이터 다각형 */}
              <polygon points={pentaPoints(cx, cy, pR, pVals)}
                fill={info.color + '30'} stroke={info.color} strokeWidth="3" />
              {/* 꼭짓점 점 */}
              {pVals.map((v, i) => {
                const a = -Math.PI / 2 + i * (2 * Math.PI / 5)
                const r = pR * Math.max(v, 0.05)
                return <circle key={i} cx={cx + r * Math.cos(a)} cy={cy + r * Math.sin(a)} r="7" fill={info.color} />
              })}
              {/* 레이블 */}
              {Array.from({ length: 5 }, (_, i) => {
                const a = -Math.PI / 2 + i * (2 * Math.PI / 5)
                const labelR = pR + 48
                const lx = cx + labelR * Math.cos(a)
                const ly = cy + labelR * Math.sin(a)
                const dominant = pVals[i] >= 0.5
                const main = dominant ? pLabelsHi[i] : (pLabelsLo[i] || pLabelsHi[i])
                const sub = dominant ? pLabelsLo[i] : pLabelsHi[i]
                const anchor = Math.cos(a) > 0.1 ? 'start' : Math.cos(a) < -0.1 ? 'end' : 'middle'
                return (
                  <g key={i}>
                    <text x={lx} y={ly - 2} textAnchor={anchor} fontSize="17" fontWeight="700" fill="#1e293b">{main}</text>
                    {sub && <text x={lx} y={ly + 18} textAnchor={anchor} fontSize="13" fill="#94a3b8">{sub}</text>}
                  </g>
                )
              })}
            </svg>
          </div>
        </div>

        {/* 하단 CTA 띠 */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, width: 800, height: 100,
          background: '#f8fafc', borderTop: '1px solid #e2e8f0',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: 50,
        }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#6366f1', display: 'flex' }}>나도 진단해보기 →</div>
          <div style={{ fontSize: 16, color: '#94a3b8', display: 'flex', marginTop: 4 }}>aimbti.vercel.app</div>
        </div>
      </div>
    ),
    { ...size }
  )
}
