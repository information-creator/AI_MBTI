import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isSameOrBefore)

const KST = 'Asia/Seoul'

export function todayKst(): string {
  return dayjs().tz(KST).format('YYYY-MM-DD')
}

export function daysAgoKst(days: number, from?: string): string {
  const base = from ? dayjs.tz(from, KST) : dayjs().tz(KST)
  return base.subtract(days, 'day').format('YYYY-MM-DD')
}

export function addDays(dateStr: string, days: number): string {
  return dayjs(dateStr).add(days, 'day').format('YYYY-MM-DD')
}

export function rangeDates(since: string, until: string): string[] {
  const start = dayjs(since)
  const end = dayjs(until)
  const dates: string[] = []
  let cur = start
  while (cur.isSameOrBefore(end, 'day')) {
    dates.push(cur.format('YYYY-MM-DD'))
    cur = cur.add(1, 'day')
  }
  return dates
}

export function formatKst(date: Date | string, fmt = 'YYYY-MM-DD HH:mm:ss'): string {
  return dayjs(date).tz(KST).format(fmt)
}

export function nowIso(): string {
  return dayjs().toISOString()
}
