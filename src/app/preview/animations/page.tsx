'use client'

import { useState, useEffect } from 'react'

const ROTATE_MESSAGES = [
  '지금까지 참여한 사람들',
  '방금 김O준님이 참여했습니다',
  '현재 128명이 테스트 중',
  '오늘 2,341명 완료',
]

const TYPE_TEXT = '지금까지 참여한 사람들'

export default function AnimationsPreview() {
  return (
    <main className="min-h-screen bg-black text-white px-5 py-10">
      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-1deg); }
          75% { transform: rotate(1deg); }
        }
        @keyframes typing {
          from { width: 0; }
          to { width: 100%; }
        }
        @keyframes blink-caret {
          50% { border-color: transparent; }
        }
      `}</style>

      <header className="max-w-md mx-auto mb-10">
        <h1 className="text-2xl font-black mb-2">배지 애니메이션 미리보기</h1>
        <p className="text-white/50 text-sm">6가지 효과 비교 — 마음에 드는 번호 알려주세요</p>
      </header>

      <div className="max-w-md mx-auto space-y-8">
        {/* 0. 기본 (원본) */}
        <Card num={0} title="기본 (원본)" desc="지금 적용된 상태 — 빨강 도트만 pulse">
          <Badge>
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            지금까지 참여한 사람들
          </Badge>
        </Card>

        {/* 1. 숨쉬기 */}
        <Card num={1} title="숨쉬기" desc="배지 전체가 천천히 scale 1↔1.05">
          <Badge style={{ animation: 'breathe 2s ease-in-out infinite' }}>
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
            지금까지 참여한 사람들
          </Badge>
        </Card>

        {/* 2. 빨강 글로우 ping */}
        <Card num={2} title="빨강 글로우 (ping)" desc="배지 외곽에 빛이 확산됐다 사라짐">
          <div className="relative inline-flex">
            <span className="absolute inset-0 rounded-full bg-red-500/40 animate-ping" />
            <Badge className="relative">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
              지금까지 참여한 사람들
            </Badge>
          </div>
        </Card>

        {/* 3. 실시간 카운터 */}
        <Card num={3} title="실시간 카운터" desc="숫자가 불규칙하게 오름 — FOMO 유발">
          <CounterBadge />
        </Card>

        {/* 4. 타이핑 효과 */}
        <Card num={4} title="타이핑 (typewriter)" desc="한 글자씩 나타남 + 커서 깜빡임">
          <TypingBadge />
        </Card>

        {/* 5. 문구 로테이션 */}
        <Card num={5} title="문구 로테이션 (3초마다)" desc="4가지 문구가 페이드로 순환">
          <RotatingBadge />
        </Card>

        {/* 6. 샤머 */}
        <Card num={6} title="샤머 (빛 띠 흐름)" desc="좌→우로 빨강 빛 띠가 흘러감">
          <span
            className="inline-flex items-center gap-2 border border-red-500/40 rounded-full px-4 py-1.5 text-red-400 text-xs font-bold"
            style={{
              backgroundImage:
                'linear-gradient(90deg, rgba(239,68,68,0.15) 0%, rgba(239,68,68,0.45) 50%, rgba(239,68,68,0.15) 100%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 2.2s linear infinite',
            }}
          >
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
            지금까지 참여한 사람들
          </span>
        </Card>

        {/* 7. 플로팅 */}
        <Card num={7} title="보너스 — 위아래 플로팅" desc="배지가 위아래로 살짝 떠다님">
          <Badge style={{ animation: 'float 2.5s ease-in-out infinite' }}>
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
            지금까지 참여한 사람들
          </Badge>
        </Card>

        {/* 8. 흔들림 */}
        <Card num={8} title="보너스 — 흔들림 (wiggle)" desc="좌우로 살짝 회전 (긴박감)">
          <Badge style={{ animation: 'wiggle 1.2s ease-in-out infinite' }}>
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
            지금까지 참여한 사람들
          </Badge>
        </Card>

        {/* 9. 조합: ping + 카운터 */}
        <Card num={9} title="조합: 글로우 + 카운터" desc="가장 강력 — 경고등 + FOMO">
          <div className="relative inline-flex">
            <span className="absolute inset-0 rounded-full bg-red-500/40 animate-ping" />
            <CounterBadge className="relative" />
          </div>
        </Card>
      </div>
    </main>
  )
}

function Card({ num, title, desc, children }: { num: number; title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-5 text-center">
      <p className="text-red-400 text-xs font-bold mb-1">#{num}</p>
      <h3 className="text-base font-black mb-1">{title}</h3>
      <p className="text-white/50 text-xs mb-4">{desc}</p>
      <div className="flex justify-center py-4">{children}</div>
    </div>
  )
}

function Badge({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <span
      className={`inline-flex items-center gap-2 bg-red-500/20 border border-red-500/40 rounded-full px-4 py-1.5 text-red-400 text-xs font-bold ${className}`}
      style={style}
    >
      {children}
    </span>
  )
}

function CounterBadge({ className = '' }: { className?: string }) {
  const [n, setN] = useState(12847)
  useEffect(() => {
    const id = setInterval(() => setN(v => v + Math.floor(Math.random() * 3)), 2500)
    return () => clearInterval(id)
  }, [])
  return (
    <Badge className={className}>
      <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
      <span className="tabular-nums">{n.toLocaleString()}</span>명 참여 중 🔥
    </Badge>
  )
}

function TypingBadge() {
  const [shown, setShown] = useState('')
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    if (idx >= TYPE_TEXT.length) {
      const reset = setTimeout(() => { setShown(''); setIdx(0) }, 1800)
      return () => clearTimeout(reset)
    }
    const timer = setTimeout(() => {
      setShown(TYPE_TEXT.slice(0, idx + 1))
      setIdx(idx + 1)
    }, 110)
    return () => clearTimeout(timer)
  }, [idx])

  return (
    <Badge>
      <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
      <span className="inline-block min-w-[140px] text-left">
        {shown}
        <span className="inline-block w-[1px] ml-0.5 border-l border-red-400 animate-pulse" style={{ height: '0.75em', verticalAlign: '-0.05em' }}>&nbsp;</span>
      </span>
    </Badge>
  )
}

function RotatingBadge() {
  const [i, setI] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    const id = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setI(v => (v + 1) % ROTATE_MESSAGES.length)
        setFade(true)
      }, 250)
    }, 3000)
    return () => clearInterval(id)
  }, [])

  return (
    <Badge>
      <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
      <span
        className="transition-opacity duration-250 inline-block min-w-[180px] text-center"
        style={{ opacity: fade ? 1 : 0 }}
      >
        {ROTATE_MESSAGES[i]}
      </span>
    </Badge>
  )
}
