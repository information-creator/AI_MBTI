import { redirect } from 'next/navigation'

export function GET() {
  redirect('/?utm_source=meta_facebook&utm_medium=paid&utm_campaign=promotion')
}
