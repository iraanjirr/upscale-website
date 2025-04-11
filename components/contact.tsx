"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Instagram, MessageCircle, Users } from "lucide-react"

export function Contact() {
  return (
    <div className="max-w-4xl mx-auto mt-16 px-4 mb-16">
      <h2 className="text-2xl font-bold text-center mb-8">Hubungi Developer</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Instagram className="h-5 w-5 mr-2 text-pink-500" />
              Instagram
            </CardTitle>
            <CardDescription>Ikuti saya di Instagram untuk update terbaru</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium mb-4">@syaaikoo</p>
            <Button className="w-full" onClick={() => window.open("https://instagram.com/syaaikoo", "_blank")}>
              Kunjungi Instagram
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2 text-green-500" />
              WhatsApp
            </CardTitle>
            <CardDescription>Hubungi saya melalui WhatsApp untuk konsultasi</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium mb-4">081553362795</p>
            <Button className="w-full" onClick={() => window.open("https://wa.me/6281553362795", "_blank")}>
              Chat di WhatsApp
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8 bg-gradient-to-r from-green-50 to-emerald-100 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-green-600" />
            Grup WhatsApp
          </CardTitle>
          <CardDescription className="text-green-800">
            Bergabunglah dengan komunitas kami untuk berbagi tips dan trik
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">
            Dapatkan update terbaru, bantuan teknis, dan berbagi pengalaman dengan pengguna lain di grup WhatsApp kami.
          </p>
          <Button
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={() => window.open("https://chat.whatsapp.com/EnHeWbOaHHE1ADdkYZq40v", "_blank")}
          >
            Gabung Grup WhatsApp
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
