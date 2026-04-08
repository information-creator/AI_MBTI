'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { questions, calculateResult } from '@/lib/quiz'
import { gtagEvent } from '@/lib/ga'

const PART_LABELS: Record<string, string> = {
  A: '업무방식',
  B: 'AI 활용도',
  C: '강점영역',
  D: '실행속도',
  E: '퇴근',
}

const PART_ICONS: Record<string, string> = {
  A: '🧠',
  B: '🤖',
  C: '✨',
  D: '⚡',
  E: '😴',
}

const PART_COLORS: Record<string, string> = {
  A: 'rgba(99,102,241,0.12)',
  B: 'rgba(16,185,129,0.12)',
  C: 'rgba(168,85,247,0.12)',
  D: 'rgba(217,119,6,0.12)',
  E: 'rgba(234,88,12,0.12)',
}

const PART_TEXT_COLORS: Record<string, string> = {
  A: '#6366f1',
  B: '#10b981',
  C: '#9333ea',
  D: '#d97706',
  E: '#ea580c',
}

const CHEER_MESSAGES: Record<number, { emoji: string; title: string; sub: string }> = {
  5:  { emoji: '🔥', title: '벌써 25%!', sub: '조금만 더 가보자!' },
  10: { emoji: '💪', title: '절반 달성!', sub: '이제 반 왔어요!' },
  15: { emoji: '🚀', title: '거의 다 왔어요!', sub: '5개만 더!' },
}

export default function TestPage() {
  const router = useRouter()
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [cheerStep, setCheerStep] = useState<number | null>(null)

  const question = questions[current]
  const progress = (current / questions.length) * 100
  const isLast = current === questions.length - 1

  function handleAnswer(value: string) {
    const newAnswers = { ...answers, [question.id]: value }
    setAnswers(newAnswers)

    if (current === 0) gtagEvent('test_start')

    if (!isLast) {
      const next = current + 1
      setCurrent(next)
      // Q5, Q10, Q15 완료 시 독려 팝업 (0-indexed: 4, 9, 14)
      if (current === 4 || current === 9 || current === 14) {
        setCheerStep(next) // next = 5, 10, 15
        setTimeout(() => setCheerStep(null), 2200)
      }
      return
    }

    // 마지막 문항 — 결과 계산 후 analyzing 페이지로
    const result = calculateResult(newAnswers)
    router.push(
      `/analyzing?type=${result.typeCode}&score=${result.aiScore}&overtime=${encodeURIComponent(result.overtimeLevel)}`
    )
  }

  function handleBack() {
    if (current === 0) router.push('/')
    else setCurrent((c) => c - 1)
  }

  const part = question.part

  const cheer = cheerStep ? CHEER_MESSAGES[cheerStep] : null

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 독려 토스트 */}
      {cheer && (
        <div className="fixed top-28 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div
            className="animate-cheer-pop flex items-center gap-4 bg-white rounded-2xl shadow-lg px-7 py-4"
            style={{ border: '1.5px solid #6366f1' }}
          >
            <span className="text-3xl">{cheer.emoji}</span>
            <div>
              <p className="text-base font-black text-slate-900">{cheer.title}</p>
              <p className="text-slate-500 text-sm">{cheer.sub}</p>
            </div>
          </div>
        </div>
      )}
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
          disabled={false}
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
              background: PART_COLORS[part] ?? 'rgba(99,102,241,0.2)',
              color: PART_TEXT_COLORS[part] ?? '#a5b4fc',
            }}
          >
            {PART_LABELS[part]}
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
              {PART_ICONS[part] ?? '❓'}
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
        {(['A', 'B', 'C', 'D', 'E'] as const).map((p) => {
          const partQuestions = questions.filter((q) => q.part === p)
          const partAnswered = partQuestions.filter((q) => answers[q.id]).length
          const isActive = question.part === p
          return (
            <div key={p} className="flex items-center gap-1.5">
              <div
                className={`h-1.5 rounded-full transition-all ${
                  isActive ? 'w-8' : 'w-4'
                }`}
                style={{
                  background: partAnswered === partQuestions.length
                    ? '#6ee7b7'
                    : isActive
                    ? '#6366f1'
                    : 'rgba(99,102,241,0.2)',
                }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
