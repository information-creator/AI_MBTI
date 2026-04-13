export type Question = {
  id: number
  part: 'A' | 'B' | 'C' | 'D' | 'E'
  text: string
  options: { label: string; value: string }[]
}

export const questions: Question[] = [
  // 파트 A — AI 활용도 (Q1-4)
  {
    id: 1,
    part: 'A',
    text: '업무에 AI 도구 활용 빈도는?',
    options: [
      { label: '매일 필수 — AI 없이는 일 못 함', value: 'Y' },
      { label: '가끔 쓰거나 거의 안 쓴다', value: 'N' },
    ],
  },
  {
    id: 2,
    part: 'A',
    text: 'AI가 내 업무를 몇 % 대신할 수 있을까?',
    options: [
      { label: '50% 이상 — AI가 많은 부분을 커버 가능', value: 'Y' },
      { label: '30% 미만 — 내 일은 내가 해야 한다', value: 'N' },
    ],
  },
  {
    id: 3,
    part: 'A',
    text: '업무 중 막히면 가장 먼저?',
    options: [
      { label: 'ChatGPT나 AI 도구에 물어본다', value: 'Y' },
      { label: '구글 검색하거나 동료에게 묻는다', value: 'N' },
    ],
  },
  {
    id: 4,
    part: 'A',
    text: 'AI 도구 없이 일주일 버틸 수 있나요?',
    options: [
      { label: '솔직히 힘들다 — 이미 의존 중', value: 'Y' },
      { label: '충분히 가능하다 — 없어도 괜찮음', value: 'N' },
    ],
  },

  // 파트 B — AI 민감도 (Q5-8)
  {
    id: 5,
    part: 'B',
    text: 'AI 뉴스를 접하면?',
    options: [
      { label: '바로 업무에 적용 시도해본다', value: 'Y' },
      { label: '일단 지켜본다 — 검증되면 쓸 것', value: 'N' },
    ],
  },
  {
    id: 6,
    part: 'B',
    text: '6개월 뒤, 내 업무에서 AI 비중은?',
    options: [
      { label: '확실히 더 늘어날 것이다', value: 'Y' },
      { label: '지금과 비슷할 것이다', value: 'N' },
    ],
  },
  {
    id: 7,
    part: 'B',
    text: '새 AI 도구가 출시되면?',
    options: [
      { label: '당일에 가입해서 써본다', value: 'Y' },
      { label: '후기 먼저 찾아보고 결정한다', value: 'N' },
    ],
  },
  {
    id: 8,
    part: 'B',
    text: 'AI가 내 직업을 위협한다고 느끼나요?',
    options: [
      { label: '느낀다 — 그래서 더 공부하고 있다', value: 'Y' },
      { label: '아직은 괜찮다고 본다', value: 'N' },
    ],
  },

  // 파트 C — 독립성 (Q9-12)
  {
    id: 9,
    part: 'C',
    text: '혼자 vs 팀, 어디서 더 잘 되나요?',
    options: [
      { label: '혼자 집중할 때 훨씬 잘 된다', value: 'Y' },
      { label: '팀과 함께할 때 더 잘 된다', value: 'N' },
    ],
  },
  {
    id: 10,
    part: 'C',
    text: '새 프로젝트를 시작할 때?',
    options: [
      { label: '혼자 먼저 구상하고 정리한다', value: 'Y' },
      { label: '팀 미팅부터 잡고 함께 방향을 잡는다', value: 'N' },
    ],
  },
  {
    id: 11,
    part: 'C',
    text: '문제가 생기면?',
    options: [
      { label: '혼자 끝까지 파고들어 해결한다', value: 'Y' },
      { label: '바로 동료에게 물어보고 같이 푼다', value: 'N' },
    ],
  },
  {
    id: 12,
    part: 'C',
    text: '나의 핵심 경쟁력은?',
    options: [
      { label: '전문성 — 내 분야에서 깊이 파는 것', value: 'Y' },
      { label: '소통 — 사람과 관계를 잘 만드는 것', value: 'N' },
    ],
  },

  // 파트 D — 논리력 (Q13-16)
  {
    id: 13,
    part: 'D',
    text: '칭찬받는 이유는?',
    options: [
      { label: '정확하고 논리적이라는 말을 듣는다', value: 'Y' },
      { label: '창의적이고 감각적이라는 말을 듣는다', value: 'N' },
    ],
  },
  {
    id: 14,
    part: 'D',
    text: '보고서를 작성할 때?',
    options: [
      { label: '데이터와 수치 위주로 구성한다', value: 'Y' },
      { label: '스토리와 감성 위주로 풀어낸다', value: 'N' },
    ],
  },
  {
    id: 15,
    part: 'D',
    text: '문제를 해결하는 방식은?',
    options: [
      { label: '원인을 분석하고 논리적으로 해결책을 찾는다', value: 'Y' },
      { label: '직관적으로 새로운 아이디어를 던진다', value: 'N' },
    ],
  },
  {
    id: 16,
    part: 'D',
    text: '나를 한 단어로 표현하면?',
    options: [
      { label: '분석가', value: 'Y' },
      { label: '크리에이터', value: 'N' },
    ],
  },

  // 파트 E — 실행력 (Q17-20)
  {
    id: 17,
    part: 'E',
    text: '일 처리 스타일은?',
    options: [
      { label: '일단 빠르게 시작하고 고쳐나간다', value: 'Y' },
      { label: '완벽히 준비한 다음 시작한다', value: 'N' },
    ],
  },
  {
    id: 18,
    part: 'E',
    text: '마감이 다가오면?',
    options: [
      { label: '이미 다 끝내놨다', value: 'Y' },
      { label: '막판에 몰아서 완성한다', value: 'N' },
    ],
  },
  {
    id: 19,
    part: 'E',
    text: '새 기술이나 툴을 접하면?',
    options: [
      { label: '일단 써본다 — 쓰면서 배운다', value: 'Y' },
      { label: '매뉴얼 다 읽고 이해한 다음 쓴다', value: 'N' },
    ],
  },
  {
    id: 20,
    part: 'E',
    text: '회의에서 아이디어가 나오면?',
    options: [
      { label: '바로 실행 계획을 세운다', value: 'Y' },
      { label: '충분히 검토한 뒤 시작한다', value: 'N' },
    ],
  },
]

