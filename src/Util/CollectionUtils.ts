export function withoutNullish<T>(arr: (T | null | undefined)[] | null | undefined): T[] {
  if (!arr) {
    return []
  }

  return arr.reduce((res, el) => {
    if (el) {
      res.push(el)
    }

    return res
  }, [] as T[])
}
