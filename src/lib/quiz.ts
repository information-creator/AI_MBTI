export type Question = {
  id: number
  part: 'A' | 'B' | 'C' | 'D' | 'E'
  text: string
  options: { label: string; value: string }[]
}

export const questions: Question[] = [
  // 파트 A — 업무방식 (H vs T)
  {
    id: 1,
    part: 'A',
    text: '혼자 집중할 때 vs 팀과 협업할 때\n어느 쪽이 더 잘 되나요?',
    options: [
      { label: '혼자 집중할 때 훨씬 잘 된다', value: 'H' },
      { label: '팀과 함께할 때 더 잘 된다', value: 'T' },
    ],
  },
  {
    id: 2,
    part: 'A',
    text: '새 프로젝트를 시작할 때?',
    options: [
      { label: '혼자 먼저 구상하고 정리한다', value: 'H' },
      { label: '팀 미팅부터 잡고 함께 방향을 잡는다', value: 'T' },
    ],
  },
  {
    id: 3,
    part: 'A',
    text: '가장 생산적인 환경은?',
    options: [
      { label: '조용한 1인실 — 방해 없이 몰입', value: 'H' },
      { label: '활기찬 오픈 오피스 — 자극받으며 일함', value: 'T' },
    ],
  },
  {
    id: 4,
    part: 'A',
    text: '문제가 생기면?',
    options: [
      { label: '혼자 끝까지 파고들어 해결한다', value: 'H' },
      { label: '바로 동료에게 물어보고 같이 푼다', value: 'T' },
    ],
  },

  // 파트 B — AI 활용도 (A vs S)
  {
    id: 5,
    part: 'B',
    text: '업무에 AI 도구 활용 빈도는?',
    options: [
      { label: '매일 필수 — AI 없이는 일 못 함', value: 'A' },
      { label: '가끔 쓰거나 거의 안 쓴다', value: 'S' },
    ],
  },
  {
    id: 6,
    part: 'B',
    text: 'AI가 내 일의 몇 %를 대신할 수 있을 것 같나요?',
    options: [
      { label: '50% 이상 — AI가 많은 부분을 커버 가능', value: 'A' },
      { label: '30% 미만 — 내 일은 내가 해야 한다', value: 'S' },
    ],
  },
  {
    id: 7,
    part: 'B',
    text: 'AI 뉴스를 접하면?',
    options: [
      { label: '바로 업무에 적용 시도해본다', value: 'A' },
      { label: '일단 지켜본다 — 검증되면 쓸 것', value: 'S' },
    ],
  },
  {
    id: 8,
    part: 'B',
    text: '나의 핵심 경쟁력은?',
    options: [
      { label: 'AI 활용 능력 — 도구를 잘 쓰는 것', value: 'A' },
      { label: '사람 감각 — 관계와 직관', value: 'S' },
    ],
  },

  // 파트 C — 강점영역 (L vs C)
  {
    id: 9,
    part: 'C',
    text: '칭찬받는 이유는?',
    options: [
      { label: '정확하고 논리적이라는 말을 듣는다', value: 'L' },
      { label: '창의적이고 감각적이라는 말을 듣는다', value: 'C' },
    ],
  },
  {
    id: 10,
    part: 'C',
    text: '보고서를 작성할 때?',
    options: [
      { label: '데이터와 수치 위주로 구성한다', value: 'L' },
      { label: '스토리와 감성 위주로 풀어낸다', value: 'C' },
    ],
  },
  {
    id: 11,
    part: 'C',
    text: '문제를 해결하는 방식은?',
    options: [
      { label: '원인을 분석하고 논리적으로 해결책을 찾는다', value: 'L' },
      { label: '직관적으로 새로운 아이디어를 던진다', value: 'C' },
    ],
  },
  {
    id: 12,
    part: 'C',
    text: '나를 한 단어로 표현하면?',
    options: [
      { label: '분석가', value: 'L' },
      { label: '크리에이터', value: 'C' },
    ],
  },

  // 파트 D — 실행속도 (F vs P)
  {
    id: 13,
    part: 'D',
    text: '일 처리 스타일은?',
    options: [
      { label: '일단 빠르게 시작하고 고쳐나간다', value: 'F' },
      { label: '완벽히 준비한 다음 시작한다', value: 'P' },
    ],
  },
  {
    id: 14,
    part: 'D',
    text: '마감이 다가오면?',
    options: [
      { label: '이미 다 끝내놨다', value: 'F' },
      { label: '막판에 몰아서 완성한다', value: 'P' },
    ],
  },
  {
    id: 15,
    part: 'D',
    text: '새 기술이나 툴을 접하면?',
    options: [
      { label: '일단 써본다 — 쓰면서 배운다', value: 'F' },
      { label: '매뉴얼 다 읽고 이해한 다음 쓴다', value: 'P' },
    ],
  },
  {
    id: 16,
    part: 'D',
    text: '완성도 vs 속도, 어느 쪽이 더 중요한가요?',
    options: [
      { label: '속도가 더 중요하다 — 일단 내놓고 봐야', value: 'F' },
      { label: '완성도가 더 중요하다 — 낼 거면 제대로', value: 'P' },
    ],
  },

  // 파트 E — 퇴근 보너스 (유머용, 결과 유형에 영향 없음)
  {
    id: 17,
    part: 'E',
    text: '이번 주 평균 퇴근 시간은?',
    options: [
      { label: '칼퇴! 6시 이전', value: 'E1_EARLY' },
      { label: '그래도 7~8시', value: 'E1_MID' },
      { label: '9~10시... 야근 루틴', value: 'E1_LATE' },
      { label: '자정 이후 — 퇴근이란 개념이 없다', value: 'E1_ZOMBIE' },
    ],
  },
  {
    id: 18,
    part: 'E',
    text: '주말에 업무 연락이 오면?',
    options: [
      { label: '무조건 무시 — 나의 시간은 나의 것', value: 'E2_IGNORE' },
      { label: '눈팅은 하지만 답장은 월요일에', value: 'E2_DELAY' },
      { label: '보면 바로 답장하게 됨... 습관이 됐다', value: 'E2_REPLY' },
      { label: '주말도 출근한다 이미', value: 'E2_WORK' },
    ],
  },
  {
    id: 19,
    part: 'E',
    text: '야근의 이유는?',
    options: [
      { label: '일이 많아서 — 어쩔 수 없다', value: 'E3_BUSY' },
      { label: '완벽주의 때문에 — 내가 문제다', value: 'E3_PERFECT' },
      { label: '눈치 때문에 — 문화가 문제다', value: 'E3_CULTURE' },
      { label: '재밌어서 — 일이 좋다', value: 'E3_FUN' },
    ],
  },
  {
    id: 20,
    part: 'E',
    text: '"AI가 야근을 없애줄 수 있다"는 말에?',
    options: [
      { label: '제발요 당장 도입해주세요', value: 'E4_PLEASE' },
      { label: '반반 — 일은 줄겠지만 다른 일이 생긴다', value: 'E4_MAYBE' },
      { label: '야근은 문화가 문제지 AI가 답이 아님', value: 'E4_CULTURE' },
      { label: '이미 AI 써도 야근 중', value: 'E4_ALREADY' },
    ],
  },
]

