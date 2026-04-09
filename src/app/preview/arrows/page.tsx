'use client'

import { useState } from 'react'

const images = Array.from({ length: 5 }, (_, i) => `/zunza/DE/DE_테스트_${String(i + 1).padStart(2, '0')}.png`)

function SliderBase({ page, setPage, label, children }: {
  page: number
  setPage: (p: number) => void
  label: string
  children: (page: number, prev: () => void, next: () => void) => React.ReactNode
}) {
  const prev = () => setPage(Math.max(0, page - 1))
  const next = () => setPage(Math.min(images.length - 1, page + 1))
  return (
    <div className="bg-white rounded-3xl overflow-hidden">
      <div className="bg-indigo-600 text-white text-center py-2 text-sm font-bold">{label}</div>
      <div className="p-5">
        {children(page, prev, next)}
        <div className="flex justify-center gap-2 mt-3">
          {images.map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full transition-all" style={{ background: i === page ? '#6366f1' : '#e2e8f0' }} />
          ))}
        </div>
      </div>
    </div>
  )
}

// A. 이미지 위 반투명 동그라미
function A() {
  const [page, setPage] = useState(0)
  return (
    <SliderBase page={page} setPage={setPage} label="A — 반투명 동그라미 (현재)">
      {(p, prev, next) => (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200">
          <img src={images[p]} className="w-full h-auto block" alt="" />
          {p > 0 && <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center text-xl font-bold">‹</button>}
          <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center text-xl font-bold">›</button>
        </div>
      )}
    </SliderBase>
  )
}

// B. 이미지 위 진한 화살표
function B() {
  const [page, setPage] = useState(0)
  return (
    <SliderBase page={page} setPage={setPage} label="B — 진한 화살표">
      {(p, prev, next) => (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200">
          <img src={images[p]} className="w-full h-auto block" alt="" />
          {p > 0 && <button onClick={prev} className="absolute left-0 top-0 h-full px-3 flex items-center" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.3), transparent)' }}><span className="text-white text-3xl font-black">‹</span></button>}
          <button onClick={next} className="absolute right-0 top-0 h-full px-3 flex items-center" style={{ background: 'linear-gradient(to left, rgba(0,0,0,0.3), transparent)' }}><span className="text-white text-3xl font-black">›</span></button>
        </div>
      )}
    </SliderBase>
  )
}

// C. 이미지 아래 버튼
function C() {
  const [page, setPage] = useState(0)
  return (
    <SliderBase page={page} setPage={setPage} label="C — 이미지 아래 버튼">
      {(p, prev, next) => (
        <div>
          <div className="rounded-2xl overflow-hidden border border-slate-200">
            <img src={images[p]} className="w-full h-auto block" alt="" />
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={prev} disabled={p === 0} className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 disabled:opacity-30 font-bold">‹</button>
            <div className="flex-1 flex items-center justify-center text-sm text-slate-400">{p + 1} / {images.length}</div>
            <button onClick={next} disabled={p === images.length - 1} className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 disabled:opacity-30 font-bold">›</button>
          </div>
        </div>
      )}
    </SliderBase>
  )
}

// D. 컬러 화살표 버튼
function D() {
  const [page, setPage] = useState(0)
  return (
    <SliderBase page={page} setPage={setPage} label="D — 컬러 화살표">
      {(p, prev, next) => (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200">
          <img src={images[p]} className="w-full h-auto block" alt="" />
          {p > 0 && (
            <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg" style={{ background: '#6366f1' }}>‹</button>
          )}
          <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg" style={{ background: '#6366f1' }}>›</button>
        </div>
      )}
    </SliderBase>
  )
}

// E. 상단 페이지 카운터 + 화살표
function E() {
  const [page, setPage] = useState(0)
  return (
    <SliderBase page={page} setPage={setPage} label="E — 상단 카운터 + 화살표">
      {(p, prev, next) => (
        <div>
          <div className="flex items-center justify-between mb-2">
            <button onClick={prev} disabled={p === 0} className="text-slate-400 disabled:opacity-30 font-bold px-2">← 이전</button>
            <span className="text-xs text-slate-400 font-medium">{p + 1} / {images.length}</span>
            <button onClick={next} disabled={p === images.length - 1} className="text-indigo-600 disabled:opacity-30 font-bold px-2">다음 →</button>
          </div>
          <div className="rounded-2xl overflow-hidden border border-slate-200">
            <img src={images[p]} className="w-full h-auto block" alt="" />
          </div>
        </div>
      )}
    </SliderBase>
  )
}

// F. 좌우 세로 탭
function F() {
  const [page, setPage] = useState(0)
  return (
    <SliderBase page={page} setPage={setPage} label="F — 세로 탭 썸네일">
      {(p, prev, next) => (
        <div className="flex gap-3">
          <div className="flex flex-col gap-1.5 justify-center">
            {images.map((src, i) => (
              <button key={i} onClick={() => setPage(i)} className="w-10 h-10 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0"
                style={{ borderColor: i === p ? '#6366f1' : '#e2e8f0' }}>
                <img src={src} className="w-full h-full object-cover" alt="" />
              </button>
            ))}
          </div>
          <div className="flex-1 rounded-2xl overflow-hidden border border-slate-200">
            <img src={images[p]} className="w-full h-auto block" alt="" />
          </div>
        </div>
      )}
    </SliderBase>
  )
}

export default function ArrowsPreview() {
  return (
    <main className="min-h-screen bg-slate-100 py-8 px-5 space-y-8">
      <div className="bg-slate-800 text-white text-center py-2 rounded-xl text-xs font-medium">
        🎨 슬라이더 화살표 스타일 비교 (내부 검토용)
      </div>
      <A /><B /><C /><D /><E /><F />
    </main>
  )
}
