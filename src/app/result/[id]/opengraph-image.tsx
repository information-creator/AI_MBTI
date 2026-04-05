import { ImageResponse } from 'next/og'
import { getSupabaseServer } from '@/lib/supabase'
import { TypeCode, typeInfo } from '@/lib/quiz'

export const runtime = 'edge'
export const alt = 'AI 시대 생존력 진단 결과'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  let typeCode: TypeCode = 'TSLF'
  let aiScore = 50

  if (id !== 'local') {
    try {
      const db = getSupabaseServer()
      if (db) {
        const { data } = await db.from('results_v2').select('*').eq('id', id).single()
        if (data) {
          typeCode = (data.type_code as TypeCode) ?? 'TSLF'
          aiScore = data.ai_score
        }
      }
    } catch {}
  }

  const info = typeInfo[typeCode]
  const scoreColor = aiScore >= 70 ? '#ef4444' : aiScore >= 40 ? '#f59e0b' : '#10b981'
  const scoreLabel = aiScore >= 70 ? '⚠️ AI 대체 위험' : aiScore >= 40 ? '🟡 주의 필요' : '✅ 안전 구간'

  const pngTypes = new Set(['HACF', 'HACP', 'HALF', 'HALP'])
  const BASE = 'https://aimbti-jet.vercel.app'
  const imgUrl = pngTypes.has(typeCode)
    ? `${BASE}/character/${typeCode}.png`
    : `${BASE}/characters/${typeCode}.svg`

  let charImgSrc = ''
  try {
    const res = await fetch(imgUrl)
    const buf = await res.arrayBuffer()
    const mime = pngTypes.has(typeCode) ? 'image/png' : 'image/svg+xml'
    charImgSrc = `data:${mime};base64,${Buffer.from(buf).toString('base64')}`
  } catch {}

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 배경 장식 원 */}
        <div style={{
          position: 'absolute', top: -80, right: -80,
          width: 320, height: 320, borderRadius: '50%',
          background: info.color + '15', display: 'flex',
        }} />
        <div style={{
          position: 'absolute', bottom: -60, left: -60,
          width: 240, height: 240, borderRadius: '50%',
          background: info.color + '10', display: 'flex',
        }} />

        {/* 브랜드 */}
        <div style={{
          position: 'absolute', top: 40, left: 60,
          fontSize: 28, fontWeight: 900, color: '#6366f1', display: 'flex',
        }}>
          AI<span style={{ color: '#818cf8' }}>mbti</span>
        </div>

        {/* MBTI 배지 */}
        <div style={{
          position: 'absolute', top: 40, right: 60,
          background: info.color + '20', color: info.color,
          fontSize: 22, fontWeight: 800,
          padding: '8px 20px', borderRadius: 30, display: 'flex',
        }}>
          {typeCode}
        </div>

        {/* 메인 콘텐츠 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 60 }}>
          {/* 캐릭터 이미지 */}
          {charImgSrc && (
            <img
              src={charImgSrc}
              width={200}
              height={200}
              style={{ display: 'flex' }}
            />
          )}

          {/* 텍스트 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{
              fontSize: 20, color: '#64748b', fontWeight: 500, display: 'flex',
            }}>
              AI 시대 생존 유형
            </div>
            <div style={{
              fontSize: 52, fontWeight: 900, color: '#0f172a',
              lineHeight: 1.1, display: 'flex', maxWidth: 580,
            }}>
              {info.title}
            </div>
            <div style={{
              fontSize: 24, color: '#475569', display: 'flex', marginTop: 4,
            }}>
              {info.subtitle}
            </div>

            {/* AI 점수 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 16 }}>
              <div style={{
                fontSize: 18, color: '#64748b', fontWeight: 500, display: 'flex',
              }}>
                AI 대체 가능성
              </div>
              <div style={{
                fontSize: 48, fontWeight: 900, color: scoreColor, display: 'flex',
              }}>
                {aiScore}%
              </div>
              <div style={{
                fontSize: 18, color: scoreColor, fontWeight: 600,
                background: scoreColor + '15',
                padding: '4px 14px', borderRadius: 20, display: 'flex',
              }}>
                {scoreLabel}
              </div>
            </div>

            {/* 게이지 바 */}
            <div style={{
              width: 500, height: 12, background: '#e2e8f0',
              borderRadius: 6, overflow: 'hidden', display: 'flex',
            }}>
              <div style={{
                width: `${aiScore}%`, height: '100%',
                background: `linear-gradient(to right, #6366f1, ${scoreColor})`,
                borderRadius: 6, display: 'flex',
              }} />
            </div>
          </div>
        </div>

        {/* 하단 CTA */}
        <div style={{
          position: 'absolute', bottom: 40,
          fontSize: 20, color: '#94a3b8', display: 'flex',
        }}>
          나의 유형은? → aimbti-jet.vercel.app
        </div>
      </div>
    ),
    { ...size }
  )
}
