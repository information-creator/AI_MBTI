import { redirect } from 'next/navigation'

export function GET() {
  redirect('/?utm_source=kakao&utm_medium=openchat&utm_campaign=share')
}
