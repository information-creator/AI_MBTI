import { redirect } from 'next/navigation'

export function GET() {
  redirect('/?utm_source=kakao_biz&utm_medium=ad&utm_campaign=promotion')
}
