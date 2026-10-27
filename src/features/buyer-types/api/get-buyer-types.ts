import { queryOptions, useQuery } from '@tanstack/react-query'

import type { BuyerType } from '@/features/buyer-types/types/buyer-type'
import { api } from '@/lib/api-client'

/**
 * Lista todos os tipos de comprador, ativos e inativos (GET /buyer-types).
 * Ao contrário dos outros catálogos, até a leitura exige token — o api-client já envia.
 * O filtro por situação é feito na tela, para as contagens usarem a lista inteira.
 *
 * @example
 * const buyerTypes = await getBuyerTypes()
 */
export const getBuyerTypes = (): Promise<BuyerType[]> =>
  api.get<BuyerType[]>('/buyer-types').then((response) => response.data)

/**
 * Query options da lista de tipos de comprador.
 *
 * @example
 * queryClient.invalidateQueries({ queryKey: getBuyerTypesQueryOptions().queryKey })
 */
export const getBuyerTypesQueryOptions = () =>
  queryOptions({ queryKey: ['buyer-types'], queryFn: getBuyerTypes })

/**
 * Lista de tipos de comprador como estado do servidor.
 *
 * @example
 * const buyerTypesQuery = useBuyerTypes()
 */
export const useBuyerTypes = () => useQuery(getBuyerTypesQueryOptions())
