import { redirect } from 'next/navigation'

export function GET() {
  redirect('/?utm_source=meta_instagram&utm_medium=paid&utm_campaign=promotion')
}
