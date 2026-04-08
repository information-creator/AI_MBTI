interface Window {
  gtag?: (...args: unknown[]) => void
  Kakao?: {
    isInitialized: () => boolean
    init: (key: string) => void
    Share: { sendDefault: (options: Record<string, unknown>) => void }
  }
}
