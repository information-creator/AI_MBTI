'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { questions, calculateResult } from '@/lib/quiz'
import { gtagEvent } from '@/lib/ga'

const PART_LABELS: Record<string, string> = {
  A: 'AI 활용도',
  B: 'AI 민감도',
  C: '독립성',
  D: '논리력',
  E: '실행력',
}

const PART_ICONS: Record<string, string> = {
  A: '🤖',
  B: '📡',
  C: '🧠',
  D: '🔬',
  E: '⚡',
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
  5:  { emoji: '🔥', title: '벌써 5개 완료!', sub: '조금만 더 가보자!' },
  15: { emoji: '🚀', title: '거의 다 왔어요!', sub: '5개만 더!' },
}

function getMidResult(answers: Record<number, string>) {
  let aScore = 0
  for (let i = 1; i <= 4; i++) if (answers[i] === 'Y') aScore++
  let bScore = 0
  for (let i = 5; i <= 8; i++) if (answers[i] === 'Y') bScore++
  const aiTotal = aScore + bScore

  if (aiTotal >= 6) {
    return {
      emoji: '🚀',
      label: 'AI 선도자 성향',
      color: '#6366f1',
      message: 'AI를 적극 활용하고 트렌드에 민감합니다.\n이미 AI 시대에 앞서가고 있어요!',
      score: aiTotal,
    }
  } else if (aiTotal >= 3) {
    return {
      emoji: '⚖️',
      label: 'AI 균형파 성향',
      color: '#f59e0b',
      message: 'AI를 적절히 활용하면서 균형을 잡고 있어요.\n조금만 더 깊이 파면 차별화됩니다!',
      score: aiTotal,
    }
  } else {
    return {
      emoji: '🛡️',
      label: 'AI 신중파 성향',
      color: '#10b981',
      message: '검증된 방법을 선호하는 신중한 타입!\nAI 도구 하나만 익혀도 큰 변화가 옵니다.',
      score: aiTotal,
    }
  }
}

export default function TestPage() {
  const router = useRouter()
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [cheerStep, setCheerStep] = useState<number | null>(null)
  const [showMidResult, setShowMidResult] = useState(false)

  const question = questions[current]
  const progress = (current / questions.length) * 100
  const isLast = current === questions.length - 1

  function handleAnswer(value: string) {
    const newAnswers = { ...answers, [question.id]: value }
    setAnswers(newAnswers)

    if (current === 0) gtagEvent('test_start')

    if (!isLast) {
      const next = current + 1

      // Q10 완료 (0-indexed: current === 9) → 중간 결과 표시
      if (current === 9) {
        setCurrent(next)
        setShowMidResult(true)
        return
      }

      setCurrent(next)
      // Q5, Q15 완료 시 독려 팝업
      if (current === 4 || current === 14) {
        setCheerStep(next)
        setTimeout(() => setCheerStep(null), 2200)
      }
      return
    }

    // 마지막 문항 — 결과 계산 후 analyzing 페이지로
    const result = calculateResult(newAnswers)
    router.push(
      `/analyzing?type=${result.typeCode}&score=${result.aiScore}&sa=${result.scores.a}&sb=${result.scores.b}&sc=${result.scores.c}&sd=${result.scores.d}&se=${result.scores.e}`
    )
  }

  function handleBack() {
    if (showMidResult) {
      setShowMidResult(false)
      setCurrent(9) // Q10으로 돌아가기
      return
    }
    if (current === 0) router.push('/')
    else setCurrent((c) => c - 1)
  }

  const part = question.part
  const cheer = cheerStep ? CHEER_MESSAGES[cheerStep] : null

  // 중간 결과 화면
  if (showMidResult) {
    const mid = getMidResult(answers)
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* 진행 바 50% */}
        <div className="w-full h-1.5 bg-slate-200">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
            style={{ width: '50%' }}
          />
        </div>

        {/* 헤더 */}
        <div className="px-5 py-4 flex items-center justify-between w-full">
          <button
            onClick={handleBack}
            className="text-slate-400 hover:text-slate-700 transition-colors text-sm flex items-center gap-1"
          >
            ← 이전
          </button>
          <div className="text-center">
            <span className="text-slate-400 text-sm">
              10 / {questions.length}
            </span>
          </div>
          <span
            className="text-xs font-semibold px-2 py-1 rounded-full"
            style={{ background: 'rgba(99,102,241,0.12)', color: '#6366f1' }}
          >
            중간 결과
          </span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
          <div className="w-full max-w-sm animate-fade-in-up">
            {/* 이모지 */}
            <div className="text-center mb-4">
              <span className="text-6xl">{mid.emoji}</span>
            </div>

            {/* 성향 라벨 */}
            <div className="text-center mb-3">
              <span
                className="inline-block text-sm font-bold px-4 py-1.5 rounded-full text-white"
                style={{ background: mid.color }}
              >
                중간 결과
              </span>
            </div>

            <h2 className="text-2xl font-black text-slate-900 text-center mb-3">
              당신은{' '}
              <span style={{ color: mid.color }}>{mid.label}</span>
            </h2>

            <p className="text-slate-600 text-center text-sm leading-relaxed whitespace-pre-line mb-8">
              {mid.message}
            </p>

            {/* 안내 */}
            <div
              className="rounded-2xl p-4 mb-6 text-center"
              style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)' }}
            >
              <p className="text-slate-700 text-sm font-medium leading-relaxed">
                나머지 <strong className="text-indigo-600">10문항</strong>을 완료하면<br />
                정확한 유형과 커리어 방향을 알려드립니다
              </p>
            </div>

            {/* 계속하기 버튼 */}
            <button
              onClick={() => setShowMidResult(false)}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-base px-6 py-4 rounded-2xl transition-all shadow-lg shadow-indigo-200"
            >
              상세 결과 보러가기 →
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 독려 토스트 */}
      {cheer && (
        <div className="fixed top-28 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div
            className="animate-cheer-pop flex items-center gap-4 bg-white rounded-2xl shadow-lg px-7 py-4 select-none"
            style={{ border: '1.5px solid #6366f1' }}
          >
            <span className="text-3xl">{cheer.emoji}</span>
            <div>
              <p className="text-base font-black text-slate-900 whitespace-nowrap">{cheer.title}</p>
              <p className="text-slate-500 text-sm whitespace-nowrap">{cheer.sub}</p>
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
