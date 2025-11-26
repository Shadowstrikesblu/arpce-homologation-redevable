"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Rediriger vers la plateforme (qui est protégée par UserProvider)
    router.replace('/platform')
  }, [router])

  return null
}