export type TypeCode =
  | 'AI_DOM'
  | 'LLM_DES'
  | 'AI_LEAD'
  | 'LLM_ART'
  | 'DA_ART'
  | 'DA_LOG'
  | 'DE_SOLO'
  | 'DE_STRAT'

export type BootcampType = 'AI LLM' | '데이터 분석' | '데이터 엔지니어' | 'AI 서비스 개발자'

export type ResultData = {
  typeCode: TypeCode
  aiScore: number
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
    fieldDescription: '큰 그림을 보고 언어 모델의 방향을 정하는 유형. AI를 쓰는 사람이 아닌, AI를 만드는 사람.',
  },
  '데이터 분석': {
    title: '데이터 분석 부트캠프',
    shortLabel: 'DA',
    color: '#0ea5e9',
    reason: '당신의 강점 + 데이터 = AI 시대 생존 패키지',
    fieldDescription: '숫자 뒤에 숨은 패턴을 읽어내는 유형. 데이터로 비즈니스 판단을 이끄는 인사이트 발굴자.',
  },
  '데이터 엔지니어': {
    title: '데이터 엔지니어 부트캠프',
    shortLabel: 'DE',
    color: '#10b981',
    reason: 'AI가 대체 못 하는 파이프라인 설계자로 전환하세요',
    fieldDescription: '체계와 정확성으로 데이터 흐름을 설계하는 유형. 보이지 않는 곳에서 AI 전체를 받치는 구조 설계자.',
  },
  'AI 서비스 개발자': {
    title: 'AI 서비스 개발자 부트캠프',
    shortLabel: 'AI',
    color: '#f59e0b',
    reason: 'AI 서비스를 만드는 사람이 AI에 대체되지 않습니다',
    fieldDescription: 'AI 기능을 실제 서비스로 만들어내는 유형. 아이디어를 제품으로 구현하는 실행형 빌더.',
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
  // AI_DOM ← from HALF, bootcamp changed to 'AI LLM'
  AI_DOM: {
    title: 'AI 지배자',
    subtitle: '혼자서 AI 스택 다 쌓는 LLM형',
    emoji: '🚀',
    color: '#6366f1',
    aiScore: 28,
    bootcamp: 'AI LLM',
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

  // LLM_DES ← from TALP, bootcamp 'AI LLM' (same)
  LLM_DES: {
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

  // AI_LEAD ← from TALF, bootcamp 'AI 서비스 개발자' (same)
  AI_LEAD: {
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

  // LLM_ART ← from HACF, bootcamp changed to 'AI 서비스 개발자'
  LLM_ART: {
    title: 'LLM 아티스트',
    subtitle: 'AI + 창의력 = 대체 불가 DA형',
    emoji: '🎨',
    color: '#10b981',
    aiScore: 38,
    bootcamp: 'AI 서비스 개발자',
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

  // DA_ART ← from HACP, bootcamp '데이터 분석' (same)
  DA_ART: {
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

  // DA_LOG ← from HSLF, bootcamp '데이터 분석' (same)
  DA_LOG: {
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

  // DE_SOLO ← from HSLP, bootcamp '데이터 엔지니어' (same)
  DE_SOLO: {
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

  // DE_STRAT ← from TSLP, bootcamp '데이터 엔지니어' (same)
  DE_STRAT: {
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
}

export function calculateResult(answers: Record<number, string>): ResultData {
  // 파트 A (1-4): AI 활용도
  let aScore = 0
  for (let i = 1; i <= 4; i++) {
    if (answers[i] === 'Y') aScore++
  }

  // 파트 B (5-8): AI 민감도
  let bScore = 0
  for (let i = 5; i <= 8; i++) {
    if (answers[i] === 'Y') bScore++
  }

  // 파트 C (9-12): 독립성
  let cScore = 0
  for (let i = 9; i <= 12; i++) {
    if (answers[i] === 'Y') cScore++
  }

  // 파트 D (13-16): 논리력
  let dScore = 0
  for (let i = 13; i <= 16; i++) {
    if (answers[i] === 'Y') dScore++
  }

  // 파트 E (17-20): 실행력
  let eScore = 0
  for (let i = 17; i <= 20; i++) {
    if (answers[i] === 'Y') eScore++
  }

  const scores = { a: aScore, b: bScore, c: cScore, d: dScore, e: eScore }

  // 분류 로직
  const aiTotal = scores.a + scores.b // AI활용도 + AI민감도 합산 (0-8)

  let typeCode: TypeCode

  if (aiTotal >= 6) {
    // AI 성향 높음
    if (scores.c >= 3) {
      // 독립성 높음
      if (scores.e >= 3) typeCode = 'AI_DOM'    // AI 지배자 (AI LLM)
      else typeCode = 'LLM_DES'                  // LLM 설계자 (AI LLM)
    } else {
      // 팀 지향
      if (scores.e >= 3) typeCode = 'AI_LEAD'   // AI 팀장 (AI 서비스 개발자)
      else typeCode = 'LLM_ART'                  // LLM 아티스트 (AI 서비스 개발자)
    }
  } else if (scores.d >= 3 && scores.c >= 3) {
    // 논리+독립 높음 → DE
    if (scores.e >= 3) typeCode = 'DE_SOLO'      // DE 은둔자 (데이터 엔지니어)
    else typeCode = 'DE_STRAT'                    // DE 전략가 (데이터 엔지니어)
  } else {
    // 나머지 → DA
    if (scores.d >= 2) typeCode = 'DA_LOG'       // DA 논리왕 (데이터 분석)
    else typeCode = 'DA_ART'                      // DA 예술가 (데이터 분석)
  }

  const aiScore = typeInfo[typeCode].aiScore

  return {
    typeCode,
    aiScore,
    scores,
  }
}
