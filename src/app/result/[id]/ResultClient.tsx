'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { TypeCode, typeInfo, bootcampInfo } from '@/lib/quiz'
import { gtagEvent } from '@/lib/ga'

type Props = {
  typeCode: TypeCode
  aiScore: number
  overtimeLevel: string
  overtimeComment: string
  resultId: string
  couponCode: string | null
}

export default function ResultClient({
  typeCode,
  aiScore,
  overtimeLevel,
  overtimeComment,
  resultId,
  couponCode,
}: Props) {
  const info = typeInfo[typeCode]
  const bc = bootcampInfo[info.bootcamp]

  useEffect(() => {
    gtagEvent('result_view', { type_code: typeCode, ai_score: aiScore })
  }, [typeCode, aiScore])

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [copied, setCopied] = useState(false)
  const [couponCopied, setCouponCopied] = useState(false)
  const [shareLoading, setShareLoading] = useState(false)

  // 부트캠프 모달 (옵션 A)
  const [showBootcampModal, setShowBootcampModal] = useState(false)
  const [bootcampPhone, setBootcampPhone] = useState('')
  const [bootcampConsent, setBootcampConsent] = useState(false)
  const [bootcampPhoneError, setBootcampPhoneError] = useState('')
  const [bootcampLoading, setBootcampLoading] = useState(false)

  // 쿠폰 전화번호 게이트 (옵션 C)
  const [couponUnlocked, setCouponUnlocked] = useState(false)
  const [couponPhone, setCouponPhone] = useState('')
  const [couponConsent, setCouponConsent] = useState(false)
  const [couponPhoneError, setCouponPhoneError] = useState('')
  const [couponPhoneLoading, setCouponPhoneLoading] = useState(false)

  const scoreLabel =
    aiScore >= 70
      ? '⚠️ AI 대체 위험'
      : aiScore >= 40
      ? '🟡 주의 필요'
      : '✅ 안전 구간'

  const scoreColor = aiScore >= 70 ? '#ef4444' : aiScore >= 40 ? '#f59e0b' : '#10b981'

  async function submitLead(phone: string, source: 'bootcamp' | 'coupon'): Promise<string | null> {
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, type_code: typeCode, result_id: resultId, source }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      return data.error ?? '오류가 발생했습니다.'
    }
    return null
  }

  async function handleBootcampSubmit() {
    const cleaned = bootcampPhone.replace(/\D/g, '')
    if (cleaned.length < 9 || cleaned.length > 11) {
      setBootcampPhoneError('올바른 전화번호를 입력해주세요.')
      return
    }
    if (!bootcampConsent) {
      setBootcampPhoneError('개인정보 수집에 동의해주세요.')
      return
    }
    setBootcampPhoneError('')
    setBootcampLoading(true)
    const err = await submitLead(cleaned, 'bootcamp')
    setBootcampLoading(false)
    if (err) {
      setBootcampPhoneError(err)
      return
    }
    gtagEvent('lead_submit', { source: 'bootcamp', type_code: typeCode })
    setShowBootcampModal(false)
    window.open(process.env.NEXT_PUBLIC_BOOTCAMP_URL ?? 'https://metacodes.co.kr/', '_blank')
  }

  async function handleCouponSubmit() {
    const cleaned = couponPhone.replace(/\D/g, '')
    if (cleaned.length < 9 || cleaned.length > 11) {
      setCouponPhoneError('올바른 전화번호를 입력해주세요.')
      return
    }
    if (!couponConsent) {
      setCouponPhoneError('개인정보 수집에 동의해주세요.')
      return
    }
    setCouponPhoneError('')
    setCouponPhoneLoading(true)
    const err = await submitLead(cleaned, 'coupon')
    setCouponPhoneLoading(false)
    if (err) {
      setCouponPhoneError(err)
      return
    }
    gtagEvent('lead_submit', { source: 'coupon', type_code: typeCode })
    setCouponUnlocked(true)
  }

  function drawShareCard(): string {
    const canvas = canvasRef.current
    if (!canvas) return ''
    const ctx = canvas.getContext('2d')
    if (!ctx) return ''

    const W = 800
    const H = 420
    canvas.width = W
    canvas.height = H

    const grad = ctx.createLinearGradient(0, 0, W, H)
    grad.addColorStop(0, '#0f0f1a')
    grad.addColorStop(1, '#1a1040')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, W, H)

    ctx.beginPath()
    ctx.arc(W - 80, 80, 120, 0, Math.PI * 2)
    ctx.fillStyle = info.color + '20'
    ctx.fill()

    ctx.beginPath()
    ctx.arc(80, H - 80, 80, 0, Math.PI * 2)
    ctx.fillStyle = info.color + '15'
    ctx.fill()

    ctx.font = 'bold 18px Arial'
    ctx.fillStyle = '#6366f1'
    ctx.fillText('AImBTI', 40, 44)

    ctx.font = '72px Arial'
    ctx.fillText(info.emoji, 40, 130)

    ctx.font = 'bold 36px Arial'
    ctx.fillStyle = '#ffffff'
    ctx.fillText(info.title, 40, 180)

    ctx.fillStyle = info.color + '30'
    ctx.roundRect(40, 195, 90, 30, 8)
    ctx.fill()
    ctx.font = 'bold 14px Arial'
    ctx.fillStyle = info.color
    ctx.fillText(typeCode, 54, 215)

    ctx.font = '16px Arial'
    ctx.fillStyle = '#9ca3af'
    ctx.fillText(info.subtitle, 40, 250)

    ctx.font = 'bold 14px Arial'
    ctx.fillStyle = '#9ca3af'
    ctx.fillText('AI 대체 가능성', 40, 295)

    ctx.font = 'bold 28px Arial'
    ctx.fillStyle = scoreColor
    ctx.fillText(`${aiScore}%`, 200, 295)

    ctx.fillStyle = '#374151'
    ctx.roundRect(40, 308, 400, 12, 6)
    ctx.fill()

    const barGrad = ctx.createLinearGradient(40, 0, 440, 0)
    barGrad.addColorStop(0, '#6366f1')
    barGrad.addColorStop(1, scoreColor)
    ctx.fillStyle = barGrad
    ctx.roundRect(40, 308, 400 * (aiScore / 100), 12, 6)
    ctx.fill()

    ctx.font = '14px Arial'
    ctx.fillStyle = '#6b7280'
    ctx.fillText('추천 직무:', 40, 348)
    ctx.font = 'bold 14px Arial'
    ctx.fillStyle = '#e5e7eb'
    ctx.fillText(info.jobs.join(' · '), 40, 368)

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
    a.download = `aimbti_${typeCode}.png`
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
    const BASE = 'https://aimbti-jet.vercel.app'
    if (typeof window !== 'undefined' && (window as any).Kakao?.isInitialized?.()) {
      ;(window as any).Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: `나는 "${info.title}" (${typeCode}) — AI 대체 가능성 ${aiScore}%`,
          description: info.subtitle,
          imageUrl: `${BASE}/result/${resultId}/opengraph-image`,
          link: { mobileWebUrl: url, webUrl: url },
        },
        buttons: [
          { title: '내 유형 확인하기', link: { mobileWebUrl: BASE, webUrl: BASE } },
        ],
      })
    } else {
      navigator.clipboard.writeText(url)
      alert('링크가 복사됐습니다! 카카오톡에 붙여넣기 해주세요.')
    }
    gtagEvent('share_click', { method: 'kakao' })
  }

  return (
    <div className="min-h-screen bg-white">
      <canvas ref={canvasRef} className="hidden" />

      {/* 부트캠프 모달 */}
      {showBootcampModal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-4 pb-4 sm:pb-0"
          onClick={(e) => { if (e.target === e.currentTarget) setShowBootcampModal(false) }}
        >
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 space-y-4">
            <div>
              <h3 className="text-slate-900 font-bold text-lg">잠깐, 무료 상담도 받으세요!</h3>
              <p className="text-slate-500 text-sm mt-1">전화번호를 남기시면 전문가가 직접 연락드려요.</p>
            </div>

            <div className="space-y-2">
              <input
                type="tel"
                value={bootcampPhone}
                onChange={(e) => setBootcampPhone(e.target.value)}
                placeholder="010-0000-0000"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400"
              />
              {bootcampPhoneError && (
                <p className="text-red-500 text-xs">{bootcampPhoneError}</p>
              )}
              <label className="flex items-start gap-2 text-xs text-slate-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bootcampConsent}
                  onChange={(e) => setBootcampConsent(e.target.checked)}
                  className="mt-0.5 flex-shrink-0"
                />
                <span>
                  개인정보 수집·이용에 동의합니다.{' '}
                  <Link href="/privacy" className="underline" target="_blank">개인정보처리방침</Link>
                </span>
              </label>
            </div>

            <button
              onClick={handleBootcampSubmit}
              disabled={bootcampLoading}
              className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: bc.color, color: '#000' }}
            >
              {bootcampLoading ? '신청 중...' : '신청하고 커리큘럼 받기'}
            </button>

            <a
              href={process.env.NEXT_PUBLIC_BOOTCAMP_URL ?? 'https://metacodes.co.kr/'}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-slate-400 text-sm hover:text-slate-600 transition-colors"
              onClick={() => setShowBootcampModal(false)}
            >
              건너뛰고 이동 →
            </a>
          </div>
        </div>
      )}

      <header className="px-5 py-4 flex items-center justify-between border-b border-slate-100">
        <Link href="/" className="text-slate-900 font-bold text-lg">
          AI<span className="text-indigo-600">mbti</span>
        </Link>
        <Link
          href="/test"
          className="text-sm text-slate-400 hover:text-slate-700 transition-colors"
        >
          다시 테스트 →
        </Link>
      </header>

      <main className="px-5 py-6 space-y-5">
        {/* 캐릭터 이미지 */}
        <div className="flex justify-center float-animation">
          <Image
            src={`/characters/${typeCode}.svg`}
            alt={info.title}
            width={240}
            height={240}
            className="object-contain"
            unoptimized
          />
        </div>

        {/* 결과 카드 */}
        <div
          className="rounded-3xl p-6 animate-fade-in-up"
          style={{
            background: `linear-gradient(135deg, ${info.color}12 0%, #ffffff 100%)`,
            border: `1px solid ${info.color}30`,
          }}
        >
          <div className="text-center">
            <span
              className="text-xs font-bold px-3 py-1 rounded-full"
              style={{ background: info.color + '20', color: info.color }}
            >
              {typeCode}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3 mb-1">{info.title}</h1>
            <p className="text-slate-600 text-sm">{info.subtitle}</p>
          </div>

          <p className="mt-5 text-slate-700 leading-relaxed text-sm sm:text-base whitespace-pre-line text-center">
            {info.description}
          </p>
        </div>

        {/* AI 대체 점수 */}
        <div
          className="rounded-3xl p-6 space-y-4 animate-fade-in-up bg-white border border-slate-200"
          style={{ animationDelay: '0.1s' }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-slate-900 font-bold text-lg">AI 대체 가능성</h2>
            <div className="text-right">
              <span className="text-3xl font-black" style={{ color: scoreColor }}>
                {aiScore}%
              </span>
              <p className="text-xs text-slate-400">{scoreLabel}</p>
            </div>
          </div>

          <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${aiScore}%`,
                background: `linear-gradient(to right, #6366f1, ${scoreColor})`,
              }}
            />
          </div>

          <p className="text-slate-500 text-sm">{info.scoreComment(aiScore)}</p>

          <div
            className="rounded-xl p-3 text-sm font-semibold"
            style={{ background: scoreColor + '10', color: scoreColor }}
          >
            ⚠️ {info.threat}
          </div>
        </div>

        {/* 직무 추천 */}
        <div
          className="rounded-3xl p-6 animate-fade-in-up bg-white border border-slate-200"
          style={{ animationDelay: '0.2s' }}
        >
          <h2 className="text-slate-900 font-bold text-lg mb-4">추천 직업 / 직무</h2>
          <div className="grid grid-cols-2 gap-3">
            {info.jobs.map((job) => (
              <div
                key={job}
                className="rounded-2xl p-4 text-center text-sm font-semibold leading-snug"
                style={{ background: info.color + '12', border: `1px solid ${info.color}25`, color: info.color }}
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
            background: 'rgba(99,102,241,0.05)',
            border: '1px solid rgba(99,102,241,0.15)',
            animationDelay: '0.3s',
          }}
        >
          <h2 className="text-slate-900 font-bold text-lg mb-3">
            💡 나만의 AI 자동화 가이드
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">{info.aiTip}</p>
          <Link
            href="/guide"
            className="inline-block mt-4 text-indigo-600 text-sm font-semibold hover:text-indigo-500 transition-colors"
          >
            전체 자동화 가이드 보기 →
          </Link>
        </div>

        {/* 부트캠프 추천 */}
        <div
          className="rounded-3xl p-6 animate-fade-in-up bg-white"
          style={{
            border: `1px solid ${bc.color}30`,
            animationDelay: '0.4s',
          }}
        >
          <h2 className="text-slate-900 font-bold text-lg mt-2 mb-1">🎯 당신의 다음 스텝</h2>
          <p className="text-slate-500 text-sm mb-4">{info.bootcampReason}</p>
          <div
            className="rounded-2xl p-4 mb-4 border border-slate-100"
            style={{ background: bc.color + '08' }}
          >
            <p className="font-bold text-slate-900 mb-1">{bc.title}</p>
            <p className="text-slate-500 text-sm">{bc.reason}</p>
          </div>
          <button
            onClick={() => {
              gtagEvent('bootcamp_click', { bootcamp: info.bootcamp, type_code: typeCode })
              setShowBootcampModal(true)
            }}
            className="block w-full text-center py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90"
            style={{ background: bc.color, color: '#000' }}
          >
            무료 커리큘럼 받아보기 →
          </button>
        </div>

        {/* 퇴근 보너스 */}
        <div
          className="rounded-3xl p-6 animate-fade-in-up bg-white border border-slate-200"
          style={{ animationDelay: '0.45s' }}
        >
          <h2 className="text-slate-900 font-bold text-lg mb-2">😴 퇴근</h2>
          <div
            className="rounded-xl p-4"
            style={{ background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.15)' }}
          >
            <p className="font-bold text-orange-600 text-lg mb-1">{overtimeLevel}</p>
            <p className="text-slate-600 text-sm">{overtimeComment}</p>
          </div>
        </div>

        {/* 무료 쿠폰 — 전화번호 게이트 */}
        {couponCode && (
          <div
            className="rounded-3xl p-6 animate-fade-in-up bg-amber-50 border border-amber-200"
            style={{ animationDelay: '0.5s' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🎁</span>
              <h2 className="text-slate-900 font-bold text-lg">무료 쿠폰 받기</h2>
            </div>
            <p className="text-slate-600 text-sm mb-4">
              전화번호를 남기시면 쿠폰 코드 + 오픈채팅 특별 혜택을 드립니다.
            </p>

            {couponUnlocked ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1 font-mono font-bold text-xl text-amber-600 px-4 py-3 rounded-xl text-center tracking-widest bg-white border border-amber-200">
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
                  className="block text-center py-3 rounded-xl font-bold text-sm transition-colors"
                  style={{ background: '#FEE500', color: '#3C1E1E' }}
                >
                  카카오 오픈채팅 입장하기 →
                </a>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative">
                  <div className="font-mono font-bold text-xl text-amber-600 px-4 py-3 rounded-xl text-center tracking-widest bg-white border border-amber-200 blur-sm select-none pointer-events-none">
                    AIMBTI-XXXX
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                      🔒 전화번호 입력 후 공개
                    </span>
                  </div>
                </div>

                <input
                  type="tel"
                  value={couponPhone}
                  onChange={(e) => setCouponPhone(e.target.value)}
                  placeholder="010-0000-0000"
                  className="w-full border border-amber-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-amber-400"
                />

                {couponPhoneError && (
                  <p className="text-red-500 text-xs">{couponPhoneError}</p>
                )}

                <label className="flex items-start gap-2 text-xs text-slate-500 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={couponConsent}
                    onChange={(e) => setCouponConsent(e.target.checked)}
                    className="mt-0.5 flex-shrink-0"
                  />
                  <span>
                    개인정보 수집·이용에 동의합니다.{' '}
                    <Link href="/privacy" className="underline" target="_blank">개인정보처리방침</Link>
                  </span>
                </label>

                <button
                  onClick={handleCouponSubmit}
                  disabled={couponPhoneLoading}
                  className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: '#f59e0b', color: '#000' }}
                >
                  {couponPhoneLoading ? '확인 중...' : '🎁 쿠폰 코드 확인하기'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* 공유 섹션 */}
        <div
          className="rounded-3xl p-6 animate-fade-in-up bg-white border border-slate-200"
          style={{ animationDelay: '0.55s' }}
        >
          <h2 className="text-slate-900 font-bold text-lg mb-2">결과 공유하기</h2>
          <p className="text-slate-500 text-sm mb-5">
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
                background: copied ? '#10b981' : '#f1f5f9',
                color: copied ? '#fff' : '#334155',
                border: '1px solid #e2e8f0',
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
            className="inline-block text-slate-400 hover:text-slate-700 text-sm transition-colors"
          >
            ← 테스트 다시 하기
          </Link>
        </div>
      </main>
    </div>
  )
}