export type TypeCode =
  | 'HALF' | 'HALP' | 'HACF' | 'HACP'
  | 'HSLF' | 'HSLP' | 'HSCF' | 'HSCP'
  | 'TALF' | 'TALP' | 'TACF' | 'TACP'
  | 'TSLF' | 'TSLP' | 'TSCF' | 'TSCP'

export type BootcampType = 'AI LLM' | '데이터 분석' | '데이터 엔지니어' | 'AI 서비스'

export type ResultData = {
  typeCode: TypeCode
  aiScore: number
  overtimeLevel: string
  overtimeComment: string
}

export const bootcampInfo: Record<
  BootcampType,
  { title: string; color: string; reason: string }
> = {
  'AI LLM': {
    title: 'AI LLM 부트캠프',
    color: '#6366f1',
    reason: 'ChatGPT를 도구로 쓰는 사람 vs 도구가 되는 사람',
  },
  '데이터 분석': {
    title: '데이터 분석 부트캠프',
    color: '#0ea5e9',
    reason: '당신의 강점 + 데이터 = AI 시대 생존 패키지',
  },
  '데이터 엔지니어': {
    title: '데이터 엔지니어 부트캠프',
    color: '#10b981',
    reason: 'AI가 대체 못 하는 파이프라인 설계자로 전환하세요',
  },
  'AI 서비스': {
    title: 'AI 서비스 부트캠프',
    color: '#f59e0b',
    reason: 'AI 서비스를 만드는 사람이 AI에 대체되지 않습니다',
  },
}

