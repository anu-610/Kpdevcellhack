const shownPages = new Set()

export function claimPageBootLoader(pageKey) {
  if (shownPages.has(pageKey)) return false
  shownPages.add(pageKey)
  return true
}
