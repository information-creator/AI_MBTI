'use client'

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white px-5 text-center">
      <p className="text-6xl font-black text-red-500 mb-4">!</p>
      <h1 className="text-xl font-black text-slate-900 mb-2">
        문제가 발생했습니다
      </h1>
      <p className="text-sm text-slate-400 mb-8">
        일시적인 오류입니다. 다시 시도해주세요.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm px-6 py-3 rounded-full transition-all"
        >
          다시 시도
        </button>
        <a
          href="/"
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm px-6 py-3 rounded-full transition-all"
        >
          홈으로
        </a>
      </div>
      <footer className="absolute bottom-6 text-slate-300 text-xs">
        © 2026 AI-역량진단 ·{' '}
        <a href="https://metacodes.co.kr/" className="hover:text-slate-500 transition-colors">
          metacodes.co.kr
        </a>
      </footer>
    </main>
  )
}
