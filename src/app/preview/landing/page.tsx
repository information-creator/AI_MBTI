import V1 from '../v1/page'
import V2 from '../v2/page'
import V3 from '../v3/page'
import V4 from '../v4/page'
import V5 from '../v5/page'
import V6 from '../v6/page'
import V7 from '../v7/page'
import V8 from '../v8/page'
import V9 from '../v9/page'
import V10 from '../v10/page'

const variants = [
  {
    id: 'v1',
    label: 'V1 공포소구',
    desc: '다크모드 + "2년 안에 사라집니다" + 위험도 미터',
    color: '#ef4444',
    Component: V1,
    why: '손실 회피(Loss Aversion) 심리 활용',
    evidence: [
      'Kahneman/Tversky 전망 이론 — 손실 프레이밍이 이득 프레이밍 대비 행동 전환율 2배 (WhichTestWon A/B 검증)',
      '카운트다운/긴급성 요소 — 전환율 평균 8.6% 상승, 최대 332% (CXL Institute)',
      '긴급성 카피("Limited time") — CTR 14~22% 상승 (ConversionXL)',
      '위험도 시각화 — 보험/보안 업종에서 정적 페이지 대비 참여율 18~25% 상승 (Optimizely)',
      '다크 배경 — 테크/게임 타깃 체류시간 10~15% 증가 (UXCam)',
    ],
    caveat: '가짜 긴급성은 역효과 — 소비자 40%가 조작된 긴급성에 불신감 (Baymard Institute)',
    fit: '★★★☆ — AIMBTI의 "AI 대체 위험" 메시지와 자연스럽게 연결. 단, 과도한 공포는 이탈 유발 가능.',
  },
  {
    id: 'v2',
    label: 'V2 호기심',
    desc: '보라-핑크 그라데이션 + "나는 어떤 유형?"',
    color: '#a855f7',
    Component: V2,
    why: '호기심 갭(Curiosity Gap) + 퀴즈 심리 활용',
    evidence: [
      '퀴즈형 랜딩 — 일반 랜딩 전환율 3~5% vs 퀴즈형 30~50% (LeadQuizzes / Outgrow)',
      '인터랙티브 콘텐츠 — 정적 콘텐츠 대비 전환 2배 (Demand Metric)',
      '호기심 갭 헤드라인 — 직접적 헤드라인 대비 CTR 5~25% 상승 (Conductor)',
      '퀴즈 완료율 — 잘 설계된 퀴즈는 60~85% 완료 (Typeform / Outgrow)',
      '체류시간 — 퀴즈 페이지 체류시간 정적 페이지 대비 2~3배 (CMI)',
    ],
    caveat: '없음 — 퀴즈 서비스와 가장 자연스러운 조합.',
    fit: '★★★★★ — AIMBTI가 퀴즈 서비스이므로 가장 적합. "나는 어떤 유형?" 질문이 핵심 후크.',
  },
  {
    id: 'v3',
    label: 'V3 사회적 증거',
    desc: '후기 카드 + "가장 많이 공유한 테스트"',
    color: '#3b82f6',
    Component: V3,
    why: '밴드왜건 효과(Bandwagon Effect) + 사회적 증거',
    evidence: [
      '후기/추천사 — 랜딩 전환율 34% 상승 (VWO)',
      '별점 표시 — CTA 근처 별점 노출 시 전환 4.6~35% 상승 (Spiegel Research Center)',
      '사용자 수 표시("50,000명 참여") — 가입율 12~15% 상승 (Basecamp 사례)',
      '리뷰 영향력 — 소비자 92%가 구매 전 리뷰 확인 (Spiegel Research)',
      '신뢰 배지/로고 — 보안 배지 전환율 42% 증가 (Baymard Institute)',
    ],
    caveat: '실제 데이터 기반이어야 효과적. 조작된 후기는 신뢰도 급락.',
    fit: '★★★★ — 실제 참여 수치가 쌓이면 강력. 초기에는 후기 콘텐츠가 부족할 수 있음.',
  },
  {
    id: 'v4',
    label: 'V4 극심플',
    desc: '화이트 + 텍스트만 + "나는 살아남을까?"',
    color: '#0f172a',
    Component: V4,
    why: '선택의 역설 제거 + 인지 부하 최소화',
    evidence: [
      'GNB 제거 — 전환율 28~100% 상승 (VWO / HubSpot)',
      '단일 CTA vs 다중 — 단일 CTA 전환 266% 우위 (Unbounce)',
      '요소 축소(10개→3~5개) — 전환 20~30% 상승 (Unbounce 벤치마크)',
      'CTA 주변 여백 20% 확대 — 클릭률 20% 상승 (Google 내부 연구, CXL 인용)',
      'B2C 리드젠 100단어 미만 — 500단어 이상 대비 전환 50% 우위 (Unbounce 2024)',
      '선택지 1개 vs 3개+ — 결정 마비 감소, 전환 25% 상승 (Columbia Univ.)',
    ],
    caveat: '정보가 너무 적으면 신뢰 부족. 고관여 상품에는 부적합할 수 있음.',
    fit: '★★★★ — 1분짜리 무료 테스트에 최적. 모바일에서 로딩 빠르고 즉시 행동 유도.',
  },
  {
    id: 'v5',
    label: 'V5 스토리텔링',
    desc: '실화 기반 마케터 전환 스토리',
    color: '#f97316',
    Component: V5,
    why: '내러티브 몰입 + 감정적 동일시',
    evidence: [
      '내러티브 랜딩 — 체류시간 30~50% 증가, 전환 5~20% 상승 (Stanford Web Credibility)',
      '감정적 스토리텔링 — 행동 의지 2~3배 증가 (Carnegie Mellon, 식별 가능한 피해자 효과)',
      '브랜드 스토리 — 55%의 소비자가 스토리에 공감하면 구매 의향 상승 (Headstream)',
      'PAS 프레임워크(문제→자극→해결) — 피처 리스트 대비 전환 15~30% 우위 (Copy Hackers A/B)',
      '영상 스토리 — 스토리 기반 영상 포함 시 전환 80~86% 상승 (EyeView)',
    ],
    caveat: '스토리가 길면 모바일 이탈 증가. 스크롤 깊이 모니터링 필요.',
    fit: '★★★☆ — 감정적 공감이 강하지만 스크롤이 길어 모바일 이탈 위험. 타깃이 명확할 때 효과적.',
  },
  {
    id: 'v6',
    label: 'V6 게이미피케이션',
    desc: '게임UI + 미션/레벨/스탯',
    color: '#10b981',
    Component: V6,
    why: '게임 메커닉으로 참여 동기 부여',
    evidence: [
      '프로그레스 바 — 폼 완료율 28~40% 상승 (LinkedIn / ConversionXL)',
      '게이미피케이션 요소(배지, 포인트, 레벨) — 참여 48% 상승, 전환 15~20% 상승 (Gigya)',
      '멀티스텝 폼 + 진행 표시 — 단일 긴 폼 대비 전환 14% 상승 (Venture Harbour)',
      '"80% 완료!" 같은 마일스톤 메시지 — 이탈 20~30% 감소 (Nir Eyal Hooked)',
      '스크래치/공개 메커닉 — 일반 CTA 대비 참여율 20~30% vs 2~5% (Gamify)',
    ],
    caveat: '과도한 게이미피케이션은 "유치하다" 인식 유발. 타깃 연령대 고려 필요.',
    fit: '★★★★ — AIMBTI의 20문항 테스트와 게임 메커닉이 자연스럽게 결합. 완료율 향상 기대.',
  },
  {
    id: 'v7',
    label: 'V7 비교형',
    desc: 'Before/After + "어느 쪽인가요?"',
    color: '#f59e0b',
    Component: V7,
    why: '대비 효과(Contrast Effect)로 가치 인식 극대화',
    evidence: [
      'Before/After 비주얼 — 참여 50~70% 상승, 전환 25% 상승 (VWO, 헬스/뷰티)',
      '비교표 — 사용자 42%가 제품 평가 시 비교표 선호 (Baymard Institute)',
      '"우리 vs 없이" 프레이밍 — 일반 베네핏 리스트 대비 전환 10~20% 상승 (CXL)',
      '추천 플랜 하이라이트 — 해당 플랜 선택률 30~40% 상승 (Price Intelligently)',
      '인터랙티브 슬라이더(Before/After) — 체류시간 40~60% 증가 (CXL)',
    ],
    caveat: '비교 대상이 현실적이어야 효과적. 비현실적 비교는 신뢰 저하.',
    fit: '★★★☆ — "AI 아는 사람 vs 모르는 사람" 프레이밍이 직관적. 직업별 구체적 비교가 설득력.',
  },
  {
    id: 'v8',
    label: 'V8 뉴스형',
    desc: '속보 스타일 + 기사 레이아웃',
    color: '#64748b',
    Component: V8,
    why: '에디토리얼 신뢰 + 네이티브 광고 효과',
    evidence: [
      '에디토리얼/기사형 랜딩 — 일반 세일즈 페이지 대비 CTR 20~50% 상승 (Taboola / Outbrain)',
      '네이티브 광고 — 배너 대비 조회수 53% 상승, 구매 의향 18% 상승 (Sharethrough / IPG)',
      '데이터/통계 기반 콘텐츠 — 신뢰도 및 공유율 38% 상승 (BuzzSumo)',
      '리포트 형식(차트, 데이터 시각화) — 텍스트만 있는 페이지 대비 공유 2.5배 (OkDork / BuzzSumo)',
      '"As seen in" 미디어 로고 — 신뢰 15~25% 상승, 전환 10~15% 상승 (VWO)',
    ],
    caveat: 'FTC 광고 표시 규정 준수 필요. 비공개 기사형 광고는 규제 리스크.',
    fit: '★★★☆ — 뉴스 피드에서 유입되는 트래픽에 효과적. 검색/SNS 트래픽에는 다소 이질감.',
  },
  {
    id: 'v9',
    label: 'V9 대화형',
    desc: 'AI 상담사 채팅 UI',
    color: '#6366f1',
    Component: V9,
    why: '대화형 마케팅 + 즉각적 응답 기대감',
    evidence: [
      '챗봇 기반 랜딩 — 일반 폼 대비 전환 2~3배 (Drift 2023)',
      '대화형 폼(한 번에 하나씩) — 기존 폼 대비 완료율 40% 상승 (Typeform)',
      '라이브 채팅 — 전환 20% 상승, 만족도 73% 상승 (Forrester)',
      '즉시 응답 기대 — 소비자 82%가 즉각 응답 기대 (HubSpot 2024)',
      '메시지 CTA vs 폼 — 아시아/유럽 시장에서 응답률 35~45% 상승 (Meta Business)',
    ],
    caveat: '실제 대화가 아니면 기대와 현실의 괴리. 클릭 후 일반 테스트로 전환 시 이질감.',
    fit: '★★★★ — 카카오톡 익숙한 한국 사용자에게 친숙. 챗봇 느낌이 AI 서비스와 맥락 일치.',
  },
  {
    id: 'v10',
    label: 'V10 카드형',
    desc: '캐릭터 선공개 + "이 중에 당신은?"',
    color: '#06b6d4',
    Component: V10,
    why: '결과 미리보기로 호기심 극대화 (Zeigarnik 효과)',
    evidence: [
      '결과 미리보기 — 퀴즈/테스트 시작률 30~50% 상승 (Outgrow / Interact)',
      '카드 기반 레이아웃 — 리스트 대비 모바일 CTR 17% 상승 (Google Material Design)',
      '비주얼 미리보기/썸네일 — 텍스트 대비 참여 94% 상승 (MDG Advertising)',
      '4~6개 결과 유형 티저 — 테스트 시작률 20~35% 상승 (BuzzFeed 내부 데이터)',
      '이미지 포함 랜딩 — 이미지 없는 랜딩 대비 전환 40% 우위 (VWO)',
    ],
    caveat: '너무 많은 유형을 보여주면 선택 마비. 4~6개가 최적.',
    fit: '★★★★★ — AIMBTI의 16유형 캐릭터 자산 활용. "이 중에 나는?" 호기심이 테스트 시작 직결.',
  },
]

