'use client'

const color = '#6366f1'

function TypeCard({ label, color: cardColor, children }: { label: string; color: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full shrink-0" style={{ background: cardColor }} />
        <p className="text-xs font-bold text-slate-500">{label}</p>
      </div>
      {children}
    </div>
  )
}

export default function PreviewPage() {
  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <h1 className="text-2xl font-black text-center text-slate-800 mb-2">직업 섹션 리디자인 10종</h1>
      <p className="text-center text-slate-400 text-sm mb-10">UI + 내용 동시 변경 — 마음에 드는 번호 골라주세요</p>

      <div className="flex flex-col gap-10 max-w-sm mx-auto">

        {/* ─── 1 ─── */}
        <Section num={1} label="충격 수치 → 자연스러운 전환">
          <div className="space-y-2 mb-4">
            {[
              { name: '기획서 작성', rate: 82, danger: true },
              { name: '보고서 작성', rate: 88, danger: true },
              { name: '전략 수립', rate: null, danger: false },
              { name: 'AI 서비스 설계', rate: null, danger: false },
            ].map(t => (
              <div key={t.name} className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm ${t.danger ? 'bg-red-50' : 'bg-emerald-50'}`}>
                <span className={t.danger ? 'text-red-700' : 'text-emerald-700'}>{t.danger ? '🤖' : '✅'} {t.name}</span>
                <span className={`font-black text-xs ${t.danger ? 'text-red-500' : 'text-emerald-600'}`}>
                  {t.danger ? `${t.rate}% 대체됨` : '아직 내 영역'}
                </span>
              </div>
            ))}
          </div>
          <div className="rounded-xl p-4" style={{ background: color + '08', border: `1px solid ${color}20` }}>
            <p className="text-xs font-bold text-slate-500 mb-3">살아남은 사람들의 공통점</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-400 line-through">기획자</span>
                <span className="text-slate-300">+</span>
                <span className="text-slate-600">AI 설계</span>
                <span className="text-slate-300">=</span>
                <span className="font-black text-sm" style={{ color }}>AI 서비스 기획자</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-400 line-through">PM</span>
                <span className="text-slate-300">+</span>
                <span className="text-slate-600">LLM 이해</span>
                <span className="text-slate-300">=</span>
                <span className="font-black text-sm" style={{ color }}>LLM 제품 설계자</span>
              </div>
            </div>
          </div>
        </Section>

        {/* ─── 2 ─── */}
        <Section num={2} label="Before / After 카드">
          <p className="text-xs font-bold text-slate-500 mb-3">당신 업무의 현실</p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="rounded-xl p-3 bg-red-50 border border-red-100">
              <p className="text-xs font-bold text-red-400 mb-2">AI가 가져간 것</p>
              <p className="text-sm text-red-700 font-medium">기획서 작성 82%</p>
              <p className="text-sm text-red-700 font-medium">보고서 작성 88%</p>
            </div>
            <div className="rounded-xl p-3 bg-emerald-50 border border-emerald-100">
              <p className="text-xs font-bold text-emerald-500 mb-2">아직 남은 것</p>
              <p className="text-sm text-emerald-700 font-medium">전략 수립</p>
              <p className="text-sm text-emerald-700 font-medium">AI 서비스 설계</p>
            </div>
          </div>
          <p className="text-xs font-bold text-slate-500 mb-2">남은 강점에 AI를 더하면</p>
          <div className="space-y-2">
            {[
              { before: '기획자', after: 'AI 서비스 기획자' },
              { before: 'PM', after: 'LLM 제품 설계자' },
            ].map(t => (
              <div key={t.before} className="flex items-center gap-2 rounded-xl overflow-hidden border border-slate-200 text-sm">
                <div className="bg-slate-100 px-3 py-2.5 text-slate-400 font-medium shrink-0">{t.before}</div>
                <div className="text-slate-300 font-bold">→</div>
                <div className="px-3 py-2.5 font-black" style={{ color }}>{t.after}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* ─── 3 ─── */}
        <Section num={3} label="퍼센트 바 + 스토리">
          <p className="text-sm font-bold text-slate-700 mb-3">지금 당신이 하는 일, AI도 할 수 있습니다</p>
          <div className="space-y-3 mb-5">
            {[
              { name: '기획서 작성', rate: 82 },
              { name: '보고서 작성', rate: 88 },
              { name: '전략 수립', rate: 36 },
              { name: 'AI 서비스 설계', rate: 19 },
            ].map(t => (
              <div key={t.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">{t.name}</span>
                  <span className={`font-bold ${t.rate >= 60 ? 'text-red-500' : 'text-emerald-600'}`}>{t.rate}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${t.rate}%`, background: t.rate >= 60 ? '#ef4444' : '#10b981' }} />
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 rounded-xl text-sm" style={{ background: color + '08', border: `1px solid ${color}20` }}>
            <p className="font-bold text-slate-700 mb-1">대체 안 되는 사람이 되려면</p>
            <p className="text-slate-500 text-xs leading-relaxed">AI가 못 하는 <strong className="text-slate-700">전략·설계 역량</strong>에 집중해야 합니다. 기획자 → AI 서비스 기획자, 이 전환이 가장 빠른 루트입니다.</p>
          </div>
        </Section>

        {/* ─── 4 ─── */}
        <Section num={4} label="타임라인 스타일">
          <p className="text-xs font-bold text-slate-400 mb-4 uppercase">지금 이 순간도 바뀌고 있습니다</p>
          <div className="relative pl-5 border-l-2 border-slate-200 space-y-4 mb-5">
            {[
              { name: '기획서 작성', rate: 82, done: true },
              { name: '보고서 작성', rate: 88, done: true },
              { name: '전략 수립', rate: null, done: false },
              { name: 'AI 서비스 설계', rate: null, done: false },
            ].map(t => (
              <div key={t.name} className="relative">
                <div className={`absolute -left-[21px] w-3 h-3 rounded-full border-2 border-white ${t.done ? 'bg-red-400' : 'bg-emerald-400'}`} />
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${t.done ? 'text-slate-400 line-through' : 'text-slate-800 font-bold'}`}>{t.name}</span>
                  <span className={`text-xs font-bold ${t.done ? 'text-red-400' : 'text-emerald-600'}`}>
                    {t.done ? `AI 대체 ${t.rate}%` : '✅ 살아남음'}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {[
              { from: '기획자', to: 'AI 서비스 기획자', label: '지금 전환 중' },
              { from: 'PM', to: 'LLM 제품 설계자', label: '지금 전환 중' },
            ].map(t => (
              <div key={t.from} className="flex items-center justify-between rounded-xl px-4 py-2.5 bg-slate-50 border border-slate-200">
                <div>
                  <p className="text-xs text-slate-400">{t.label}</p>
                  <p className="text-sm font-bold text-slate-500">{t.from}</p>
                </div>
                <span className="text-slate-300 text-lg font-bold">→</span>
                <div className="text-right">
                  <p className="text-xs font-bold" style={{ color }}>목표</p>
                  <p className="text-sm font-black" style={{ color }}>{t.to}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ─── 5 ─── */}
        <Section num={5} label="경고 박스 → CTA 연결">
          <div className="rounded-xl p-4 bg-red-50 border border-red-200 mb-4">
            <p className="text-sm font-black text-red-700 mb-1">⚠️ 지금 당신이 하는 일의 85%</p>
            <p className="text-xs text-red-500">기획서·보고서·자료정리 — 이미 AI가 대신하고 있습니다</p>
          </div>
          <div className="rounded-xl p-4 bg-emerald-50 border border-emerald-200 mb-4">
            <p className="text-sm font-black text-emerald-700 mb-1">✅ 아직 살아있는 스킬</p>
            <p className="text-xs text-emerald-600">전략 수립 · AI 서비스 설계 — 이게 당신의 무기입니다</p>
          </div>
          <div className="rounded-xl p-4 border" style={{ background: color + '08', borderColor: color + '30' }}>
            <p className="text-xs font-bold text-slate-500 mb-2">이 두 가지를 합친 사람들</p>
            <div className="space-y-1.5">
              <p className="text-sm font-black" style={{ color }}>기획자 경험 + AI 설계 → AI 서비스 기획자</p>
              <p className="text-sm font-black" style={{ color }}>PM 경험 + LLM 이해 → LLM 제품 설계자</p>
            </div>
          </div>
        </Section>

        {/* ─── 6 ─── */}
        <Section num={6} label="큰 숫자 충격 → 희망">
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="rounded-xl p-3 bg-red-50 border border-red-100 text-center">
              <p className="text-3xl font-black text-red-500">88%</p>
              <p className="text-xs text-red-400 mt-0.5">보고서 작성 대체율</p>
            </div>
            <div className="rounded-xl p-3 bg-red-50 border border-red-100 text-center">
              <p className="text-3xl font-black text-red-500">82%</p>
              <p className="text-xs text-red-400 mt-0.5">기획서 작성 대체율</p>
            </div>
            <div className="rounded-xl p-3 bg-emerald-50 border border-emerald-100 text-center">
              <p className="text-3xl font-black text-emerald-500">19%</p>
              <p className="text-xs text-emerald-500 mt-0.5">AI 서비스 설계 위험</p>
            </div>
            <div className="rounded-xl p-3 bg-emerald-50 border border-emerald-100 text-center">
              <p className="text-3xl font-black text-emerald-500">36%</p>
              <p className="text-xs text-emerald-500 mt-0.5">전략 수립 위험</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 text-center mb-3">살아남는 사람은 이미 방향을 틀었습니다</p>
          <div className="space-y-2">
            {[
              { from: '기획자', to: 'AI 서비스 기획자' },
              { from: 'PM', to: 'LLM 제품 설계자' },
            ].map(t => (
              <div key={t.from} className="flex items-center gap-3 rounded-xl p-3" style={{ background: color + '08', border: `1px solid ${color}20` }}>
                <span className="text-sm text-slate-400 line-through shrink-0">{t.from}</span>
                <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-indigo-400" />
                <span className="text-sm font-black shrink-0" style={{ color }}>{t.to}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ─── 7 ─── */}
        <Section num={7} label="미니멀 + 한 줄 인사이트">
          <div className="divide-y divide-slate-100 mb-4">
            {[
              { name: '기획서 작성', rate: 82, danger: true },
              { name: '보고서 작성', rate: 88, danger: true },
              { name: '전략 수립', rate: 36, danger: false },
              { name: 'AI 서비스 설계', rate: 19, danger: false },
            ].map(t => (
              <div key={t.name} className="flex items-center justify-between py-2.5">
                <span className="text-sm text-slate-700">{t.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${t.rate}%`, background: t.danger ? '#ef4444' : '#10b981' }} />
                  </div>
                  <span className={`text-xs font-bold w-14 text-right ${t.danger ? 'text-red-500' : 'text-emerald-600'}`}>
                    {t.danger ? `대체 ${t.rate}%` : `안전 ${t.rate}%`}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mb-2">지금 배워야 할 방향</p>
          <div className="space-y-1.5">
            {[
              { from: '기획자', to: 'AI 서비스 기획자' },
              { from: 'PM', to: 'LLM 제품 설계자' },
            ].map(t => (
              <p key={t.from} className="text-sm">
                <span className="text-slate-400">{t.from}</span>
                <span className="text-slate-300 mx-1.5">→</span>
                <span className="font-black" style={{ color }}>{t.to}</span>
              </p>
            ))}
          </div>
        </Section>

        {/* ─── 8 ─── */}
        <Section num={8} label="배지 + 전환 강조">
          <p className="text-sm font-bold text-slate-700 mb-3">지금 당신이 하는 일</p>
          <div className="flex flex-wrap gap-2 mb-5">
            {[
              { name: '기획서 작성', rate: 82, danger: true },
              { name: '보고서 작성', rate: 88, danger: true },
              { name: '전략 수립', danger: false },
              { name: 'AI 서비스 설계', danger: false },
            ].map(t => (
              <span key={t.name} className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full border ${t.danger ? 'bg-red-50 border-red-200 text-red-600' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
                {t.danger ? `🤖 ${t.name} ${t.rate}%` : `✅ ${t.name}`}
              </span>
            ))}
          </div>
          <p className="text-sm font-bold text-slate-700 mb-2">1년 뒤 살아남는 포지션</p>
          <div className="space-y-2">
            {[
              { from: '기획자 경험', to: 'AI 서비스 기획자' },
              { from: 'PM 경험', to: 'LLM 제품 설계자' },
            ].map(t => (
              <div key={t.from} className="rounded-xl p-3 flex items-center gap-3" style={{ background: color + '08', border: `1px solid ${color}20` }}>
                <div className="text-center flex-1">
                  <p className="text-xs text-slate-400">지금 가진 것</p>
                  <p className="text-sm font-bold text-slate-600">{t.from}</p>
                </div>
                <span className="text-xl font-black" style={{ color }}>+</span>
                <div className="text-center flex-1">
                  <p className="text-xs" style={{ color }}>더할 것</p>
                  <p className="text-sm font-black" style={{ color }}>AI 설계</p>
                </div>
                <span className="text-xl text-slate-300">=</span>
                <div className="text-center flex-1">
                  <p className="text-xs text-slate-400">목표</p>
                  <p className="text-xs font-black" style={{ color }}>{t.to}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ─── 9 ─── */}
        <Section num={9} label="스토리텔링 + 포지셔닝">
          <blockquote className="border-l-4 border-red-300 pl-4 mb-4">
            <p className="text-sm text-slate-600 leading-relaxed">"기획자로 5년 일했는데, 제가 하던 보고서 작성을 AI가 10분 만에 끝냅니다."</p>
          </blockquote>
          <div className="space-y-1.5 mb-4">
            {[
              { name: '기획서·보고서 작성', danger: true, rate: 85 },
              { name: '전략 수립·AI 설계', danger: false },
            ].map(t => (
              <div key={t.name} className={`flex justify-between items-center px-3 py-2 rounded-lg text-sm ${t.danger ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
                <span>{t.danger ? '🤖' : '✅'} {t.name}</span>
                <span className="font-bold text-xs">{t.danger ? `${t.rate}% 자동화` : '대체 불가'}</span>
              </div>
            ))}
          </div>
          <div className="rounded-xl p-4" style={{ background: color + '08', border: `1px solid ${color}20` }}>
            <p className="text-xs font-bold text-slate-500 mb-2">살아남은 사람들은 이렇게 했습니다</p>
            <p className="text-sm text-slate-700 leading-relaxed">
              기획 경험에 <strong style={{ color }}>AI 서비스 설계</strong>를 더해<br />
              <strong style={{ color }}>대체 불가 포지션</strong>으로 이동했습니다
            </p>
          </div>
        </Section>

        {/* ─── 10 ─── */}
        <Section num={10} label="선택지 제시 스타일">
          <p className="text-sm font-bold text-slate-700 mb-3">지금 당신에게 두 가지 선택이 있습니다</p>
          <div className="space-y-2 mb-4">
            <div className="rounded-xl p-4 bg-red-50 border border-red-200">
              <p className="text-sm font-black text-red-600 mb-1">❌ 지금처럼 계속한다면</p>
              <p className="text-xs text-red-500">기획서 82% · 보고서 88% AI 대체<br />2년 안에 포지션이 사라집니다</p>
            </div>
            <div className="rounded-xl p-4 border-2" style={{ background: color + '06', borderColor: color + '40' }}>
              <p className="text-sm font-black mb-1" style={{ color }}>✅ 지금 전환한다면</p>
              <p className="text-xs text-slate-600">기획자 → AI 서비스 기획자<br />PM → LLM 제품 설계자<br /><strong style={{ color }}>대체 불가 포지션 선점</strong></p>
            </div>
          </div>
          <p className="text-xs text-center text-slate-400">이 전환, 지금이 가장 빠른 타이밍입니다</p>
        </Section>

        {/* ─── 구분선 ─── */}
        <div className="text-center">
          <p className="text-lg font-black text-slate-700 mb-1">경고+전환+CTA 연결 10종</p>
          <p className="text-xs text-slate-400">위 섹션과 겹침 문제 해결 + CTA 자연 연결 방안</p>
        </div>

        {/* ─── 11 ─── */}
        <Section num={11} label="경고 없애고 전환만 (겹침 해결)">
          <p className="text-xs text-slate-400 mb-3">위에서 이미 위기를 봤으니, 여기선 방향만</p>
          <div className="rounded-2xl p-4 mb-3" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <p className="text-sm font-black text-emerald-700 mb-1">✅ 아직 살아있는 스킬</p>
            <p className="text-xs text-emerald-600">전략 수립 · AI 서비스 설계 — 이게 당신의 무기입니다</p>
          </div>
          <div className="rounded-2xl p-4 mb-3" style={{ background: color + '08', border: `1px solid ${color}30` }}>
            <p className="text-xs font-bold text-slate-500 mb-2">이 무기에 AI를 더하면</p>
            <p className="text-sm font-black leading-snug mb-1" style={{ color }}>기획자 경험 + AI 서비스 설계 → AI 서비스 기획자</p>
            <p className="text-sm font-black leading-snug" style={{ color }}>PM 경험 + LLM 이해 → LLM 제품 설계자</p>
          </div>
          <p className="text-xs text-center text-slate-400">이 전환을 가장 빠르게 — 매주 무료 특강 👇</p>
        </Section>

        {/* ─── 12 ─── */}
        <Section num={12} label="하나로 통합 (3박스 → 1박스)">
          <div className="rounded-2xl p-4 mb-3" style={{ background: color + '06', border: `1px solid ${color}25` }}>
            <p className="text-xs text-slate-500 mb-3">살아남은 사람들은 이렇게 했습니다</p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-lg shrink-0">✅</span>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">아직 살아있는 스킬</p>
                  <p className="text-sm font-bold text-slate-700">전략 수립 · AI 서비스 설계</p>
                </div>
              </div>
              <div className="h-px bg-slate-200" />
              <div className="flex items-start gap-3">
                <span className="text-lg shrink-0">➕</span>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">여기에 더한 것</p>
                  <p className="text-sm font-bold" style={{ color }}>AI 서비스 설계 · LLM 이해</p>
                </div>
              </div>
              <div className="h-px bg-slate-200" />
              <div className="flex items-start gap-3">
                <span className="text-lg shrink-0">🎯</span>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">결과</p>
                  <p className="text-sm font-black" style={{ color }}>AI 서비스 기획자 · LLM 제품 설계자</p>
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs text-center text-slate-400">이 전환 경로, 매주 무료 특강에서 배울 수 있습니다 👇</p>
        </Section>

        {/* ─── 13 ─── */}
        <Section num={13} label="공식처럼 표현">
          <p className="text-sm font-bold text-slate-700 mb-4 text-center">대체 안 되는 포지션의 공식</p>
          <div className="space-y-3 mb-4">
            {[
              { exp: '기획자 경험', plus: 'AI 서비스 설계', result: 'AI 서비스 기획자' },
              { exp: 'PM 경험', plus: 'LLM 이해', result: 'LLM 제품 설계자' },
            ].map(t => (
              <div key={t.exp} className="flex items-center gap-1 text-sm flex-wrap">
                <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-600 font-medium text-xs">{t.exp}</span>
                <span className="font-black text-slate-400">+</span>
                <span className="px-2 py-1 rounded-lg text-white font-bold text-xs" style={{ background: color }}>{t.plus}</span>
                <span className="font-black text-slate-400">=</span>
                <span className="px-2 py-1 rounded-lg font-black text-xs" style={{ background: color + '15', color }}>{t.result}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-center text-slate-400">이 공식, 매주 무료 특강에서 직접 만들어 보세요 👇</p>
        </Section>

        {/* ─── 14 ─── */}
        <Section num={14} label="스텝 형식 (단계별 행동)">
          <p className="text-xs font-bold text-slate-400 uppercase mb-4">지금 당장 해야 할 것</p>
          <div className="space-y-3 mb-4">
            {[
              { step: '1', title: '살아있는 스킬 확인', desc: '전략 수립 · AI 서비스 설계는 아직 내 영역', color: '#10b981' },
              { step: '2', title: 'AI 역량 한 가지 추가', desc: 'AI 서비스 설계 or LLM 이해', color: '#6366f1' },
              { step: '3', title: '포지션 전환', desc: 'AI 서비스 기획자 · LLM 제품 설계자', color: '#8b5cf6' },
            ].map(s => (
              <div key={s.step} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0 mt-0.5" style={{ background: s.color }}>{s.step}</div>
                <div>
                  <p className="text-sm font-bold text-slate-700">{s.title}</p>
                  <p className="text-xs text-slate-400">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-center text-slate-400">2단계를 가장 빠르게 — 매주 무료 특강 👇</p>
        </Section>

        {/* ─── 15 ─── */}
        <Section num={15} label="포지티브만 (위기 언급 없음)">
          <p className="text-sm font-bold text-slate-700 mb-1">당신에게 이미 있는 것</p>
          <p className="text-xs text-slate-400 mb-4">AI도 못 빼앗는 역량입니다</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {['전략 수립', 'AI 서비스 설계'].map(s => (
              <span key={s} className="px-3 py-1.5 rounded-full text-sm font-bold bg-emerald-50 border border-emerald-200 text-emerald-700">✅ {s}</span>
            ))}
          </div>
          <p className="text-sm font-bold text-slate-700 mb-2">여기에 하나만 더하면</p>
          <div className="space-y-2 mb-4">
            <div className="rounded-xl px-4 py-3 flex items-center justify-between" style={{ background: color + '08', border: `1px solid ${color}25` }}>
              <span className="text-sm text-slate-500">기획자</span>
              <span className="text-xs font-black" style={{ color }}>+ AI 서비스 설계 → AI 서비스 기획자</span>
            </div>
            <div className="rounded-xl px-4 py-3 flex items-center justify-between" style={{ background: color + '08', border: `1px solid ${color}25` }}>
              <span className="text-sm text-slate-500">PM</span>
              <span className="text-xs font-black" style={{ color }}>+ LLM 이해 → LLM 제품 설계자</span>
            </div>
          </div>
          <p className="text-xs text-center text-slate-400">이 한 가지, 매주 무료 특강에서 👇</p>
        </Section>

        {/* ─── 16 ─── */}
        <Section num={16} label="질문 → 답변 흐름">
          <div className="space-y-3 mb-4">
            <div className="rounded-xl p-3 bg-slate-50 border border-slate-200">
              <p className="text-sm font-bold text-slate-700">💬 "AI 시대에 기획자는 살아남을 수 있나요?"</p>
            </div>
            <div className="rounded-xl p-3" style={{ background: color + '08', border: `1px solid ${color}25` }}>
              <p className="text-sm font-black mb-1" style={{ color }}>살아남습니다. 단, 조건이 있어요.</p>
              <p className="text-xs text-slate-500 leading-relaxed">기획서·보고서는 AI가 대신합니다. 하지만 <strong className="text-slate-700">전략 수립 + AI 설계</strong>를 합친 사람은 대체 불가입니다.</p>
            </div>
            <div className="rounded-xl p-3 bg-emerald-50 border border-emerald-100">
              <p className="text-xs font-bold text-emerald-700 mb-1">실제 전환 사례</p>
              <p className="text-xs text-emerald-600">기획자 → AI 서비스 기획자</p>
              <p className="text-xs text-emerald-600">PM → LLM 제품 설계자</p>
            </div>
          </div>
          <p className="text-xs text-center text-slate-400">이 전환 방법, 매주 무료 특강에서 공개합니다 👇</p>
        </Section>

        {/* ─── 17 ─── */}
        <Section num={17} label="숫자 없이 임팩트 문장만">
          <div className="space-y-3 mb-4">
            <div className="border-l-4 border-red-300 pl-4 py-1">
              <p className="text-sm font-bold text-red-600">기획서 쓰는 시간, AI가 더 빠릅니다</p>
              <p className="text-xs text-red-400 mt-0.5">보고서도, 자료정리도 마찬가지입니다</p>
            </div>
            <div className="border-l-4 pl-4 py-1" style={{ borderColor: color }}>
              <p className="text-sm font-bold" style={{ color }}>하지만 전략을 짜고 서비스를 설계하는 건</p>
              <p className="text-xs text-slate-500 mt-0.5">아직 사람만 할 수 있습니다</p>
            </div>
            <div className="rounded-xl p-3" style={{ background: color + '08', border: `1px solid ${color}25` }}>
              <p className="text-xs text-slate-500 mb-1.5">이 역량을 가진 사람들이 가는 곳</p>
              <p className="text-sm font-black" style={{ color }}>AI 서비스 기획자 · LLM 제품 설계자</p>
            </div>
          </div>
          <p className="text-xs text-center text-slate-400">매주 이 전환을 직접 도와드립니다 👇</p>
        </Section>

        {/* ─── 18 ─── */}
        <Section num={18} label="한 줄 요약 + 전환만">
          <div className="rounded-2xl p-4 mb-3 text-center" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
            <p className="text-sm font-black text-red-700">기획서·보고서는 AI가, 전략·설계는 당신이</p>
          </div>
          <div className="space-y-2 mb-3">
            {[
              { from: '기획자', via: 'AI 서비스 설계', to: 'AI 서비스 기획자' },
              { from: 'PM', via: 'LLM 이해', to: 'LLM 제품 설계자' },
            ].map(t => (
              <div key={t.from} className="flex items-center gap-2 rounded-xl p-3" style={{ background: color + '08', border: `1px solid ${color}25` }}>
                <span className="text-xs text-slate-400 shrink-0">{t.from}</span>
                <span className="text-slate-300">+</span>
                <span className="text-xs font-bold shrink-0" style={{ color }}>{t.via}</span>
                <span className="text-slate-300">→</span>
                <span className="text-xs font-black shrink-0" style={{ color }}>{t.to}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-center text-slate-400">매주 무료 특강에서 직접 배울 수 있습니다 👇</p>
        </Section>

        {/* ─── 19 ─── */}
        <Section num={19} label="완전 미니멀 (텍스트만)">
          <div className="space-y-4 mb-4">
            <div>
              <p className="text-xs text-red-400 font-bold mb-1">AI가 대신하는 것</p>
              <p className="text-sm text-slate-600">기획서 작성 · 보고서 작성</p>
            </div>
            <div>
              <p className="text-xs font-bold mb-1" style={{ color }}>당신이 해야 할 것</p>
              <p className="text-sm text-slate-600">전략 수립 + AI 서비스 설계</p>
            </div>
            <div>
              <p className="text-xs text-emerald-500 font-bold mb-1">그 결과</p>
              <p className="text-sm font-black text-slate-800">기획자 → AI 서비스 기획자</p>
              <p className="text-sm font-black text-slate-800">PM → LLM 제품 설계자</p>
            </div>
          </div>
          <p className="text-xs text-center text-slate-400">이 전환, 매주 무료 특강에서 👇</p>
        </Section>

        {/* ─── 20 ─── */}
        <Section num={20} label="CTA와 완전 통합 (경계 없음)">
          <div className="space-y-2 mb-2">
            <p className="text-sm text-slate-600 leading-relaxed">
              기획서·보고서는 <span className="text-red-500 font-bold">AI가 대신</span>하지만,<br />
              전략·설계 역량은 <span className="font-bold" style={{ color }}>아직 당신 것</span>입니다.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              이 역량에 AI를 더한 사람들이<br />
              <span className="font-black" style={{ color }}>AI 서비스 기획자, LLM 제품 설계자</span>로<br />
              포지션을 옮기고 있습니다.
            </p>
          </div>
          <div className="mt-4 rounded-2xl p-4" style={{ background: '#FFFDE7', border: '2px solid #FEE500' }}>
            <p className="text-xs text-slate-600 mb-2 font-medium">이 전환을 매주 무료로 도와드립니다</p>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">🎓</span>
              <p className="text-sm font-black text-slate-900">매주 대기업 · AI/데이터 현직자 무료 특강</p>
            </div>
            <p className="text-xs text-slate-500">단톡방에서 직접 배우고 질문하세요</p>
          </div>
        </Section>

        {/* ─── DA / DE 유형 구분선 ─── */}
        <div className="text-center">
          <p className="text-lg font-black text-slate-700 mb-1">DA · DE 유형 실제 데이터 렌더링</p>
          <p className="text-xs text-slate-400">HSLF(DA 논리왕) · HSLP(DE 은둔자) · TSLF(DE 분석가) · TSLP(DE 전략가)</p>
        </div>

        {/* ─── DA-1: HSLF 5번 UI ─── */}
        <TypeCard label="HSLF · DA 논리왕 — 5번 UI 적용" color="#64748b">
          <div className="rounded-2xl p-4 mb-3" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
            <p className="text-sm font-black text-red-700 mb-1">⚠️ 지금 당신이 하는 일의 91%</p>
            <p className="text-xs text-red-500">데이터 정리 · 코드 작성 — 이미 AI가 대신하고 있습니다</p>
          </div>
          <div className="rounded-2xl p-4 mb-3" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <p className="text-sm font-black text-emerald-700 mb-1">✅ 아직 살아있는 스킬</p>
            <p className="text-xs text-emerald-600">파이프라인 설계 — 이게 당신의 무기입니다</p>
          </div>
          <div className="rounded-2xl p-4 mb-3" style={{ background: '#64748b10', border: '1px solid #64748b30' }}>
            <p className="text-xs font-bold text-slate-500 mb-2">이 두 가지를 합친 사람들</p>
            <p className="text-sm font-black leading-snug text-slate-700">개발자 경험 + 데이터 파이프라인 → 데이터 엔지니어</p>
            <p className="text-sm font-black leading-snug text-slate-700 mt-1">분석가 경험 + ML 파이프라인 → ML 파이프라인 엔지니어</p>
          </div>
          <p className="text-xs text-center text-slate-400">이 전환, 매주 무료 특강에서 가장 빠르게 배울 수 있습니다 👇</p>
        </TypeCard>

        {/* ─── DA-2: HSLF 11번 UI (겹침 해결) ─── */}
        <TypeCard label="HSLF · DA 논리왕 — 11번 UI (경고 없앰)" color="#64748b">
          <p className="text-xs text-slate-400 mb-3">위에서 이미 위기를 봤으니, 여기선 방향만</p>
          <div className="rounded-2xl p-4 mb-3" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <p className="text-sm font-black text-emerald-700 mb-1">✅ 아직 살아있는 스킬</p>
            <p className="text-xs text-emerald-600">파이프라인 설계 — 이게 당신의 무기입니다</p>
          </div>
          <div className="rounded-2xl p-4 mb-3" style={{ background: '#64748b10', border: '1px solid #64748b30' }}>
            <p className="text-xs font-bold text-slate-500 mb-2">이 무기에 AI를 더하면</p>
            <p className="text-sm font-black text-slate-700 leading-snug">개발자 경험 + 데이터 파이프라인 → 데이터 엔지니어</p>
            <p className="text-sm font-black text-slate-700 leading-snug mt-1">분석가 경험 + ML 파이프라인 → ML 파이프라인 엔지니어</p>
          </div>
          <p className="text-xs text-center text-slate-400">이 전환을 가장 빠르게 — 매주 무료 특강 👇</p>
        </TypeCard>

        {/* ─── DA-3: HSLF 공식 UI ─── */}
        <TypeCard label="HSLF · DA 논리왕 — 공식 UI (13번)" color="#64748b">
          <p className="text-sm font-bold text-slate-700 mb-4 text-center">대체 안 되는 포지션의 공식</p>
          <div className="space-y-3 mb-4">
            {[
              { exp: '개발자 경험', plus: '데이터 파이프라인', result: '데이터 엔지니어' },
              { exp: '분석가 경험', plus: 'ML 파이프라인', result: 'ML 파이프라인 엔지니어' },
            ].map(t => (
              <div key={t.exp} className="flex items-center gap-1 text-sm flex-wrap">
                <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-600 font-medium text-xs">{t.exp}</span>
                <span className="font-black text-slate-400">+</span>
                <span className="px-2 py-1 rounded-lg text-white font-bold text-xs bg-slate-600">{t.plus}</span>
                <span className="font-black text-slate-400">=</span>
                <span className="px-2 py-1 rounded-lg font-black text-xs bg-slate-100 text-slate-700">{t.result}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-center text-slate-400">이 공식, 매주 무료 특강에서 직접 만들어 보세요 👇</p>
        </TypeCard>

        {/* ─── DE-1: TSLF 5번 UI ─── */}
        <TypeCard label="TSLF · DE 분석가 — 5번 UI 적용" color="#0ea5e9">
          <div className="rounded-2xl p-4 mb-3" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
            <p className="text-sm font-black text-red-700 mb-1">⚠️ 지금 당신이 하는 일의 86%</p>
            <p className="text-xs text-red-500">보고서 작성 · 데이터 정리 · 고객 응대 — 이미 AI가 대신하고 있습니다</p>
          </div>
          <div className="rounded-2xl p-4 mb-3" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <p className="text-sm font-black text-emerald-700 mb-1">✅ 아직 살아있는 스킬</p>
            <p className="text-xs text-emerald-600">데이터 기반 의사결정 — 이게 당신의 무기입니다</p>
          </div>
          <div className="rounded-2xl p-4 mb-3" style={{ background: '#0ea5e910', border: '1px solid #0ea5e930' }}>
            <p className="text-xs font-bold text-slate-500 mb-2">이 두 가지를 합친 사람들</p>
            <p className="text-sm font-black leading-snug" style={{ color: '#0ea5e9' }}>마케터 경험 + 데이터 분석 → 데이터 마케터</p>
            <p className="text-sm font-black leading-snug mt-1" style={{ color: '#0ea5e9' }}>영업 경험 + 세일즈 데이터 → 세일즈 애널리스트</p>
          </div>
          <p className="text-xs text-center text-slate-400">이 전환, 매주 무료 특강에서 가장 빠르게 배울 수 있습니다 👇</p>
        </TypeCard>

        {/* ─── DE-2: TSLP 5번 UI ─── */}
        <TypeCard label="TSLP · DE 전략가 — 5번 UI 적용" color="#1d4ed8">
          <div className="rounded-2xl p-4 mb-3" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
            <p className="text-sm font-black text-red-700 mb-1">⚠️ 지금 당신이 하는 일의 85%</p>
            <p className="text-xs text-red-500">전략 보고서 · 회의 준비 · 데이터 분석 — 이미 AI가 대신하고 있습니다</p>
          </div>
          <div className="rounded-2xl p-4 mb-3" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <p className="text-sm font-black text-emerald-700 mb-1">✅ 아직 살아있는 스킬</p>
            <p className="text-xs text-emerald-600">조직 전략 수립 — 이게 당신의 무기입니다</p>
          </div>
          <div className="rounded-2xl p-4 mb-3" style={{ background: '#1d4ed810', border: '1px solid #1d4ed830' }}>
            <p className="text-xs font-bold text-slate-500 mb-2">이 두 가지를 합친 사람들</p>
            <p className="text-sm font-black leading-snug" style={{ color: '#1d4ed8' }}>전략기획 경험 + 데이터 분석 → 데이터 기반 전략가</p>
            <p className="text-sm font-black leading-snug mt-1" style={{ color: '#1d4ed8' }}>조직개발 경험 + 피플 데이터 → 피플 애널리틱스</p>
          </div>
          <p className="text-xs text-center text-slate-400">이 전환, 매주 무료 특강에서 가장 빠르게 배울 수 있습니다 👇</p>
        </TypeCard>

        {/* ─── DE-3: TSLP 스텝 UI ─── */}
        <TypeCard label="TSLP · DE 전략가 — 스텝 UI (14번)" color="#1d4ed8">
          <p className="text-xs font-bold text-slate-400 uppercase mb-4">지금 당장 해야 할 것</p>
          <div className="space-y-3 mb-4">
            {[
              { step: '1', title: '살아있는 스킬 확인', desc: '조직 전략 수립은 아직 내 영역', color: '#10b981' },
              { step: '2', title: 'AI 역량 한 가지 추가', desc: '데이터 분석 · 피플 데이터', color: '#1d4ed8' },
              { step: '3', title: '포지션 전환', desc: '데이터 기반 전략가 · 피플 애널리틱스', color: '#4f46e5' },
            ].map(s => (
              <div key={s.step} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0 mt-0.5" style={{ background: s.color }}>{s.step}</div>
                <div>
                  <p className="text-sm font-bold text-slate-700">{s.title}</p>
                  <p className="text-xs text-slate-400">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-center text-slate-400">2단계를 가장 빠르게 — 매주 무료 특강 👇</p>
        </TypeCard>

        {/* ─── DE-4: 문제점 비교 — 안전 스킬 1개짜리 ─── */}
        <TypeCard label="⚠️ 문제 케이스 — 안전 스킬 1개일 때" color="#ef4444">
          <div className="rounded-2xl p-3 mb-2 bg-slate-50 border border-slate-200">
            <p className="text-xs text-slate-500 font-bold mb-1">현재 렌더링 (어색함)</p>
            <div className="rounded-xl p-3 mb-2" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              <p className="text-sm font-black text-emerald-700 mb-1">✅ 아직 살아있는 스킬</p>
              <p className="text-xs text-emerald-600">파이프라인 설계 — 이게 당신의 무기입니다</p>
            </div>
            <p className="text-xs text-red-400">→ 스킬이 1개면 어색하고 빈약해 보임</p>
          </div>
          <div className="rounded-2xl p-3" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <p className="text-xs text-slate-500 font-bold mb-1">개선안 (2줄로 풀어쓰기)</p>
            <p className="text-sm font-black text-emerald-700 mb-1">✅ 아직 살아있는 스킬</p>
            <p className="text-xs text-emerald-600 leading-relaxed">파이프라인 설계 능력은 아직 AI가 대체하지 못합니다.<br />이게 당신의 핵심 무기입니다.</p>
          </div>
        </TypeCard>

      </div>
    </div>
  )
}

function Section({ num, label, children }: { num: number; label: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-6 h-6 rounded-full text-white text-xs font-black flex items-center justify-center shrink-0" style={{ background: color }}>{num}</span>
        <p className="text-sm font-bold text-slate-600">{label}</p>
      </div>
      {children}
    </div>
  )
}
