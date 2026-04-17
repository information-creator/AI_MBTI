'use client'

import { useEffect } from 'react'

export default function VariantTracker({ variant }: { variant: string }) {
  useEffect(() => {
    document.cookie = `ab_variant=${variant}; path=/; max-age=2592000; SameSite=Lax`
  }, [variant])
  return null
}
