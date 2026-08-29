// Minimal history router tuned for this SPA: route patterns with :params.
import { useEffect, useState, useCallback } from 'react'

export type Route<P = Record<string, string>> = {
  pattern: string
  keys: string[]
  regex: RegExp
}

export function compile(pattern: string): Route {
  const keys: string[] = []
  const regex = new RegExp(
    '^' +
      pattern
        .replace(/\/+$/, '')
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        .replace(/:([A-Za-z0-9_]+)/g, (_, k) => {
          keys.push(k)
          return '([^/]+)'
        }) +
      '/?$'
  )
  return { pattern, keys, regex }
}

export function matchRoute<P extends Record<string, string>>(route: Route, path: string): P | null {
  const m = route.regex.exec(path.replace(/\/+$/, '') || '/')
  if (!m) return null
  const params: Record<string, string> = {}
  route.keys.forEach((k, i) => (params[k] = decodeURIComponent(m[i + 1])))
  return params as P
}

export function navigate(to: string) {
  window.history.pushState({}, '', to)
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
}

export function usePath(): string {
  const [path, setPath] = useState(window.location.pathname)
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])
  return path
}

export function useQuery(): URLSearchParams {
  const path = usePath()
  void path
  return new URLSearchParams(window.location.search)
}

export function setQueryParam(key: string, value: string | null) {
  const url = new URL(window.location.href)
  if (value === null || value === '') url.searchParams.delete(key)
  else url.searchParams.set(key, value)
  window.history.replaceState({}, '', url.toString())
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export function useNavigate() {
  return useCallback((to: string) => navigate(to), [])
}