export const typeInfo: Record<
  TypeCode,
  {
    title: string
    subtitle: string
    emoji: string
    color: string
    aiScore: number
    bootcamp: BootcampType
    bootcampReason: string
    description: string
    aiTip: string
    jobs: [string, string, string]
    threat: string
    scoreComment: (score: number) => string
  }
> = {
  HALF: {
    title: 'AI 시대 지휘관',
    subtitle: '빠르고 혼자인데 AI까지 쓴다',
    emoji: '🚀',
    color: '#6366f1',
    aiScore: 28,
    bootcamp: 'AI LLM',
    bootcampReason: 'AI를 이미 쓰는 당신, LLM을 직접 다루면 경쟁자가 없어집니다.',
    description:
      'AI를 누구보다 빠르게 씁니다.\n하지만 방향이 없으면 AI도 무기가 아닙니다.\n\nLLM을 직접 설계하면, 당신은 지휘관이 됩니다.',
    aiTip:
      'ChatGPT + Notion AI로 보고서 자동화, Claude로 코드 리뷰 — 지금 당장 도입하세요. 당신의 직관과 AI의 속도가 합쳐지면 무적입니다.',
    jobs: ['AI 프로덕트 매니저', '전략 컨설턴트', '스타트업 창업자'],
    threat: 'AI를 써도 방향을 못 잡으면 더 빠르게 도태됩니다.',
    scoreComment: (s) =>
      s <= 30
        ? '대체 걱정 제로! AI를 부리는 지휘관입니다.'
        : s <= 60
        ? 'AI 활용 방향을 잡으면 무적이 됩니다.'
        : '지금 LLM 과정에 투자하면 역전 가능합니다!',
  },
  HALP: {
    title: '완벽주의 AI 설계자',
    subtitle: '느리지만 정확한 AI 아키텍트',
    emoji: '🔭',
    color: '#0ea5e9',
    aiScore: 25,
    bootcamp: '데이터 엔지니어',
    bootcampReason: '꼼꼼함과 AI 활용을 합치면 파이프라인 아키텍트로 전환 가능합니다.',
    description:
      'AI를 씁니다. 그것도 제대로 검증하면서 씁니다.\n\n하지만 속도가 느리면 기회를 놓칠 수 있습니다.\n데이터 파이프라인을 설계하는 역량이 당신을 대체 불가로 만듭니다.',
    aiTip:
      'AI 도구를 테스트하는 습관이 강점입니다. 자동화 파이프라인 설계에 이 역량을 쏟으세요.',
    jobs: ['데이터 엔지니어', 'ML 엔지니어', 'AI 아키텍트'],
    threat: 'AI 속도를 따라가지 못하면 완벽주의가 발목을 잡습니다.',
    scoreComment: (s) =>
      s <= 30
        ? '완벽한 AI 활용자! 대체 가능성 최저 구간입니다.'
        : s <= 60
        ? '파이프라인 설계 역량을 더하면 독보적이 됩니다.'
        : '지금 데이터 엔지니어링 커리어로 전환할 타이밍!',
  },
  HACF: {
    title: '데이터로 판치는 크리에이터',
    subtitle: 'AI + 창의력의 가장 강력한 조합',
    emoji: '🎨',
    color: '#10b981',
    aiScore: 32,
    bootcamp: 'AI LLM',
    bootcampReason: '창의력 + AI 도구 조합이 가장 강력합니다. LLM을 조수로 쓰는 법을 배우세요.',
    description:
      'AI를 쓰고, 논리도 되고, 빠릅니다.\n하지만 창의력은 AI가 흉내 낼 수 없습니다.\n\n지금 LLM을 내 무기로 만들면 경쟁자가 없어집니다.',
    aiTip:
      'Midjourney로 시각화, Claude로 카피 초안 — AI를 조수로 써서 아이디어 실현 속도를 극대화하세요.',
    jobs: ['크리에이티브 디렉터', 'AI 콘텐츠 전략가', 'UX 리서처'],
    threat: '창의력만으로는 부족합니다. AI 활용 깊이가 차별점이 됩니다.',
    scoreComment: (s) =>
      s <= 30
        ? '창의력 + AI = 대체 불가 조합! 앞서갑니다.'
        : s <= 60
        ? 'LLM 과정 하나로 슈퍼파워 조합 완성!'
        : 'AI로 반복 줄이고 창의에만 집중하세요.',
  },
  HACP: {
    title: '느린 듯 정확한 AI 예술가',
    subtitle: 'AI를 쓰되 감성은 내가 완성한다',
    emoji: '🌙',
    color: '#14b8a6',
    aiScore: 30,
    bootcamp: 'AI LLM',
    bootcampReason: '감성 + AI = 아무도 못 따라오는 창작 역량. LLM으로 완성하세요.',
    description:
      'AI를 씁니다. 창의적이고, 완벽하게 준비합니다.\n\n하지만 느린 실행이 기회를 놓치게 할 수 있습니다.\nAI로 반복을 줄이면, 당신의 감성이 빛납니다.',
    aiTip:
      'AI 초안으로 속도를 높이고, 마지막 감성 터치는 당신이 직접. 이 조합이 가장 강합니다.',
    jobs: ['AI 아트 디렉터', '콘텐츠 크리에이터', 'AI 기획자'],
    threat: '속도 없는 완벽주의는 시장에서 무시됩니다.',
    scoreComment: (s) =>
      s <= 30
        ? '감성 + AI 활용 = 희귀한 조합! 당신이 앞섭니다.'
        : s <= 60
        ? 'AI 반복 자동화로 창의에 더 집중하세요.'
        : 'LLM 과정에서 무기를 찾을 수 있습니다.',
  },
  HSLF: {
    title: '조용한 논리 장인',
    subtitle: '혼자서 빠르게 정확하게, 하지만 AI와는 거리를 둔다',
    emoji: '⚙️',
    color: '#64748b',
    aiScore: 48,
    bootcamp: '데이터 엔지니어',
    bootcampReason: '논리적이고 꼼꼼한 당신, 파이프라인 설계자로 전환하면 AI가 대체 못 합니다.',
    description:
      '혼자서 빠르고 정확하게 해냅니다.\n\n하지만 AI를 멀리하는 순간,\n당신의 속도는 AI를 쓰는 경쟁자에게 추월당합니다.',
    aiTip:
      'Copilot으로 코드 자동화, SQL 쿼리 생성 — 당신의 논리 역량에 AI 속도를 더하세요.',
    jobs: ['데이터 엔지니어', '백엔드 개발자', '시스템 분석가'],
    threat: 'AI 없이 혼자 하는 속도는 곧 경쟁력을 잃습니다.',
    scoreComment: (s) =>
      s <= 30
        ? '논리 + 실행력 조합! 대체 가능성 낮은 구간입니다.'
        : s <= 60
        ? 'AI 도구 하나만 더하면 대체 불가 포지션!'
        : '데이터 엔지니어링 역량으로 역전하세요.',
  },
  HSLP: {
    title: '철저한 혼자형 전략가',
    subtitle: '완벽하게 혼자 논리로 만든다',
    emoji: '♟️',
    color: '#475569',
    aiScore: 45,
    bootcamp: '데이터 엔지니어',
    bootcampReason: '꼼꼼한 당신의 분석력 + 파이프라인 설계 = AI 시대 가장 안전한 커리어.',
    description:
      '혼자서 완벽하게 만들어냅니다.\n\n하지만 AI 도구 없이 완벽을 추구하면\n속도 경쟁에서 밀립니다.',
    aiTip:
      'AI 초안으로 시간을 아끼고, 당신의 꼼꼼함으로 완성도를 높이세요. 이 조합이 최강입니다.',
    jobs: ['데이터 엔지니어', '시스템 설계자', '기술 전략가'],
    threat: 'AI 없는 완벽주의는 점점 더 느린 커리어가 됩니다.',
    scoreComment: (s) =>
      s <= 30
        ? '전략적 꼼꼼함은 AI가 못 따라와요!'
        : s <= 60
        ? 'AI 자동화 도구 하나 익히면 레벨 업!'
        : '지금 데이터 파이프라인 역량에 투자하세요.',
  },
  HSCF: {
    title: '감성 독립군',
    subtitle: '혼자서 감성으로 빠르게 만들어낸다',
    emoji: '🎭',
    color: '#f59e0b',
    aiScore: 38,
    bootcamp: 'AI LLM',
    bootcampReason: '감성 독립군에게 AI LLM은 가장 강력한 창작 도구입니다.',
    description:
      '혼자서 감성적으로 빠르게 창작합니다.\n\n하지만 AI를 안 쓰면\n당신의 창의력은 AI를 활용하는 경쟁자에게 밀립니다.',
    aiTip:
      'AI를 창작 조수로 써보세요. 당신의 감성 + AI의 속도 = 아무도 못 따라오는 조합입니다.',
    jobs: ['콘텐츠 크리에이터', '브랜드 기획자', 'UX 디자이너'],
    threat: 'AI를 외면하는 크리에이터는 점점 시장에서 밀려납니다.',
    scoreComment: (s) =>
      s <= 30
        ? '감성 + 실행력! 창의 영역에서 앞서갑니다.'
        : s <= 60
        ? 'AI 조수 하나만 들이면 슈퍼파워 조합!'
        : '지금 AI LLM 과정에서 무기를 찾으세요.',
  },
  HSCP: {
    title: '나만의 세계 완성형',
    subtitle: '혼자서 감성으로 완벽하게 만든다',
    emoji: '🌸',
    color: '#f97316',
    aiScore: 35,
    bootcamp: 'AI LLM',
    bootcampReason: '완벽한 감성 창작자에게 AI는 가장 강력한 조수입니다.',
    description:
      '나만의 세계를 완벽하게 구현합니다.\n\n하지만 속도 없는 완벽주의는\n시장의 빠른 흐름을 따라가지 못합니다.',
    aiTip:
      'AI로 반복 작업을 줄이고, 당신만의 감성 완성에 집중하세요. 그게 가장 강한 포지션입니다.',
    jobs: ['AI 아트 디렉터', '독립 크리에이터', '브랜드 디자이너'],
    threat: '완벽주의 + AI 거리두기 = 커리어 위기 신호입니다.',
    scoreComment: (s) =>
      s <= 30
        ? '나만의 세계는 AI가 절대 못 만들어요!'
        : s <= 60
        ? 'AI 도구 하나로 속도를 더하면 무적!'
        : 'AI LLM 과정에서 돌파구를 찾으세요.',
  },
  TALF: {
    title: '팀 이끄는 AI 선봉장',
    subtitle: 'AI 쓰고 팀도 이끌고 빠르게 실행',
    emoji: '⚡',
    color: '#3b82f6',
    aiScore: 31,
    bootcamp: '데이터 분석',
    bootcampReason: '팀을 이끄는 당신에게 데이터 분석은 의사결정의 무기가 됩니다.',
    description:
      'AI를 쓰고 팀도 이끕니다. 빠르고 논리적입니다.\n\n하지만 데이터 없는 빠른 실행은\n방향이 틀릴 때 팀 전체가 흔들립니다.',
    aiTip:
      '데이터 분석 + AI 도구로 의사결정 속도를 높이세요. 팀을 이끄는 당신에게 가장 강력한 무기입니다.',
    jobs: ['팀장/리더', '프로덕트 매니저', '데이터 기반 전략가'],
    threat: '데이터 없이 빠르게만 달리면 팀 전체가 방향을 잃습니다.',
    scoreComment: (s) =>
      s <= 30
        ? '팀 이끄는 AI 선봉장! 대체 가능성 낮습니다.'
        : s <= 60
        ? '데이터 역량 더하면 팀에서 독보적이 됩니다.'
        : '지금 데이터 분석 역량에 투자할 타이밍!',
  },
  TALP: {
    title: '함께 만드는 AI 설계자',
    subtitle: '팀과 AI로 완벽한 시스템을 만든다',
    emoji: '🏗️',
    color: '#6366f1',
    aiScore: 29,
    bootcamp: '데이터 분석',
    bootcampReason: '팀 + AI + 완벽주의에 데이터 분석이 더해지면 최강의 설계자가 됩니다.',
    description:
      'AI를 쓰고, 팀과 함께, 완벽하게 설계합니다.\n\n하지만 완벽하게 준비하다 기회를 놓치면\n아무리 좋은 설계도 의미가 없습니다.',
    aiTip:
      'MVP를 빠르게 만들고, 데이터로 검증하고, 팀과 개선하세요. 이 사이클이 가장 강합니다.',
    jobs: ['프로덕트 매니저', '데이터 기반 기획자', 'AI 서비스 기획자'],
    threat: '완벽한 준비만 하다가는 시장 기회를 놓칩니다.',
    scoreComment: (s) =>
      s <= 30
        ? '완벽한 AI 설계자! 대체 가능성 매우 낮습니다.'
        : s <= 60
        ? '데이터 분석으로 설계에 힘을 더하세요.'
        : '지금 데이터 역량 강화가 필요합니다.',
  },
  TACF: {
    title: 'AI 부리는 크리에이터',
    subtitle: '팀 속에서 AI로 창의를 폭발시킨다',
    emoji: '🎙️',
    color: '#8b5cf6',
    aiScore: 33,
    bootcamp: 'AI LLM',
    bootcampReason: '팀 크리에이터 + AI LLM = 시장에서 가장 강력한 콘텐츠 파워.',
    description:
      'AI를 쓰고, 팀과 함께, 창의적으로 빠르게.\n\n하지만 AI 활용의 깊이가 없으면\n표면적인 창의력에 그칩니다.',
    aiTip:
      'LLM으로 콘텐츠 생산 파이프라인을 만들어보세요. 팀과 AI가 합쳐질 때 창의력이 배가됩니다.',
    jobs: ['AI 콘텐츠 디렉터', '크리에이티브 팀장', 'AI 마케터'],
    threat: 'AI 활용 깊이 없는 창의력은 금방 평준화됩니다.',
    scoreComment: (s) =>
      s <= 30
        ? 'AI + 창의 + 팀! 대체 불가 조합입니다.'
        : s <= 60
        ? 'LLM 과정으로 AI 활용을 한 단계 올리세요.'
        : '지금 AI LLM 과정에서 돌파구를 찾으세요.',
  },
  TACP: {
    title: '협력형 AI 아티스트',
    subtitle: '팀과 AI로 감성 작품을 완성한다',
    emoji: '🎭',
    color: '#a855f7',
    aiScore: 31,
    bootcamp: 'AI LLM',
    bootcampReason: '협력 + 감성 + AI LLM = 누구도 흉내 낼 수 없는 창작 역량.',
    description:
      'AI를 쓰고, 팀과 함께, 감성으로 완성합니다.\n\n하지만 완성도를 위한 속도 희생이\n팀 전체의 리듬을 방해할 수 있습니다.',
    aiTip:
      'AI로 초안 속도를 높이고, 팀과 감성 터치를 나누세요. 이 조합이 가장 아름답습니다.',
    jobs: ['AI 크리에이티브 디렉터', '협업 아트 디렉터', 'AI 콘텐츠 기획자'],
    threat: '완벽한 감성 추구가 팀 속도를 늦추면 기회를 잃습니다.',
    scoreComment: (s) =>
      s <= 30
        ? '협력 + AI + 감성! 희귀한 조합입니다.'
        : s <= 60
        ? 'AI 활용 속도를 높이면 팀에서 독보적!'
        : 'LLM 과정에서 새 무기를 찾으세요.',
  },
  TSLF: {
    title: '사람으로 굴러가는 분석가',
    subtitle: '팀과 논리로 빠르게 결론을 낸다',
    emoji: '📊',
    color: '#0ea5e9',
    aiScore: 61,
    bootcamp: '데이터 분석',
    bootcampReason: '당신의 강점 + 데이터 = AI 시대 생존 패키지',
    description:
      '성실한 당신의 관리 업무, AI가 이미 넘보고 있습니다.\n지금 데이터 역량을 더하면 대체 불가능한 존재가 됩니다.',
    aiTip:
      '데이터 분석 + AI 리포팅 자동화로 당신의 팀 장악력을 데이터로 증명하세요.',
    jobs: ['데이터 분석가', '비즈니스 분석가', '팀 리더'],
    threat: 'AI가 보고서와 분석을 대체하는 속도가 빨라지고 있습니다.',
    scoreComment: (s) =>
      s <= 30
        ? '팀 장악력 + 분석력! AI도 당신의 부하입니다.'
        : s <= 60
        ? '데이터 역량 더하면 AI 시대 완벽한 생존 패키지!'
        : '지금 데이터 분석 과정에 투자할 타이밍입니다.',
  },
  TSLP: {
    title: '신중한 팀 전략가',
    subtitle: '팀과 논리로 완벽하게 준비한다',
    emoji: '🏢',
    color: '#1d4ed8',
    aiScore: 58,
    bootcamp: '데이터 분석',
    bootcampReason: '전략 + 데이터 분석 = 조직에서 독보적인 의사결정자.',
    description:
      '신중하게 준비하고 팀을 이끕니다.\n\n하지만 AI가 분석과 보고서를 대체하는 속도는\n당신의 준비 속도보다 빠릅니다.',
    aiTip:
      '데이터 분석 도구로 준비 시간을 단축하세요. 전략적 판단은 여전히 당신의 몫입니다.',
    jobs: ['전략기획 팀장', '조직개발 전문가', '비즈니스 전략가'],
    threat: 'AI가 전략 분석 초안을 만드는 시대, 당신의 역할은 재정의되어야 합니다.',
    scoreComment: (s) =>
      s <= 30
        ? '신중한 전략가는 AI가 못 대체해요!'
        : s <= 60
        ? '데이터 분석 역량 더하면 조직에서 독보적!'
        : '지금 데이터 분석 과정에서 역전하세요.',
  },
  TSCF: {
    title: '감성으로 팀 살리는 사람',
    subtitle: '팀의 에너지를 만들고 빠르게 실행한다',
    emoji: '🤝',
    color: '#ec4899',
    aiScore: 65,
    bootcamp: '데이터 분석',
    bootcampReason: '사람 중심 강점 + 데이터 = AI 시대 HR·영업에서 최강.',
    description:
      '팀을 살리는 당신의 감성 역량, AI가 이미 흉내 내기 시작했습니다.\n지금 데이터 역량을 더하면 AI도 대체 못 하는 존재가 됩니다.',
    aiTip:
      'AI로 미팅 준비 자동화 (상대방 정보 요약, 대화 포인트 생성). 관계 구축 시간에 더 집중하세요.',
    jobs: ['HR 파트너', '커뮤니티 매니저', '세일즈 전략가'],
    threat: 'AI 챗봇이 고객 응대를 대체하는 속도가 빠릅니다.',
    scoreComment: (s) =>
      s <= 30
        ? '인간 감성은 AI가 절대 못 빼앗아요!'
        : s <= 60
        ? 'AI + 인간적 감성의 하이브리드 전략이 답!'
        : '지금 데이터 분석 역량에 투자하면 역전 가능.',
  },
  TSCP: {
    title: '완벽한 팀의 완성자',
    subtitle: '팀과 감성으로 완벽하게 마무리한다',
    emoji: '🛡️',
    color: '#f43f5e',
    aiScore: 62,
    bootcamp: '데이터 분석',
    bootcampReason: '완벽한 팀플레이어 + 데이터 = AI 시대에도 살아남는 조합.',
    description:
      '팀을 완성시키는 당신, 하지만 AI가 협업 도구와 보고서를 대체하고 있습니다.\n지금 데이터로 당신의 가치를 증명하세요.',
    aiTip:
      'AI 협업 도구를 먼저 익혀서 팀에 도입하세요. 도입하는 사람이 대체되지 않습니다.',
    jobs: ['프로젝트 매니저', '팀 리더', '조직 문화 전문가'],
    threat: 'AI가 협업 관리 영역까지 들어오고 있습니다.',
    scoreComment: (s) =>
      s <= 30
        ? '완벽한 팀플레이어! 대체 가능성 낮은 구간입니다.'
        : s <= 60
        ? '데이터 역량 더하면 팀에서 독보적이 됩니다.'
        : '지금 데이터 분석 과정에서 역전하세요.',
  },
}

