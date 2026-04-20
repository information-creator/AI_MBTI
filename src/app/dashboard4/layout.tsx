import { TooltipProvider } from '@/components/ui/tooltip'

export default function Dashboard4Layout({ children }: { children: React.ReactNode }) {
  return <TooltipProvider>{children}</TooltipProvider>
}
