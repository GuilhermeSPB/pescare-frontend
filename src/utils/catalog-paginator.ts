const ROWS_PER_PAGE = 10

interface CatalogPaginatorProps {
  paginator: boolean
  rows: number
  paginatorTemplate: string
  currentPageReportTemplate: string
}

/**
 * Paginação padrão das tabelas de catálogo: 10 linhas, e só aparece quando há mais de uma página.
 *
 * @param isLoading durante o carregamento as linhas são esqueleto, sem paginação.
 * @example
 * <DataTable value={items} {...getCatalogPaginatorProps(items.length, isLoading)} />
 */
export const getCatalogPaginatorProps = (
  itemCount: number,
  isLoading: boolean,
): CatalogPaginatorProps => ({
  paginator: !isLoading && itemCount > ROWS_PER_PAGE,
  rows: ROWS_PER_PAGE,
  // Poucas páginas: setas de primeira/última seriam controle demais para uma lista curta.
  paginatorTemplate: 'PrevPageLink PageLinks NextPageLink CurrentPageReport',
  currentPageReportTemplate: 'Mostrando {first}–{last} de {totalRecords}',
})
