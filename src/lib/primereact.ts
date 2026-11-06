import { addLocale, type APIOptions } from 'primereact/api'

// Textos internos dos componentes PrimeReact (paginação, diálogos, calendário, seleção
// múltipla, leitores de tela).
addLocale('pt-BR', {
  accept: 'Sim',
  reject: 'Não',
  cancel: 'Cancelar',
  close: 'Fechar',
  clear: 'Limpar',
  emptyMessage: 'Nenhum resultado',
  emptyFilterMessage: 'Nenhum resultado encontrado',
  // Calendar
  firstDayOfWeek: 0,
  dayNames: [
    'domingo',
    'segunda-feira',
    'terça-feira',
    'quarta-feira',
    'quinta-feira',
    'sexta-feira',
    'sábado',
  ],
  dayNamesShort: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'],
  dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
  monthNames: [
    'janeiro',
    'fevereiro',
    'março',
    'abril',
    'maio',
    'junho',
    'julho',
    'agosto',
    'setembro',
    'outubro',
    'novembro',
    'dezembro',
  ],
  monthNamesShort: [
    'jan',
    'fev',
    'mar',
    'abr',
    'mai',
    'jun',
    'jul',
    'ago',
    'set',
    'out',
    'nov',
    'dez',
  ],
  today: 'Hoje',
  weekHeader: 'Sem',
  dateFormat: 'dd/mm/yy',
  chooseDate: 'Escolher data',
  prevMonth: 'Mês anterior',
  nextMonth: 'Próximo mês',
  prevYear: 'Ano anterior',
  nextYear: 'Próximo ano',
  prevDecade: 'Década anterior',
  nextDecade: 'Próxima década',
  chooseYear: 'Escolher ano',
  chooseMonth: 'Escolher mês',
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
    selectAll: 'Selecionar todos',
    unselectAll: 'Desmarcar todos',
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
