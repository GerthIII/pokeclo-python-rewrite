import { useEffect, useState } from 'react'

// Tiny hash router: "#/outfits/3/edit" -> ["outfits", "3", "edit"].
function parse(): string[] {
  return window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean)
}

export function useRoute(): string[] {
  const [route, setRoute] = useState(parse)
  useEffect(() => {
    const onChange = () => setRoute(parse())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}

export const go = (path: string) => {
  window.location.hash = `#/${path}`
}