export default function LandingPreviewPage() {
  return (
    <div className="min-h-screen bg-slate-200">
      {/* 고정 네비게이션 */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200 px-4 py-3 shadow-sm">
        <h1 className="text-lg font-black text-slate-800 mb-2">랜딩 페이지 A/B 테스트 변형 10종</h1>
        <div className="flex flex-wrap gap-1.5">
          {variants.map(v => (
            <a
              key={v.id}
              href={`#${v.id}`}
              className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: v.color }} />
              {v.label}
            </a>
          ))}
        </div>
      </nav>

      {/* 일반 벤치마크 */}
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-2">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <p className="text-sm font-black text-slate-800 mb-3">일반 랜딩 페이지 벤치마크</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-lg font-black text-slate-800">2.35%</p>
              <p>평균 전환율 (WordStream)</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-lg font-black text-slate-800">4.3%</p>
              <p>중앙값 전환율 (Unbounce 2024)</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-lg font-black text-red-500">+90%</p>
              <p>로딩 1초 추가 시 이탈 확률 증가 (Google)</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-lg font-black text-emerald-600">+266%</p>
              <p>단일 CTA vs 다중 CTA 전환 차이 (Unbounce)</p>
            </div>
          </div>
        </div>
      </div>

      {/* 랜딩 페이지 목록 */}
      <div className="max-w-2xl mx-auto py-4 px-4 space-y-10">
        {variants.map(v => (
          <section key={v.id} id={v.id}>
            {/* 분석 카드 */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm mb-3">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ background: v.color }} />
                <p className="text-base font-black text-slate-800">{v.label}</p>
                <span className="ml-auto text-xs font-bold text-slate-400">{v.fit.slice(0, 5)}</span>
              </div>

              {/* 전략 */}
              <p className="text-sm font-bold text-slate-700 mb-1">전략: {v.why}</p>
              <p className="text-xs text-slate-400 mb-3">{v.desc}</p>

              {/* 데이터 근거 */}
              <div className="mb-3">
                <p className="text-xs font-bold text-indigo-600 mb-1.5">데이터 근거</p>
                <ul className="space-y-1">
                  {v.evidence.map((e, i) => (
                    <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                      <span className="text-indigo-400 shrink-0 mt-0.5">•</span>
                      <span>{e}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 주의점 */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-3">
                <p className="text-xs text-amber-700">
                  <strong>주의:</strong> {v.caveat}
                </p>
              </div>

              {/* 적합도 */}
              <div className="bg-slate-50 rounded-lg px-3 py-2">
                <p className="text-xs text-slate-600">
                  <strong>AIMBTI 적합도:</strong> {v.fit}
                </p>
              </div>
            </div>

            {/* 실제 렌더링 */}
            <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-300 max-w-sm mx-auto">
              <v.Component />
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
