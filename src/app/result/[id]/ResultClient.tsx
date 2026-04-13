'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { TypeCode, typeInfo, bootcampInfo } from '@/lib/quiz'
import { gtagEvent } from '@/lib/ga'

type Scores = { a: number; b: number; c: number; d: number; e: number }

type Props = {
  typeCode: TypeCode
  aiScore: number
  resultId: string
  couponCode: string | null
  scores: Scores | null
}

function RadarChart({ scores, color }: { scores: Scores; color: string }) {
  // 5각형: 위=AI활용도, 우상=AI민감도, 우하=독립성, 좌하=논리력, 좌상=실행력
  const R = 185, cx = 325, cy = 300
  const N = 5
  const angles = Array.from({ length: N }, (_, i) => -Math.PI / 2 + i * 2 * Math.PI / N)
  const targetVals = [scores.a / 4, scores.b / 4, scores.c / 4, scores.d / 4, scores.e / 4]

  const [animVals, setAnimVals] = useState([0, 0, 0, 0, 0])

  useEffect(() => {
    const duration = 900
    const start = performance.now()
    let raf: number
    function step(now: number) {
      const t = Math.min((now - start) / duration, 1)
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
      setAnimVals(targetVals.map(v => v * eased))
      if (t < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const pt = (r: number, a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)] as [number, number]
  const polyPts = (vs: number[]) => vs.map((v, i) => pt(R * Math.max(v, 0.04), angles[i])).map(([x, y]) => `${x},${y}`).join(' ')
  const gridPts = (level: number) => angles.map(a => pt(R * level, a)).map(([x, y]) => `${x},${y}`).join(' ')

  const labelR = R + 48
  const anchors = ['middle', 'start', 'start', 'end', 'end'] as const
  const labels = [
    { hi: 'AI 활용도', lo: '' },
    { hi: 'AI 민감도', lo: '' },
    { hi: '독립성', lo: '' },
    { hi: '논리력', lo: '' },
    { hi: '실행력', lo: '' },
  ]

  return (
    <svg viewBox="0 0 670 570" className="w-full max-w-[670px] mx-auto">
      {[0.25, 0.5, 0.75, 1].map(l => (
        <polygon key={l} points={gridPts(l)} fill="none" stroke="#e2e8f0" strokeWidth="1" />
      ))}
      {angles.map((a, i) => {
        const [x, y] = pt(R, a)
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#e2e8f0" strokeWidth="1" />
      })}
      <polygon points={polyPts(animVals)} fill={`${color}22`} stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
      {animVals.map((v, i) => {
        const [x, y] = pt(R * Math.max(v, 0.04), angles[i])
        return <circle key={i} cx={x} cy={y} r="6" fill={color} />
      })}
      {labels.map(({ hi }, i) => {
        const [lx, ly] = pt(labelR, angles[i])
        const yOff = i === 0 ? -10 : (i === 2 || i === 3) ? 10 : 0
        return (
          <g key={i}>
            <text x={lx} y={ly + yOff - 10} textAnchor={anchors[i]} fontSize="27" fontWeight="700" fill="#1e293b" fontFamily="'Apple SD Gothic Neo','Malgun Gothic',sans-serif">
              {hi}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export default function ResultClient({
  typeCode,
  aiScore,
  resultId,
  scores: scoresProp,
  // couponCode reserved for future use
}: Props) {
  const scores: Scores = scoresProp ?? {
    a: 2, b: 2, c: 2, d: 2, e: 2,
  }
  const info = typeInfo[typeCode]
  const bInfo = bootcampInfo[info.bootcamp]

  useEffect(() => {
    gtagEvent('result_view', { type_code: typeCode, ai_score: aiScore })
  }, [typeCode, aiScore])

  // 결과 페이지 이탈 추적 (뒤로가기 / 탭 닫기)
  useEffect(() => {
    const enteredAt = Date.now()
    const handleExit = () => {
      const timeOnPage = Math.round((Date.now() - enteredAt) / 1000)
      gtagEvent('page_exit', { type_code: typeCode, time_on_page: timeOnPage, exit_via: 'unload' })
    }
    window.addEventListener('pagehide', handleExit)
    return () => window.removeEventListener('pagehide', handleExit)
  }, [typeCode])

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ebookScrollRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)
  const [shareLoading, setShareLoading] = useState(false)
  const [displayScore, setDisplayScore] = useState(0)
  const [instaToast, setInstaToast] = useState(false)
  const [ebookPage, setEbookPage] = useState(0)

  useEffect(() => {
    if (ebookScrollRef.current) ebookScrollRef.current.scrollTop = 0
  }, [ebookPage])

  const ebookLinkMap: Record<string, string> = {
    '데이터 분석': 'https://metacodes.co.kr/edu/read2.nx?M2_IDX=30656&page=1&sc_is_discount=&sc_is_new=&EP_IDX=27422&EM_IDX=27263',
    '데이터 엔지니어': 'https://metacodes.co.kr/edu/read2.nx?M2_IDX=30656&page=1&sc_is_discount=&sc_is_new=&EP_IDX=27426&EM_IDX=27267',
    'AI LLM': 'https://metacodes.co.kr/edu/read2.nx?M2_IDX=30656&page=1&sc_is_discount=&sc_is_new=&EP_IDX=27427&EM_IDX=27268',
    'AI 서비스 개발자': 'https://metacodes.co.kr/edu/read2.nx?M2_IDX=30656&page=1&sc_is_discount=&sc_is_new=&EP_IDX=27433&EM_IDX=27274',
  }
  const ebookLink = ebookLinkMap[info.bootcamp] ?? 'https://metacodes.co.kr/'

  const EBOOK_FREE_LIMIT = 7

  const testImages = Array.from({ length: 10 }, (_, i) => `/zunza/DE/DE_테스트_${String(i + 1).padStart(2, '0')}.png`)

  const daImages = Array.from({ length: 6 }, (_, i) => `/zunza/DA/${i + 1}.png`)
  const deImages = Array.from({ length: 6 }, (_, i) => `/zunza/DE/${i + 1}.png`)
  const llmImages = Array.from({ length: 8 }, (_, i) => `/zunza/AILLM/${i + 1}.png`)
  const aiServiceImages = Array.from({ length: 6 }, (_, i) => `/zunza/AISERVICE/${i + 1}.png`)

  const ebookImageMap: Record<string, string[]> = {
    '데이터 엔지니어': deImages,
    '데이터 분석': daImages,
    'AI LLM': llmImages,
    'AI 서비스 개발자': aiServiceImages,
  }
  const ebookImages = ebookImageMap[info.bootcamp] ?? null

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
              { icon: '🧠', title: 'AI를 두려워하지 않고, 도구로 씁니다', desc: 'ChatGPT·Copilot·Canva AI를 매일 씁니다.' },
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
    type CtxWithRoundRect = CanvasRenderingContext2D & { roundRect?: (x: number, y: number, w: number, h: number, r: number) => void }
    const ctxExt = ctx as CtxWithRoundRect
    if (!ctxExt.roundRect) {
      ctxExt.roundRect = function(x: number, y: number, w: number, h: number, r: number) {
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

    // 캐릭터 이미지
    try {
      const charImg = new window.Image()
      charImg.crossOrigin = 'anonymous'
      charImg.src = `/characters/${encodeURIComponent(info.title)}.png`
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


    // 성향 5각형 (유형명 바로 아래)
    const pentaStartY = titleBottom + 78
    ctx.font = `bold 20px ${KR}`
    ctx.fillStyle = '#94a3b8'
    ctx.textAlign = 'left'
    ctx.fillText('나의 성향 DNA', 50, pentaStartY)

    const pCx = W / 2, pCy = pentaStartY + 170, pR = 130
    const pN = 5
    const pAngles = Array.from({ length: pN }, (_,i) => -Math.PI/2 + i * 2*Math.PI/pN)
    const pVals = [scores.a/4, scores.b/4, scores.c/4, scores.d/4, scores.e/4]
    const pLabelsHi = ['AI 활용도', 'AI 민감도', '독립성', '논리력', '실행력']
    const pLabelsLo = ['', '', '', '', '']

    for (const level of [0.25, 0.5, 0.75, 1.0]) {
      ctx.beginPath()
      pAngles.forEach((a, i) => {
        const x = pCx + pR * level * Math.cos(a)
        const y = pCy + pR * level * Math.sin(a)
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
      })
      ctx.closePath(); ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1.5; ctx.stroke()
    }
    pAngles.forEach(a => {
      ctx.beginPath(); ctx.moveTo(pCx, pCy)
      ctx.lineTo(pCx + pR * Math.cos(a), pCy + pR * Math.sin(a))
      ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1.5; ctx.stroke()
    })
    ctx.beginPath()
    pVals.forEach((v, i) => {
      const r = pR * Math.max(v, 0.05)
      if (i === 0) ctx.moveTo(pCx + r * Math.cos(pAngles[i]), pCy + r * Math.sin(pAngles[i]))
      else ctx.lineTo(pCx + r * Math.cos(pAngles[i]), pCy + r * Math.sin(pAngles[i]))
    })
    ctx.closePath(); ctx.fillStyle = info.color + '30'; ctx.fill()
    ctx.strokeStyle = info.color; ctx.lineWidth = 3; ctx.stroke()
    pVals.forEach((v, i) => {
      const r = pR * Math.max(v, 0.05)
      ctx.beginPath(); ctx.arc(pCx + r * Math.cos(pAngles[i]), pCy + r * Math.sin(pAngles[i]), 7, 0, Math.PI * 2)
      ctx.fillStyle = info.color; ctx.fill()
    })
    const labelR = pR + 44
    pAngles.forEach((a, i) => {
      const lx = pCx + labelR * Math.cos(a), ly = pCy + labelR * Math.sin(a)
      const dominant = pVals[i] >= 0.5
      const mainLabel = dominant ? pLabelsHi[i] : (pLabelsLo[i] || pLabelsHi[i])
      const subLabel = dominant ? pLabelsLo[i] : pLabelsHi[i]
      const cosA = Math.cos(a)
      ctx.textAlign = cosA > 0.1 ? 'left' : cosA < -0.1 ? 'right' : 'center'
      ctx.font = `bold 18px ${KR}`; ctx.fillStyle = '#1e293b'; ctx.fillText(mainLabel, lx, ly - 4)
      if (subLabel) { ctx.font = `14px ${KR}`; ctx.fillStyle = '#94a3b8'; ctx.fillText(subLabel, lx, ly + 16) }
    })
    ctx.textAlign = 'left'

    // AI 대체 점수 섹션 배경
    const scoreY = pCy + pR + 80
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
    ctx.font = `18px ${KR}`
    ctx.fillStyle = '#94a3b8'
    ctx.fillText('aimbti.vercel.app', 50, H - 28)

    return canvas.toDataURL('image/jpeg', 0.95)
  }

  async function handleDownloadCard() {
    setShareLoading(true)
    gtagEvent('exit_click', { label: 'share_image_download', type_code: typeCode })
    try {
      const dataUrl = await drawShareCard()
      if (!dataUrl) throw new Error('canvas error')
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `AIMBTI_${info.title}.jpg`
      a.click()
    } catch {
      alert('이미지 저장에 실패했습니다. 다시 시도해주세요.')
    }
    setShareLoading(false)
  }

  async function handleInstagramShare() {
    gtagEvent('exit_click', { label: 'share_instagram', type_code: typeCode })
    setShareLoading(true)

    const dataUrl = await drawShareCard()
    if (!dataUrl) { alert('이미지 생성 실패'); setShareLoading(false); return }

    // 이미지 다운로드
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `AIMBTI_${info.title}.jpg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    setInstaToast(true)
    setShareLoading(false)
  }

  async function drawKakaoCard(): Promise<string> {
    const canvas = canvasRef.current
    if (!canvas) return ''
    const ctx = canvas.getContext('2d')
    if (!ctx) return ''

    try {
      const font = new FontFace('NotoSansKR', 'url(https://fonts.gstatic.com/s/notosanskr/v36/PbykFmXiEBPT4ITbgNA5Cgm20xz64px_1hVWr0wuPNGmlQNMEfD4.0.woff2) format("woff2")')
      document.fonts.add(await font.load())
    } catch { /* 시스템 폰트 폴백 */ }

    type CtxWithRoundRect = CanvasRenderingContext2D & { roundRect?: (x: number, y: number, w: number, h: number, r: number) => void }
    const ctxR = ctx as CtxWithRoundRect
    if (!ctxR.roundRect) {
      ctxR.roundRect = function(x: number, y: number, w: number, h: number, r: number) {
        ctx.beginPath(); ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y);
        ctx.quadraticCurveTo(x+w,y,x+w,y+r); ctx.lineTo(x+w,y+h-r);
        ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h); ctx.lineTo(x+r,y+h);
        ctx.quadraticCurveTo(x,y+h,x,y+h-r); ctx.lineTo(x,y+r);
        ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath();
      }
    }

    const W = 800, H = 1070
    canvas.width = W; canvas.height = H
    const KR = '"NotoSansKR", "Apple SD Gothic Neo", "Malgun Gothic", Arial'

    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H)

    const topBand = ctx.createLinearGradient(0, 0, W, 0)
    topBand.addColorStop(0, info.color); topBand.addColorStop(1, '#6366f1')
    ctx.fillStyle = topBand; ctx.fillRect(0, 0, W, 10)

    ctx.beginPath(); ctx.arc(W - 50, 220, 140, 0, Math.PI * 2)
    ctx.fillStyle = info.color + '12'; ctx.fill()
    ctx.beginPath(); ctx.arc(50, 1000, 100, 0, Math.PI * 2)
    ctx.fillStyle = '#6366f110'; ctx.fill()

    ctx.font = `bold 22px ${KR}`; ctx.fillStyle = '#6366f1'
    ctx.fillText('AIMBTI', 50, 98)

    try {
      const charImg = new window.Image()
      charImg.crossOrigin = 'anonymous'
      charImg.src = `/characters/${encodeURIComponent(info.title)}.png`
      await new Promise<void>((resolve) => {
        charImg.onload = () => resolve(); charImg.onerror = () => resolve(); setTimeout(resolve, 3000)
      })
      ctx.drawImage(charImg, W - 270, 56, 230, 230)
    } catch { /* 폴백 */ }

    const titleLines = info.title.length > 12 ? [info.title.slice(0, 12), info.title.slice(12)] : [info.title]
    ctx.font = `bold 46px ${KR}`; ctx.fillStyle = '#0f172a'; ctx.textAlign = 'left'
    titleLines.forEach((line, i) => ctx.fillText(line, 50, 148 + i * 54))
    const titleBottom = 148 + titleLines.length * 54

    ctx.font = `18px ${KR}`; ctx.fillStyle = '#64748b'
    ctx.fillText(info.subtitle, 50, titleBottom + 20)

    // 성향 5각형 (유형명 바로 아래)
    const pentaStartY = titleBottom + 50
    ctx.font = `bold 18px ${KR}`; ctx.fillStyle = '#94a3b8'
    ctx.fillText('나의 성향 DNA', 50, pentaStartY)

    const pCx = W / 2, pCy = pentaStartY + 160, pR = 120
    const pN = 5
    const pAngles = Array.from({ length: pN }, (_, i) => -Math.PI / 2 + i * 2 * Math.PI / pN)
    const pVals = [scores.a / 4, scores.b / 4, scores.c / 4, scores.d / 4, scores.e / 4]
    const pLabelsHi = ['AI 활용도', 'AI 민감도', '독립성', '논리력', '실행력']
    const pLabelsLo = ['', '', '', '', '']

    // 그리드
    for (const level of [0.25, 0.5, 0.75, 1.0]) {
      ctx.beginPath()
      pAngles.forEach((a, i) => {
        const x = pCx + pR * level * Math.cos(a), y = pCy + pR * level * Math.sin(a)
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
      })
      ctx.closePath(); ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1.5; ctx.stroke()
    }
    // 축선
    pAngles.forEach(a => {
      ctx.beginPath(); ctx.moveTo(pCx, pCy)
      ctx.lineTo(pCx + pR * Math.cos(a), pCy + pR * Math.sin(a))
      ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1.5; ctx.stroke()
    })
    // 데이터 다각형
    ctx.beginPath()
    pVals.forEach((v, i) => {
      const r = pR * Math.max(v, 0.05)
      const x = pCx + r * Math.cos(pAngles[i]), y = pCy + r * Math.sin(pAngles[i])
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
    })
    ctx.closePath(); ctx.fillStyle = info.color + '30'; ctx.fill()
    ctx.strokeStyle = info.color; ctx.lineWidth = 3; ctx.stroke()
    // 꼭짓점 점
    pVals.forEach((v, i) => {
      const r = pR * Math.max(v, 0.05)
      ctx.beginPath(); ctx.arc(pCx + r * Math.cos(pAngles[i]), pCy + r * Math.sin(pAngles[i]), 6, 0, Math.PI * 2)
      ctx.fillStyle = info.color; ctx.fill()
    })
    // 레이블
    const labelR = pR + 42
    pAngles.forEach((a, i) => {
      const lx = pCx + labelR * Math.cos(a), ly = pCy + labelR * Math.sin(a)
      const dominant = pVals[i] >= 0.5
      const main = dominant ? pLabelsHi[i] : (pLabelsLo[i] || pLabelsHi[i])
      const sub = dominant ? pLabelsLo[i] : pLabelsHi[i]
      const cosA = Math.cos(a)
      ctx.textAlign = cosA > 0.1 ? 'left' : cosA < -0.1 ? 'right' : 'center'
      ctx.font = `bold 16px ${KR}`; ctx.fillStyle = '#1e293b'; ctx.fillText(main, lx, ly - 2)
      if (sub) { ctx.font = `13px ${KR}`; ctx.fillStyle = '#94a3b8'; ctx.fillText(sub, lx, ly + 16) }
    })
    ctx.textAlign = 'left'

    // AI 점수 (pentagon 아래)
    const scoreY = pCy + pR + 56
    ctx.beginPath(); ctx.fillStyle = '#f8fafc'; ctxR.roundRect!(50, scoreY, W - 100, 116, 16); ctx.fill()
    ctx.beginPath(); ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1; ctxR.roundRect!(50, scoreY, W - 100, 116, 16); ctx.stroke()
    ctx.font = `bold 15px ${KR}`; ctx.fillStyle = '#64748b'; ctx.fillText('AI 대체 가능성', 80, scoreY + 26)
    ctx.font = `bold 50px ${KR}`; ctx.fillStyle = scoreColor; ctx.fillText(`${aiScore}%`, 80, scoreY + 78)
    ctx.font = `17px ${KR}`; ctx.fillStyle = scoreColor; ctx.fillText(scoreLabel, 220, scoreY + 78)
    const barY = scoreY + 92
    ctx.beginPath(); ctx.fillStyle = '#e2e8f0'; ctxR.roundRect!(80, barY, W - 160, 12, 6); ctx.fill()
    const bg = ctx.createLinearGradient(80, 0, W - 160, 0)
    bg.addColorStop(0, '#6366f1'); bg.addColorStop(1, scoreColor)
    ctx.beginPath(); ctx.fillStyle = bg; ctxR.roundRect!(80, barY, (W - 160) * (aiScore / 100), 12, 6); ctx.fill()

    // 인사이트 카드
    const insightItems = [
      { emoji: '💪', label: '강점', text: info.insight.strength, bg: '#f0fdf4', border: '#bbf7d0', labelColor: '#15803d', textColor: '#166534' },
      { emoji: '🚨', label: '현실', text: info.insight.crisis, bg: '#fff1f2', border: '#fecdd3', labelColor: '#dc2626', textColor: '#9f1239' },
      { emoji: '🎯', label: '할 것', text: info.insight.direction, bg: info.color + '0d', border: info.color + '30', labelColor: info.color, textColor: info.color },
    ]
    let iy = scoreY + 128
    for (const item of insightItems) {
      ctx.beginPath(); ctx.fillStyle = item.bg; ctxR.roundRect!(50, iy, W - 100, 68, 12); ctx.fill()
      ctx.beginPath(); ctx.strokeStyle = item.border; ctx.lineWidth = 1.5; ctxR.roundRect!(50, iy, W - 100, 68, 12); ctx.stroke()
      ctx.font = `20px ${KR}`; ctx.fillStyle = item.textColor; ctx.fillText(item.emoji, 74, iy + 26)
      ctx.font = `bold 13px ${KR}`; ctx.fillStyle = item.labelColor; ctx.fillText(item.label, 110, iy + 20)
      const short = item.text.length > 32 ? item.text.slice(0, 32) + '…' : item.text
      ctx.font = `14px ${KR}`; ctx.fillStyle = item.textColor; ctx.fillText(short, 110, iy + 42)
      iy += 78
    }

    ctx.font = `15px ${KR}`; ctx.fillStyle = '#94a3b8'
    ctx.fillText('aimbti.vercel.app', W - 195, iy + 40)

    return canvas.toDataURL('image/jpeg', 0.95)
  }

    async function handleKakaoShare() {
    gtagEvent('exit_click', { label: 'share_kakao', type_code: typeCode })
    setShareLoading(true)
    const K = window.Kakao
    if (!K) {
      const url = window.location.href
      await navigator.clipboard.writeText(`${window.location.origin}?utm_source=kakao&utm_medium=share`)
      alert('링크가 복사됐습니다! 카카오톡에 붙여넣기 해주세요.')
      setShareLoading(false)
      return
    }
    if (!K.isInitialized()) K.init(process.env.NEXT_PUBLIC_KAKAO_APP_KEY ?? '')
    const shareUrl = `${window.location.origin}?utm_source=kakao&utm_medium=share`
    try {
      const dataUrl = await drawKakaoCard()
      if (!dataUrl) throw new Error('no image')
      const blob = await (await fetch(dataUrl)).blob()
      const file = new File([blob], 'aimbti.jpg', { type: 'image/jpeg' })
      const uploaded = await K.Share.uploadImage({ file: [file] })
      K.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: `나는 "${info.title}"`,
          description: `AI 대체 가능성 ${aiScore}%`,
          imageUrl: uploaded.infos.original.url,
          imageWidth: 800,
          imageHeight: 1200,
          link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
        },
        buttons: [{ title: '결과 보러가기', link: { mobileWebUrl: shareUrl, webUrl: shareUrl } }],
      })
    } catch {
      const IMAGE_BASE = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin
      K.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: `나는 "${info.title}"`,
          description: `AI 대체 가능성 ${aiScore}%`,
          imageUrl: `${IMAGE_BASE}/result/${resultId}/opengraph-image`,
          imageWidth: 800,
          imageHeight: 1600,
          link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
        },
        buttons: [{ title: '결과 보러가기', link: { mobileWebUrl: shareUrl, webUrl: shareUrl } }],
      })
    }
    setShareLoading(false)
  }

  async function handleCopyLink() {
    const url = `${window.location.origin}?utm_source=link&utm_medium=share`
    await navigator.clipboard.writeText(url)
    gtagEvent('exit_click', { label: 'share_link_copy', type_code: typeCode })
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
        <Link href="/" className="text-slate-900 font-bold text-lg" onClick={() => gtagEvent('exit_click', { destination: '/', label: 'home_logo', type_code: typeCode })}>
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">AI-MBTI</span>
        </Link>
        <Link
          href="/test"
          className="text-sm text-slate-400 hover:text-slate-700 transition-colors"
          onClick={() => gtagEvent('exit_click', { destination: '/test', label: 'header_retest', type_code: typeCode })}
        >
          다시 테스트 →
        </Link>
      </header>

      <main className="px-5 py-6 space-y-5">
        {/* 캐릭터 이미지 */}
        <div className="flex justify-center float-animation">
          <Image
            src={`/characters/${encodeURIComponent(info.title)}.png`}
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
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-1">{info.title}</h1>
            <p className="text-slate-600 text-base">{info.subtitle}</p>
          </div>

          {/* 성향 레이더 */}
          <div className="mt-5">
            <RadarChart scores={scores} color={info.color} />
          </div>

          <p className="mt-6 text-slate-700 leading-relaxed text-base whitespace-pre-line pl-3" style={{ wordBreak: 'keep-all', lineHeight: '2' }}>
            {info.description}
          </p>

          {/* 강점 → 위기 → 방향 */}
          <div className="mt-8 flex flex-col gap-4">
            <div className="flex gap-2 items-start rounded-xl p-3 border" style={{ background: bInfo.color + '08', borderColor: bInfo.color + '30' }}>
              <span className="text-base mt-0.5 flex-shrink-0">💡</span>
              <div>
                <p className="text-base font-bold mb-1" style={{ color: bInfo.color }}>{bInfo.shortLabel} 유형</p>
                <p className="text-base leading-relaxed font-medium" style={{ color: bInfo.color, wordBreak: 'keep-all' }}>{bInfo.fieldDescription}</p>
              </div>
            </div>
            <div className="flex gap-2 items-start rounded-xl p-3 border border-emerald-100" style={{ background: '#f0fdf4' }}>
              <span className="text-base mt-0.5 flex-shrink-0">💪</span>
              <div>
                <p className="text-base font-bold text-emerald-700 mb-1">당신의 강점</p>
                <p className="text-base text-emerald-800 leading-relaxed" style={{ wordBreak: 'keep-all' }}>{info.insight.strength}</p>
              </div>
            </div>
            <div className="flex gap-2 items-start rounded-xl p-3 border border-red-200" style={{ background: '#fff1f1' }}>
              <span className="text-base mt-0.5 flex-shrink-0">🚨</span>
              <div>
                <p className="text-base font-bold text-red-600 mb-1">AI 대체 위험</p>
                <p className="text-base text-red-700 leading-relaxed font-medium" style={{ wordBreak: 'keep-all' }}>{info.insight.crisis}</p>
              </div>
            </div>
            <div className="flex gap-2 items-start rounded-xl p-3 border" style={{ background: info.color + '08', borderColor: info.color + '30' }}>
              <span className="text-base mt-0.5 flex-shrink-0">🎯</span>
              <div>
                <p className="text-base font-bold mb-1" style={{ color: info.color }}>생존 전략</p>
                <p className="text-base leading-relaxed font-medium" style={{ color: info.color, wordBreak: 'keep-all' }}>{info.insight.direction}</p>
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
          {/* 안전 스킬 박스 */}
          <div className="rounded-2xl p-4 mb-3" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <p className="text-base font-bold text-emerald-700 mb-1">✅ AI도 못 뺏는 스킬</p>
            <p className="text-base text-emerald-600 leading-relaxed">
              {info.jobSection.tasks.filter(t => t.rate < 70).map(t => t.name).join(' · ')}
              {info.jobSection.tasks.filter(t => t.rate < 70).length === 1
                ? <> 능력은 아직 AI가 대체하지 못합니다.<br />이게 당신의 핵심 무기입니다.</>
                : ' — 이게 당신의 무기입니다'}
            </p>
          </div>

          {/* 전환 공식 박스 */}
          <div className="rounded-2xl p-4 mb-3" style={{ background: info.color + '08', border: `1px solid ${info.color}30` }}>
            <p className="text-base font-bold text-slate-500 mb-3">대체 안 되는 포지션의 공식</p>
            <div className="flex flex-col gap-2.5">
              {info.jobSection.transitions.map((t) => (
                <div key={t.from} className="flex items-center gap-1.5 overflow-x-auto">
                  <span className="px-2 py-1 rounded-lg bg-white text-slate-500 font-medium text-sm border border-slate-200 whitespace-nowrap">{t.from}</span>
                  <span className="font-black text-slate-300 text-base">+</span>
                  <span className="px-2 py-1 rounded-lg text-white font-bold text-sm whitespace-nowrap" style={{ background: info.color }}>{t.via}</span>
                  <span className="font-black text-slate-300 text-base">=</span>
                  <span className="px-2 py-1 rounded-lg font-black text-sm whitespace-nowrap" style={{ background: info.color + '15', color: info.color }}>{t.to}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA 연결 문구 */}
        </div>

        {/* 무료 특강 단톡방 */}
        <div
          className="rounded-3xl p-6 animate-fade-in-up"
          style={{ background: '#FFFDE7', border: '2px solid #FEE500', animationDelay: '0.55s' }}
        >
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl">🎓</span>
            <div>
              <p className="text-slate-900 text-xl font-black">온라인 커리어 무료 특강</p>
              <p className="text-slate-600 text-sm">매주 대기업 · AI/데이터 현직자 노하우</p>
            </div>
          </div>
          <a
            href={process.env.NEXT_PUBLIC_OPENCHAT_SURVEY_URL ?? process.env.NEXT_PUBLIC_OPENCHAT_URL ?? 'https://metacodes.co.kr/?utm_source=aimbti&utm_medium=openchat'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              gtagEvent('openchat_click', { type_code: typeCode })
              gtagEvent('exit_click', { label: 'openchat', destination: process.env.NEXT_PUBLIC_OPENCHAT_SURVEY_URL ?? process.env.NEXT_PUBLIC_OPENCHAT_URL ?? 'https://metacodes.co.kr', type_code: typeCode })
            }}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-base transition-all hover:opacity-90"
            style={{ background: '#FEE500', color: '#3C1E1E' }}
          >
            💬 단톡방 입장하기 (무료)
          </a>
        </div>

        {/* 무료 전자책 */}
        <div
          className="rounded-3xl p-6 animate-fade-in-up bg-white"
          style={{ border: '1px solid rgba(99,102,241,0.25)', animationDelay: '0.5s' }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">📖</span>
            <h2 className="text-slate-900 font-bold text-2xl">무료 전자책 다운받기</h2>
          </div>
          <p className="text-slate-500 text-sm mb-4"></p>

          {ebookImages && (
            <div>
              {/* 슬라이더 */}
              <div className="relative">
                <div ref={ebookScrollRef} className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50" style={{ height: '70vh', overflowY: 'auto' }}>
                  <img
                    src={ebookImages[ebookPage]}
                    alt={`전자책 ${ebookPage + 1}`}
                    className="w-full h-auto block"
                  />
                </div>

                {ebookPage > 0 && (
                  <button
                    onClick={() => setEbookPage(ebookPage - 1)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center shadow-md text-xl font-bold"
                    style={{ background: 'rgba(255,255,255,0.9)' }}
                  >‹</button>
                )}
                <button
                  onClick={() => {
                    if (ebookPage + 1 >= ebookImages.length) {
                      gtagEvent('ebook_click', { type_code: typeCode, action: 'unlock' })
                      gtagEvent('exit_click', { label: 'ebook_metacode', destination: ebookLink, type_code: typeCode })
                      window.open(ebookLink, '_blank')
                    } else {
                      setEbookPage(ebookPage + 1)
                    }
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center shadow-md text-xl font-bold"
                  style={{ background: 'rgba(255,255,255,0.9)' }}
                >›</button>
              </div>

              {/* 인디케이터 */}
              <div className="flex justify-center gap-2 mt-3">
                {ebookImages.map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full transition-all"
                    style={{ background: i === ebookPage ? '#6366f1' : '#e2e8f0' }}
                  />
                ))}
              </div>
            </div>
          )}

          <a
            href={ebookLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              gtagEvent('ebook_click', { type_code: typeCode, action: 'download' })
              gtagEvent('exit_click', { label: 'ebook_download', type_code: typeCode })
            }}
            className="block w-full text-center py-3.5 rounded-xl font-bold text-base transition-all hover:opacity-90 mt-4"
            style={{ background: 'linear-gradient(to right, #6366f1, #8b5cf6)', color: '#fff' }}
          >
            (50페이지 분량) 전자책 무료 다운받기
          </a>
        </div>

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
              disabled={shareLoading}
              className="flex items-center justify-center gap-2 rounded-2xl font-bold text-base transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
              style={{ background: '#FEE500', color: '#3C1E1E', height: 47 }}
            >
              💛 {shareLoading ? '준비 중...' : '카카오톡으로 공유하기'}
            </button>
            <button
              onClick={handleInstagramShare}
              disabled={shareLoading}
              className="flex items-center justify-center gap-2 rounded-2xl font-bold text-base transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                color: '#fff',
                height: 47,
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

        {/* 다시 테스트 */}
        <div className="text-center pb-8">
          <Link
            href="/test"
            className="inline-block text-slate-400 hover:text-slate-700 text-sm transition-colors"
            onClick={() => gtagEvent('exit_click', { destination: '/test', label: 'bottom_retest', type_code: typeCode })}
          >
            ← 테스트 다시 하기
          </Link>
        </div>
      </main>
    </div>
  )
}
