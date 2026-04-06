import { getSupabaseServer } from '@/lib/supabase'
import { TypeCode, typeInfo } from '@/lib/quiz'
import ResultClient from './ResultClient'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ type?: string; score?: string; overtime?: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const BASE_URL = 'https://aimbti-seven.vercel.app'

  if (id === 'local') {
    return { title: 'AI 시대 생존력 진단 결과' }
  }

  let title = 'AI 시대 생존력 진단 결과 | AIMBTI'
  let description = 'AI 대체 가능성 진단 결과를 확인하세요.'

  try {
    const db = getSupabaseServer()
    if (db) {
      const { data } = await db.from('results_v2').select('*').eq('id', id).single()
      if (data) {
        const info = typeInfo[data.type_code as TypeCode]
        if (info) {
          title = `나는 "${info.title}" | AI 대체 가능성 ${data.ai_score}% | AIMBTI`
          description = `${info.subtitle} — 나의 AI 대체 가능성은 ${data.ai_score}%! 당신의 유형은?`
        }
      }
    }
  } catch {}

  const ogImageUrl = `${BASE_URL}/result/${id}/opengraph-image`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogImageUrl, width: 900, height: 900 }],
      url: `${BASE_URL}/result/${id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  }
}

export default async function ResultPage({ params, searchParams }: Props) {
  const { id } = await params
  const sp = await searchParams

  let typeCode: TypeCode
  let aiScore: number
  let overtimeLevel: string
  let overtimeComment: string
  let resultId: string
  let couponCode: string | null = null

  if (id === 'local') {
    // Supabase 저장 실패 fallback
    typeCode = (sp.type as TypeCode) ?? 'TSLF'
    aiScore = Number(sp.score ?? 50)
    overtimeLevel = decodeURIComponent(sp.overtime ?? '적당한 직장인')
    overtimeComment = '저장에 실패했지만 결과는 정확합니다.'
    resultId = 'local'
  } else {
    const db = getSupabaseServer()
    if (!db) {
      // Supabase 미설정 — 기본값으로 표시
      typeCode = 'TSLF'
      aiScore = 61
      overtimeLevel = '적당한 직장인'
      overtimeComment = 'AI 자동화 도구 하나만 도입해도\n야근 2시간은 줄일 수 있습니다.'
      resultId = id
    } else {
      const { data: result, error } = await db
        .from('results_v2')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !result) {
        notFound()
      }

      typeCode = (result.type_code as TypeCode) ?? 'TSLF'
      aiScore = result.ai_score
      overtimeLevel = result.overtime_result ?? '적당한 직장인'
      overtimeComment = 'AI 자동화 도구 하나만 도입해도\n야근 2시간은 줄일 수 있습니다.'
      resultId = result.id

      // 쿠폰 조회
      const { data: coupon } = await db
        .from('coupons')
        .select('code')
        .eq('result_id', id)
        .single()

      couponCode = coupon?.code ?? null
    }
  }

  return (
    <ResultClient
      typeCode={typeCode}
      aiScore={aiScore}
      overtimeLevel={overtimeLevel}
      overtimeComment={overtimeComment}
      resultId={resultId}
      couponCode={couponCode}
    />
  )
}
