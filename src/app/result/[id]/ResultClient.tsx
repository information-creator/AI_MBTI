'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { JobType, jobTypeInfo } from '@/lib/quiz'
import { gtagEvent } from '@/lib/ga'

type Props = {
  mbtiType: string
  aiScore: number
  jobType: JobType
  resultId: string
  couponCode: string | null
}

export default function ResultClient({
  mbtiType,
  aiScore,
  jobType,
  resultId,
  couponCode,
}: Props) {
  const info = jobTypeInfo[jobType]

  useEffect(() => {
    gtagEvent('result_view', { mbti_type: mbtiType, ai_score: aiScore, job_type: jobType })
  }, [mbtiType, aiScore, jobType])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [copied, setCopied] = useState(false)
  const [couponCopied, setCouponCopied] = useState(false)
  const [shareLoading, setShareLoading] = useState(false)

  const scoreLabel =
    aiScore >= 70
      ? '⚠️ AI 대체 위험'
      : aiScore >= 40
      ? '🟡 주의 필요'
      : '✅ 안전 구간'

  const scoreColor = aiScore >= 70 ? '#ef4444' : aiScore >= 40 ? '#f59e0b' : '#10b981'

  function drawShareCard(): string {
    const canvas = canvasRef.current
    if (!canvas) return ''
    const ctx = canvas.getContext('2d')
    if (!ctx) return ''

    const W = 800
    const H = 420
    canvas.width = W
    canvas.height = H

    // 배경
    const grad = ctx.createLinearGradient(0, 0, W, H)
    grad.addColorStop(0, '#0f0f1a')
    grad.addColorStop(1, '#1a1040')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, W, H)

    // 장식 원
    ctx.beginPath()
    ctx.arc(W - 80, 80, 120, 0, Math.PI * 2)
    ctx.fillStyle = info.color + '20'
    ctx.fill()

    ctx.beginPath()
    ctx.arc(80, H - 80, 80, 0, Math.PI * 2)
    ctx.fillStyle = info.color + '15'
    ctx.fill()

    // 브랜드
    ctx.font = 'bold 18px Arial'
    ctx.fillStyle = '#6366f1'
    ctx.fillText('AImBTI', 40, 44)

    // 이모지 (큰 텍스트로)
    ctx.font = '72px Arial'
    ctx.fillText(info.emoji, 40, 130)

    // 유형 제목
    ctx.font = 'bold 36px Arial'
    ctx.fillStyle = '#ffffff'
    ctx.fillText(info.title, 40, 180)

    // MBTI 배지
    ctx.fillStyle = info.color + '30'
    ctx.roundRect(40, 195, 80, 30, 8)
    ctx.fill()
    ctx.font = 'bold 14px Arial'
    ctx.fillStyle = info.color
    ctx.fillText(mbtiType, 54, 215)

    // 설명 (줄바꿈 처리)
    ctx.font = '16px Arial'
    ctx.fillStyle = '#9ca3af'
    const words = info.subtitle.split('')
    ctx.fillText(info.subtitle, 40, 250)

    // AI 점수 바
    ctx.font = 'bold 14px Arial'
    ctx.fillStyle = '#9ca3af'
    ctx.fillText('AI 대체 가능성', 40, 295)

    ctx.font = 'bold 28px Arial'
    ctx.fillStyle = scoreColor
    ctx.fillText(`${aiScore}%`, 200, 295)

    // 게이지 바
    ctx.fillStyle = '#374151'
    ctx.roundRect(40, 308, 400, 12, 6)
    ctx.fill()

    const barGrad = ctx.createLinearGradient(40, 0, 440, 0)
    barGrad.addColorStop(0, '#6366f1')
    barGrad.addColorStop(1, scoreColor)
    ctx.fillStyle = barGrad
    ctx.roundRect(40, 308, 400 * (aiScore / 100), 12, 6)
    ctx.fill()

    // 직업 추천
    ctx.font = '14px Arial'
    ctx.fillStyle = '#6b7280'
    ctx.fillText('추천 직업:', 40, 348)
    ctx.font = 'bold 14px Arial'
    ctx.fillStyle = '#e5e7eb'
    ctx.fillText(info.jobs.join(' · '), 40, 368)

    // 우측 URL
    ctx.save()
    ctx.font = '13px Arial'
    ctx.fillStyle = '#4b5563'
    ctx.textAlign = 'right'
    ctx.fillText('aimbti.vercel.app', W - 40, H - 20)
    ctx.restore()

    return canvas.toDataURL('image/png')
  }

  async function handleDownloadCard() {
    setShareLoading(true)
    gtagEvent('share_click', { method: 'card' })
    const dataUrl = drawShareCard()
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `aimbti_${jobType}.png`
    a.click()
    setShareLoading(false)
  }

  async function handleCopyLink() {
    const url = window.location.href
    await navigator.clipboard.writeText(url)
    gtagEvent('share_click', { method: 'link' })
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleCopyCoupon() {
    if (!couponCode) return
    await navigator.clipboard.writeText(couponCode)
    gtagEvent('coupon_copy')
    setCouponCopied(true)
    setTimeout(() => setCouponCopied(false), 2000)
  }

  function handleKakaoShare() {
    const url = window.location.href
    const text = `나는 ${info.title}! AI 대체 가능성 ${aiScore}%\n${info.subtitle}\n\n당신의 유형은? → ${url}`
    // 카카오 SDK 미설치 시 URL 복사로 fallback
    if (typeof window !== 'undefined' && (window as any).Kakao?.isInitialized?.()) {
      ;(window as any).Kakao.Share.sendDefault({
        objectType: 'text',
        text,
        link: { mobileWebUrl: url, webUrl: url },
      })
    } else {
      navigator.clipboard.writeText(text)
      alert('링크가 복사됐습니다! 카카오톡에 붙여넣기 해주세요.')
    }
    gtagEvent('share_click', { method: 'kakao' })
  }

  return (
    <div className="min-h-screen bg-[#0f0f1a]">
      {/* 히든 캔버스 */}
      <canvas ref={canvasRef} className="hidden" />

      {/* 상단 헤더 */}
      <header className="px-5 py-4 flex items-center justify-between">
        <Link href="/" className="text-white font-bold text-lg">
          AI<span className="text-indigo-400">mbti</span>
        </Link>
        <Link
          href="/test"
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          다시 테스트 →
        </Link>
      </header>

      <main className="px-5 py-6 space-y-5">
        {/* 결과 카드 */}
        <div
          className="rounded-3xl p-8 animate-fade-in-up"
          style={{
            background: `linear-gradient(135deg, ${info.color}20 0%, rgba(15,15,26,0.8) 100%)`,
            border: `1px solid ${info.color}40`,
          }}
        >
          <div className="flex items-start gap-4">
            <div className="text-6xl float-animation">{info.emoji}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: info.color + '30', color: info.color }}
                >
                  {mbtiType}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white mb-1">{info.title}</h1>
              <p className="text-gray-300 text-sm">{info.subtitle}</p>
              <p className="text-xs text-gray-500 mt-1">
                {info.celebrity} · {info.company}
              </p>
            </div>
          </div>

          <p className="mt-6 text-gray-300 leading-relaxed text-sm sm:text-base">
            {info.description}
          </p>
        </div>

        {/* AI 대체 점수 */}
        <div
          className="rounded-3xl p-6 space-y-4 animate-fade-in-up"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            animationDelay: '0.1s',
          }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-white font-bold text-lg">AI 대체 가능성</h2>
            <div className="text-right">
              <span className="text-3xl font-black" style={{ color: scoreColor }}>
                {aiScore}%
              </span>
              <p className="text-xs text-gray-400">{scoreLabel}</p>
            </div>
          </div>

          {/* 게이지 바 */}
          <div className="relative h-4 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${aiScore}%`,
                background: `linear-gradient(to right, #6366f1, ${scoreColor})`,
              }}
            />
          </div>

          <p className="text-gray-400 text-sm">{info.scoreComment(aiScore)}</p>
        </div>

        {/* 직업 추천 */}
        <div
          className="rounded-3xl p-6 animate-fade-in-up"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            animationDelay: '0.2s',
          }}
        >
          <h2 className="text-white font-bold text-lg mb-4">추천 직업 / 직무</h2>
          <div className="grid grid-cols-2 gap-3">
            {info.jobs.map((job) => (
              <div
                key={job}
                className="rounded-2xl p-4 text-center text-sm font-semibold text-white"
                style={{ background: info.color + '20', border: `1px solid ${info.color}30` }}
              >
                {job}
              </div>
            ))}
          </div>
        </div>

        {/* AI 자동화 가이드 */}
        <div
          className="rounded-3xl p-6 animate-fade-in-up"
          style={{
            background: 'rgba(99,102,241,0.08)',
            border: '1px solid rgba(99,102,241,0.2)',
            animationDelay: '0.3s',
          }}
        >
          <h2 className="text-white font-bold text-lg mb-3">
            💡 나만의 AI 자동화 가이드
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">{info.aiTip}</p>
          <Link
            href="/guide"
            className="inline-block mt-4 text-indigo-400 text-sm font-semibold hover:text-indigo-300 transition-colors"
          >
            전체 자동화 가이드 보기 →
          </Link>
        </div>

        {/* 무료 쿠폰 */}
        {couponCode && (
          <div
            className="rounded-3xl p-6 animate-fade-in-up"
            style={{
              background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(249,115,22,0.1))',
              border: '1px solid rgba(245,158,11,0.3)',
              animationDelay: '0.4s',
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🎁</span>
              <h2 className="text-white font-bold text-lg">무료 쿠폰 발급 완료!</h2>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              오픈채팅방 입장 시 아래 코드를 제시하면 특별 혜택을 드립니다.
            </p>
            <div className="flex items-center gap-3">
              <div
                className="flex-1 font-mono font-bold text-xl text-amber-300 px-4 py-3 rounded-xl text-center tracking-widest"
                style={{ background: 'rgba(0,0,0,0.3)' }}
              >
                {couponCode}
              </div>
              <button
                onClick={handleCopyCoupon}
                className="px-4 py-3 rounded-xl font-semibold text-sm transition-colors"
                style={{
                  background: couponCopied ? '#10b981' : '#f59e0b',
                  color: '#000',
                }}
              >
                {couponCopied ? '복사됨!' : '복사'}
              </button>
            </div>
            <a
              href={process.env.NEXT_PUBLIC_OPENCHAT_URL ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-4 text-center py-3 rounded-xl font-bold text-sm transition-colors"
              style={{ background: '#FEE500', color: '#3C1E1E' }}
            >
              카카오 오픈채팅 입장하기 →
            </a>
          </div>
        )}

        {/* 공유 섹션 */}
        <div
          className="rounded-3xl p-6 animate-fade-in-up"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            animationDelay: '0.5s',
          }}
        >
          <h2 className="text-white font-bold text-lg mb-2">결과 공유하기</h2>
          <p className="text-gray-400 text-sm mb-5">
            친구도 AI 대체 가능성이 궁금하지 않을까요? 😏
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={handleKakaoShare}
              className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90"
              style={{ background: '#FEE500', color: '#3C1E1E' }}
            >
              💬 카카오톡 공유
            </button>
            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90"
              style={{
                background: copied ? '#10b981' : 'rgba(255,255,255,0.1)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              {copied ? '✅ 복사됨!' : '🔗 링크 복사'}
            </button>
            <button
              onClick={handleDownloadCard}
              disabled={shareLoading}
              className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 disabled:opacity-50"
              style={{
                background: 'linear-gradient(to right, #6366f1, #8b5cf6)',
                color: '#fff',
              }}
            >
              {shareLoading ? '생성 중...' : '🖼️ 카드 저장'}
            </button>
          </div>
        </div>

        {/* 다시 테스트 */}
        <div className="text-center pb-8">
          <Link
            href="/test"
            className="inline-block text-gray-400 hover:text-white text-sm transition-colors"
          >
            ← 테스트 다시 하기
          </Link>
        </div>
      </main>
    </div>
  )
}
