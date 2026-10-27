import type { UIMatch } from 'react-router'

// Dados que cada rota declara em `handle` para o layout montar o caminho no topo.
export interface RouteHandle {
  breadcrumb: string[]
}

const isRouteHandle = (handle: unknown): handle is RouteHandle =>
  typeof handle === 'object' &&
  handle !== null &&
  Array.isArray((handle as Partial<RouteHandle>).breadcrumb)

/**
 * Caminho (breadcrumb) da rota mais interna que declara um.
 *
 * @example
 * const breadcrumb = getRouteBreadcrumb(useMatches())
 */
export const getRouteBreadcrumb = (matches: UIMatch[]): string[] => {
  const deepestHandle = matches
    .map((match) => match.handle)
    .filter(isRouteHandle)
    .at(-1)

  return deepestHandle?.breadcrumb ?? []
}
