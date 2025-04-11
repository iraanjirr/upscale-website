"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Terjadi Kesalahan</h2>
        <p className="text-gray-600 mb-6">Maaf, terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi.</p>
        <Button onClick={reset}>Coba Lagi</Button>
      </div>
    </div>
  )
}
