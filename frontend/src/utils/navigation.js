export function navigateToRoute(route) {
  if (typeof window === 'undefined') return
  const normalizedRoute = route.startsWith('#') ? route : `#${route}`
  window.location.hash = normalizedRoute
}
