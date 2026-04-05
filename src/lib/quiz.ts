export type Question = {
  id: number
  part: 'A' | 'B' | 'C'
  text: string
  options: { label: string; value: string; score?: number }[]
}

export const questions: Question[] = [
  // Part A — MBTI 매핑 (6문항)
  {
    id: 1,
    part: 'A',
    text: '회의에서 나는?',
    options: [
      { label: '먼저 발언하고 아이디어를 쏟아낸다', value: 'E' },
      { label: '충분히 듣고 나서 신중하게 말한다', value: 'I' },
    ],
  },
  {
    id: 2,
    part: 'A',
    text: '새 프로젝트를 시작할 때 나는?',
    options: [
      { label: '검증된 방법과 구체적인 데이터로 시작한다', value: 'S' },
      { label: '큰 그림과 가능성부터 그려본다', value: 'N' },
    ],
  },
  {
    id: 3,
    part: 'A',
    text: '팀원이 실수했을 때 나는?',
    options: [
      { label: '원인 분석과 개선안을 먼저 제시한다', value: 'T' },
      { label: '먼저 공감하고 함께 해결책을 찾는다', value: 'F' },
    ],
  },
  {
    id: 4,
    part: 'A',
    text: '업무 방식은?',
    options: [
      { label: '계획대로 착착 끝내는 스타일', value: 'J' },
      { label: '상황 보면서 유연하게 처리하는 스타일', value: 'P' },
    ],
  },
  {
    id: 5,
    part: 'A',
    text: '주말 재충전 방식은?',
    options: [
      { label: '친구들 만나거나 밖에서 활동한다', value: 'E' },
      { label: '혼자만의 시간으로 에너지를 충전한다', value: 'I' },
    ],
  },
  {
    id: 6,
    part: 'A',
    text: '보고서를 쓸 때 나는?',
    options: [
      { label: '숫자와 팩트 위주로 깔끔하게 정리한다', value: 'S' },
      { label: '맥락과 인사이트를 강조해서 스토리를 만든다', value: 'N' },
    ],
  },

  // Part B — AI 대체 가능성 (4문항)
  {
    id: 7,
    part: 'B',
    text: '내 주요 업무에서 반복적인 작업의 비중은?',
    options: [
      { label: '80% 이상 — 매일 같은 일을 한다', value: 'B1_HIGH', score: 80 },
      { label: '50~80% — 반복도 있고 창의도 있다', value: 'B1_MID', score: 50 },
      { label: '30~50% — 대부분 새로운 판단이 필요하다', value: 'B1_LOW', score: 30 },
      { label: '30% 미만 — 매번 다른 문제를 푼다', value: 'B1_MIN', score: 10 },
    ],
  },
  {
    id: 8,
    part: 'B',
    text: '내 직무에서 AI 도구(ChatGPT 등)를\n활용하면?',
    options: [
      { label: '내 일의 90%를 대신 할 수 있을 것 같다', value: 'B2_HIGH', score: 85 },
      { label: '절반 정도는 도움 받을 수 있겠다', value: 'B2_MID', score: 50 },
      { label: '보조 도구 수준이고 핵심은 내가 해야 한다', value: 'B2_LOW', score: 25 },
      { label: '내 직무에 AI는 거의 적용 안 된다', value: 'B2_MIN', score: 10 },
    ],
  },
  {
    id: 9,
    part: 'B',
    text: '내 직업에서 가장 중요한 능력은?',
    options: [
      { label: '정확한 데이터 입력 / 문서 처리', value: 'B3_DATA', score: 80 },
      { label: '고객 응대 / 커뮤니케이션', value: 'B3_COMM', score: 45 },
      { label: '전략적 판단 / 의사결정', value: 'B3_STRAT', score: 20 },
      { label: '창의적 발상 / 예술적 표현', value: 'B3_CREA', score: 30 },
    ],
  },
  {
    id: 10,
    part: 'B',
    text: 'AI 뉴스를 보면 드는 솔직한 생각은?',
    options: [
      { label: '"나도 대체될 것 같아 불안하다"', value: 'B4_SCARED', score: 70 },
      { label: '"잘 활용하면 경쟁력이 올라갈 것 같다"', value: 'B4_OPPO', score: 30 },
      { label: '"아직은 내 일을 못 따라온다"', value: 'B4_SAFE', score: 20 },
      { label: '"관심 없다 / 잘 모른다"', value: 'B4_NONE', score: 55 },
    ],
  },

  // Part C — 퇴근 레벨 (3문항)
  {
    id: 11,
    part: 'C',
    text: '이번 주 평균 퇴근 시간은?',
    options: [
      { label: '칼퇴! 6시 이전', value: 'C1_EARLY' },
      { label: '그래도 7~8시', value: 'C1_MID' },
      { label: '9~10시... 야근 루틴', value: 'C1_LATE' },
      { label: '자정 이후 — 퇴근이란 개념이 없다', value: 'C1_ZOMBIE' },
    ],
  },
  {
    id: 12,
    part: 'C',
    text: '주말에 업무 연락이 오면?',
    options: [
      { label: '무조건 무시 — 나의 시간은 나의 것', value: 'C2_IGNORE' },
      { label: '눈팅은 하지만 답장은 월요일에', value: 'C2_DELAY' },
      { label: '보면 바로 답장하게 됨... 습관이 됐다', value: 'C2_REPLY' },
      { label: '주말도 출근한다 이미', value: 'C2_WORK' },
    ],
  },
  {
    id: 13,
    part: 'C',
    text: '"AI가 내 야근을 없애줄 수 있다"는 말에?',
    options: [
      { label: '제발요 당장 도입해주세요', value: 'C3_PLEASE' },
      { label: '반반 — 일은 줄겠지만 다른 일이 생긴다', value: 'C3_MAYBE' },
      { label: '야근은 일 때문이 아니라 문화 때문', value: 'C3_CULTURE' },
      { label: '이미 AI 써도 야근 중', value: 'C3_ALREADY' },
    ],
  },
]

