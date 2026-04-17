'use client'

type Campaign = {
  name: string
  impressions: number
  clicks: number
  spend: number
  ctr: number
  cpc: number
  conversions: number
  [key: string]: unknown
}

export default function CampaignTable({ campaigns }: { campaigns: Campaign[] }) {
  if (campaigns.length === 0) return <p className="text-slate-400 text-sm">캠페인 데이터 없음</p>

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500">
            <th className="text-left py-2 pr-2 font-medium">캠페인</th>
            <th className="text-right py-2 px-1 font-medium">노출</th>
            <th className="text-right py-2 px-1 font-medium">클릭</th>
            <th className="text-right py-2 px-1 font-medium">CTR</th>
            <th className="text-right py-2 px-1 font-medium">CPC</th>
            <th className="text-right py-2 px-1 font-medium">비용</th>
            <th className="text-right py-2 pl-1 font-medium">전환</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map(c => (
            <tr key={c.name} className="border-b border-slate-100">
              <td className="py-2 pr-2 text-slate-700 font-medium truncate max-w-[120px]">{c.name}</td>
              <td className="text-right py-2 px-1 text-slate-600">{c.impressions.toLocaleString()}</td>
              <td className="text-right py-2 px-1 text-slate-600">{c.clicks.toLocaleString()}</td>
              <td className="text-right py-2 px-1 text-slate-600">{c.ctr}%</td>
              <td className="text-right py-2 px-1 text-slate-600">₩{c.cpc.toLocaleString()}</td>
              <td className="text-right py-2 px-1 text-slate-600">₩{c.spend.toLocaleString()}</td>
              <td className="text-right py-2 pl-1 text-slate-900 font-bold">{c.conversions}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
