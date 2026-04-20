import { getSupabaseServer } from '@/lib/supabase'
import { TypeCode, typeInfo } from '@/lib/quiz'
import ResultClient from './ResultClient'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ type?: string; score?: string; sa?: string; sb?: string; sc?: string; sd?: string; se?: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mcodegc.com'

  if (id === 'local') {
    return { title: 'AI-역량진단' }
  }

  let title = 'AI-역량진단'
  let description = 'AI 대체 가능성 진단 결과를 확인하세요.'

  try {
    const db = getSupabaseServer()
    if (db) {
      const { data } = await db.from('results_v2').select('*').eq('id', id).single()
      if (data) {
        const info = typeInfo[data.type_code as TypeCode]
        if (info) {
          title = 'AI-역량진단'
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
  let resultId: string
  let couponCode: string | null = null
  let scores: { a: number; b: number; c: number; d: number; e: number } | null = null

  if (id === 'local') {
    typeCode = (sp.type as TypeCode) ?? 'TSLF'
    aiScore = Number(sp.score ?? 50)
    resultId = 'local'
    scores = sp.sa
      ? { a: Number(sp.sa), b: Number(sp.sb), c: Number(sp.sc), d: Number(sp.sd), e: Number(sp.se) }
      : { a: 2, b: 2, c: 2, d: 2, e: 2 }
  } else {
    const db = getSupabaseServer()
    if (!db) {
      typeCode = 'TSLF'
      aiScore = 61
      resultId = id
      scores = { a: 2, b: 2, c: 2, d: 2, e: 2 }
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
      resultId = result.id
      scores = result.score_a !== null
        ? { a: result.score_a, b: result.score_b, c: result.score_c, d: result.score_d, e: result.score_e }
        : { a: 2, b: 2, c: 2, d: 2, e: 2 }

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
      resultId={resultId}
      couponCode={couponCode}
      scores={scores}
    />
  )
}
