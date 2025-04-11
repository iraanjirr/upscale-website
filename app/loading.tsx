import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <h2 className="mt-4 text-xl font-semibold">Memuat...</h2>
        <p className="text-gray-500">Mohon tunggu sebentar</p>
      </div>
    </div>
  )
}