// 퇴근 보너스 계산
function calcOvertimeLevel(answers: Record<number, string>): {
  overtimeLevel: string
  overtimeComment: string
} {
  const q17 = answers[17] ?? ''
  const q18 = answers[18] ?? ''
  const q19 = answers[19] ?? ''
  const q20 = answers[20] ?? ''

  // 야근 레벨 점수
  let score = 0
  if (q17 === 'E1_LATE') score += 1
  else if (q17 === 'E1_ZOMBIE') score += 2

  if (q18 === 'E2_REPLY') score += 1
  else if (q18 === 'E2_WORK') score += 2

  if (q19 === 'E3_BUSY' || q19 === 'E3_PERFECT') score += 1
  if (q19 === 'E3_CULTURE') score += 1

  if (q20 === 'E4_ALREADY') score += 2
  else if (q20 === 'E4_CULTURE') score += 1

  if (score === 0) {
    return {
      overtimeLevel: '칼퇴 마스터',
      overtimeComment: '워라밸 끝판왕! AI 시대에 가장 건강한 커리어를 만들고 있습니다.',
    }
  } else if (score <= 2) {
    return {
      overtimeLevel: '적당한 직장인',
      overtimeComment: '야근도 하지만 균형을 잡고 있습니다. AI로 효율을 높이면 칼퇴가 가능합니다.',
    }
  } else if (score <= 4) {
    return {
      overtimeLevel: '야근 루틴러',
      overtimeComment: 'AI 자동화 도구 하나만 도입해도 야근 2시간은 줄일 수 있습니다.',
    }
  } else {
    return {
      overtimeLevel: '야근계의 전설',
      overtimeComment: '이 정도 헌신이면 AI가 당신의 야근을 없애줄 자격이 충분합니다. 지금 당장 도입하세요.',
    }
  }
}

