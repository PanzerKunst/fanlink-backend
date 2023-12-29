import path from "node:path"

export function getContentTypeFromFilePath(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase()

  switch (ext) {
  case ".png":
    return "image/png"
  case ".gif":
    return "image/gif"
  default:
    return "image/jpeg"
  }
}
