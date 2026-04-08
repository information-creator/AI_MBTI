'use client'

import { Suspense, useEffect, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { generateCouponCode } from '@/lib/coupon'
import { gtagEvent } from '@/lib/ga'

function AnalyzingContent() {
  const router = useRouter()
  const params = useSearchParams()
  const typeCode = params.get('type') ?? ''
  const aiScore = Number(params.get('score') ?? 0)
  const overtimeLevel = params.get('overtime') ?? ''
  const scoreA = params.get('sa') !== null ? Number(params.get('sa')) : null
  const scoreB = params.get('sb') !== null ? Number(params.get('sb')) : null
  const scoreC = params.get('sc') !== null ? Number(params.get('sc')) : null
  const scoreD = params.get('sd') !== null ? Number(params.get('sd')) : null
  const scoreE = params.get('se') !== null ? Number(params.get('se')) : null

  const [pct, setPct] = useState(0)
  const resultIdRef = useRef<string | null>(null)
  const navigatedRef = useRef(false)

  // 고정 타이머 — API와 무관하게 진행
  useEffect(() => {
    const t = setInterval(() => {
      setPct((p) => (p >= 95 ? p : p + 2))
    }, 80)
    return () => clearInterval(t)
  }, [])

  // Supabase 저장 (병렬)
  useEffect(() => {
    if (!typeCode) return
    gtagEvent('test_complete', { type_code: typeCode, ai_score: aiScore })

    async function save() {
      try {
        const { data, error } = await supabase
          .from('results_v2')
          .insert({
            type_code: typeCode,
            type_name: typeCode,
            ai_score: aiScore,
            work_style: typeCode[0],
            ai_usage: typeCode[1],
            strength: typeCode[2],
            speed: typeCode[3],
            overtime_result: overtimeLevel,
            score_a: scoreA,
            score_b: scoreB,
            score_c: scoreC,
            score_d: scoreD,
            score_e: scoreE,
          })
          .select('id')
          .single()

        if (error) throw error

        const couponCode = generateCouponCode()
        await supabase.from('coupons').insert({ code: couponCode, result_id: data.id })
        resultIdRef.current = data.id
      } catch {
        resultIdRef.current = '__local__'
      }
    }
    save()
  }, [typeCode, aiScore, overtimeLevel])

  // 95% 도달 후 저장 완료 대기 → 이동
  useEffect(() => {
    if (pct < 95) return

    function tryNavigate() {
      if (navigatedRef.current) return
      if (resultIdRef.current === null) { setTimeout(tryNavigate, 100); return }

      navigatedRef.current = true
      setPct(100)

      const id = resultIdRef.current
      setTimeout(() => {
        if (id === '__local__') {
          router.push(`/result/local?type=${typeCode}&score=${aiScore}&overtime=${encodeURIComponent(overtimeLevel)}&sa=${scoreA ?? ''}&sb=${scoreB ?? ''}&sc=${scoreC ?? ''}&sd=${scoreD ?? ''}&se=${scoreE ?? ''}`)
        } else {
          router.push(`/result/${id}`)
        }
      }, 300)
    }
    tryNavigate()
  }, [pct, typeCode, aiScore, overtimeLevel, router])

  const label =
    pct < 30 ? '답변 수집 중...' :
    pct < 60 ? 'AI 패턴 분석 중...' :
    pct < 85 ? '유형 계산 중...' :
    pct < 100 ? '결과 생성 중...' : '완료!'

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center space-y-5 w-64">
        <div className="text-6xl float-animation">🤖</div>
        <div>
          <p className="text-slate-900 text-xl font-bold">AI가 분석 중...</p>
          <p className="text-slate-400 text-sm mt-1">{label}</p>
        </div>
        <div className="space-y-2">
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-150"
              style={{ width: `${pct}%`, background: 'linear-gradient(to right, #6366f1, #a855f7)' }}
            />
          </div>
          <p className="text-right text-xs font-semibold text-indigo-500">{pct}%</p>
        </div>
      </div>
    </div>
  )
}

export default function AnalyzingPage() {
  return (
    <Suspense>
      <AnalyzingContent />
    </Suspense>
  )
}
