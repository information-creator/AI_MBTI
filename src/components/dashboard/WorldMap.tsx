'use client'

import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from 'react-simple-maps'
import { useMemo, useState } from 'react'
import { geoCentroid } from 'd3-geo'

type Props = {
  data: { country: string; users: number }[]
}

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

const GA4_TO_GEO: Record<string, string> = {
  'South Korea': 'South Korea',
  'North Korea': 'North Korea',
  'United States': 'United States of America',
  'Russia': 'Russia',
  'Czechia': 'Czech Republic',
  'Myanmar (Burma)': 'Myanmar',
  'Hong Kong': 'Hong Kong',
  '(not set)': '',
}

const COUNTRY_KR: Record<string, string> = {
  'South Korea': '한국', 'India': '인도', 'Pakistan': '파키스탄', 'Bangladesh': '방글라데시',
  'Nepal': '네팔', 'Egypt': '이집트', 'Ethiopia': '에티오피아', 'Algeria': '알제리',
  'Indonesia': '인도네시아', 'Iraq': '이라크', 'United States of America': '미국', 'Japan': '일본',
  'China': '중국', 'Vietnam': '베트남', 'Philippines': '필리핀', 'Thailand': '태국',
  'Nigeria': '나이지리아', 'Morocco': '모로코', 'Turkey': '터키',
}

type Geo = { rsmKey: string; properties: { name: string }; geometry: unknown }

export default function WorldMap({ data }: Props) {
  const [hover, setHover] = useState<{ name: string; users: number; x: number; y: number } | null>(null)

  const maxUsers = Math.max(...data.map(d => d.users), 1)
  const userByCountry = useMemo(() => {
    const m = new Map<string, number>()
    for (const d of data) {
      const key = GA4_TO_GEO[d.country] ?? d.country
      if (key) m.set(key, (m.get(key) ?? 0) + d.users)
    }
    return m
  }, [data])

  // Top 8개 국가 (레이블 표시 대상)
  const topCountries = useMemo(() => {
    return data
      .slice()
      .map(d => ({ country: GA4_TO_GEO[d.country] ?? d.country, users: d.users }))
      .filter(d => d.country && d.users > 0)
      .sort((a, b) => b.users - a.users)
      .slice(0, 8)
      .map(d => d.country)
  }, [data])

  const colorFor = (users: number) => {
    if (users === 0) return 'oklch(0.93 0 0)'
    const intensity = Math.min(1, Math.log(users + 1) / Math.log(maxUsers + 1))
    const lightness = 0.9 - intensity * 0.5
    return `oklch(${lightness} 0.15 255)`
  }

  return (
    <div className="space-y-3">
      <div className="relative w-full aspect-[2/1] rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-900">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 130, center: [10, 30] }}
          style={{ width: '100%', height: '100%' }}
        >
          <ZoomableGroup>
            <Geographies geography={GEO_URL}>
              {({ geographies }: { geographies: Geo[] }) => (
                <>
                  {geographies.map(geo => {
                    const name = geo.properties.name
                    const users = userByCountry.get(name) ?? 0
                    const isKorea = name === 'South Korea'
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={isKorea && users > 0 ? 'oklch(0.55 0.2 260)' : colorFor(users)}
                        stroke="oklch(0.85 0 0)"
                        strokeWidth={0.3}
                        onMouseEnter={(e: React.MouseEvent) => {
                          setHover({ name, users, x: e.clientX, y: e.clientY })
                        }}
                        onMouseMove={(e: React.MouseEvent) => {
                          setHover(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : null)
                        }}
                        onMouseLeave={() => setHover(null)}
                        style={{
                          default: { outline: 'none' },
                          hover: { outline: 'none', fill: users > 0 ? 'oklch(0.45 0.25 260)' : 'oklch(0.8 0 0)', cursor: 'pointer', stroke: 'oklch(0.3 0 0)', strokeWidth: 0.6 },
                          pressed: { outline: 'none' },
                        }}
                      />
                    )
                  })}
                  {/* Top 국가에 레이블 마커 */}
                  {geographies
                    .filter(g => topCountries.includes(g.properties.name))
                    .map(geo => {
                      const users = userByCountry.get(geo.properties.name) ?? 0
                      const centroid = geoCentroid(geo as unknown as Parameters<typeof geoCentroid>[0])
                      const krName = COUNTRY_KR[geo.properties.name] ?? geo.properties.name
                      if (!Number.isFinite(centroid[0]) || !Number.isFinite(centroid[1])) return null
                      return (
                        <Marker key={geo.rsmKey + '-lbl'} coordinates={centroid}>
                          <g style={{ pointerEvents: 'none' }}>
                            <rect x={-22} y={-10} width={44} height={16} rx={3} fill="white" stroke="oklch(0.5 0.2 260)" strokeWidth={0.6} opacity={0.95} />
                            <text textAnchor="middle" y={2} fontSize={8} fontWeight={700} fill="oklch(0.2 0 0)">
                              {krName.slice(0, 4)} {users >= 1000 ? `${(users / 1000).toFixed(1)}k` : users}
                            </text>
                          </g>
                        </Marker>
                      )
                    })}
                </>
              )}
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        {/* 호버 툴팁 */}
        {hover && (
          <div
            className="pointer-events-none fixed z-50 bg-slate-900 text-white text-sm px-3 py-1.5 rounded-md shadow-lg"
            style={{ left: hover.x + 12, top: hover.y - 10 }}
          >
            <span className="font-bold">{COUNTRY_KR[hover.name] ?? hover.name}</span>
            <span className="ml-2 font-mono">{hover.users.toLocaleString()}명</span>
          </div>
        )}

        {/* 좌상단 범례 */}
        <div className="absolute top-2 left-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-md p-2 shadow-sm text-xs">
          <p className="font-bold mb-1 text-slate-900 dark:text-white">유입 수</p>
          <div className="flex items-center gap-1">
            <div className="h-3 w-24 rounded" style={{ background: 'linear-gradient(to right, oklch(0.93 0 0), oklch(0.45 0.15 255))' }} />
          </div>
          <div className="flex justify-between w-24 mt-0.5 text-[10px] text-muted-foreground font-mono">
            <span>0</span>
            <span>{maxUsers.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Top 리스트 (지도 아래) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {data.slice(0, 8).map((d, i) => {
          const krName = COUNTRY_KR[d.country] ?? COUNTRY_KR[GA4_TO_GEO[d.country] ?? ''] ?? d.country
          const isKorea = d.country === 'South Korea'
          return (
            <div key={i} className={`px-3 py-2 rounded-md border ${isKorea ? 'bg-blue-50 border-blue-300' : 'bg-muted/30 border-border'}`}>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold truncate">{krName}</span>
                <span className="text-base font-black font-mono">{d.users.toLocaleString()}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