export type MbtiType =
  | 'ENTJ' | 'ENTP' | 'ENFJ' | 'ENFP'
  | 'ESTJ' | 'ESTP' | 'ESFJ' | 'ESFP'
  | 'INTJ' | 'INTP' | 'INFJ' | 'INFP'
  | 'ISTJ' | 'ISTP' | 'ISFJ' | 'ISFP'

export type JobType =
  | 'AI_PIONEER'
  | 'CORPORATE_SURVIVOR'
  | 'CREATIVE_REBEL'
  | 'DATA_GUARDIAN'
  | 'PEOPLE_CONNECTOR'
  | 'STRATEGY_MASTER'
  | 'SILENT_EXECUTOR'
  | 'WILD_CARD'

export type ResultData = {
  mbtiType: MbtiType
  aiScore: number
  jobType: JobType
}

export type BootcampType = '데이터 분석' | '데이터 엔지니어링' | 'AI LLM'

export const bootcampInfo: Record<
  BootcampType,
  { label: string; description: string; tag: string; color: string }
> = {
  '데이터 분석': {
    label: '데이터 분석 부트캠프',
    description: '비즈니스 데이터를 읽고 인사이트로 바꾸는 실전 과정. SQL · Python · 시각화까지.',
    tag: '취업 연계',
    color: '#10b981',
  },
  '데이터 엔지니어링': {
    label: '데이터 엔지니어링 부트캠프',
    description: '데이터 파이프라인 설계부터 클라우드 인프라까지. 실무 프로젝트 중심.',
    tag: '실무 집중',
    color: '#6366f1',
  },
  'AI LLM': {
    label: 'AI · LLM 부트캠프',
    description: 'ChatGPT API · LangChain · RAG 구축까지. AI를 직접 만드는 과정.',
    tag: '최신 트렌드',
    color: '#f59e0b',
  },
}

export const jobTypeInfo: Record<
  JobType,
  {
    title: string
    subtitle: string
    celebrity: string
    company: string
    description: string
    aiTip: string
    jobs: string[]
    color: string
    emoji: string
    scoreComment: (score: number) => string
    bootcamp: BootcampType
    bootcampReason: string
  }
