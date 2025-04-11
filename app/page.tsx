"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Upload, LinkIcon, ImageIcon } from "lucide-react"
import Image from "next/image"
import { Portfolio } from "@/components/portfolio"
import { Contact } from "@/components/contact"
import { InstagramShowcase } from "@/components/instagram-showcase"
import { Footer } from "@/components/footer"

export default function Home() {
  const [imageUrl, setImageUrl] = useState("")
  const [urlInput, setUrlInput] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [style, setStyle] = useState("art")
  const [noise, setNoise] = useState("-1")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setImageUrl(URL.createObjectURL(e.target.files[0]))
      setError("")
    }
  }

  const handleUrlSubmit = () => {
    if (!urlInput) {
      setError("Silakan masukkan URL gambar")
      return
    }
    setImageUrl(urlInput)
    setFile(null)
    setError("")
  }

  const handleUpscale = async () => {
    if (!imageUrl) {
      setError("Silakan pilih gambar atau masukkan URL gambar")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const formData = new FormData()

      if (file) {
        formData.append("file", file)
      } else {
        formData.append("url", imageUrl)
      }

      formData.append("style", style)
      formData.append("noise", noise)

      const response = await fetch("/api/upscale", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Terjadi kesalahan saat memproses gambar")
      }

      setResult(data.result)
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat memproses gambar")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setImageUrl("")
    setUrlInput("")
    setFile(null)
    setError("")
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Website HD</h1>
          <p className="text-lg text-gray-600">Tingkatkan kualitas gambar Anda dengan mudah</p>
        </div>

        {!result ? (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Upscale Gambar</CardTitle>
              <CardDescription>Upload gambar atau masukkan URL untuk meningkatkan kualitasnya</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="upload">Upload Gambar</TabsTrigger>
                  <TabsTrigger value="url">URL Gambar</TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="space-y-4">
                  <div
                    className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {imageUrl && file ? (
                      <div className="relative w-full h-64">
                        <Image src={imageUrl || "/placeholder.svg"} alt="Preview" fill className="object-contain" />
                      </div>
                    ) : (
                      <div className="py-8">
                        <Upload className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Klik untuk memilih atau drag & drop gambar di sini</p>
                      </div>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="url" className="space-y-4">
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <Input
                        placeholder="https://example.com/image.jpg"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleUrlSubmit} type="button">
                      <LinkIcon className="h-4 w-4 mr-2" />
                      Ambil
                    </Button>
                  </div>

                  {imageUrl && !file && (
                    <div className="relative w-full h-64 mt-4">
                      <Image src={imageUrl || "/placeholder.svg"} alt="Preview" fill className="object-contain" />
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mt-4">{error}</div>}

              <div className="mt-6 space-y-4">
                <div>
                  <Label htmlFor="style">Style</Label>
                  <RadioGroup id="style" value={style} onValueChange={setStyle} className="flex space-x-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="art" id="art" />
                      <Label htmlFor="art">Artwork</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="photo" id="photo" />
                      <Label htmlFor="photo">Foto</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="noise">Noise Level</Label>
                  <RadioGroup id="noise" value={noise} onValueChange={setNoise} className="grid grid-cols-5 gap-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="-1" id="none" />
                      <Label htmlFor="none">None</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="0" id="low" />
                      <Label htmlFor="low">Low</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1" id="medium" />
                      <Label htmlFor="medium">Medium</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2" id="high" />
                      <Label htmlFor="high">High</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3" id="highest" />
                      <Label htmlFor="highest">Highest</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleUpscale} disabled={!imageUrl || isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Upscale Gambar
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Hasil Upscale</CardTitle>
              <CardDescription>Gambar telah berhasil ditingkatkan kualitasnya</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="relative w-full h-96">
                  <Image src={result.url || "/placeholder.svg"} alt="Hasil Upscale" fill className="object-contain" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="font-medium">Nama File</p>
                    <p className="text-gray-600">{result.info.fileName}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="font-medium">Ukuran Asli</p>
                    <p className="text-gray-600">{(result.info.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="font-medium">Ukuran Hasil</p>
                    <p className="text-gray-600">{result.size}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="font-medium">Style</p>
                    <p className="text-gray-600">{result.config.styleName}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="font-medium">Noise Level</p>
                    <p className="text-gray-600">{result.config.noiseName}</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleReset}>
                Upscale Gambar Lain
              </Button>
              <Button onClick={() => window.open(result.url, "_blank")}>Buka Gambar</Button>
            </CardFooter>
          </Card>
        )}

        {/* Portfolio Section */}
        <div id="portfolio">
          <Portfolio />
        </div>

        {/* Instagram Showcase Section */}
        <div id="instagram">
          <InstagramShowcase />
        </div>

        {/* Contact Section */}
        <div id="contact">
          <Contact />
        </div>
      </div>

      <Footer />
    </main>
  )
}
