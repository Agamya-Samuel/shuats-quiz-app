"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

export default function VerificationRedirectPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Keep the existing tab parameter if present or set default
  const tab = searchParams.get("tab") || "pending"

  useEffect(() => {
    // Redirect to the main admin page with verification section and preserve tab
    router.push(`/admin?section=verification&tab=${tab}`)
  }, [router, tab])

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Redirecting to verification page...</p>
      </div>
    </div>
  )
}
