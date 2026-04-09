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
    text: 'AI가 내 업무를 몇 % 대신할 수 있을까?',
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

export type BootcampType = 'AI LLM' | '데이터 분석' | '데이터 엔지니어' | 'AI 서비스 개발자'

export type ResultData = {
  typeCode: TypeCode
  aiScore: number
  overtimeLevel: string
  overtimeComment: string
  scores: { a: number; b: number; c: number; d: number; e: number }
}

export const bootcampInfo: Record<
  BootcampType,
  { title: string; shortLabel: string; color: string; reason: string; fieldDescription: string }
> = {
  'AI LLM': {
    title: 'AI LLM 부트캠프',
    shortLabel: 'LLM',
    color: '#6366f1',
    reason: 'ChatGPT를 도구로 쓰는 사람 vs 도구가 되는 사람',
    fieldDescription: 'ChatGPT 같은 언어 모델을 직접 설계하고 활용하는 직무. AI를 쓰는 사람이 아닌, AI를 만드는 사람.',
  },
  '데이터 분석': {
    title: '데이터 분석 부트캠프',
    shortLabel: 'DA',
    color: '#0ea5e9',
    reason: '당신의 강점 + 데이터 = AI 시대 생존 패키지',
    fieldDescription: '데이터로 비즈니스 의사결정을 이끄는 직무. 숫자 뒤에 숨은 인사이트를 찾아내는 사람.',
  },
  '데이터 엔지니어': {
    title: '데이터 엔지니어 부트캠프',
    shortLabel: 'DE',
    color: '#10b981',
    reason: 'AI가 대체 못 하는 파이프라인 설계자로 전환하세요',
    fieldDescription: 'AI가 학습할 데이터를 수집·정제·공급하는 직무. AI가 존재하는 한 절대 사라지지 않는 포지션.',
  },
  'AI 서비스 개발자': {
    title: 'AI 서비스 개발자 부트캠프',
    shortLabel: 'AI',
    color: '#f59e0b',
    reason: 'AI 서비스를 만드는 사람이 AI에 대체되지 않습니다',
    fieldDescription: 'AI 기능을 실제 서비스에 탑재하는 개발자. ChatGPT API를 제품에 붙이는 사람.',
  },
}

export type Insight = { strength: string; crisis: string; direction: string }
export type JobTask = { name: string; rate: number }
export type JobTransition = { from: string; via: string; to: string }
export type JobSection = {
  tasks: JobTask[]
  transitions: JobTransition[]
  warning: string
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
    jobSection: JobSection
    insight: Insight
  }
