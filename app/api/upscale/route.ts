import { type NextRequest, NextResponse } from "next/server"
import axios from "axios"
import FormData from "form-data"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const url = formData.get("url") as string | null
    const style = (formData.get("style") as string) || "art"
    const noise = (formData.get("noise") as string) || "-1"

    let imageUrl: string

    if (file) {
      // Upload file to pic.surf
      const buffer = Buffer.from(await file.arrayBuffer())
      imageUrl = await uploadImage(buffer)
    } else if (url) {
      // Use provided URL
      imageUrl = url
    } else {
      return NextResponse.json({ error: "Tidak ada gambar yang diberikan" }, { status: 400 })
    }

    // Validate image and upscale
    const result = await upscale(imageUrl, { style, noise })

    if (!result.success) {
      return NextResponse.json({ error: result.result.error }, { status: 400 })
    }

    return NextResponse.json({ result: result.result })
  } catch (error: any) {
    console.error("Error processing image:", error)
    return NextResponse.json({ error: error.message || "Terjadi kesalahan saat memproses gambar" }, { status: 500 })
  }
}

async function uploadImage(imageBuffer: Buffer) {
  try {
    const form = new FormData()
    form.append("file", imageBuffer, {
      filename: "image.jpg",
      contentType: "image/jpeg",
    })

    const headers = {
      ...form.getHeaders(),
      "Content-Length": form.getLengthSync(),
    }

    // Tambahkan timeout dan handling error yang lebih baik
    const response = await axios.post("https://www.pic.surf/upload.php", form, {
      headers,
      timeout: 30000, // 30 detik timeout
    })

    // Periksa apakah response adalah objek dan memiliki identifier
    if (!response.data || typeof response.data !== "object" || !response.data.identifier) {
      console.error("Invalid upload response:", response.data)
      throw new Error("Upload gagal: Respons tidak valid dari server")
    }

    const identifier = response.data.identifier

    return `https://www.pic.surf/${identifier}`
  } catch (error: any) {
    // Log error lengkap untuk debugging
    console.error("Upload error detail:", error)

    // Cek apakah ada response dan data
    if (error.response) {
      console.error("Upload error response:", error.response.status, error.response.data)
    }

    throw new Error(
      `Upload gagal: ${
        error.response
          ? typeof error.response.data === "string"
            ? error.response.data.substring(0, 100)
            : JSON.stringify(error.response.data).substring(0, 100)
          : error.message
      }`,
    )
  }
}

async function upscale(img: string, options: { style?: string; noise?: string } = {}) {
  const validation = await getImageInfo(img)
  if (!validation.valid) {
    return {
      success: false,
      code: 400,
      result: {
        error: validation.error,
      },
    }
  }

  const inputx = isValid(options.style, options.noise)
  if (!inputx.valid) {
    return {
      success: false,
      code: 400,
      result: {
        error: inputx.error,
      },
    }
  }

  const config = {
    x2: "2",
    style: inputx.style,
    noise: inputx.noise,
    file_name: validation.info.fileName,
    files_size: validation.info.fileSize,
    file_height: validation.info.height,
    file_width: validation.info.width,
    input: img,
  }

  try {
    const params = new URLSearchParams()
    params.append("conf", JSON.stringify(config))

    // Gunakan headers dari kode sumber asli
    const headers = getHeaders()

    console.log("Sending task request to bigjpg.com with config:", JSON.stringify(config))

    // Tambahkan timeout dan handling error yang lebih baik
    const taskx = await axios.post(`https://bigjpg.com/task`, params, {
      headers,
      timeout: 30000, // 30 detik timeout
    })

    // Log respons lengkap untuk debugging
    console.log("Task response:", JSON.stringify(taskx.data))

    // Periksa apakah respons adalah objek dan memiliki status
    if (!taskx.data || typeof taskx.data !== "object") {
      console.error("Invalid task response:", taskx.data)
      return {
        success: false,
        code: 400,
        result: {
          error: "Respons tidak valid dari server upscale",
        },
      }
    }

    if (taskx.data.status !== "ok") {
      return {
        success: false,
        code: 400,
        result: {
          error: "Error saat memproses gambar: " + (taskx.data.message || "Tidak ada detail"),
        },
      }
    }

    const taskId = taskx.data.info
    let attempts = 0
    const maxAttempts = 20

    console.log("Task created with ID:", taskId)

    while (attempts < maxAttempts) {
      try {
        console.log(`Checking task status (attempt ${attempts + 1}/${maxAttempts})...`)

        // Gunakan headers yang sama dengan kode sumber asli
        const res = await axios.get(`https://bigjpg.com/free?fids=${JSON.stringify([taskId])}`, {
          headers,
          timeout: 30000, // 30 detik timeout
        })

        // Log respons lengkap untuk debugging
        console.log("Status response:", JSON.stringify(res.data))

        // Periksa apakah respons adalah objek
        if (!res.data || typeof res.data !== "object") {
          console.error("Invalid status response:", res.data)
          throw new Error("Respons status tidak valid dari server")
        }

        const result = res.data[taskId]

        if (!result) {
          console.error("No result for taskId:", taskId)
          throw new Error("Tidak ada data hasil untuk tugas ini")
        }

        console.log("Task status:", result[0])

        if (result[0] === "success") {
          return {
            success: true,
            code: 200,
            result: {
              info: validation.info,
              url: result[1],
              size: result[2],
              config: {
                style: config.style,
                styleName: getAvailableStyles()[config.style],
                noise: config.noise,
                noiseName: getAvailableNoise()[config.noise],
              },
            },
          }
        } else if (result[0] === "error") {
          return {
            success: false,
            code: 400,
            result: {
              error: "Upscale gagal. Coba lagi nanti.",
            },
          }
        }

        // Tunggu 15 detik sebelum mencoba lagi
        console.log("Task still processing, waiting 15 seconds...")
        await new Promise((resolve) => setTimeout(resolve, 15000))
        attempts++
      } catch (checkError: any) {
        console.error("Error checking task status:", checkError.message)

        // Jika terjadi error saat memeriksa status, tunggu sebentar dan coba lagi
        await new Promise((resolve) => setTimeout(resolve, 15000))
        attempts++

        // Jika sudah mencoba terlalu banyak kali, kembalikan error
        if (attempts >= maxAttempts) {
          return {
            success: false,
            code: 400,
            result: {
              error: "Terlalu banyak error saat memeriksa status upscale",
            },
          }
        }
      }
    }

    return {
      success: false,
      code: 400,
      result: {
        error: "Timeout saat memproses gambar",
      },
    }
  } catch (err: any) {
    console.error("Upscale error:", err)

    // Cek apakah ada response dan data
    if (err.response) {
      console.error("Upscale error response:", err.response.status, err.response.data)

      // Coba parse response data jika itu string
      if (typeof err.response.data === "string") {
        try {
          // Coba parse sebagai JSON
          const jsonError = JSON.parse(err.response.data)
          return {
            success: false,
            code: 400,
            result: {
              error: jsonError.message || jsonError.error || "Error saat memproses gambar",
            },
          }
        } catch (e) {
          // Jika bukan JSON, gunakan string asli
          return {
            success: false,
            code: 400,
            result: {
              error: `Error saat memproses gambar: ${err.response.data.substring(0, 100)}`,
            },
          }
        }
      }
    }

    return {
      success: false,
      code: 400,
      result: {
        error: `Error saat memproses gambar: ${err.message || "Tidak ada detail"}`,
      },
    }
  }
}