> = {
  AI_PIONEER: {
    title: 'AI를 부려먹는 사람',
    subtitle: '누구보다 빠르게 AI를 내 편으로',
    bootcamp: 'AI LLM',
    bootcampReason: '이미 AI 친화적인 당신, LLM을 직접 다루면 경쟁자가 없어집니다.',
    celebrity: '일론 머스크 스타일',
    company: '테슬라 · 오픈AI 창업자형',
    description:
      '당신은 AI를 두려워하지 않습니다. 오히려 AI를 도구로 삼아 경쟁자보다 10배 빠르게 움직이는 타입입니다. 변화에 가장 먼저 올라타는 사람이 결국 가장 많이 남습니다.',
    aiTip:
      'ChatGPT + Notion AI로 보고서 자동화, Claude로 코드 리뷰 — 지금 당장 도입하세요. 당신의 직관과 AI의 속도가 합쳐지면 무적입니다.',
    jobs: ['AI 프로덕트 매니저', '스타트업 창업자', '디지털 전략 컨설턴트'],
    color: '#6366f1',
    emoji: '🚀',
    scoreComment: (s) =>
      s <= 30
        ? '대체 걱정 제로! 당신은 AI를 부리는 사람입니다.'
        : s <= 60
        ? 'AI와 공존하며 한 단계 더 올라갈 수 있습니다.'
        : '지금 당장 AI 툴을 배우면 역전 가능합니다!',
  },
  CORPORATE_SURVIVOR: {
    title: '조직에서 살아남는 사람',
    subtitle: '조직의 언어를 AI보다 잘 아는 사람',
    bootcamp: '데이터 분석',
    bootcampReason: '보고서와 의사결정에 데이터 역량이 더해지면 조직에서 독보적이 됩니다.',
    celebrity: '삼성전자 임원 스타일',
    company: '삼성전자 · LG전자 · 현대차',
    description:
      '수많은 보고서와 회의를 버텨낸 당신. 프로세스를 이해하고 사람을 움직이는 능력은 AI가 쉽게 따라오지 못합니다. 단, AI를 모르면 도태됩니다.',
    aiTip:
      '내부 보고서 초안은 ChatGPT로, 데이터 분석은 Copilot으로. 하루 2시간 절약이 당신을 살립니다.',
    jobs: ['조직개발 전문가', '전략기획 팀장', '디지털 혁신 담당'],
    color: '#0ea5e9',
    emoji: '🏢',
    scoreComment: (s) =>
      s <= 30
        ? '조직 장악력 최강! AI도 당신의 부하입니다.'
        : s <= 60
        ? 'AI 도구 몇 가지만 익히면 완벽한 생존 패키지!'
        : '지금 AI 툴 하나라도 도입하면 당장 티가 납니다.',
  },
  CREATIVE_REBEL: {
    title: 'AI가 절대 못 베끼는 사람',
    subtitle: 'AI가 흉내 못 내는 감성의 소유자',
    bootcamp: 'AI LLM',
    bootcampReason: '창의력 + AI 도구 조합이 가장 강력합니다. LLM을 조수로 쓰는 법을 배우세요.',
    celebrity: '방탄소년단 RM 스타일',
    company: '카카오 · 네이버 · 크리에이터',
    description:
      '독창적인 아이디어와 감성이 무기인 당신. AI는 평균을 잘 만들지만, 당신 같은 반란자의 창의성은 대체 불가입니다. 단, AI로 반복 작업을 제거하면 더 빛납니다.',
    aiTip:
      'Midjourney로 시각화, Claude로 카피 초안 — AI를 조수로 써서 아이디어 실현 속도를 높이세요.',
    jobs: ['크리에이티브 디렉터', '콘텐츠 전략가', 'UX 리서처'],
    color: '#f59e0b',
    emoji: '🎨',
    scoreComment: (s) =>
      s <= 30
        ? '창의력은 AI 대체 불가 영역! 당신이 앞섭니다.'
        : s <= 60
        ? '창의력 + AI 도구 = 슈퍼파워 조합!'
        : 'AI로 반복 줄이고 창의에만 집중하세요.',
  },
  DATA_GUARDIAN: {
    title: '숫자로 모든 걸 증명하는 사람',
    subtitle: '숫자 뒤에 숨겨진 진실을 찾는 사람',
    bootcamp: '데이터 분석',
    bootcampReason: '당신의 성향은 데이터 분석가에 최적화되어 있습니다. 지금 시작하면 6개월 내 전직 가능.',
    celebrity: '구글 데이터 사이언티스트 스타일',
    company: '카카오뱅크 · 토스 · 네이버',
    description:
      '데이터로 말하고, 숫자로 설득하는 당신. AI 시대에 가장 각광받는 유형 중 하나입니다. 단순 집계는 AI가 하지만, 의미 해석과 의사결정은 당신이 합니다.',
    aiTip:
      'Python + ChatGPT API 연동으로 자동 분석 파이프라인 구축. SQL 쿼리는 Copilot에 맡기고 인사이트 도출에 집중하세요.',
    jobs: ['데이터 분석가', '비즈니스 인텔리전스 전문가', '핀테크 기획자'],
    color: '#10b981',
    emoji: '📊',
    scoreComment: (s) =>
      s <= 30
        ? '데이터 + 판단력 = AI 시대 최강 조합!'
        : s <= 60
        ? 'AI 분석 도구 하나 추가하면 레벨 업!'
        : '데이터 역량 강화에 집중하면 역전 가능!',
  },
  PEOPLE_CONNECTOR: {
    title: '사람이 곧 스펙인 사람',
    subtitle: 'AI가 절대 못 하는 관계의 기술',
    bootcamp: '데이터 분석',
    bootcampReason: '데이터로 사람을 설득하는 능력을 더하면 HR · 영업에서 최강이 됩니다.',
    celebrity: '스타벅스 하워드 슐츠 스타일',
    company: '인사팀 · 영업 · HR 컨설팅',
    description:
      '사람과 사람을 잇고, 신뢰를 쌓는 능력이 핵심인 당신. 공감력과 네트워크는 AI의 가장 취약한 영역입니다. 이 강점을 살리면 AI 시대에도 오히려 더 빛납니다.',
    aiTip:
      'AI로 미팅 준비 자동화 (상대방 정보 요약, 대화 포인트 생성). 관계 구축 시간에 더 집중하세요.',
    jobs: ['HR 비즈니스 파트너', '커뮤니티 매니저', '세일즈 전략가'],
    color: '#ec4899',
    emoji: '🤝',
    scoreComment: (s) =>
      s <= 30
        ? '인간 네트워크는 AI가 절대 못 빼앗아요!'
        : s <= 60
        ? 'AI + 인간적 감성의 하이브리드 전략이 답!'
        : '지금 인적 네트워크에 투자하면 미래가 달라집니다.',
  },
  STRATEGY_MASTER: {
    title: '3수 앞을 보는 사람',
    subtitle: '복잡한 판을 읽고 움직이는 체스 플레이어',
    bootcamp: '데이터 분석',
    bootcampReason: '전략적 사고 + 데이터 분석 = 컨설팅 · 기획 시장에서 독보적 포지션.',
    celebrity: 'McKinsey 파트너 스타일',
    company: '전략컨설팅 · 투자은행 · VC',
    description:
      '복잡한 상황을 분석하고 최적의 전략을 짜는 당신. AI가 데이터를 처리해도 최종 판단과 책임은 사람이 집니다. 전략적 사고는 AI 시대에 더 가치 있어집니다.',
    aiTip:
      'ChatGPT로 시나리오 브레인스토밍, Perplexity로 시장 조사 자동화. 당신의 판단 시간을 늘리세요.',
    jobs: ['경영전략 컨설턴트', '사업개발 리더', '투자 심사역'],
    color: '#8b5cf6',
    emoji: '♟️',
    scoreComment: (s) =>
      s <= 30
        ? '전략 판단력은 AI가 넘볼 수 없는 영역!'
        : s <= 60
        ? 'AI 리서치 도구로 무장하면 더 강해집니다!'
        : '전략 역량 + AI 분석 = 다음 레벨로 도약!',
  },
  SILENT_EXECUTOR: {
    title: '말 없이 다 해버리는 사람',
    subtitle: '말보다 결과로 증명하는 사람',
    bootcamp: '데이터 엔지니어링',
    bootcampReason: '묵묵히 실행하는 성향은 파이프라인 구축에 딱 맞습니다. 수요 폭발 중인 직군입니다.',
    celebrity: '워런 버핏 스타일',
    company: '제조 · 물류 · 운영관리',
    description:
      '묵묵히 실행하고 책임지는 당신. 운영과 실행력은 여전히 현장에서 가장 중요합니다. 단, 반복 업무의 자동화 속도가 빨라지고 있어 지금 준비가 필요합니다.',
    aiTip:
      'RPA 도구(UiPath 등)로 반복 업무 자동화, AI 일정 관리 도구로 실행력 극대화. 당신의 꼼꼼함 + 자동화 = 최강 조합.',
    jobs: ['운영 매니저', '프로젝트 매니저', '품질관리 전문가'],
    color: '#64748b',
    emoji: '⚙️',
    scoreComment: (s) =>
      s <= 30
        ? '실행력 + 꼼꼼함은 AI도 못 따라와요!'
        : s <= 60
        ? '자동화 도구 하나 배우면 생산성 2배!'
        : '지금 RPA나 자동화 도구에 투자할 타이밍!',
  },
  WILD_CARD: {
    title: 'AI도 예측 못 하는 사람',
    subtitle: '예측 불가능한 게 오히려 강점',
    bootcamp: 'AI LLM',
    bootcampReason: '다양한 실험을 즐기는 당신에게 LLM 과정은 가장 빠르게 몰입할 수 있는 분야입니다.',
    celebrity: '스티브 잡스 스타일',
    company: '스타트업 · 프리랜서 · 포트폴리오 커리어',
    description:
      '틀에 맞지 않는 당신. 그게 바로 AI 시대의 최대 강점입니다. AI는 패턴을 학습하지만 당신은 패턴을 깨는 사람입니다. 불확실성을 즐기는 사람이 AI 시대를 지배합니다.',
    aiTip:
      '다양한 AI 도구를 실험해보세요. Claude, Midjourney, Suno, Runway — 당신의 실험 정신이 남들보다 빠르게 배우게 만듭니다.',
    jobs: ['멀티 포트폴리오 크리에이터', 'AI 도구 얼리어답터', '플렉시블 커리어 설계자'],
    color: '#f97316',
    emoji: '🃏',
    scoreComment: (s) =>
      s <= 30
        ? '예측 불가 카드! AI도 당신을 못 따라잡아요.'
        : s <= 60
        ? '다양한 AI 도구 실험으로 독보적 영역 개척!'
        : '지금이 바로 새로운 역할을 만들 타이밍!',
  },
}

