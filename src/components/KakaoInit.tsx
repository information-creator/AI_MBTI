'use client'

import Script from 'next/script'

export default function KakaoInit({ kakaoKey }: { kakaoKey: string }) {
  return (
    <Script
      src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
      integrity="sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4"
      crossOrigin="anonymous"
      strategy="afterInteractive"
      onLoad={() => {
        const K = window.Kakao
        if (K && !K.isInitialized()) K.init(kakaoKey)
      }}
    />
  )
}
