import { TooltipProvider } from '@/components/ui/tooltip'

export default function Dashboard3Layout({ children }: { children: React.ReactNode }) {
  return <TooltipProvider>{children}</TooltipProvider>
}
