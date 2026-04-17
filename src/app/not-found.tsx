import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white px-5 text-center">
      <p className="text-6xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
        404
      </p>
      <h1 className="text-xl font-black text-slate-900 mb-2">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="text-sm text-slate-400 mb-8">
        요청하신 페이지가 존재하지 않거나 이동되었습니다
      </p>
      <div className="flex gap-3">
        <Link
          href="/"
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm px-6 py-3 rounded-full transition-all"
        >
          AI 생존유형 진단하기
        </Link>
      </div>
      <footer className="absolute bottom-6 text-slate-300 text-xs">
        © 2026 AI-MBTI ·{' '}
        <a href="https://metacodes.co.kr/" className="hover:text-slate-500 transition-colors">
          metacodes.co.kr
        </a>
      </footer>
    </main>
  )
}
