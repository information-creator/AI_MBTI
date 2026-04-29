'use client'

import { useState } from 'react'
import { trackEvent } from '@/lib/track'
import { gtagEvent, gtagConversion } from '@/lib/ga'
import { fbqLeadOnce } from '@/lib/meta'

const SHEET_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbyacRd_-i38hszbE6Ri1lehsiADFnw2DH8eYaxYsgGbHVKiWDwDp0cvC1ry-lAzD5rW/exec'

type Props = {
  bootcampName: string
  typeCode: string
  aiScore: number
  source: 'ebook_inline' | 'floating_bottom'
}

export default function LeadForm({ bootcampName, typeCode, aiScore, source }: Props) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [agree, setAgree] = useState(false)
  const [showAgreementDetail, setShowAgreementDetail] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const isValid = name.trim().length > 0 && /^010-?\d{3,4}-?\d{4}$/.test(phone.replace(/\s/g, '')) && agree

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid || submitting) return
    setSubmitting(true)

    const cleanPhone = phone.replace(/[^\d]/g, '')

    // Supabase events — fire-and-forget (trackEvent 자체가 sync void)
    trackEvent('lead_submit', typeCode, {
      name,
      phone: cleanPhone,
      ai_score: aiScore,
      bootcamp: bootcampName,
      source,
      variant: 'main',
    })

    // Google Sheets webhook — fire-and-forget. no-cors라 응답 못 읽음 = await 무의미.
    // 누락 시 Supabase events에서 복구 가능.
    fetch(SHEET_WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({
        name,
        phone: cleanPhone,
        typeCode,
        aiScore,
        bootcamp: bootcampName,
        source,
      }),
    }).catch(err => console.warn('[LeadForm] sheet webhook failed', err))

    gtagEvent('lead_submit', { type_code: typeCode, source, bootcamp: bootcampName })
    gtagConversion('lead_submit')
    fbqLeadOnce({ content_name: `lead_form_${source}`, type_code: typeCode })

    setSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 mt-3 text-center animate-fade-in-up">
        <p className="text-3xl mb-2">✅</p>
        <p className="text-emerald-700 font-black text-lg mb-1">신청이 완료되었습니다</p>
        <p className="text-emerald-600 text-sm">빠른 시일 내에 입력하신 번호로 안내 도와드리겠습니다.</p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-slate-50 border border-slate-200 p-5 mt-3 animate-fade-in-up"
    >
      <div className="text-center mb-4">
        <p className="text-slate-900 font-black text-lg">{bootcampName} 전자책 무료받기</p>
        <p className="text-slate-500 text-xs mt-1">정보를 입력해 주시면 빠르게 안내 도와드리겠습니다.</p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-slate-700 text-sm font-bold mb-1">성함</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="성함을 입력해주세요"
            className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-slate-700 text-sm font-bold mb-1">전화번호</label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="010-0000-0000"
            className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-indigo-500"
            required
          />
        </div>

        <label className="flex items-start gap-2 cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={agree}
            onChange={e => setAgree(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-indigo-600 flex-shrink-0"
          />
          <span className="text-slate-700 text-xs leading-relaxed">
            <span className="font-bold">[필수]</span> 개인정보 수집 및 이용에 동의합니다.{' '}
            <button
              type="button"
              onClick={() => setShowAgreementDetail(v => !v)}
              className="text-indigo-600 underline ml-1"
            >
              {showAgreementDetail ? '접기' : '자세히'}
            </button>
          </span>
        </label>

        {showAgreementDetail && (
          <div className="text-slate-600 text-[11px] leading-relaxed bg-white border border-slate-200 rounded-lg p-3 max-h-48 overflow-y-auto">
            <p className="font-bold mb-2">[개인정보 수집 및 이용 동의 안내]</p>
            <p className="mb-2">
              본인은 아래의 내용을 숙지하였으며, 「개인정보 보호법」 등 관련 법령에 따라 메타코드가 관리하는 [{bootcampName} 부트캠프] 과정의 운영 및 관리를 위해 개인정보를 수집·이용하는 것에 동의합니다. 성함 및 연락처 입력 시, 상담 진행에 활용되는 홍보 및 안내 문자 수신에 동의하신 것으로 간주됩니다.
            </p>
            <p className="font-bold mt-2">1. 수집·이용 목적</p>
            <p>· 교육 과정 관련 안내 및 소통, 수료 후 추적관리, 향후 유사 과정 정보 제공</p>
            <p className="font-bold mt-2">2. 수집·이용 항목</p>
            <p>· 개인식별정보: 이름, 휴대폰번호</p>
            <p className="font-bold mt-2">3. 보유 및 이용 기간</p>
            <p>· 수집일로부터 1년간 보관 (또는 삭제 요청 시까지)</p>
            <p className="font-bold mt-2">4. 동의 거부 권리</p>
            <p>· 동의를 거부할 수 있으나, 필수 항목 미동의 시 교육과정 참여가 제한될 수 있습니다.</p>
          </div>
        )}

        <button
          type="submit"
          disabled={!isValid || submitting}
          className="w-full py-3.5 rounded-xl font-black text-white text-base transition-all disabled:opacity-50"
          style={{ background: '#6c47ff' }}
        >
          {submitting ? '처리 중...' : '전자책 무료받기'}
        </button>
      </div>
    </form>
  )
}
