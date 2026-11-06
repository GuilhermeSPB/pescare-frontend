import type { ReactNode } from 'react'

interface CatalogSectionProps {
  // Nome da região para leitores de tela, ex.: "Lista de métodos de pesca".
  label: string
  // Sem busca nem filtros (ex.: o histórico de versões de um período), só a tabela.
  toolbar?: ReactNode
  children: ReactNode
}

// Cartão da lista: busca e filtros no topo, tabela (ou erro) embaixo. A última linha da
// tabela perde a borda e a paginação ganha uma, para o cartão não ter borda dupla.
export function CatalogSection({ label, toolbar, children }: CatalogSectionProps) {
  return (
    <section
      aria-label={label}
      className="overflow-hidden rounded-md border border-line bg-white shadow-[0_1px_2px_rgb(15_23_42/0.04)] [&_.p-datatable-tbody>tr:last-child>td]:border-b-0 [&_.p-paginator]:border-t [&_.p-paginator]:border-line"
    >
      {toolbar && <div className="border-b border-line p-4">{toolbar}</div>}
      {children}
    </section>
  )
}
