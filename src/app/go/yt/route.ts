import { redirect } from 'next/navigation'

export function GET() {
  redirect('/?utm_source=youtube&utm_medium=post&utm_campaign=share')
}
