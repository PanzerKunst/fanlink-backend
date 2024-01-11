import path from "node:path"

export function getContentTypeFromFilePath(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase()

  switch (ext) {
  case ".png":
    return "image/png"
  case ".jpg":
  case ".jpeg":
    return "image/jpeg"
  case ".gif":
    return "image/gif"
  case ".bmp":
    return "image/bmp"
  case ".svg":
    return "image/svg+xml"
  case ".mp4":
    return "video/mp4"
  case ".webm":
    return "video/webm"
  case ".ogg":
    return "video/ogg"
  case ".mov":
    return "video/quicktime"
  case ".avi":
    return "video/x-msvideo"
  default:
    return "application/octet-stream"
  }
}
