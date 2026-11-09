import { useEffect, useState } from 'react'

/**
 * Devolve o valor só depois de ele ficar parado pelo tempo indicado. Evita uma requisição por
 * tecla nas buscas feitas no servidor.
 *
 * @example
 * const debouncedSearchTerm = useDebouncedValue(searchTerm, 300)
 */
export const useDebouncedValue = <Value>(value: Value, delayInMs: number): Value => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedValue(value), delayInMs)

    return () => clearTimeout(timeoutId)
  }, [value, delayInMs])

  return debouncedValue
}
