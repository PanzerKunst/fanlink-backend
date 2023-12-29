import { stripHtml } from "./StringUtils"

export function getPostSlug(htmlContent: string, title: string | null) {
  const slugSource = title || stripHtml(htmlContent)

  return slugSource.toLowerCase()
    .trim()
    .split(" ")
    .filter(word => !["and", "or", "but", "the"].includes(word)) // remove stop words
    .slice(0, 6) // limit to first 6 words
    .join("-") // join with hyphens
}
