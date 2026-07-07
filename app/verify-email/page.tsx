"use client"

import { useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"

export default function VerifyEmailPage() {
  const params = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const token = params.get("token")

    if (!token) return

    const verifyEmail = async () => {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token })
      })

      const data = await res.json()

      alert(data.message)

      router.push("/login")
    }

    verifyEmail()
  }, [])

  return (
    <div className="flex items-center justify-center h-screen">
      Verifying your email...
    </div>
  )
}