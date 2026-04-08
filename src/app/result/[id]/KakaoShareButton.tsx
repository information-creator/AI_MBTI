'use client'

import { TypeCode, typeInfo } from '@/lib/quiz'
import { gtagEvent } from '@/lib/ga'

type Props = {
  typeCode: TypeCode
  aiScore: number
  resultId: string
}

export default function KakaoShareButton({ typeCode, aiScore, resultId }: Props) {
  const info = typeInfo[typeCode]

  function handleKakaoShare() {
    const BASE = window.location.origin
    const IMAGE_BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aimbti-seven.vercel.app'
    const shareUrl = `${BASE}/result/${resultId}`
    const K = window.Kakao
    if (K) {
      if (!K.isInitialized()) K.init(process.env.NEXT_PUBLIC_KAKAO_APP_KEY ?? '')
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
    <button
      onClick={handleKakaoShare}
      className="flex items-center justify-center gap-2 rounded-2xl font-bold text-base transition-all hover:opacity-90 active:scale-[0.98]"
      style={{ background: '#FEE500', color: '#3C1E1E', height: 47 }}
    >
      💛 카카오톡으로 공유하기
    </button>
  )
}
