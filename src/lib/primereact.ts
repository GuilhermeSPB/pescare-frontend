import { addLocale, type APIOptions } from 'primereact/api'

// Textos internos dos componentes PrimeReact (paginação, diálogos, leitores de tela).
addLocale('pt-BR', {
  accept: 'Sim',
  reject: 'Não',
  cancel: 'Cancelar',
  close: 'Fechar',
  clear: 'Limpar',
  emptyMessage: 'Nenhum resultado',
  emptyFilterMessage: 'Nenhum resultado encontrado',
  aria: {
    close: 'Fechar',
    previous: 'Anterior',
    next: 'Próximo',
    navigation: 'Navegação',
    pageLabel: 'Página {page}',
    firstPageLabel: 'Primeira página',
    lastPageLabel: 'Última página',
    nextPageLabel: 'Próxima página',
    prevPageLabel: 'Página anterior',
    rowsPerPageLabel: 'Linhas por página',
  },
})

/**
 * Configuração global passada ao `PrimeReactProvider`.
 *
 * @example
 * <PrimeReactProvider value={primeReactConfig}>...</PrimeReactProvider>
 */
export const primeReactConfig: Partial<APIOptions> = {
  locale: 'pt-BR',
  ripple: false,
}
