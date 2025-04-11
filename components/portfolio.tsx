import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

export function Portfolio() {
  return (
    <div className="max-w-4xl mx-auto mt-16 px-4">
      <h2 className="text-2xl font-bold text-center mb-8">Tentang Developer</h2>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="md:flex">
            <div className="md:w-1/3 bg-gradient-to-br from-blue-100 to-indigo-200 p-6 flex flex-col items-center justify-center">
              <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-lg mb-4">
                <Image src="/placeholder.svg?height=200&width=200" alt="Airaa Cheisyaa" fill className="object-cover" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Airaa Cheisyaa 🅥</h3>
              <p className="text-gray-600 text-center mt-2">Web Developer & Designer</p>
            </div>

            <div className="md:w-2/3 p-6">
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-2">Tentang Saya</h4>
                <p className="text-gray-600">
                  Halo! Saya Airaa Cheisyaa, seorang web developer dengan passion di bidang programming. Saya senang
                  mengembangkan aplikasi web yang berguna dan memiliki antarmuka yang menarik. Website HD adalah salah 
                  satu proyek yang saya kembangkan untuk membantu pengguna meningkatkan kualitas gambar dengan mudah
                  menggunakan teknologi AI.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-2">Keahlian</h4>
                <div className="flex flex-wrap gap-2">
                  {["Python", "Next.js", "TypeScript", "Tailwind CSS", "UI/UX Design", "Node.js", "API Integration"].map(
                    (skill) => (
                      <span key={skill} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
