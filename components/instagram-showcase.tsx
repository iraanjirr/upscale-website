import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, MessageCircle, Bookmark, Share2 } from "lucide-react"

type InstagramPostProps = {
  imageUrl: string
  likes: number
  caption: string
  date: string
}

function InstagramPost({ imageUrl, likes, caption, date }: InstagramPostProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-3 flex items-center">
          <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2">
            <Image 
              src="https://files.catbox.moe/oje9gx.jpg"
              alt="Airaa Cheisyaa" 
              fill 
              className="object-cover" 
              unoptimized
            />
          </div>
          <span className="font-medium">syaaikoo</span>
        </div>

        <div className="relative aspect-square w-full">
          <Image 
            src={imageUrl || "/placeholder.svg"} 
            alt="Instagram post" 
            fill 
            className="object-cover" 
            unoptimized={imageUrl.startsWith('http')}
          />
        </div>

        <div className="p-3">
          <div className="flex justify-between mb-2">
            <div className="flex space-x-4">
              <Heart className="w-6 h-6 cursor-pointer hover:text-red-500 transition-colors" />
              <MessageCircle className="w-6 h-6 cursor-pointer hover:text-blue-500 transition-colors" />
              <Share2 className="w-6 h-6 cursor-pointer hover:text-green-500 transition-colors" />
            </div>
            <Bookmark className="w-6 h-6 cursor-pointer hover:text-yellow-500 transition-colors" />
          </div>

          <p className="font-medium mb-1">{likes} suka</p>

          <div className="mb-1">
            <span className="font-medium mr-2">syaaikoo</span>
            <span className="text-gray-700">{caption}</span>
          </div>

          <p className="text-gray-500 text-xs">{date}</p>
        </div>
      </CardContent>
    </Card>
  )
}


export function InstagramShowcase() {
  const posts = [
    {
      imageUrl: "https://files.catbox.moe/4152eo.jpeg",
      likes: 253,
      caption: "Akumah pemula python 😭🙏🏻 #coding #webdevelopment #nextjs",
      date: "2 hari yang lalu",
    },
    {
      imageUrl: "https://files.catbox.moe/7i6shr.jpg",
      likes: 187,
      caption: "Follow instagramku yaa: syaaikoo ✨ #dailypost #instagran",
      date: "1 tahun yang lalu",
    },
    {
      imageUrl: "https://files.catbox.moe/imh7f4.png",
      likes: 342,
      caption: "Jurusan sekolahku guyss 🖥️ #programming #teknikKomputerJaringan #Mikrotik",
      date: "2 minggu yang lalu",
    },
  ]

  return (
    <div className="max-w-4xl mx-auto mt-16 px-4">
      <h2 className="text-2xl font-bold text-center mb-2">Instagram Posts</h2>
      <p className="text-center text-gray-600 mb-8">Lihat aktivitas terbaru saya di Instagram</p>

      <div className="grid md:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <InstagramPost key={index} {...post} />
        ))}
      </div>

      <div className="text-center mt-8">
        <a
          href="https://instagram.com/syaaikoo"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          Lihat lebih banyak di Instagram
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </div>
  )
}
