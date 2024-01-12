export function isValidIsoDateString(dateString: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?$/

  if (!regex.test(dateString)) {
    return false
  }

  const date = new Date(dateString)
  return date.toISOString() === dateString
}