> = {
  HALF: {
    title: 'AI 지배자',
    subtitle: '혼자서 AI 스택 다 쌓는 LLM형',
    emoji: '🚀',
    color: '#6366f1',
    aiScore: 28,
    bootcamp: 'AI 서비스 개발자',
    bootcampReason: 'AI를 논리적으로 쓰는 당신, 직접 서비스를 만들면 대체 불가 포지션이 됩니다.',
    description:
      '지금은 앞서 있습니다.\n하지만 ChatGPT 쓰는 사람이 당신 옆자리에도 앉기 시작했습니다.\n\n1년 후, 도구를 쓰는 것만으론 차별점이 없어집니다.\nLLM을 직접 설계하는 사람만 지휘관으로 남습니다.',
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
    insight: {
      strength: 'AI를 도구로 쓰는 속도가 남들보다 빠릅니다. 혼자서도 팀 하나 몫을 해냅니다.',
      crisis: '하지만 ChatGPT 쓰는 사람은 이미 수만명입니다. 도구를 쓰는 것과 설계하는 것은 다릅니다.',
      direction: '도구 쓰는 사람은 많습니다. 설계하는 사람은 드뭅니다. 그 한 칸 차이가 연봉 두 배를 만듭니다.',
    },
    jobSection: {
      warning: '기획서·보고서 작성은 이미 자동화됐습니다\nLLM을 직접 다루는 기획자만 자리가 남습니다',
      tasks: [
        { name: '기획서 작성', rate: 82 },
        { name: '보고서 작성', rate: 88 },
        { name: '전략 수립', rate: 58 },
        { name: 'AI 서비스 설계', rate: 19 },
      ],
      transitions: [
        { from: '기획자', via: 'AI 서비스 설계', to: 'AI 서비스 개발자' },
        { from: 'PM', via: 'LLM 이해', to: 'AI LLM 기획자' },
      ],
    },
  },
  HALP: {
    title: 'LLM 장인',
    subtitle: '완벽하게 설계한 뒤 AI로 폭발하는 LLM형',
    emoji: '🔭',
    color: '#0ea5e9',
    aiScore: 32,
    bootcamp: 'AI LLM',
    bootcampReason: 'AI를 검증하며 쓰는 당신, 서비스 설계까지 더하면 AI 시대 핵심 인재가 됩니다.',
    description:
      '꼼꼼하게 AI를 씁니다. 지금은 강점입니다.\n하지만 Copilot이 이미 코드를 완성하고 있습니다.\n\n코드 잘 짜는 것은 더 이상 차별점이 아닙니다.\n시스템을 설계하는 사람만 대체되지 않습니다.',
    aiTip:
      'AI 도구를 테스트하는 습관이 강점입니다. 자동화 파이프라인 설계에 이 역량을 쏟으세요.',
    jobs: ['데이터 엔지니어', 'AI 서비스 개발자', 'AI 아키텍트'],
    threat: 'AI 속도를 따라가지 못하면 완벽주의가 발목을 잡습니다.',
    scoreComment: (s) =>
      s <= 30
        ? '완벽한 AI 활용자! 대체 가능성 최저 구간입니다.'
        : s <= 60
        ? '파이프라인 설계 역량을 더하면 독보적이 됩니다.'
        : '지금 데이터 엔지니어링 커리어로 전환할 타이밍!',
    insight: {
      strength: '꼼꼼하게 검증하면서 AI를 씁니다. 실수가 적고 신뢰도가 높습니다.',
      crisis: 'Copilot이 이미 코드를 짭니다. 코드 잘 짜는 것만으론 더 이상 차별점이 안 됩니다.',
      direction: '코드 짜는 건 Claude Code가 합니다. 어떤 시스템을 짤지 결정하는 건 당신이 해야 합니다.',
    },
    jobSection: {
      warning: '코드 작성은 이미 자동화됐습니다\n시스템을 설계하는 개발자만 자리가 남습니다',
      tasks: [
        { name: '코드 작성', rate: 76 },
        { name: '문서화', rate: 91 },
        { name: '버그 수정', rate: 83 },
        { name: '시스템 설계', rate: 24 },
      ],
      transitions: [
        { from: '개발자', via: '시스템 설계', to: 'AI 서비스 개발자' },
        { from: '분석가', via: 'AI 서비스 설계', to: 'AI 서비스 개발자' },
      ],
    },
  },
  HACF: {
    title: 'LLM 아티스트',
    subtitle: 'AI + 창의력 = 대체 불가 DA형',
    emoji: '🎨',
    color: '#10b981',
    aiScore: 38,
    bootcamp: 'AI LLM',
    bootcampReason: '창의력 + AI 도구 조합이 가장 강력합니다. LLM을 조수로 쓰는 법을 배우세요.',
    description:
      '창의력과 AI를 동시에 씁니다. 희귀한 조합입니다.\n하지만 Canva AI, Sora, Claude가 초당 수천 개의 콘텐츠를 쏟아냅니다.\n\n만드는 것만으론 살아남을 수 없습니다.\nAI를 지휘하는 디렉터만 시장을 가져갑니다.',
    aiTip:
      'Canva AI로 시각화, Claude로 카피 초안 — AI를 조수로 써서 아이디어 실현 속도를 극대화하세요.',
    jobs: ['크리에이티브 디렉터', 'AI 콘텐츠 전략가', 'UX 리서처'],
    threat: '창의력만으로는 부족합니다. AI 활용 깊이가 차별점이 됩니다.',
    scoreComment: (s) =>
      s <= 30
        ? '창의력 + AI = 대체 불가 조합! 앞서갑니다.'
        : s <= 60
        ? 'LLM 과정 하나로 슈퍼파워 조합 완성!'
        : 'AI로 반복 줄이고 창의에만 집중하세요.',
    insight: {
      strength: 'AI도 쓰고 창의력도 있습니다. 이 조합은 시장에서 가장 희귀한 역량입니다.',
      crisis: 'Canva AI, Sora, Claude가 콘텐츠를 쏟아냅니다. 만드는 것만으론 살아남기 어렵습니다.',
      direction: '당신이 아이디어를 던지면 AI가 10개로 불립니다. 방향만 잡으면 됩니다.',
    },
    jobSection: {
      warning: '콘텐츠 제작은 이미 자동화됐습니다\n방향을 잡는 디렉터만 자리가 남습니다',
      tasks: [
        { name: '콘텐츠 초안', rate: 93 },
        { name: '이미지 제작', rate: 87 },
        { name: '카피라이팅', rate: 89 },
        { name: '브랜드 전략', rate: 37 },
      ],
      transitions: [
        { from: '콘텐츠 기획자', via: 'LLM 활용', to: 'AI LLM 기획자' },
        { from: '마케터', via: '데이터 분석', to: '데이터 분석가' },
      ],
    },
  },
  HACP: {
    title: 'DA 예술가',
    subtitle: 'AI는 도구, 완성은 나 — DA형 장인',
    emoji: '🌙',
    color: '#14b8a6',
    aiScore: 44,
    bootcamp: '데이터 분석',
    bootcampReason: '감성 + AI = 아무도 못 따라오는 창작 역량. LLM으로 완성하세요.',
    description:
      '감성과 AI가 공존하는 드문 유형입니다.\n하지만 AI가 이미 당신의 스타일을 학습하고 있습니다.\n\n완벽함을 추구하는 동안 시장은 AI를 앞세운 경쟁자에게 넘어갑니다.\n지금 속도를 더하지 않으면 뒤처집니다.',
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
    insight: {
      strength: '감성과 AI를 동시에 씁니다. 완성도 높은 결과물을 만드는 능력이 강점입니다.',
      crisis: '속도가 느리면 AI를 앞세운 경쟁자에게 시장을 빼앗깁니다. 완벽함만 추구하면 기회를 놓칩니다.',
      direction: 'AI가 초안을 만들면, 당신의 감성이 그걸 작품으로 바꿉니다. 그 역할은 아직 사람 몫입니다.',
    },
    jobSection: {
      warning: '이미지·영상·글쓰기는 이미 자동화됐습니다\nAI를 지휘하는 크리에이터만 자리가 남습니다',
      tasks: [
        { name: '콘텐츠 제작', rate: 87 },
        { name: '기획서 작성', rate: 79 },
        { name: '시안 제작', rate: 83 },
        { name: '아트 디렉션', rate: 31 },
      ],
      transitions: [
        { from: '아트 디렉터', via: '생성AI 활용', to: 'AI 서비스 개발자' },
        { from: '크리에이터', via: 'AI 기획', to: 'AI LLM 기획자' },
      ],
    },
  },
  HSLF: {
    title: 'DA 논리왕',
    subtitle: '말 없이 혼자 데이터 다 처리하는 DA형',
    emoji: '⚙️',
    color: '#64748b',
    aiScore: 72,
    bootcamp: '데이터 분석',
    bootcampReason: '논리적이고 꼼꼼한 당신, 파이프라인 설계자로 전환하면 AI가 대체 못 합니다.',
    description:
      '혼자서 빠르고 정확하게 해냅니다.\n하지만 AI를 쓰는 경쟁자가 당신의 속도를 이미 넘어섰습니다.\n\nAI 없는 실행력은 점점 평균이 됩니다.\n지금 데이터 파이프라인 역량을 더하지 않으면 대체됩니다.',
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
    insight: {
      strength: '혼자서 빠르고 정확하게 해냅니다. 논리적 사고력은 어떤 분야에서도 강점입니다.',
      crisis: 'AI를 안 쓰면 경쟁자에게 속도로 밀립니다. 실력 있는 사람이 AI까지 쓰면 당신 자리가 없어집니다.',
      direction: '실력은 이미 있습니다. AI를 더하면 경쟁자가 하루 걸릴 일을 한 시간에 끝납니다.',
    },
    jobSection: {
      warning: '코드 작성은 이미 자동화됐습니다\n파이프라인을 설계하는 엔지니어만 자리가 남습니다',
      tasks: [
        { name: '코드 작성', rate: 78 },
        { name: 'SQL 쿼리', rate: 85 },
        { name: '데이터 정리', rate: 91 },
        { name: '파이프라인 설계', rate: 22 },
      ],
      transitions: [
        { from: '개발자', via: '데이터 파이프라인', to: '데이터 엔지니어' },
        { from: '분석가', via: '데이터 분석', to: '데이터 분석가' },
      ],
    },
  },
  HSLP: {
    title: 'DE 은둔자',
    subtitle: '아무도 모르게 혼자 시스템 다 만드는 DE형',
    emoji: '♟️',
    color: '#475569',
    aiScore: 76,
    bootcamp: '데이터 엔지니어',
    bootcampReason: '꼼꼼한 당신의 분석력 + 파이프라인 설계 = AI 시대 가장 안전한 커리어.',
    description:
      '완벽하게 혼자 만들어냅니다.\n하지만 AI가 완벽한 코드와 문서를 순식간에 완성합니다.\n\n완벽주의만으론 더 이상 차별점이 없습니다.\n설계 역량이 없으면, 당신의 자리가 사라집니다.',
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
    insight: {
      strength: '꼼꼼하고 체계적으로 혼자 완성합니다. 실수가 거의 없고 신뢰받는 스타일입니다.',
      crisis: 'AI가 완벽한 코드를 짜는 시대가 왔습니다. 꼼꼼함만으론 더 이상 경쟁력이 아닙니다.',
      direction: '당신의 꼼꼼함에 AI 속도가 붙으면, 빠르지만 틀리는 사람들을 쉽게 앞섭니다.',
    },
    jobSection: {
      warning: '완벽한 코드 작성도 이미 자동화됐습니다\n아키텍처를 설계하는 개발자만 자리가 남습니다',
      tasks: [
        { name: '코드 리뷰', rate: 74 },
        { name: '문서 작성', rate: 91 },
        { name: '데이터 분석', rate: 83 },
        { name: '아키텍처 설계', rate: 21 },
      ],
      transitions: [
        { from: '개발자', via: '클라우드+데이터', to: '데이터 엔지니어' },
        { from: '시스템 관리자', via: '클라우드 설계', to: '데이터 아키텍트' },
      ],
    },
  },
  HSCF: {
    title: 'DA 독립군',
    subtitle: '혼자서 빠르게 뚝딱 — AI 없이도 DA형',
    emoji: '🎭',
    color: '#f59e0b',
    aiScore: 70,
    bootcamp: '데이터 분석',
    bootcampReason: '감성 + 데이터 분석 조합은 AI 시대 크리에이터의 최강 무기입니다.',
    description:
      '감성과 실행력이 동시에 있는 크리에이터입니다.\n하지만 Canva AI가 디자인하고 Claude가 글을 씁니다.\n\nAI를 외면하는 크리에이터는 이미 시장에서 밀리고 있습니다.\n지금 AI를 조수로 쓰지 않으면 도태됩니다.',
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
    insight: {
      strength: '혼자서 감성적으로 빠르게 만들어냅니다. 실행력과 창의력이 동시에 있는 희귀한 조합입니다.',
      crisis: 'Canva AI가 디자인하고 Claude가 글을 씁니다. AI를 외면하면 시장에서 밀려납니다.',
      direction: '당신의 감각에 AI 속도가 붙으면, 팀 전체보다 빠릅니다.',
    },
    jobSection: {
      warning: '디자인·시안 작업은 이미 자동화됐습니다\nAI를 지휘하는 크리에이터만 자리가 남습니다',
      tasks: [
        { name: '디자인 시안', rate: 81 },
        { name: '콘텐츠 작성', rate: 89 },
        { name: 'SNS 운영', rate: 77 },
        { name: '브랜드 기획', rate: 34 },
      ],
      transitions: [
        { from: '디자이너', via: 'AI 크리에이티브', to: 'AI LLM 기획자' },
        { from: '콘텐츠 작가', via: 'AI 전략 기획', to: 'AI LLM 기획자' },
      ],
    },
  },
  HSCP: {
    title: 'DA 세계관 장인',
    subtitle: '느려도 괜찮아, 결과물이 예술이니까',
    emoji: '🌸',
    color: '#f97316',
    aiScore: 74,
    bootcamp: '데이터 분석',
    bootcampReason: '완벽한 감성 + 데이터 = AI 시대에도 살아남는 크리에이터 조합.',
    description:
      '나만의 세계와 감성이 있습니다. 그건 진짜 강점입니다.\n하지만 AI가 이미 당신의 스타일을 학습하고 복제하기 시작했습니다.\n\n독창성만으론 살아남기 어렵습니다.\n먼저 AI를 쓰는 크리에이터가 시장을 가져갑니다.',
    aiTip:
      'AI로 반복 작업을 줄이고, 당신만의 감성 완성에 집중하세요. 그게 가장 강한 포지션입니다.',
    jobs: ['AI 아트 디렉터', '크리에이터', '브랜드 디자이너'],
    threat: '완벽주의 + AI 거리두기 = 커리어 위기 신호.',
    scoreComment: (s) =>
      s <= 30
        ? '나만의 세계는 AI가 절대 못 만들어요!'
        : s <= 60
        ? 'AI 도구 하나로 속도를 더하면 무적!'
        : 'AI LLM 과정에서 돌파구를 찾으세요.',
    insight: {
      strength: '나만의 세계와 감성이 있습니다. 이 독창성은 AI가 쉽게 흉내 낼 수 없습니다.',
      crisis: 'AI가 이미 당신의 스타일을 학습하고 모방합니다. 속도까지 더하지 않으면 따라잡힙니다.',
      direction: '당신의 세계관은 AI가 흉내 못 냅니다. 거기에 AI 속도만 붙이면 아무도 따라올 수 없습니다.',
    },
    jobSection: {
      warning: '콘텐츠 제작과 편집은 이미 자동화됐습니다\nAI를 먼저 쓰는 크리에이터만 자리가 남습니다',
      tasks: [
        { name: '콘텐츠 제작', rate: 87 },
        { name: '디자인', rate: 81 },
        { name: '기획', rate: 79 },
        { name: '나만의 감성 디렉션', rate: 27 },
      ],
      transitions: [
        { from: '크리에이터', via: 'AI 디렉션', to: 'AI 서비스 개발자' },
        { from: '디자이너', via: 'AI 브랜딩', to: 'AI LLM 기획자' },
      ],
    },
  },
  TALF: {
    title: 'AI 팀장',
    subtitle: 'AI + 팀워크 = 최강 조합 LLM형',
    emoji: '⚡',
    color: '#3b82f6',
    aiScore: 52,
    bootcamp: 'AI 서비스 개발자',
    bootcampReason: 'AI를 쓰는 팀 리더, 직접 서비스를 설계하면 조직에서 독보적이 됩니다.',
    description:
      'AI를 쓰고 팀도 이끌고 빠르게 실행합니다.\n하지만 회의 요약, 업무 배분, 보고서 작성 — 팀 관리의 74%가 이미 자동화 가능합니다.\n\n데이터 없이 빠르게만 달리면 방향을 잃습니다.\n데이터로 의사결정하는 리더만 살아남습니다.',
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
    insight: {
      strength: 'AI도 쓰고 팀도 이끕니다. 빠른 실행력까지 있어서 결과를 만들어내는 리더입니다.',
      crisis: '회의 요약·업무 배분·보고서 작성, 팀 관리 업무의 74%가 이미 자동화 가능합니다.',
      direction: 'AI가 팀원 일을 대신할수록, 그걸 지휘하는 리더 자리는 더 커집니다.',
    },
    jobSection: {
      warning: '팀 관리 업무의 74%는 이미 자동화됐습니다\n데이터로 의사결정하는 리더만 자리가 남습니다',
      tasks: [
        { name: '회의 요약', rate: 88 },
        { name: '업무 배분', rate: 74 },
        { name: '보고서 작성', rate: 91 },
        { name: '팀 방향 설정', rate: 23 },
      ],
      transitions: [
        { from: '팀장', via: '데이터 분석', to: '데이터 분석가' },
        { from: 'PM', via: 'AI 프로덕트', to: 'AI 서비스 개발자' },
      ],
    },
  },
  TALP: {
    title: 'LLM 설계자',
    subtitle: '팀 + AI로 완벽한 시스템 설계',
    emoji: '🏗️',
    color: '#6366f1',
    aiScore: 55,
    bootcamp: 'AI LLM',
    bootcampReason: '팀과 AI로 완벽하게 설계하는 당신, AI 서비스 개발로 커리어를 확장하세요.',
    description:
      'AI를 쓰며 팀과 완벽하게 설계합니다.\n하지만 기획서, 회의록, 데이터 정리 — 당신이 하는 일의 82%가 자동화 가능합니다.\n\n완벽하게 준비하다 기회를 놓치고 있을 수 있습니다.\n설계 역량만이 남은 차별점입니다.',
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
    insight: {
      strength: 'AI를 쓰면서 팀과 함께 완벽하게 설계합니다. 신중한 판단이 팀의 실수를 막습니다.',
      crisis: '기획서·회의록·데이터 정리, 당신이 하는 일의 82%가 이미 자동화 가능합니다.',
      direction: '팀을 위해 신중하게 설계하는 능력, 그게 AI가 절대 못 하는 겁니다. 거기에 집중하면 됩니다.',
    },
    jobSection: {
      warning: '기획서 작성의 82%는 이미 자동화됐습니다\n설계 역량을 가진 기획자만 자리가 남습니다',
      tasks: [
        { name: '기획서 작성', rate: 82 },
        { name: '회의록 정리', rate: 91 },
        { name: '데이터 정리', rate: 88 },
        { name: '서비스 설계', rate: 26 },
      ],
      transitions: [
        { from: '기획자', via: 'AI 서비스 설계', to: 'AI 서비스 개발자' },
        { from: 'PM', via: '데이터 분석', to: '데이터 분석가' },
      ],
    },
  },
  TACF: {
    title: 'LLM 크리에이터',
    subtitle: '팀 속에서 AI로 창의 폭발 — DA형',
    emoji: '🎙️',
    color: '#8b5cf6',
    aiScore: 48,
    bootcamp: 'AI LLM',
    bootcampReason: '팀 크리에이터 + AI LLM = 시장에서 가장 강력한 콘텐츠 파워.',
    description:
      'AI를 쓰고 팀과 함께 창의력을 폭발시킵니다.\n하지만 광고 카피, 콘텐츠, 시장 조사 — 마케팅 업무의 대부분을 AI가 대신합니다.\n\n만드는 것 자체는 더 이상 가치가 없습니다.\nAI를 지휘하는 전략가만 살아남습니다.',
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
    insight: {
      strength: 'AI도 쓰고 팀과 함께 창의력을 폭발시킵니다. 아이디어를 현실로 만드는 실행력이 있습니다.',
      crisis: '광고 카피, 콘텐츠, 시장 조사 모두 AI가 합니다. 만드는 것 자체는 더 이상 가치가 없습니다.',
      direction: '아이디어를 AI로 10배 확장하고 팀이 실행합니다. 그 사이클을 설계하는 게 당신의 역할입니다.',
    },
    jobSection: {
      warning: '광고 카피·콘텐츠 제작은 이미 자동화됐습니다\nAI를 지휘하는 마케터만 자리가 남습니다',
      tasks: [
        { name: '콘텐츠 제작', rate: 93 },
        { name: '광고 카피', rate: 89 },
        { name: '시장 조사', rate: 82 },
        { name: 'AI 마케팅 전략', rate: 28 },
      ],
      transitions: [
        { from: '마케터', via: 'AI 마케팅 전략', to: 'AI LLM 기획자' },
        { from: '콘텐츠팀장', via: 'AI 서비스 기획', to: 'AI 서비스 개발자' },
      ],
    },
  },
  TACP: {
    title: 'DA 화가',
    subtitle: '팀 + AI + 감성 = 독보적 DA형',
    emoji: '🎭',
    color: '#a855f7',
    aiScore: 51,
    bootcamp: '데이터 분석',
    bootcampReason: '협력 + 감성 + AI LLM = 누구도 흉내 낼 수 없는 창작 역량.',
    description:
      '팀과 함께, AI로, 감성까지 — 셋을 동시에 다루는 당신.\n그런데 이제 AI가 아이디어도 콘텐츠도 혼자 만들기 시작했습니다.\n\n만드는 것만으로는 더 이상 특별해질 수 없습니다.\n무엇을 만들지 결정하는 사람이 살아남습니다.',
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
    insight: {
      strength: '팀과 AI와 감성, 세 가지를 동시에 다룹니다. 이 조합을 가진 사람은 정말 드뭅니다.',
      crisis: '이제 AI가 아이디어도, 콘텐츠도 만듭니다. 만드는 것 자체로는 더 이상 차별점이 없습니다.',
      direction: '팀도, AI도, 감성도 있습니다. 그걸 하나로 묶는 디렉터가 당신의 자리입니다.',
    },
    jobSection: {
      warning: '아이디어·콘텐츠 제작은 이미 자동화됐습니다\n방향을 잡는 디렉터만 자리가 남습니다',
      tasks: [
        { name: '콘텐츠 초안', rate: 91 },
        { name: '아이디어 발굴', rate: 76 },
        { name: '시안 작업', rate: 84 },
        { name: '크리에이티브 디렉션', rate: 29 },
      ],
      transitions: [
        { from: '크리에이터', via: 'AI 디렉션', to: 'AI LLM 기획자' },
        { from: '아트 디렉터', via: 'AI 협업', to: 'AI 서비스 개발자' },
      ],
    },
  },
  TSLF: {
    title: 'DE 분석가',
    subtitle: 'AI 없어도 사람 네트워크가 곧 데이터 — DE형',
    emoji: '📊',
    color: '#0ea5e9',
    aiScore: 82,
    bootcamp: '데이터 엔지니어',
    bootcampReason: '당신의 강점 + 데이터 = AI 시대 생존 패키지',
    description:
      '사람을 읽고 팀을 움직이는 능력이 있습니다.\n하지만 보고서, 데이터 정리, 고객 응대 — 당신이 하는 일을 AI가 이미 하고 있습니다.\n\n관계력만으론 더 이상 안전하지 않습니다.\n데이터로 설득하는 사람만 조직에서 살아남습니다.',
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
    insight: {
      strength: '사람을 읽고 팀을 움직입니다. 관계력과 설득력은 어떤 조직에서도 핵심 역량입니다.',
      crisis: '보고서, 데이터 정리, 고객 응대. 당신이 하는 일의 대부분을 AI가 이미 합니다.',
      direction: '사람을 읽는 눈에 데이터까지 더하면, 설득 못 할 회의실이 없습니다.',
    },
    jobSection: {
      warning: '보고서·데이터 정리·고객 응대는 이미 자동화됐습니다\n데이터로 설득하는 사람만 자리가 남습니다',
      tasks: [
        { name: '보고서 작성', rate: 91 },
        { name: '데이터 정리', rate: 88 },
        { name: '고객 응대', rate: 79 },
        { name: '데이터 기반 의사결정', rate: 18 },
      ],
      transitions: [
        { from: '마케터', via: '데이터 분석', to: '데이터 분석가' },
        { from: '영업', via: 'AI 툴 기획', to: 'AI 서비스 개발자' },
      ],
    },
  },
  TSLP: {
    title: 'DE 전략가',
    subtitle: '느리지만 팀 전체를 완벽하게 묶는 DE형',
    emoji: '🏢',
    color: '#1d4ed8',
    aiScore: 85,
    bootcamp: '데이터 엔지니어',
    bootcampReason: '전략 + 데이터 분석 = 조직에서 독보적인 의사결정자.',
    description:
      '신중하게 준비하고 팀을 이끄는 전략가입니다.\n하지만 전략 보고서, 데이터 분석, 회의 준비 — 핵심 업무 84%가 자동화 가능합니다.\n\n준비하는 동안 AI가 더 빠르게 같은 결과를 냅니다.\n데이터로 설득하는 전략가만 대체되지 않습니다.',
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
    insight: {
      strength: '신중하게 준비하고 팀을 이끕니다. 완성도 높은 전략과 깊은 분석이 강점입니다.',
      crisis: '전략 보고서, 회의 준비, 데이터 분석. 당신의 핵심 업무 84%가 자동화 가능한 시대입니다.',
      direction: '당신이 준비한 전략에 데이터 근거가 붙으면, 아무도 반박 못 합니다.',
    },
    jobSection: {
      warning: '전략 보고서 작성의 84%는 이미 자동화됐습니다\n데이터로 설득하는 전략가만 자리가 남습니다',
      tasks: [
        { name: '전략 보고서', rate: 84 },
        { name: '회의 준비', rate: 88 },
        { name: '데이터 분석', rate: 82 },
        { name: '조직 전략 수립', rate: 21 },
      ],
      transitions: [
        { from: '전략기획', via: '데이터 분석', to: '데이터 분석가' },
        { from: '조직개발', via: 'LLM 기획', to: 'AI LLM 기획자' },
      ],
    },
  },
  TSCF: {
    title: 'DA 구원투수',
    subtitle: '감성으로 팀 살리는 DA형 에너지 메이커',
    emoji: '🤝',
    color: '#ec4899',
    aiScore: 78,
    bootcamp: '데이터 분석',
    bootcampReason: '사람 중심 강점 + 데이터 = AI 시대 HR·영업에서 최강.',
    description:
      '팀의 에너지를 만들고 사람을 살리는 리더입니다.\n하지만 채용, 교육, 팀 관리 — AI 챗봇이 이미 이 영역을 넘보고 있습니다.\n\n감성만으로는 AI 시대를 버틸 수 없습니다.\n사람을 이해하는 감성 + 데이터 = 대체 불가 조합입니다.',
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
    insight: {
      strength: '팀의 에너지를 만들고 사람을 움직입니다. 이 감성 리더십은 어느 조직에서나 필요합니다.',
      crisis: 'HR 채용, 교육, 팀 관리. AI 챗봇이 이미 이 영역에 들어오고 있습니다.',
      direction: '사람 마음을 읽는 감성은 AI가 흉내 못 냅니다. 거기에 AI 툴 하나만 더 얹으면 팀에서 독보적입니다.',
    },
    jobSection: {
      warning: 'HR 채용·교육·관리는 이미 자동화됐습니다\n데이터로 사람을 이해하는 HR만 자리가 남습니다',
      tasks: [
        { name: '채용 공고·스크리닝', rate: 83 },
        { name: '교육 자료 제작', rate: 87 },
        { name: '팀 관리 보고', rate: 74 },
        { name: '조직 문화 설계', rate: 19 },
      ],
      transitions: [
        { from: 'HR', via: '피플 데이터', to: '데이터 분석가' },
        { from: '교육 담당', via: 'AI 교육 기획', to: 'AI LLM 기획자' },
      ],
    },
  },
  TSCP: {
    title: 'DE 완성자',
    subtitle: '느리지만 팀 + 감성으로 완벽 마무리 — DE형',
    emoji: '🛡️',
    color: '#f43f5e',
    aiScore: 88,
    bootcamp: '데이터 엔지니어',
    bootcampReason: '완벽한 팀플레이어 + 데이터 = AI 시대에도 살아남는 조합.',
    description:
      '팀을 완성시키고 마무리를 책임지는 사람입니다.\n하지만 일정 관리, 진행 보고, 피드백 정리 — 당신의 핵심 업무가 자동화되고 있습니다.\n\n완벽한 팀 관리만으론 더 이상 안전하지 않습니다.\n데이터로 팀을 설계하는 PM만 살아남습니다.',
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
    insight: {
      strength: '팀을 완성시키고 마무리를 책임집니다. 꼼꼼한 팀 관리로 조직의 신뢰를 받습니다.',
      crisis: '일정 관리, 진행 보고, 팀 피드백 정리. 당신이 하는 일의 대부분이 자동화되고 있습니다.',
      direction: '팀을 완성시키는 감각에 AI 자동화까지 더하면, 당신 없이 돌아가는 조직이 없어집니다.',
    },
    jobSection: {
      warning: '일정·보고·피드백은 이미 자동화됐습니다\n조직을 설계하는 사람만 자리가 남습니다',
      tasks: [
        { name: '일정 관리', rate: 86 },
        { name: '진행 보고', rate: 91 },
        { name: '팀 피드백 정리', rate: 77 },
        { name: '조직 문화 설계', rate: 22 },
      ],
      transitions: [
        { from: 'PM', via: '조직 데이터', to: 'AI 서비스 개발자' },
        { from: '팀 리더', via: '조직 분석', to: '데이터 분석가' },
      ],
    },
  },
}

