import Link from "next/link"

export function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Website HD</h3>
            <p className="text-gray-600 text-sm">
              Tingkatkan kualitas gambar Anda dengan mudah menggunakan teknologi AI terbaik.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/#portfolio" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Tentang Developer
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Kontak</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-600">Instagram: @syaaikoo</li>
              <li className="text-gray-600">WhatsApp: 081553362795</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Website HD - Upscale gambar dengan mudah. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
