import { redirect } from 'next/navigation'

export function GET() {
  redirect('/?utm_source=kakao&utm_medium=share&utm_campaign=result')
}
