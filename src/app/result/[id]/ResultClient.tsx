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
  const [bootcampName, setBootcampName] = useState('')
  const [bootcampPhone, setBootcampPhone] = useState('')
  const [bootcampEmail, setBootcampEmail] = useState('')
  const [bootcampConsent, setBootcampConsent] = useState(false)

  const [bootcampPhoneError, setBootcampPhoneError] = useState('')
  const [bootcampLoading, setBootcampLoading] = useState(false)

  // 쿠폰 전화번호 게이트 (옵션 C)
  const [showCouponModal, setShowCouponModal] = useState(false)
  const [couponUnlocked, setCouponUnlocked] = useState(false)
  const [couponName, setCouponName] = useState('')
  const [couponPhone, setCouponPhone] = useState('')
  const [couponEmail, setCouponEmail] = useState('')
  const [couponConsent, setCouponConsent] = useState(false)

  const [couponPhoneError, setCouponPhoneError] = useState('')
  const [couponPhoneLoading, setCouponPhoneLoading] = useState(false)

  // 전자책 신청
  const [showEbookModal, setShowEbookModal] = useState(false)
  const [ebookDone, setEbookDone] = useState(false)
  const [ebookName, setEbookName] = useState('')
  const [ebookPhone, setEbookPhone] = useState('')
  const [ebookEmail, setEbookEmail] = useState('')
  const [ebookConsent, setEbookConsent] = useState(false)
  const [ebookError, setEbookError] = useState('')
  const [ebookLoading, setEbookLoading] = useState(false)

  const scoreLabel =
    aiScore >= 70
      ? '⚠️ AI 대체 위험'
      : aiScore >= 40
      ? '🟡 주의 필요'
      : '✅ 안전 구간'

  const scoreColor = aiScore >= 70 ? '#ef4444' : aiScore >= 40 ? '#f59e0b' : '#10b981'

  async function submitLead(name: string, phone: string, source: 'bootcamp' | 'coupon', email?: string): Promise<string | null> {
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, email: email || null, type_code: typeCode, result_id: resultId, source }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      return data.error ?? '오류가 발생했습니다.'
    }
    return null
  }

  async function handleBootcampSubmit() {
    if (!bootcampName.trim()) {
      setBootcampPhoneError('이름을 입력해주세요.')
      return
    }
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
    const err = await submitLead(bootcampName.trim(), cleaned, 'bootcamp', bootcampEmail.trim() || undefined)
    setBootcampLoading(false)
    if (err) {
      setBootcampPhoneError(err)
      return
    }
    gtagEvent('lead_submit', { source: 'bootcamp', type_code: typeCode })
    setShowBootcampModal(false)
    window.open('https://metacodes.co.kr/', '_blank')
  }

  async function handleCouponSubmit() {
    if (!couponName.trim()) {
      setCouponPhoneError('이름을 입력해주세요.')
      return
    }
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
    const err = await submitLead(couponName.trim(), cleaned, 'coupon', couponEmail.trim() || undefined)
    setCouponPhoneLoading(false)
    if (err) {
      setCouponPhoneError(err)
      return
    }
    gtagEvent('lead_submit', { source: 'coupon', type_code: typeCode })
    setCouponUnlocked(true)
    setShowCouponModal(false)
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
    try {
      const res = await fetch(`/result/${resultId}/opengraph-image`)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `aimbti_${typeCode}.png`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('이미지 저장에 실패했습니다. 다시 시도해주세요.')
    }
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

  async function handleEbookSubmit() {
    if (!ebookName.trim()) { setEbookError('이름을 입력해주세요.'); return }
    const cleaned = ebookPhone.replace(/\D/g, '')
    if (cleaned.length < 9 || cleaned.length > 11) { setEbookError('올바른 전화번호를 입력해주세요.'); return }
    if (!ebookEmail.includes('@')) { setEbookError('올바른 이메일을 입력해주세요.'); return }
    if (!ebookConsent) { setEbookError('개인정보 수집에 동의해주세요.'); return }
    setEbookError('')
    setEbookLoading(true)
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: ebookName.trim(), phone: cleaned, email: ebookEmail.trim(), type_code: typeCode, result_id: resultId, source: 'ebook' }),
    })
    setEbookLoading(false)
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setEbookError(data.error ?? '오류가 발생했습니다.')
      return
    }
    gtagEvent('ebook_submit', { type_code: typeCode })
    setEbookDone(true)
    setShowEbookModal(false)
  }

  function handleKakaoShare() {
    const BASE = 'https://aimbti.vercel.app'
    const shareUrl = `${BASE}/result/${resultId}`
    if (typeof window !== 'undefined' && (window as any).Kakao?.isInitialized?.()) {
      ;(window as any).Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: `나는 "${info.title}" (${typeCode}) — AI 대체 가능성 ${aiScore}%`,
          description: info.subtitle,
          imageUrl: `${BASE}/result/${resultId}/opengraph-image`,
          imageWidth: 900,
          imageHeight: 900,
          link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
        },
        buttons: [
          { title: '내 유형 확인하기', link: { mobileWebUrl: BASE, webUrl: BASE } },
        ],
      })
    } else {
      navigator.clipboard.writeText(shareUrl)
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
              <h3 className="text-slate-900 font-bold text-lg">무료 상담 받아보기</h3>
              <p className="text-slate-500 text-sm mt-1">이름과 연락처를 남기시면 전문가가 직접 연락드려요.</p>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                value={bootcampName}
                onChange={(e) => setBootcampName(e.target.value)}
                placeholder="이름"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400"
              />
              <input
                type="tel"
                value={bootcampPhone}
                onChange={(e) => setBootcampPhone(e.target.value)}
                placeholder="01000000000"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400"
              />
              <input
                type="email"
                value={bootcampEmail}
                onChange={(e) => setBootcampEmail(e.target.value)}
                placeholder="이메일 주소 (선택)"
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
            <p className="text-slate-600 text-base">{info.subtitle}</p>

            {/* 코드 설명 */}
            <div className="grid grid-cols-2 gap-2 mt-4 text-left">
              {[
                {
                  letter: typeCode[0],
                  label: typeCode[0] === 'H' ? '혼자형' : '함께형',
                  desc: typeCode[0] === 'H' ? '혼자 집중할 때 최고의 결과를 냅니다' : '협업에서 시너지가 폭발합니다',
                  color: typeCode[0] === 'H' ? '#6366f1' : '#0ea5e9',
                },
                {
                  letter: typeCode[1],
                  label: typeCode[1] === 'A' ? 'AI 활용' : '사람 감각',
                  desc: typeCode[1] === 'A' ? 'AI 도구를 적극적으로 씁니다' : '사람의 감각과 직관을 중시합니다',
                  color: typeCode[1] === 'A' ? '#8b5cf6' : '#10b981',
                },
                {
                  letter: typeCode[2],
                  label: typeCode[2] === 'L' ? '논리형' : '창의형',
                  desc: typeCode[2] === 'L' ? '데이터와 분석으로 판단합니다' : '직관과 아이디어로 돌파합니다',
                  color: typeCode[2] === 'L' ? '#475569' : '#f59e0b',
                },
                {
                  letter: typeCode[3],
                  label: typeCode[3] === 'F' ? '빠른 실행' : '완벽 준비',
                  desc: typeCode[3] === 'F' ? '일단 실행하고 수정합니다' : '완벽히 준비한 뒤 움직입니다',
                  color: typeCode[3] === 'F' ? '#f97316' : '#14b8a6',
                },
              ].map(({ letter, label, desc, color }) => (
                <div key={letter + label} className="rounded-2xl p-3" style={{ background: color + '10', border: `1px solid ${color}20` }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-lg font-black" style={{ color }}>{letter}</span>
                    <span className="text-xs font-bold text-slate-700">{label}</span>
                  </div>
                  <p className="text-sm text-slate-500 leading-snug">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-5 text-slate-700 leading-relaxed text-base whitespace-pre-line text-center">
            {info.description}
          </p>

          {/* 강점 → 위기 → 방향 */}
          <div className="mt-4 flex flex-col gap-2">
            <div className="flex gap-2.5 items-start rounded-2xl p-3 border border-emerald-100" style={{ background: '#f0fdf4' }}>
              <span className="text-sm mt-0.5 flex-shrink-0">💪</span>
              <div>
                <p className="text-xs font-bold text-emerald-700 mb-0.5">당신의 강점</p>
                <p className="text-xs text-emerald-800 leading-snug">{info.insight.strength}</p>
              </div>
            </div>
            <div className="flex gap-2.5 items-start rounded-2xl p-3 border border-red-200" style={{ background: '#fff1f1' }}>
              <span className="text-sm mt-0.5 flex-shrink-0">🚨</span>
              <div>
                <p className="text-xs font-bold text-red-600 mb-0.5">지금 당신의 현실</p>
                <p className="text-xs text-red-700 leading-snug font-medium">{info.insight.crisis}</p>
              </div>
            </div>
            <div className="flex gap-2.5 items-start rounded-2xl p-3 border" style={{ background: info.color + '08', borderColor: info.color + '30' }}>
              <span className="text-sm mt-0.5 flex-shrink-0">🎯</span>
              <div>
                <p className="text-xs font-bold mb-0.5" style={{ color: info.color }}>지금 해야 할 것</p>
                <p className="text-xs leading-snug font-medium" style={{ color: info.color }}>{info.insight.direction}</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI 대체 점수 */}
        <div
          className="rounded-3xl p-6 space-y-4 animate-fade-in-up bg-white border border-slate-200"
          style={{ animationDelay: '0.1s' }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-slate-900 font-bold text-xl">AI 대체 가능성</h2>
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

          <p className="text-slate-500 text-base">{info.scoreComment(aiScore)}</p>

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
          {/* 경고 메시지 */}
          <div className="rounded-2xl p-4 mb-5" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
            <p className="text-sm font-bold text-red-600 mb-0.5">⚠️ 지금 당신이 하는 일</p>
            <p className="text-sm text-red-500 whitespace-pre-line">{info.jobSection.warning}</p>
          </div>

          {/* 업무별 AI 대체율 바 */}
          <div className="flex flex-col gap-3 mb-5">
            {info.jobSection.tasks.map((task) => {
              const isDangerous = task.rate >= 70
              return (
                <div key={task.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-medium ${isDangerous ? 'text-red-500' : 'text-slate-700'}`}>
                      {isDangerous ? `🤖 ${task.name}` : `✅ ${task.name}`}
                    </span>
                    <span className={`text-xs font-bold ${isDangerous ? 'text-red-500' : 'text-emerald-500'}`}>
                      {isDangerous ? `AI 대체 ${task.rate}%` : '아직 안전'}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${task.rate}%`,
                        background: isDangerous
                          ? 'linear-gradient(to right, #f87171, #ef4444)'
                          : 'linear-gradient(to right, #6ee7b7, #10b981)',
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* 살아남는 방법 */}
          <div className="rounded-2xl p-4" style={{ background: info.color + '08', border: `1px solid ${info.color}20` }}>
            <p className="text-sm font-bold mb-2" style={{ color: info.color }}>살아남는 사람의 전환 루트</p>
            <div className="flex flex-col gap-2">
              {info.jobSection.transitions.map((t) => (
                <div key={t.from} className="flex items-center gap-2 text-sm">
                  <span className="text-slate-400 text-sm">{t.from}</span>
                  <span className="text-slate-400 text-sm">→</span>
                  <span className="font-bold" style={{ color: info.color }}>{t.to}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 퇴근 보너스 */}
        <div
          className="rounded-3xl p-6 animate-fade-in-up bg-white border border-slate-200"
          style={{ animationDelay: '0.38s' }}
        >
          <h2 className="text-slate-900 font-bold text-xl mb-2">😴 퇴근</h2>
          <div
            className="rounded-xl p-4"
            style={{ background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.15)' }}
          >
            <p className="font-bold text-orange-600 text-lg mb-1">{overtimeLevel}</p>
            <p className="text-slate-600 text-sm whitespace-pre-line">{overtimeComment}</p>
          </div>
        </div>

        {/* 부트캠프 추천 */}
        <div
          className="rounded-3xl p-6 animate-fade-in-up bg-white"
          style={{
            border: `1px solid ${bc.color}30`,
            animationDelay: '0.4s',
          }}
        >
          <h2 className="text-slate-900 font-bold text-xl mt-2 mb-1">🎯 당신의 다음 스텝</h2>
          <p className="text-slate-500 text-base mb-4">{info.bootcampReason}</p>
          <div
            className="rounded-2xl p-4 mb-4 border border-slate-100"
            style={{ background: bc.color + '08' }}
          >
            <p className="font-bold text-slate-900 text-base mb-1">{bc.title}</p>
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
            무료 상담 받기 →
          </button>
        </div>

        {/* 전자책 신청 */}
        {showEbookModal && (
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-4 pb-4 sm:pb-0"
            onClick={(e) => { if (e.target === e.currentTarget) setShowEbookModal(false) }}
          >
            <div className="w-full max-w-sm bg-white rounded-3xl p-6 space-y-4">
              <div>
                <h3 className="text-slate-900 font-bold text-lg">📖 AI 생존 전자책 받기</h3>
                <p className="text-slate-500 text-sm mt-1">정보를 남기시면 이메일로 전자책을 보내드려요.</p>
              </div>
              <div className="space-y-2">
                <input
                  type="text"
                  value={ebookName}
                  onChange={(e) => setEbookName(e.target.value)}
                  placeholder="이름"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400"
                />
                <input
                  type="tel"
                  value={ebookPhone}
                  onChange={(e) => setEbookPhone(e.target.value)}
                  placeholder="01000000000"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400"
                />
                <input
                  type="email"
                  value={ebookEmail}
                  onChange={(e) => setEbookEmail(e.target.value)}
                  placeholder="이메일 주소"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400"
                />
                {ebookError && <p className="text-red-500 text-xs">{ebookError}</p>}
                <label className="flex items-start gap-2 text-xs text-slate-500 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ebookConsent}
                    onChange={(e) => setEbookConsent(e.target.checked)}
                    className="mt-0.5 flex-shrink-0"
                  />
                  <span>
                    개인정보 수집·이용에 동의합니다.{' '}
                    <Link href="/privacy" className="underline" target="_blank">개인정보처리방침</Link>
                  </span>
                </label>
              </div>
              <button
                onClick={handleEbookSubmit}
                disabled={ebookLoading}
                className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: 'linear-gradient(to right, #6366f1, #8b5cf6)', color: '#fff' }}
              >
                {ebookLoading ? '신청 중...' : '전자책 받기'}
              </button>
              <button
                type="button"
                onClick={() => setShowEbookModal(false)}
                className="block w-full text-center text-slate-400 text-sm hover:text-slate-600 transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        )}
        <div
          className="rounded-3xl p-6 animate-fade-in-up bg-white"
          style={{ border: '1px solid rgba(99,102,241,0.25)', animationDelay: '0.45s' }}
        >
          <h2 className="text-slate-900 font-bold text-xl mt-2 mb-1">📖 AI 생존 전자책</h2>
          <p className="text-slate-500 text-base mb-4">AI 시대에도 살아남는 법을 정리한 무료 전자책이에요.</p>
          <div className="rounded-2xl p-4 mb-4 border border-slate-100" style={{ background: 'rgba(99,102,241,0.05)' }}>
            <p className="font-bold text-slate-900 mb-1">AI 시대 생존 전략 가이드</p>
            <p className="text-slate-500 text-sm">내 유형에 맞는 AI 활용법과 커리어 전환 로드맵</p>
          </div>
          {ebookDone ? (
            <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.2)' }}>
              <p className="text-indigo-600 font-bold text-sm">✅ 신청 완료!</p>
              <p className="text-slate-500 text-xs mt-1">곧 이메일로 전자책을 보내드릴게요.</p>
            </div>
          ) : (
            <button
              onClick={() => setShowEbookModal(true)}
              className="block w-full text-center py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(to right, #6366f1, #8b5cf6)', color: '#fff' }}
            >
              무료 전자책 받기 →
            </button>
          )}
        </div>

        {/* 단톡방 */}
        <div
          className="rounded-3xl p-6 animate-fade-in-up"
          style={{ background: '#FFFDE7', border: '1px solid #FEE500', animationDelay: '0.48s' }}
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">💬</span>
            <div>
              <p className="font-bold text-slate-900 text-lg">AI 생존 단톡방</p>
              <p className="text-slate-500 text-sm">같은 유형 사람들과 이야기해요</p>
            </div>
          </div>
          <a
            href={process.env.NEXT_PUBLIC_OPENCHAT_URL ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => gtagEvent('openchat_click', { type_code: typeCode })}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90"
            style={{ background: '#FEE500', color: '#3C1E1E' }}
          >
            카카오 오픈채팅 입장하기 →
          </a>
        </div>

        {/* 무료 쿠폰 — 전화번호 게이트 */}
        {couponCode && (
          <>
            {showCouponModal && (
              <div
                className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-4 pb-4 sm:pb-0"
                onClick={(e) => { if (e.target === e.currentTarget) setShowCouponModal(false) }}
              >
                <div className="w-full max-w-sm bg-white rounded-3xl p-6 space-y-4">
                  <div>
                    <h3 className="text-slate-900 font-bold text-lg">🎁 무료 쿠폰 받기</h3>
                    <p className="text-slate-500 text-sm mt-1">이름과 연락처를 남기시면 쿠폰 코드를 드립니다.</p>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={couponName}
                      onChange={(e) => setCouponName(e.target.value)}
                      placeholder="이름"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400"
                    />
                    <input
                      type="tel"
                      value={couponPhone}
                      onChange={(e) => setCouponPhone(e.target.value)}
                      placeholder="01000000000"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400"
                    />
                    <input
                      type="email"
                      value={couponEmail}
                      onChange={(e) => setCouponEmail(e.target.value)}
                      placeholder="이메일 주소 (선택)"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400"
                    />
                    {couponPhoneError && <p className="text-red-500 text-xs">{couponPhoneError}</p>}
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
                  </div>
                  <button
                    onClick={handleCouponSubmit}
                    disabled={couponPhoneLoading}
                    className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 disabled:opacity-50"
                    style={{ background: '#f59e0b', color: '#000' }}
                  >
                    {couponPhoneLoading ? '확인 중...' : '쿠폰 받기'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCouponModal(false)}
                    className="block w-full text-center text-slate-400 text-sm hover:text-slate-600 transition-colors"
                  >
                    닫기
                  </button>
                </div>
              </div>
            )}
            <div
              className="rounded-3xl p-6 animate-fade-in-up bg-amber-50"
              style={{ border: '1px solid #fde68a', animationDelay: '0.5s' }}
            >
              <h2 className="text-slate-900 font-bold text-xl mt-2 mb-1">🎁 무료 쿠폰</h2>
              <p className="text-slate-500 text-base mb-4">이름과 연락처를 남기시면 쿠폰 코드를 드립니다.</p>
              <div className="rounded-2xl p-4 mb-4 border border-amber-100" style={{ background: 'rgba(245,158,11,0.06)' }}>
                <p className="font-bold text-slate-900 mb-1">수강료 할인 쿠폰</p>
                <p className="text-slate-500 text-sm">부트캠프 등록 시 즉시 사용 가능</p>
              </div>
              {couponUnlocked ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 font-mono font-bold text-xl text-amber-600 px-4 py-3 rounded-xl text-center tracking-widest bg-white border border-amber-200">
                      {couponCode}
                    </div>
                    <button
                      onClick={handleCopyCoupon}
                      className="px-4 py-3 rounded-xl font-semibold text-sm transition-colors"
                      style={{ background: couponCopied ? '#10b981' : '#f59e0b', color: '#000' }}
                    >
                      {couponCopied ? '복사됨!' : '복사'}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowCouponModal(true)}
                  className="block w-full text-center py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90"
                  style={{ background: '#f59e0b', color: '#000' }}
                >
                  무료 쿠폰 받기 →
                </button>
              )}
            </div>
          </>
        )}

        {/* 공유 섹션 */}
        <div
          className="rounded-3xl p-6 animate-fade-in-up bg-white border border-slate-200"
          style={{ animationDelay: '0.55s' }}
        >
          <h2 className="text-slate-900 font-bold text-xl mb-2">결과 공유하기</h2>
          <p className="text-slate-500 text-base mb-5">
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
