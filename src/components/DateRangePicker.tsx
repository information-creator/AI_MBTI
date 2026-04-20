'use client'

import { useState } from 'react'
import { CalendarIcon } from 'lucide-react'
import { DateRange } from 'react-day-picker'
import { Button, buttonVariants } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { todayKst, daysAgoKst } from '@/lib/date'
import { cn } from '@/lib/utils'

type Props = {
  startDate: string
  endDate: string
  onChange: (start: string, end: string) => void
  className?: string
}

const PRESETS = [
  { label: '오늘', days: 1 },
  { label: '7일', days: 7 },
  { label: '30일', days: 30 },
  { label: '90일', days: 90 },
]

function toISODate(d?: Date): string {
  if (!d) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function parseDate(s: string): Date | undefined {
  if (!s) return undefined
  const [y, m, d] = s.split('-').map(Number)
  if (!y || !m || !d) return undefined
  return new Date(y, m - 1, d)
}

export function DateRangePicker({ startDate, endDate, onChange, className }: Props) {
  const [open, setOpen] = useState(false)
  const [range, setRange] = useState<DateRange | undefined>({
    from: parseDate(startDate),
    to: parseDate(endDate),
  })

  const applyPreset = (days: number) => {
    const end = todayKst()
    const start = daysAgoKst(days - 1, end)
    onChange(start, end)
    setRange({ from: parseDate(start), to: parseDate(end) })
    setOpen(false)
  }

  const applyRange = () => {
    if (range?.from && range?.to) {
      onChange(toISODate(range.from), toISODate(range.to))
      setOpen(false)
    }
  }

  const label = startDate && endDate ? `${startDate} ~ ${endDate}` : '기간 선택'

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          buttonVariants({ variant: 'outline', size: 'sm' }),
          'h-8 font-mono text-xs gap-2',
          className
        )}
      >
        <CalendarIcon className="h-3.5 w-3.5" />
        {label}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 border-b flex flex-wrap gap-1">
          {PRESETS.map(p => (
            <Button
              key={p.label}
              variant="ghost"
              size="sm"
              onClick={() => applyPreset(p.days)}
              className="h-7 px-3 text-xs"
            >
              {p.label}
            </Button>
          ))}
        </div>
        <Calendar
          mode="range"
          selected={range}
          onSelect={setRange}
          numberOfMonths={2}
          defaultMonth={range?.from}
        />
        <div className="flex justify-end gap-2 p-3 border-t">
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)} className="h-7 text-xs">
            취소
          </Button>
          <Button size="sm" onClick={applyRange} disabled={!range?.from || !range?.to} className="h-7 text-xs">
            적용
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
