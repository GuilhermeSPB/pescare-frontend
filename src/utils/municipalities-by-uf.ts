import type { Municipality } from '@/types/municipality'

export interface UfMunicipalityCount {
  uf: string
  count: number
}

const compareUfs = (first: string, second: string) => first.localeCompare(second, 'pt-BR')

/**
 * As UFs presentes na lista, sem repetição e em ordem alfabética.
 *
 * @example
 * listMunicipalityUfs(municipalities) // ['AC', 'AL', 'AM', ...]
 */
export const listMunicipalityUfs = (municipalities: Municipality[]): string[] =>
  [...new Set(municipalities.map((municipality) => municipality.uf))].sort(compareUfs)

/**
 * Agrupa os municípios por UF, com as UFs em ordem alfabética. Dentro de cada UF fica a ordem
 * recebida (a API já manda por nome).
 *
 * @example
 * groupMunicipalitiesByUf(municipalities).get('PB') // [{ ibge_code: '2500205', name: 'Aguiar', uf: 'PB' }, ...]
 */
export const groupMunicipalitiesByUf = (
  municipalities: Municipality[],
): ReadonlyMap<string, Municipality[]> => {
  const municipalitiesByUf = new Map<string, Municipality[]>()

  for (const municipality of municipalities) {
    const ufMunicipalities = municipalitiesByUf.get(municipality.uf) ?? []
    municipalitiesByUf.set(municipality.uf, [...ufMunicipalities, municipality])
  }

  return new Map([...municipalitiesByUf].sort(([first], [second]) => compareUfs(first, second)))
}

/**
 * Índice código IBGE → UF.
 *
 * @example
 * buildUfByIbgeCode(municipalities).get('2507507') // 'PB'
 */
export const buildUfByIbgeCode = (municipalities: Municipality[]): ReadonlyMap<string, string> =>
  new Map(municipalities.map((municipality) => [municipality.ibge_code, municipality.uf]))

/**
 * Quantos dos códigos escolhidos caem em cada UF, em ordem de UF.
 * Códigos que não estão no índice ficam de fora.
 *
 * @example
 * countIbgeCodesByUf(['2507507', '2504009', '1600303'], ufByIbgeCode) // [{ uf: 'AP', count: 1 }, { uf: 'PB', count: 2 }]
 */
export const countIbgeCodesByUf = (
  ibgeCodes: string[],
  ufByIbgeCode: ReadonlyMap<string, string>,
): UfMunicipalityCount[] => {
  const countByUf = new Map<string, number>()

  for (const ibgeCode of ibgeCodes) {
    const uf = ufByIbgeCode.get(ibgeCode)
    if (uf) countByUf.set(uf, (countByUf.get(uf) ?? 0) + 1)
  }

  return [...countByUf]
    .map(([uf, count]) => ({ uf, count }))
    .sort((first, second) => compareUfs(first.uf, second.uf))
}
