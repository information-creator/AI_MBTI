'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { questions, calculateResult } from '@/lib/quiz'
import { supabase } from '@/lib/supabase'
import { generateCouponCode } from '@/lib/coupon'
import { gtagEvent } from '@/lib/ga'

const PART_LABELS = {
  A: 'MBTI 성향',
  B: 'AI 대체 가능성',
  C: '퇴근 레벨',
}

export default function TestPage() {
  const router = useRouter()
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const question = questions[current]
  const progress = ((current) / questions.length) * 100
  const isLast = current === questions.length - 1

  async function handleAnswer(value: string) {
    const newAnswers = { ...answers, [question.id]: value }
    setAnswers(newAnswers)

    if (current === 0) gtagEvent('test_start')

    if (!isLast) {
      setCurrent((c) => c + 1)
      return
    }

    // 마지막 문항 — 결과 계산 및 저장
    setSubmitting(true)
    try {
      const result = calculateResult(newAnswers)
      gtagEvent('test_complete', {
        mbti_type: result.mbtiType,
        ai_score: result.aiScore,
        job_type: result.jobType,
      })

      // Supabase에 결과 저장
      const { data: resultRow, error: resultError } = await supabase
        .from('results')
        .insert({
          mbti_type: result.mbtiType,
          ai_score: result.aiScore,
          job_type: result.jobType,
        })
        .select('id')
        .single()

      if (resultError) throw resultError

      const resultId = resultRow.id

      // 쿠폰 자동 발급
      const couponCode = generateCouponCode()
      await supabase.from('coupons').insert({
        code: couponCode,
        result_id: resultId,
      })

      router.push(`/result/${resultId}`)
    } catch (err) {
      const detail =
        err instanceof Error
          ? err.message
          : typeof err === 'object' && err !== null
          ? JSON.stringify(err)
          : String(err)
      console.error('결과 저장 실패:', detail, err)
      // 저장 실패해도 임시 결과 페이지로 이동
      const result = calculateResult(newAnswers)
      router.push(
        `/result/local?mbti=${result.mbtiType}&score=${result.aiScore}&job=${result.jobType}`
      )
    }
  }

  function handleBack() {
    if (current > 0) setCurrent((c) => c - 1)
  }

  if (submitting) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl float-animation">🤖</div>
          <p className="text-slate-900 text-xl font-bold">AI가 분석 중...</p>
          <p className="text-slate-400">잠시만 기다려주세요</p>
          <div className="w-48 h-1.5 bg-slate-200 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse w-3/4"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 상단 진행 바 */}
      <div className="w-full h-1.5 bg-slate-200">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 헤더 */}
      <div className="px-5 py-4 flex items-center justify-between w-full">
        <button
          onClick={handleBack}
          disabled={current === 0}
          className="text-slate-400 hover:text-slate-700 disabled:opacity-30 transition-colors text-sm flex items-center gap-1"
        >
          ← 이전
        </button>
        <div className="text-center">
          <span className="text-slate-400 text-sm">
            {current + 1} / {questions.length}
          </span>
        </div>
        <div className="text-right">
          <span
            className="text-xs font-semibold px-2 py-1 rounded-full"
            style={{
              background: question.part === 'A'
                ? 'rgba(99,102,241,0.2)'
                : question.part === 'B'
                ? 'rgba(16,185,129,0.2)'
                : 'rgba(249,115,22,0.2)',
              color: question.part === 'A' ? '#a5b4fc' : question.part === 'B' ? '#6ee7b7' : '#fdba74',
            }}
          >
            {PART_LABELS[question.part]}
          </span>
        </div>
      </div>

      {/* 질문 카드 */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-8">
        <div
          key={question.id}
          className="w-full animate-fade-in-up"
        >
          {/* 파트 아이콘 */}
          <div className="text-center mb-6">
            <span className="text-4xl">
              {question.part === 'A' ? '🧠' : question.part === 'B' ? '🤖' : '😴'}
            </span>
          </div>

          {/* 질문 */}
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 text-center mb-8 leading-relaxed whitespace-pre-line">
            {question.text}
          </h2>

          {/* 선택지 */}
          <div className="space-y-3">
            {question.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleAnswer(opt.value)}
                className="w-full text-left px-6 py-4 rounded-2xl border transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(99,102,241,0.08)'
                  e.currentTarget.style.border = '1px solid rgba(99,102,241,0.4)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f8fafc'
                  e.currentTarget.style.border = '1px solid #e2e8f0'
                }}
              >
                <span className="text-slate-800 text-sm sm:text-base leading-relaxed">
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 하단 파트 인디케이터 */}
      <div className="px-5 py-4 flex justify-center gap-2 w-full">
        {(['A', 'B', 'C'] as const).map((part) => {
          const partQuestions = questions.filter((q) => q.part === part)
          const partAnswered = partQuestions.filter((q) => answers[q.id]).length
          const isActive = question.part === part
          return (
            <div key={part} className="flex items-center gap-1.5">
              <div
                className={`h-1.5 rounded-full transition-all ${
                  isActive ? 'w-8' : 'w-4'
                }`}
                style={{
                  background: partAnswered === partQuestions.length
                    ? '#6ee7b7'
                    : isActive
                    ? '#6366f1'
                    : 'rgba(255,255,255,0.2)',
                }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
