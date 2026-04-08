'use client'

import { useState } from 'react'

const FREE_LIMIT = 7

const ebookData = [
  {
    bootcamp: '데이터 엔지니어 (테스트 10장)',
    images: Array.from({ length: 10 }, (_, i) => `/zunza/DE/DE_테스트_${String(i + 1).padStart(2, '0')}.png`),
  },
  {
    bootcamp: '데이터 엔지니어 (실제)',
    images: ['/zunza/DE/DE_커리큘럼.png', '/zunza/DE/DE_목차.png'],
  },
  {
    bootcamp: '데이터 분석',
    images: ['/zunza/DA/DA_커리큘럼.png', '/zunza/DA/DA_목차.png'],
  },
  {
    bootcamp: 'AI LLM',
    images: ['/zunza/AILLM/AILLM_커리큘럼.png', '/zunza/AILLM/AILLM_목차.png'],
  },
  {
    bootcamp: 'AI 서비스 개발자',
    images: ['/zunza/AISERVICE/AI서비스_커리큘럼.png', '/zunza/AISERVICE/AI서비스_목차.png'],
  },
]

function EbookSlider({ images }: { images: string[] }) {
  const [page, setPage] = useState(0)
  const [showPopup, setShowPopup] = useState(false)

  const handleNext = () => {
    if (page + 1 >= FREE_LIMIT) {
      setShowPopup(true)
    } else {
      setPage(page + 1)
    }
  }

  return (
    <div>
      {/* 팝업 */}
      {showPopup && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center pb-8 px-4"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowPopup(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl p-6 space-y-4 bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center space-y-2">
              <div className="text-4xl">📚</div>
              <p className="text-slate-900 font-bold text-lg">전체 전자책 보기</p>
              <p className="text-slate-500 text-sm">메타코드 사이트에서 전체 내용을 무료로 확인하세요</p>
            </div>
            <a
              href="https://metacodes.co.kr/"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center font-bold text-white py-3.5 rounded-2xl text-sm"
              style={{ background: 'linear-gradient(to right, #6366f1, #8b5cf6)' }}
            >
              메타코드 사이트로 이동 →
            </a>
            <button
              onClick={() => setShowPopup(false)}
              className="block w-full text-center text-slate-400 text-sm py-2"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 이미지 */}
      <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
        <img
          src={images[page]}
          alt={`전자책 ${page + 1}`}
          className="w-full h-auto"
          style={{ display: 'block' }}
        />
      </div>

      {/* 인디케이터 */}
      <div className="flex justify-center gap-2 mt-3 flex-wrap">
        {images.slice(0, FREE_LIMIT).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            className="w-2.5 h-2.5 rounded-full transition-all"
            style={{ background: i === page ? '#6366f1' : '#e2e8f0' }}
          />
        ))}
        {images.length > FREE_LIMIT && (
          <button
            onClick={() => setShowPopup(true)}
            className="w-2.5 h-2.5 rounded-full bg-slate-300"
          />
        )}
      </div>

      {/* 화살표 */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={() => setPage(Math.max(0, page - 1))}
          disabled={page === 0}
          className="flex-1 py-3 rounded-xl font-bold text-sm border border-slate-200 text-slate-500 disabled:opacity-30 transition-all"
        >
          ← 이전
        </button>
        <button
          onClick={handleNext}
          className="flex-1 py-3 rounded-xl font-bold text-sm transition-all"
          style={{ background: '#6366f1', color: '#fff' }}
        >
          {page + 1 >= FREE_LIMIT ? '전체 보기 →' : '다음 →'}
        </button>
      </div>

      <p className="text-center text-xs text-slate-400 mt-2">
        {page + 1} / {Math.min(images.length, FREE_LIMIT)} {images.length > FREE_LIMIT && `(+${images.length - FREE_LIMIT}장 더)`}
      </p>
    </div>
  )
}

export default function EbookPreview() {
  return (
    <main className="min-h-screen bg-slate-100 py-8 px-5 space-y-8">
      <div className="bg-slate-800 text-white text-center py-2 rounded-xl text-xs font-medium">
        📖 전자책 슬라이더 미리보기 — 7장까지 무료, 8장↑ 메타코드 이동
      </div>

      {ebookData.map((item) => (
        <div key={item.bootcamp} className="bg-white rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">📖</span>
            <div>
              <h2 className="font-bold text-slate-900">{item.bootcamp}</h2>
              <p className="text-xs text-slate-400">이미지 {item.images.length}장 · 무료 {Math.min(item.images.length, FREE_LIMIT)}장</p>
            </div>
          </div>
          <EbookSlider images={item.images} />
        </div>
      ))}
    </main>
  )
}