export function calculateResult(answers: Record<number, string>): ResultData {
  // 파트 A (1-4): H vs T
  let hCount = 0
  let tCount = 0
  for (let i = 1; i <= 4; i++) {
    if (answers[i] === 'H') hCount++
    else if (answers[i] === 'T') tCount++
  }
  const workStyle = hCount >= 3 ? 'H' : 'T'

  // 파트 B (5-8): A vs S
  let aCount = 0
  let sCount = 0
  for (let i = 5; i <= 8; i++) {
    if (answers[i] === 'A') aCount++
    else if (answers[i] === 'S') sCount++
  }
  const aiUsage = aCount >= 3 ? 'A' : 'S'

  // 파트 C (9-12): L vs C
  let lCount = 0
  let cCount = 0
  for (let i = 9; i <= 12; i++) {
    if (answers[i] === 'L') lCount++
    else if (answers[i] === 'C') cCount++
  }
  const strength = lCount >= 3 ? 'L' : 'C'

  // 파트 D (13-16): F vs P
  let fCount = 0
  let pCount = 0
  for (let i = 13; i <= 16; i++) {
    if (answers[i] === 'F') fCount++
    else if (answers[i] === 'P') pCount++
  }
  const speed = fCount >= 3 ? 'F' : 'P'

  const typeCode = `${workStyle}${aiUsage}${strength}${speed}` as TypeCode
  const aiScore = typeInfo[typeCode].aiScore

  const { overtimeLevel, overtimeComment } = calcOvertimeLevel(answers)

  return { typeCode, aiScore, overtimeLevel, overtimeComment }
}