export function calculateResult(answers: Record<number, string>): ResultData {
  // MBTI 계산
  const counts = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }
  for (const [qId, val] of Object.entries(answers)) {
    const q = questions.find((q) => q.id === Number(qId))
    if (q?.part === 'A' && val in counts) {
      counts[val as keyof typeof counts]++
    }
  }
  const e = counts.E >= counts.I ? 'E' : 'I'
  const s = counts.S >= counts.N ? 'S' : 'N'
  const t = counts.T >= counts.F ? 'T' : 'F'
  const j = counts.J >= counts.P ? 'J' : 'P'
  const mbtiType = `${e}${s}${t}${j}` as MbtiType

  // AI 점수 계산 (Part B 평균)
  const scoreMap: Record<string, number> = {
    B1_HIGH: 80, B1_MID: 50, B1_LOW: 30, B1_MIN: 10,
    B2_HIGH: 85, B2_MID: 50, B2_LOW: 25, B2_MIN: 10,
    B3_DATA: 80, B3_COMM: 45, B3_STRAT: 20, B3_CREA: 30,
    B4_SCARED: 70, B4_OPPO: 30, B4_SAFE: 20, B4_NONE: 55,
  }
  const bScores = [7, 8, 9, 10]
    .map((id) => scoreMap[answers[id]] ?? 50)
    .filter(Boolean)
  const aiScore = Math.round(bScores.reduce((a, b) => a + b, 0) / bScores.length)

  // JobType 결정
  const jobType = getJobType(mbtiType, aiScore)

  return { mbtiType, aiScore, jobType }
}

function getJobType(mbti: MbtiType, aiScore: number): JobType {
  const map: Record<MbtiType, JobType> = {
    ENTJ: 'STRATEGY_MASTER',
    ENTP: 'AI_PIONEER',
    ENFJ: 'PEOPLE_CONNECTOR',
    ENFP: 'CREATIVE_REBEL',
    ESTJ: 'CORPORATE_SURVIVOR',
    ESTP: 'WILD_CARD',
    ESFJ: 'PEOPLE_CONNECTOR',
    ESFP: 'CREATIVE_REBEL',
    INTJ: 'STRATEGY_MASTER',
    INTP: 'DATA_GUARDIAN',
    INFJ: 'CREATIVE_REBEL',
    INFP: 'CREATIVE_REBEL',
    ISTJ: 'SILENT_EXECUTOR',
    ISTP: 'DATA_GUARDIAN',
    ISFJ: 'SILENT_EXECUTOR',
    ISFP: 'WILD_CARD',
  }
  // aiScore 높으면 WILD_CARD 혹은 AI_PIONEER 우선
  if (aiScore >= 70 && (mbti.startsWith('E'))) return 'AI_PIONEER'
  return map[mbti]
}
