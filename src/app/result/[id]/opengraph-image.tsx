import { ImageResponse } from 'next/og'
import { getSupabaseServer } from '@/lib/supabase'
import { TypeCode, typeInfo } from '@/lib/quiz'

export const alt = 'AI 시대 생존력 진단 결과'
export const size = { width: 900, height: 900 }
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
  const scoreLabel = aiScore >= 70 ? 'AI 대체 위험' : aiScore >= 40 ? '주의 필요' : '안전 구간'

  const BASE = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000'

  const imgUrl = `${BASE}/reals_ch/${encodeURIComponent(info.title)}.png`

  let charImgSrc = ''
  try {
    const res = await fetch(imgUrl)
    const buf = await res.arrayBuffer()
    charImgSrc = `data:image/png;base64,${Buffer.from(buf).toString('base64')}`
  } catch {}

  return new ImageResponse(
    (
      <div
        style={{
          width: '900px',
          height: '900px',
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
          position: 'absolute', top: -70, right: -70,
          width: 280, height: 280, borderRadius: '50%',
          background: info.color + '15', display: 'flex',
        }} />
        <div style={{
          position: 'absolute', bottom: -60, left: -60,
          width: 220, height: 220, borderRadius: '50%',
          background: info.color + '10', display: 'flex',
        }} />

        {/* 브랜드 */}
        <div style={{
          position: 'absolute', top: 40, left: 60,
          fontSize: 28, fontWeight: 900, color: '#6366f1', display: 'flex',
        }}>
          AI<span style={{ color: '#818cf8' }}>MBTI</span>
        </div>

        {/* 메인 콘텐츠 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 48, width: '800px' }}>
          {/* 캐릭터 이미지 */}
          {charImgSrc && (
            <img
              src={charImgSrc}
              width={320}
              height={320}
              style={{ display: 'flex', alignSelf: 'center' }}
            />
          )}

          {/* AI 점수 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
              <div style={{ fontSize: 22, color: '#64748b', fontWeight: 500, display: 'flex' }}>
                AI 대체 가능성
              </div>
              <div style={{ fontSize: 72, fontWeight: 900, color: scoreColor, display: 'flex', lineHeight: 1 }}>
                {aiScore}%
              </div>
              <div style={{
                fontSize: 20, color: scoreColor, fontWeight: 600,
                background: scoreColor + '15',
                padding: '8px 20px', borderRadius: 24, display: 'flex',
              }}>
                {scoreLabel}
              </div>
            </div>

            {/* 게이지 바 */}
            <div style={{
              width: 560, height: 18, background: '#e2e8f0',
              borderRadius: 9, overflow: 'hidden', display: 'flex',
            }}>
              <div style={{
                width: `${aiScore}%`, height: '100%',
                background: `linear-gradient(to right, #6366f1, ${scoreColor})`,
                borderRadius: 9, display: 'flex',
              }} />
            </div>
          </div>
        </div>

        {/* 하단 CTA */}
        <div style={{
          position: 'absolute', bottom: 40,
          fontSize: 18, color: '#94a3b8', display: 'flex',
        }}>
          나의 유형은? → aimbti-seven.vercel.app
        </div>
      </div>
    ),
    { ...size }
  )
}