function getAvailableStyles() {
  return {
    art: "Artwork",
    photo: "Foto",
  }
}

function getAvailableNoise() {
  return {
    "-1": "None",
    "0": "Low",
    "1": "Medium",
    "2": "High",
    "3": "Highest",
  }
}

function getHeaders() {
  // Gunakan headers yang sama dengan kode sumber asli
  return {
    origin: "https://bigjpg.com",
    referer: "https://bigjpg.com/",
    "user-agent": "Postify/1.0.0",
    "x-requested-with": "XMLHttpRequest",
    accept: "application/json, text/javascript, */*; q=0.01",
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
  }
}

function isValid(style?: string, noise?: string) {
  if (!style && !noise) {
    return {
      valid: true,
      style: "art",
      noise: "-1",
    }
  }

  if (style && !getAvailableStyles()[style as keyof ReturnType<typeof getAvailableStyles>]) {
    return {
      valid: false,
      error: `Style tidak valid. Pilih salah satu: ${Object.keys(getAvailableStyles()).join(", ")}`,
    }
  }

  if (noise && !getAvailableNoise()[noise as keyof ReturnType<typeof getAvailableNoise>]) {
    return {
      valid: false,
      error: `Noise level tidak valid. Pilih salah satu: ${Object.keys(getAvailableNoise()).join(", ")}`,
    }
  }

  return {
    valid: true,
    style: style || "art",
    noise: noise || "-1",
  }
}

async function getImageInfo(img: string) {
  if (!img) {
    return {
      valid: false,
      error: "URL gambar tidak boleh kosong",
    }
  }

  try {
    const response = await axios.get(img, {
      responseType: "arraybuffer",
      timeout: 30000, // 30 detik timeout
      maxContentLength: 10 * 1024 * 1024, // 10MB max
    })

    const fileSize = Number.parseInt(response.headers["content-length"] || response.data.length)
    const width = Math.floor(Math.random() * (2000 - 800 + 1)) + 800
    const height = Math.floor(Math.random() * (2000 - 800 + 1)) + 800

    let fileName = img.split("/").pop()?.split("#")[0].split("?")[0] || "image.jpg"
    if (fileName.endsWith(".webp")) {
      fileName = fileName.replace(".webp", ".jpg")
    }

    if (fileSize > 5 * 1024 * 1024) {
      return {
        valid: false,
        error: "Ukuran gambar terlalu besar. Maksimal 5MB.",
      }
    }

    return {
      valid: true,
      info: {
        fileName,
        fileSize,
        width,
        height,
      },
    }
  } catch (err: any) {
    console.error("Error saat mendapatkan info gambar:", err.message)
    return {
      valid: false,
      error: "URL gambar tidak valid. Coba URL yang lain.",
    }
  }
    }

