import Link from 'next/link'

export const metadata = {
  title: '개인정보처리방침 | AIMBTI',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="px-5 py-4 flex items-center justify-between border-b border-slate-100">
        <Link href="/" className="text-slate-900 font-bold text-lg">
          AI<span className="text-indigo-600">MBTI</span>
        </Link>
      </header>

      <main className="px-5 py-8 max-w-2xl mx-auto space-y-6 text-sm text-slate-700 leading-relaxed">
        <h1 className="text-2xl font-black text-slate-900">개인정보처리방침</h1>
        <p className="text-slate-500 text-xs">최종 수정일: 2026년 4월 5일</p>

        <section className="space-y-2">
          <h2 className="font-bold text-slate-900">1. 수집하는 개인정보 항목</h2>
          <p>메타코드(이하 &quot;회사&quot;)는 부트캠프 상담 및 혜택 제공을 위해 아래 정보를 수집합니다.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>전화번호 (필수)</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-slate-900">2. 수집 목적</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>부트캠프 무료 커리큘럼 안내 및 1:1 상담 연락</li>
            <li>쿠폰 발급 및 오픈채팅 혜택 제공</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-slate-900">3. 보유 및 이용 기간</h2>
          <p>수집일로부터 1년. 이용 목적 달성 또는 동의 철회 시 즉시 파기합니다.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-slate-900">4. 제3자 제공</h2>
          <p>회사는 수집한 개인정보를 제3자에게 제공하지 않습니다.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-slate-900">5. 동의 거부 권리</h2>
          <p>
            개인정보 수집에 동의하지 않을 권리가 있습니다. 다만, 동의 거부 시 쿠폰 발급 및 부트캠프 상담 신청이 제한될 수 있습니다.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-slate-900">6. 문의</h2>
          <p>개인정보 관련 문의는 아래로 연락해주세요.</p>
          <p>이메일: information@mcode.co.kr</p>
        </section>

        <div className="pt-4">
          <Link href="/" className="text-indigo-600 text-sm font-semibold hover:text-indigo-500">
            ← 홈으로 돌아가기
          </Link>
        </div>
      </main>
    </div>
  )
}
