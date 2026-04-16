import { redirect } from 'next/navigation'

export function GET() {
  redirect('/?utm_source=link&utm_medium=share&utm_campaign=result')
}
