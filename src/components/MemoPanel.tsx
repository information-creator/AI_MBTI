'use client'

import { useEffect, useState, useCallback } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { todayKst } from '@/lib/date'

const PASS = '720972'

type Memo = {
  id: string
  memo_date: string
  content: string
  created_at: string
}

export default function MemoPanel() {
  const [memos, setMemos] = useState<Memo[]>([])
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState('')
  const [memoDate, setMemoDate] = useState(todayKst())
  const [posting, setPosting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/memos?pass=${PASS}`, { cache: 'no-store' })
      const data = await res.json()
      setMemos(data.memos ?? [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const add = async () => {
    const body = content.trim()
    if (!body) return
    setPosting(true)
    try {
      const res = await fetch(`/api/memos?pass=${PASS}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: body, memo_date: memoDate }),
      })
      if (res.ok) {
        setContent('')
        await load()
      }
    } finally {
      setPosting(false)
    }
  }

  const remove = async (id: string) => {
    if (!confirm('이 메모를 삭제할까요?')) return
    const res = await fetch(`/api/memos?pass=${PASS}&id=${id}`, { method: 'DELETE' })
    if (res.ok) setMemos(prev => prev.filter(m => m.id !== id))
  }

  const grouped = memos.reduce<Record<string, Memo[]>>((acc, m) => {
    ;(acc[m.memo_date] ??= []).push(m)
    return acc
  }, {})

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-4 space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={memoDate}
              onChange={e => setMemoDate(e.target.value)}
              className="h-8 px-2 text-xs border rounded-md bg-background"
            />
            <span className="text-xs text-muted-foreground">날짜</span>
          </div>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="예) 4.20 내부 광고 나갔음"
            rows={3}
            className="w-full text-sm px-3 py-2 border rounded-md bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            onKeyDown={e => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); add() }
            }}
          />
          <div className="flex justify-between items-center">
            <p className="text-[10px] text-muted-foreground">⌘/Ctrl+Enter 로 저장</p>
            <Button size="sm" onClick={add} disabled={posting || !content.trim()} className="h-7 text-xs gap-1">
              <Plus className="h-3 w-3" /> 저장
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading && <p className="text-xs text-muted-foreground text-center py-6">불러오는 중…</p>}
      {!loading && memos.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-6">아직 메모가 없습니다. 위 입력창에 첫 메모를 남겨보세요.</p>
      )}

      {Object.entries(grouped).map(([date, list]) => (
        <div key={date} className="space-y-2">
          <h3 className="text-xs font-black text-muted-foreground sticky top-0 bg-background py-1">📌 {date}</h3>
          {list.map(m => (
            <Card key={m.id} className="group">
              <CardContent className="py-3 px-4 flex items-start gap-2">
                <p className="flex-1 text-sm whitespace-pre-wrap leading-relaxed">{m.content}</p>
                <button
                  onClick={() => remove(m.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive shrink-0"
                  aria-label="삭제"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      ))}
    </div>
  )
}
