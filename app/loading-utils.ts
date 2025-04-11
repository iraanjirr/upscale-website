export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export function getRandomPlaceholderImage(index: number): string {
  const themes = ["Coding+Project", "UI+Design", "Programming+Setup", "Web+Development", "Mobile+App", "AI+Project"]

  const selectedTheme = themes[index % themes.length]
  return `/placeholder.svg?height=600&width=600&text=${selectedTheme}`
}
