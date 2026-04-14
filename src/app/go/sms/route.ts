import { redirect } from 'next/navigation'

export function GET() {
  redirect('/?utm_source=sms&utm_medium=text&utm_campaign=promotion')
}
