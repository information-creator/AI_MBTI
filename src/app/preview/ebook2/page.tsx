'use client'

import { useState } from 'react'

const FREE_LIMIT = 7
const images = Array.from({ length: 10 }, (_, i) => `/zunza/DE/DE_테스트_${String(i + 1).padStart(2, '0')}.png`)
const chapters = [
  '1장 AI 시대의 생존 전략',
  '2장 데이터 엔지니어링 기초',
  '3장 SQL과 파이프라인 설계',
  '4장 클라우드 인프라 구축',
  '5장 실전 프로젝트 1',
  '6장 실전 프로젝트 2',
  '7장 포트폴리오 만들기',
  '8장 취업 전략',
  '9장 현직자 인터뷰',
  '10장 커리어 로드맵',
]

function Popup({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pb-8 px-4" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div className="w-full max-w-sm rounded-3xl p-6 space-y-4 bg-white" onClick={(e) => e.stopPropagation()}>
        <div className="text-center space-y-2">
          <div className="text-4xl">📚</div>
          <p className="text-slate-900 font-bold text-lg">전체 전자책 보기</p>
          <p className="text-slate-500 text-sm">메타코드 사이트에서 전체 내용을 무료로 확인하세요</p>
        </div>
        <a href="https://metacodes.co.kr/" target="_blank" rel="noopener noreferrer"
          className="block w-full text-center font-bold text-white py-3.5 rounded-2xl text-sm"
          style={{ background: 'linear-gradient(to right, #6366f1, #8b5cf6)' }}>
          메타코드 사이트로 이동 →
        </a>
        <button onClick={onClose} className="block w-full text-center text-slate-400 text-sm py-2">닫기</button>
      </div>
    </div>
  )
}

// A. 좌우 슬라이드
function TypeA() {
  const [page, setPage] = useState(0)
  return (
    <div>
      <div className="rounded-2xl overflow-hidden border border-slate-200">
        <img src={images[page]} alt="" className="w-full h-auto block" />
      </div>
      <div className="flex justify-center gap-2 mt-3">
        {images.slice(0, FREE_LIMIT).map((_, i) => (
          <button key={i} onClick={() => setPage(i)} className="w-2 h-2 rounded-full transition-all" style={{ background: i === page ? '#6366f1' : '#e2e8f0' }} />
        ))}
      </div>
      <div className="flex gap-3 mt-4">
        <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}
          className="flex-1 py-3 rounded-xl font-bold text-sm border border-slate-200 text-slate-500 disabled:opacity-30">← 이전</button>
        <button onClick={() => {
            if (page + 1 >= FREE_LIMIT) {
              window.open('https://metacodes.co.kr/', '_blank')
            } else {
              setPage(page + 1)
            }
          }}
          className="flex-1 py-3 rounded-xl font-bold text-sm text-white" style={{ background: '#6366f1' }}>
          {page + 1 >= FREE_LIMIT ? '전체 보기 →' : '다음 →'}
        </button>
      </div>
    </div>
  )
}

// B. 세로 스크롤 + 페이드아웃
function TypeB() {
  const [popup, setPopup] = useState(false)
  return (
    <div>
      {popup && <Popup onClose={() => setPopup(false)} />}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200" style={{ maxHeight: 600 }}>
        {images.slice(0, 3).map((src, i) => (
          <img key={i} src={src} alt="" className="w-full h-auto block" />
        ))}
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end pb-6"
          style={{ height: '50%', background: 'linear-gradient(to bottom, transparent 0%, white 70%)' }}>
          <button onClick={() => setPopup(true)}
            className="font-bold text-white px-6 py-3 rounded-xl text-sm"
            style={{ background: 'linear-gradient(to right, #6366f1, #8b5cf6)' }}>
            전체 보기 →
          </button>
        </div>
      </div>
    </div>
  )
}

// C. 썸네일 그리드
function TypeC() {
  const [selected, setSelected] = useState<number | null>(null)
  const [popup, setPopup] = useState(false)
  return (
    <div>
      {popup && <Popup onClose={() => setPopup(false)} />}
      {selected !== null && (
        <div className="fixed inset-0 z-40 flex items-center justify-center px-4 bg-black/70" onClick={() => setSelected(null)}>
          <img src={images[selected]} alt="" className="max-w-sm w-full rounded-2xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
      <div className="grid grid-cols-4 gap-2">
        {images.map((src, i) => {
          const locked = i >= FREE_LIMIT
          return (
            <button key={i} onClick={() => locked ? setPopup(true) : setSelected(i)}
              className="relative rounded-xl overflow-hidden border border-slate-200 aspect-square">
              <img src={src} alt="" className="w-full h-full object-cover" style={{ filter: locked ? 'blur(3px) brightness(0.6)' : 'none' }} />
              {locked && <div className="absolute inset-0 flex items-center justify-center text-white text-xl">🔒</div>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// D. 목차 리스트
function TypeD() {
  const [popup, setPopup] = useState(false)
  return (
    <div>
      {popup && <Popup onClose={() => setPopup(false)} />}
      <div className="flex flex-col gap-2">
        {chapters.map((ch, i) => {
          const locked = i >= FREE_LIMIT
          return (
            <button key={i} onClick={() => locked ? setPopup(true) : undefined}
              className="flex items-center gap-3 p-3.5 rounded-xl text-left transition-all"
              style={{ background: locked ? '#f8fafc' : '#f0fdf4', border: `1px solid ${locked ? '#e2e8f0' : '#bbf7d0'}` }}>
              <span className="text-lg">{locked ? '🔒' : '✅'}</span>
              <span className={`text-sm font-medium ${locked ? 'text-slate-400' : 'text-slate-800'}`}>{ch}</span>
              {locked && <span className="ml-auto text-xs text-slate-400">전체보기</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function EbookPreview2() {
  return (
    <main className="min-h-screen bg-slate-100 py-8 px-5 space-y-10">
      <div className="bg-slate-800 text-white text-center py-2 rounded-xl text-xs font-medium">
        📖 전자책 UI 방식 비교 (내부 검토용)
      </div>

      {[
        { label: 'A안 — 좌우 슬라이드', component: <TypeA /> },
        { label: 'B안 — 세로 스크롤 + 페이드아웃', component: <TypeB /> },
        { label: 'C안 — 썸네일 그리드', component: <TypeC /> },
        { label: 'D안 — 목차 리스트', component: <TypeD /> },
      ].map(({ label, component }) => (
        <div key={label} className="bg-white rounded-3xl overflow-hidden">
          <div className="bg-indigo-600 text-white text-center py-2 text-sm font-bold">{label}</div>
          <div className="p-6">{component}</div>
        </div>
      ))}
    </main>
  )
}
