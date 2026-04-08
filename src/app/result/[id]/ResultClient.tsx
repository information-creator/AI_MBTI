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

  useEffect(() => {
    gtagEvent('result_view', { type_code: typeCode, ai_score: aiScore })
  }, [typeCode, aiScore])

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [copied, setCopied] = useState(false)
  const [shareLoading, setShareLoading] = useState(false)
  const [displayScore, setDisplayScore] = useState(0)
  const [instaToast, setInstaToast] = useState(false)
  const [ebookPage, setEbookPage] = useState(0)

  const FREE_PAGES = 2
  const ebookPages = [
    {
      num: 1,
      title: 'AI 시대, 살아남는 사람들의 공통점',
      content: (
        <div className="space-y-3">
          <p className="text-slate-700 text-sm leading-relaxed">
            맥킨지 2025 보고서에 따르면, <strong className="text-indigo-600">전체 직업의 47%</strong>가 AI로 대체 가능합니다.
            하지만 같은 직업군 내에서도 살아남는 사람과 도태되는 사람이 나뉩니다.
          </p>
          <div className="space-y-2">
            {[
              { icon: '🧠', title: 'AI를 두려워하지 않고, 도구로 씁니다', desc: 'ChatGPT·Copilot·Midjourney를 매일 씁니다.' },
              { icon: '🔗', title: '도메인 지식 + AI를 조합합니다', desc: '업무 맥락을 AI에게 가장 잘 설명하는 사람이 이깁니다.' },
              { icon: '🎯', title: '빠르게 실험하고 학습합니다', desc: '6개월마다 툴킷을 업데이트합니다.' },
            ].map((item) => (
              <div key={item.icon} className="flex gap-2.5 items-start rounded-xl p-2.5" style={{ background: '#f8fafc' }}>
                <span className="text-base">{item.icon}</span>
                <div>
                  <p className="text-xs font-bold text-slate-800">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      num: 2,
      title: '2026년 가장 위험한 직업 TOP 5',
      content: (
        <div className="space-y-3">
          <p className="text-slate-700 text-sm leading-relaxed">
            단순 반복 업무는 이미 AI가 90% 이상 처리합니다.
            아래 직업군에 있다면 지금 당장 전환 계획이 필요합니다.
          </p>
          <div className="space-y-2">
            {[
              { rank: 1, job: '데이터 입력·처리', rate: 94, color: '#ef4444' },
              { rank: 2, job: '기본 콘텐츠 제작 (단순 글쓰기)', rate: 88, color: '#f97316' },
              { rank: 3, job: '반복적 고객 응대 (CS)', rate: 82, color: '#f59e0b' },
              { rank: 4, job: '기초 코딩 (단순 구현)', rate: 76, color: '#eab308' },
              { rank: 5, job: '표준화된 디자인 작업', rate: 71, color: '#84cc16' },
            ].map((item) => (
              <div key={item.rank} className="flex items-center gap-2">
                <span className="text-xs font-black w-4 text-slate-400">{item.rank}</span>
                <div className="flex-1">
                  <div className="flex justify-between mb-0.5">
                    <span className="text-xs font-medium text-slate-700">{item.job}</span>
                    <span className="text-xs font-bold" style={{ color: item.color }}>{item.rate}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${item.rate}%`, background: item.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      num: 3,
      title: 'AI 시대 생존 로드맵 (6개월 플랜)',
      content: null, // locked
    },
    {
      num: 4,
      title: '메타코드 부트캠프 과정 소개',
      content: null, // locked
    },
  ]

  // AI 점수 카운트업 애니메이션
  useEffect(() => {
    const duration = 1200
    const start = Date.now()
    const timer = setInterval(() => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayScore(Math.round(aiScore * eased))
      if (progress >= 1) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [aiScore])

  // Confetti 폭죽
  useEffect(() => {
    import('canvas-confetti').then(({ default: confetti }) => {
      confetti({
        particleCount: 160,
        spread: 90,
        origin: { y: 0.4 },
        colors: [info.color, '#6366f1', '#a855f7', '#f59e0b', '#ffffff'],
        scalar: 1.1,
      })
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const scoreLabel =
    aiScore >= 70
      ? '⚠️ AI 대체 위험'
      : aiScore >= 40
      ? '🟡 주의 필요'
      : '✅ 안전 구간'

  const scoreColor = aiScore >= 70 ? '#ef4444' : aiScore >= 40 ? '#f59e0b' : '#10b981'


  async function drawShareCard(): Promise<string> {
    const canvas = canvasRef.current
    if (!canvas) return ''
    const ctx = canvas.getContext('2d')
    if (!ctx) return ''

    // 한글 지원 폰트 로드
    try {
      const font = new FontFace(
        'NotoSansKR',
        'url(https://fonts.gstatic.com/s/notosanskr/v36/PbykFmXiEBPT4ITbgNA5Cgm20xz64px_1hVWr0wuPNGmlQNMEfD4.0.woff2) format("woff2")',
      )
      const loaded = await font.load()
      document.fonts.add(loaded)
    } catch {
      // 폰트 로드 실패 시 시스템 폰트로 폴백
    }

    // roundRect 폴리필 (iOS 15 이하)
    if (!(ctx as any).roundRect) {
      (ctx as any).roundRect = function(x: number, y: number, w: number, h: number, r: number) {
        ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
      }
    }

    const W = 800
    const H = 1600
    canvas.width = W
    canvas.height = H

    const KR = '"NotoSansKR", "Apple SD Gothic Neo", "Malgun Gothic", Arial'

    // 흰색 배경
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, W, H)

    // 상단 컬러 띠
    const topBand = ctx.createLinearGradient(0, 0, W, 0)
    topBand.addColorStop(0, info.color)
    topBand.addColorStop(1, '#6366f1')
    ctx.fillStyle = topBand
    ctx.fillRect(0, 0, W, 12)

    // 장식 원 (연한 컬러)
    ctx.beginPath()
    ctx.arc(W - 40, 200, 160, 0, Math.PI * 2)
    ctx.fillStyle = info.color + '12'
    ctx.fill()
    ctx.beginPath()
    ctx.arc(40, H - 200, 100, 0, Math.PI * 2)
    ctx.fillStyle = '#6366f110'
    ctx.fill()

    // 로고
    ctx.font = `bold 24px ${KR}`
    ctx.fillStyle = '#6366f1'
    ctx.fillText('AIMBTI', 50, 70)

    // 타입 코드 배지
    ctx.beginPath()
    ctx.fillStyle = info.color + '20'
    ctx.roundRect(50, 84, 110, 34, 8)
    ctx.fill()
    ctx.font = `bold 18px ${KR}`
    ctx.fillStyle = info.color
    ctx.fillText(typeCode, 70, 107)

    // 캐릭터 이미지
    try {
      const charImg = new window.Image()
      charImg.crossOrigin = 'anonymous'
      charImg.src = `/reals_ch/${encodeURIComponent(info.title)}.png`
      await new Promise<void>((resolve) => {
        charImg.onload = () => resolve()
        charImg.onerror = () => resolve()
        setTimeout(resolve, 3000)
      })
      ctx.drawImage(charImg, W / 2 - 120, 80, 240, 240)
    } catch { /* 폴백 */ }

    // 유형명
    ctx.font = `bold 46px ${KR}`
    ctx.fillStyle = '#0f172a'
    ctx.textAlign = 'center'
    const titleLines = info.title.length > 14
      ? [info.title.slice(0, 14), info.title.slice(14)]
      : [info.title]
    titleLines.forEach((line, i) => ctx.fillText(line, W / 2, 370 + i * 58))
    ctx.textAlign = 'left'
    const titleBottom = 370 + titleLines.length * 58

    // 서브타이틀
    ctx.font = `22px ${KR}`
    ctx.fillStyle = '#64748b'
    ctx.textAlign = 'center'
    ctx.fillText(info.subtitle, W / 2, titleBottom + 22)
    ctx.textAlign = 'left'

    // 구분선
    ctx.fillStyle = '#e2e8f0'
    ctx.fillRect(50, titleBottom + 52, W - 100, 1)

    // AI 대체 점수 섹션 배경
    const scoreY = titleBottom + 80
    ctx.beginPath()
    ctx.fillStyle = '#f8fafc'
    ctx.roundRect(50, scoreY - 20, W - 100, 130, 16)
    ctx.fill()
    ctx.beginPath()
    ctx.strokeStyle = '#e2e8f0'
    ctx.lineWidth = 1
    ctx.roundRect(50, scoreY - 20, W - 100, 130, 16)
    ctx.stroke()

    ctx.font = `bold 18px ${KR}`
    ctx.fillStyle = '#64748b'
    ctx.fillText('AI 대체 가능성', 80, scoreY + 10)
    ctx.font = `bold 54px ${KR}`
    ctx.fillStyle = scoreColor
    ctx.fillText(`${aiScore}%`, 80, scoreY + 66)
    ctx.font = `18px ${KR}`
    ctx.fillStyle = scoreColor
    ctx.fillText(scoreLabel, 210, scoreY + 66)

    // 게이지
    const barY = scoreY + 82
    ctx.beginPath()
    ctx.fillStyle = '#e2e8f0'
    ctx.roundRect(80, barY, W - 160, 14, 7)
    ctx.fill()
    const barGrad = ctx.createLinearGradient(80, 0, W - 160, 0)
    barGrad.addColorStop(0, '#6366f1')
    barGrad.addColorStop(1, scoreColor)
    ctx.beginPath()
    ctx.fillStyle = barGrad
    ctx.roundRect(80, barY, (W - 160) * (aiScore / 100), 14, 7)
    ctx.fill()

    // 구분선
    ctx.fillStyle = '#e2e8f0'
    ctx.fillRect(50, scoreY + 112, W - 100, 1)

    // 인사이트 섹션
    const insightY = scoreY + 140
    const insightItems = [
      { emoji: '💪', label: '강점', text: info.insight.strength, bg: '#f0fdf4', border: '#bbf7d0', labelColor: '#15803d', textColor: '#166534' },
      { emoji: '🚨', label: '현실', text: info.insight.crisis, bg: '#fff1f2', border: '#fecdd3', labelColor: '#dc2626', textColor: '#9f1239' },
      { emoji: '🎯', label: '할 것', text: info.insight.direction, bg: info.color + '0d', border: info.color + '30', labelColor: info.color, textColor: info.color },
    ]

    let iy = insightY
    for (const item of insightItems) {
      ctx.beginPath()
      ctx.fillStyle = item.bg
      ctx.roundRect(50, iy, W - 100, 110, 14)
      ctx.fill()
      ctx.beginPath()
      ctx.strokeStyle = item.border
      ctx.lineWidth = 1.5
      ctx.roundRect(50, iy, W - 100, 110, 14)
      ctx.stroke()

      ctx.font = `28px ${KR}`
      ctx.fillText(item.emoji, 75, iy + 44)
      ctx.font = `bold 16px ${KR}`
      ctx.fillStyle = item.labelColor
      ctx.fillText(item.label, 120, iy + 38)

      ctx.font = `18px ${KR}`
      ctx.fillStyle = item.textColor
      const words = item.text
      const maxW = W - 200
      let line = ''
      let lineY = iy + 64
      for (const ch of words) {
        const test = line + ch
        if (ctx.measureText(test).width > maxW) {
          ctx.fillText(line, 120, lineY)
          line = ch
          lineY += 24
          if (lineY > iy + 100) break
        } else {
          line = test
        }
      }
      ctx.fillText(line, 120, lineY)

      iy += 126
    }

    // 추천 직무
    const jobY = iy + 20
    ctx.font = `bold 18px ${KR}`
    ctx.fillStyle = '#94a3b8'
    ctx.fillText('추천 직무', 50, jobY)
    ctx.font = `bold 22px ${KR}`
    ctx.fillStyle = '#1e293b'
    ctx.fillText(info.jobs.slice(0, 3).join('  ·  '), 50, jobY + 36)

    // 하단 CTA 띠
    ctx.fillStyle = '#f8fafc'
    ctx.fillRect(0, H - 110, W, 110)
    ctx.fillStyle = '#e2e8f0'
    ctx.fillRect(0, H - 111, W, 1)
    ctx.font = `bold 22px ${KR}`
    ctx.fillStyle = '#6366f1'
    ctx.fillText('나도 진단해보기 →', 50, H - 60)
    ctx.font = `18px ${KR}`
    ctx.fillStyle = '#94a3b8'
    ctx.fillText('aimbti.vercel.app', 50, H - 28)

    return canvas.toDataURL('image/jpeg', 0.95)
  }

  async function handleDownloadCard() {
    setShareLoading(true)
    gtagEvent('share_click', { method: 'card_download' })
    try {
      const dataUrl = await drawShareCard()
      if (!dataUrl) throw new Error('canvas error')
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `aimbti_${typeCode}.jpg`
      a.click()
    } catch {
      alert('이미지 저장에 실패했습니다. 다시 시도해주세요.')
    }
    setShareLoading(false)
  }

  async function handleInstagramShare() {
    gtagEvent('share_click', { method: 'instagram' })
    setShareLoading(true)

    const dataUrl = await drawShareCard()
    if (!dataUrl) { alert('이미지 생성 실패'); setShareLoading(false); return }

    // 이미지 다운로드
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `aimbti_${typeCode}.jpg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    setInstaToast(true)
    setShareLoading(false)
  }

  async function handleCopyLink() {
    const url = window.location.href
    await navigator.clipboard.writeText(url)
    gtagEvent('share_click', { method: 'link' })
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleKakaoShare() {
    const BASE = window.location.origin
    const IMAGE_BASE = 'https://aimbti-seven.vercel.app'
    const shareUrl = `${BASE}/result/${resultId}`
    const K = (window as any).Kakao
    if (K) {
      if (!K.isInitialized()) K.init(process.env.NEXT_PUBLIC_KAKAO_APP_KEY)
      K.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: `나는 "${info.title}"`,
          description: `AI 대체 가능성 ${aiScore}%`,
          imageUrl: `${IMAGE_BASE}/result/${resultId}/opengraph-image`,
          imageWidth: 900,
          imageHeight: 900,
          link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
        },
        buttons: [
          { title: '결과 보러가기', link: { mobileWebUrl: shareUrl, webUrl: shareUrl } },
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

      {/* 인스타 다운로드 안내 모달 */}
      {instaToast && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center pb-8 px-4"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setInstaToast(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl p-6 space-y-4 animate-fade-in-up bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center space-y-2">
              <div className="text-4xl">📸</div>
              <p className="text-slate-900 font-bold text-lg">이미지가 저장됐어요!</p>
              <p className="text-slate-500 text-sm">인스타 앱에서 갤러리 열고 업로드해주세요</p>
            </div>
            <button
              onClick={() => setInstaToast(false)}
              className="block w-full text-center font-bold text-white py-3.5 rounded-2xl text-sm"
              style={{ background: 'linear-gradient(135deg, #f09433 0%, #dc2743 50%, #bc1888 100%)' }}
            >
              확인
            </button>
          </div>
        </div>
      )}

      <header className="px-5 py-4 flex items-center justify-between border-b border-slate-100">
        <Link href="/" className="text-slate-900 font-bold text-lg">
          AI<span className="text-indigo-600">MBTI</span>
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
            src={`/reals_ch/${encodeURIComponent(info.title)}.png`}
            alt={info.title}
            width={240}
            height={240}
            className="object-contain"
            unoptimized
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
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
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">{info.title}</h1>
            <p className="text-slate-600 text-base">{info.subtitle}</p>

            {/* DNA 바 */}
            <div className="mt-4 flex flex-col gap-3">
              {[
                { left: '혼자', right: '함께', lean: typeCode[0] === 'H' ? 'left' : 'right', color: typeCode[0] === 'H' ? '#6366f1' : '#0ea5e9' },
                { left: 'AI 활용', right: '사람 감각', lean: typeCode[1] === 'A' ? 'left' : 'right', color: typeCode[1] === 'A' ? '#8b5cf6' : '#10b981' },
                { left: '논리형', right: '창의형', lean: typeCode[2] === 'L' ? 'left' : 'right', color: typeCode[2] === 'L' ? '#475569' : '#f59e0b' },
                { left: '빠른 실행', right: '완벽 준비', lean: typeCode[3] === 'F' ? 'left' : 'right', color: typeCode[3] === 'F' ? '#f97316' : '#14b8a6' },
              ].map(({ left, right, lean, color }) => (
                <div key={left} className="flex items-center gap-2">
                  <span className={`text-xs w-14 text-right font-semibold ${lean === 'left' ? 'text-slate-900' : 'text-slate-300'}`}>{left}</span>
                  <div className="flex-1 flex gap-1 items-center">
                    {[0,1,2,3,4,5].map((i) => {
                      const filled = lean === 'left' ? i < 4 : i >= 2
                      return (
                        <div
                          key={i}
                          className="flex-1 h-2.5 rounded-full transition-all"
                          style={{ background: filled ? color : '#e2e8f0' }}
                        />
                      )
                    })}
                  </div>
                  <span className={`text-xs w-14 font-semibold ${lean === 'right' ? 'text-slate-900' : 'text-slate-300'}`}>{right}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-5 text-slate-700 leading-relaxed text-base whitespace-pre-line" style={{ wordBreak: 'keep-all' }}>
            {info.description}
          </p>

          {/* 강점 → 위기 → 방향 */}
          <div className="mt-4 flex flex-col gap-2">
            <div className="flex gap-3 items-start rounded-2xl p-4 border border-emerald-100" style={{ background: '#f0fdf4' }}>
              <span className="text-base mt-0.5 flex-shrink-0">💪</span>
              <div>
                <p className="text-sm font-bold text-emerald-700 mb-1">당신의 강점</p>
                <p className="text-sm text-emerald-800 leading-relaxed">{info.insight.strength}</p>
              </div>
            </div>
            <div className="flex gap-3 items-start rounded-2xl p-4 border border-red-200" style={{ background: '#fff1f1' }}>
              <span className="text-base mt-0.5 flex-shrink-0">🚨</span>
              <div>
                <p className="text-sm font-bold text-red-600 mb-1">지금의 위기</p>
                <p className="text-sm text-red-700 leading-relaxed font-medium">{info.insight.crisis}</p>
              </div>
            </div>
            <div className="flex gap-3 items-start rounded-2xl p-4 border" style={{ background: info.color + '08', borderColor: info.color + '30' }}>
              <span className="text-base mt-0.5 flex-shrink-0">🎯</span>
              <div>
                <p className="text-sm font-bold mb-1" style={{ color: info.color }}>탈출구</p>
                <p className="text-sm leading-relaxed font-medium" style={{ color: info.color }}>{info.insight.direction}</p>
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
              <span className="text-3xl font-black tabular-nums" style={{ color: scoreColor }}>
                {displayScore}%
              </span>
              <p className="text-xs text-slate-400">{scoreLabel}</p>
            </div>
          </div>

          <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${displayScore}%`,
                background: `linear-gradient(to right, #6366f1, ${scoreColor})`,
                transition: 'width 0.05s linear',
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

        {/* 추천 부트캠프 */}
        {(() => {
          const bc = bootcampInfo[info.bootcamp]
          return (
            <div
              className="rounded-3xl p-6 animate-fade-in-up bg-white border border-slate-200"
              style={{ animationDelay: '0.4s' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ background: bc.color + '18', color: bc.color }}
                >
                  {bc.title}
                </span>
              </div>
              <h2 className="text-slate-900 font-bold text-xl mb-1">🎯 당신의 다음 스텝</h2>
              <p className="text-slate-500 text-sm mb-4">{info.bootcampReason}</p>
              <div
                className="rounded-2xl p-4 mb-4"
                style={{ background: bc.color + '08', border: `1px solid ${bc.color}20` }}
              >
                <p className="text-slate-500 text-sm">{bc.reason}</p>
              </div>
              <a
                href="https://forms.gle/FF3mZtpSMQAowrGv7"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => gtagEvent('bootcamp_click', { bootcamp: info.bootcamp, type_code: typeCode })}
                className="block text-center py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90"
                style={{ background: bc.color, color: '#fff' }}
              >
                무료 1:1 AI 커리어 상담 신청하기 →
              </a>
            </div>
          )
        })()}

        {/* 공유 섹션 */}
        <div
          className="rounded-3xl p-6 animate-fade-in-up bg-white"
          style={{ border: '1px solid #e2e8f0', animationDelay: '0.45s' }}
        >
          <p className="text-slate-900 font-black text-xl mb-1">친구들한테 공유하고 놀래켜줘!</p>
          <p className="text-slate-500 text-sm mb-5">AI 대체 가능성 {aiScore}% — 친구는 몇 %일까? 😏</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={handleKakaoShare}
              className="flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ background: '#FEE500', color: '#3C1E1E' }}
            >
              💛 카카오톡으로 공유하기
            </button>
            <button
              onClick={handleInstagramShare}
              disabled={shareLoading}
              className="flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                color: '#fff',
              }}
            >
              📷 {shareLoading ? '준비 중...' : '인스타그램에 공유하기'}
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleDownloadCard}
                disabled={shareLoading}
                className="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
                style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}
              >
                {shareLoading ? '⏳ 생성 중...' : '🖼️ 이미지 저장하기'}
              </button>
              <button
                onClick={handleCopyLink}
                className="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-all hover:opacity-90 active:scale-[0.98]"
                style={{
                  background: copied ? '#10b981' : '#f1f5f9',
                  color: copied ? '#fff' : '#475569',
                  border: `1px solid ${copied ? '#10b981' : '#e2e8f0'}`,
                }}
              >
                {copied ? '✅ 복사됨!' : '🔗 링크 복사'}
              </button>
            </div>
          </div>
        </div>

        {/* 무료 특강 단톡방 */}
        <div
          className="rounded-3xl p-6 animate-fade-in-up"
          style={{ background: '#FFFDE7', border: '2px solid #FEE500', animationDelay: '0.55s' }}
        >
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl">🎓</span>
            <div>
              <p className="font-black text-slate-900 text-lg">AIMBTI 전용 무료 특강 단톡방</p>
              <p className="text-slate-500 text-sm">매주 무료 특강 초대 · AIMBTI 유입 전용</p>
            </div>
          </div>
          <p className="text-slate-600 text-sm mb-4 ml-1">AI 시대를 같이 헤쳐나갈 사람들이 모여있어요 👀</p>
          <a
            href={process.env.NEXT_PUBLIC_OPENCHAT_SURVEY_URL ?? process.env.NEXT_PUBLIC_OPENCHAT_URL ?? 'https://metacodes.co.kr/?utm_source=aimbti&utm_medium=openchat'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => gtagEvent('openchat_click', { source: 'survey', type_code: typeCode })}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90"
            style={{ background: '#FEE500', color: '#3C1E1E' }}
          >
            💬 AIMBTI 단톡방 입장하기 (무료)
          </a>
        </div>

        {/* 무료 전자책 */}
        <div
          className="rounded-3xl p-6 animate-fade-in-up bg-white"
          style={{ border: '1px solid rgba(99,102,241,0.25)', animationDelay: '0.5s' }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">📖</span>
            <h2 className="text-slate-900 font-bold text-xl">무료 전자책 미리보기</h2>
          </div>
          <p className="text-slate-500 text-sm mb-4">AI 시대 커리어 생존 전략 · 총 4페이지 중 2페이지 무료</p>

          {/* 페이지 탭 */}
          <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1">
            {ebookPages.map((p, i) => (
              <button
                key={p.num}
                onClick={() => setEbookPage(i)}
                className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                style={ebookPage === i
                  ? { background: '#6366f1', color: '#fff' }
                  : { background: '#f1f5f9', color: i < FREE_PAGES ? '#64748b' : '#cbd5e1' }
                }
              >
                {i < FREE_PAGES ? `${p.num}페이지` : `🔒 ${p.num}페이지`}
              </button>
            ))}
          </div>

          {/* 페이지 뷰어 */}
          <div className="relative rounded-2xl overflow-hidden" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', minHeight: 260 }}>
            <div className="px-4 pt-4 pb-2 border-b border-slate-100 flex items-center justify-between">
              <p className="text-xs font-bold text-indigo-600">AI 시대 커리어 생존 전략</p>
              <p className="text-xs text-slate-400">{ebookPage + 1} / {ebookPages.length}</p>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-black text-slate-900 mb-3">{ebookPages[ebookPage].title}</h3>
              {ebookPage < FREE_PAGES ? (
                ebookPages[ebookPage].content
              ) : (
                <div className="relative">
                  <div className="space-y-2 select-none" style={{ filter: 'blur(4px)', opacity: 0.4 }}>
                    {[80, 60, 90, 50, 70].map((w, i) => (
                      <div key={i} className="h-3 rounded bg-slate-300" style={{ width: `${w}%` }} />
                    ))}
                    <div className="h-3 rounded bg-slate-300 w-3/4" />
                    <div className="h-3 rounded bg-slate-300 w-full" />
                    <div className="h-3 rounded bg-slate-300 w-2/3" />
                    <div className="h-3 rounded bg-slate-300 w-5/6" />
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <span className="text-2xl">🔒</span>
                    <p className="text-xs font-bold text-slate-700 text-center">회원가입 후 전체 무료 열람</p>
                  </div>
                </div>
              )}
            </div>
            {ebookPage === FREE_PAGES - 1 && (
              <div
                className="absolute inset-x-0 bottom-0 h-16"
                style={{ background: 'linear-gradient(to bottom, transparent, #f8fafc)' }}
              />
            )}
          </div>

          <div className="flex justify-between mt-3">
            <button
              onClick={() => setEbookPage(Math.max(0, ebookPage - 1))}
              disabled={ebookPage === 0}
              className="text-xs font-bold px-3 py-1.5 rounded-lg disabled:opacity-30 transition-all"
              style={{ background: '#f1f5f9', color: '#64748b' }}
            >
              ← 이전
            </button>
            <button
              onClick={() => setEbookPage(Math.min(ebookPages.length - 1, ebookPage + 1))}
              disabled={ebookPage === ebookPages.length - 1}
              className="text-xs font-bold px-3 py-1.5 rounded-lg disabled:opacity-30 transition-all"
              style={{ background: '#f1f5f9', color: '#64748b' }}
            >
              다음 →
            </button>
          </div>

          <a
            href="https://metacodes.co.kr/?utm_source=aimbti&utm_medium=ebook"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => gtagEvent('ebook_click', { type_code: typeCode })}
            className="block w-full text-center py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 mt-4"
            style={{ background: 'linear-gradient(to right, #6366f1, #8b5cf6)', color: '#fff' }}
          >
            전체 보기 — 메타코드 회원가입 (무료) →
          </a>
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
