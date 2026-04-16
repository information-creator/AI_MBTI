import { redirect } from 'next/navigation'

export function GET() {
  redirect('/?utm_source=instagram&utm_medium=ad&utm_campaign=promotion')
}