// 퇴근 보너스 계산
function calcOvertimeLevel(answers: Record<number, string>): {
  overtimeLevel: string
  overtimeComment: string
  overtimeScore: number
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
      overtimeScore: score,
    }
  } else if (score <= 2) {
    return {
      overtimeLevel: '적당한 직장인',
      overtimeComment: '야근도 하지만 균형을 잡고 있습니다. AI로 효율을 높이면 칼퇴가 가능합니다.',
      overtimeScore: score,
    }
  } else if (score <= 4) {
    return {
      overtimeLevel: '야근 루틴러',
      overtimeComment: 'AI 자동화 도구 하나만 도입해도 야근 2시간은 줄일 수 있습니다.',
      overtimeScore: score,
    }
  } else {
    return {
      overtimeLevel: '야근계의 전설',
      overtimeComment: '이 정도 헌신이면 AI가 당신의 야근을 없애줄 자격이 충분합니다. 지금 당장 도입하세요.',
      overtimeScore: score,
    }
  }
}

export function calculateResult(answers: Record<number, string>): ResultData {
  // 파트 A (1-4): H vs T
  let hCount = 0
  for (let i = 1; i <= 4; i++) {
    if (answers[i] === 'H') hCount++
  }
  const workStyle = hCount >= 3 ? 'H' : 'T'

  // 파트 B (5-8): A vs S
  let aCount = 0
  for (let i = 5; i <= 8; i++) {
    if (answers[i] === 'A') aCount++
  }
  const aiUsage = aCount >= 3 ? 'A' : 'S'

  // 파트 C (9-12): L vs C
  let lCount = 0
  for (let i = 9; i <= 12; i++) {
    if (answers[i] === 'L') lCount++
  }
  const strength = lCount >= 3 ? 'L' : 'C'

  // 파트 D (13-16): F vs P
  let fCount = 0
  for (let i = 13; i <= 16; i++) {
    if (answers[i] === 'F') fCount++
  }
  const speed = fCount >= 3 ? 'F' : 'P'

  const typeCode = `${workStyle}${aiUsage}${strength}${speed}` as TypeCode
  const aiScore = typeInfo[typeCode].aiScore

  const { overtimeLevel, overtimeComment, overtimeScore } = calcOvertimeLevel(answers)

  return {
    typeCode,
    aiScore,
    overtimeLevel,
    overtimeComment,
    scores: { a: hCount, b: aCount, c: lCount, d: fCount, e: overtimeScore },
  }
}
