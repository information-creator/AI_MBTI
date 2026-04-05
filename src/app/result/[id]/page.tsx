import { getSupabaseServer } from '@/lib/supabase'
import { JobType } from '@/lib/quiz'
import ResultClient from './ResultClient'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ mbti?: string; score?: string; job?: string }>
}

export async function generateMetadata({ params, searchParams }: Props) {
  const { id } = await params
  if (id === 'local') {
    return { title: 'AI 시대 생존력 진단 결과' }
  }
  return {
    title: 'AI 시대 생존력 진단 결과 | AImBTI',
    description: 'MBTI 기반 AI 대체 가능성 진단 결과를 확인하세요.',
  }
}

export default async function ResultPage({ params, searchParams }: Props) {
  const { id } = await params
  const sp = await searchParams

  let mbtiType: string
  let aiScore: number
  let jobType: JobType
  let resultId: string
  let couponCode: string | null = null

  if (id === 'local') {
    // Supabase 저장 실패 fallback
    mbtiType = sp.mbti ?? 'ENTJ'
    aiScore = Number(sp.score ?? 50)
    jobType = (sp.job as JobType) ?? 'AI_PIONEER'
    resultId = 'local'
  } else {
    const db = getSupabaseServer()
    if (!db) {
      // Supabase 미설정 — 기본값으로 표시
      mbtiType = 'ENTJ'
      aiScore = 50
      jobType = 'AI_PIONEER'
      resultId = id
    } else {
      const { data: result, error } = await db
        .from('results')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !result) {
        notFound()
      }

      mbtiType = result.mbti_type
      aiScore = result.ai_score
      jobType = result.job_type as JobType
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
      mbtiType={mbtiType}
      aiScore={aiScore}
      jobType={jobType}
      resultId={resultId}
      couponCode={couponCode}
    />
  )
}
