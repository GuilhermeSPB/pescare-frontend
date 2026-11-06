import { Button } from 'primereact/button'
import type { ReactNode } from 'react'

// O balão aparece acima do botão para não cobrir a linha de baixo.
const ACTION_TOOLTIP_OPTIONS = { position: 'top', showDelay: 300 } as const

// O botão pequeno do Lara deixa o ícone em 0.875rem (~12px), difícil de distinguir na linha.
const ACTIONS_ICON_CLASS = '[&_.p-button-icon]:text-lg'

// Fileira de ações de uma linha de tabela, centralizada na coluna "Ações".
export function RowActions({ children }: { children: ReactNode }) {
  return <div className={`flex justify-center gap-1 ${ACTIONS_ICON_CLASS}`}>{children}</div>
}

interface RowActionButtonProps {
  icon: string
  // Verbo da ação, no balão e no início do nome acessível: "Visualizar".
  actionLabel: string
  // Nome que identifica a linha no nome acessível: "Visualizar Tarrafa".
  itemLabel: string
  // Ação em andamento nesta linha (mostra o botão carregando).
  isLoading?: boolean
  // Cinza em vez de azul: ações que tiram algo de uso (desativar, encerrar).
  isSecondary?: boolean
  onClick: () => void
}

// Botão redondo só com ícone; o nome da ação aparece no balão e no aria-label.
export function RowActionButton({
  icon,
  actionLabel,
  itemLabel,
  isLoading = false,
  isSecondary = false,
  onClick,
}: RowActionButtonProps) {
  return (
    <Button
      icon={icon}
      rounded
      text
      size="small"
      severity={isSecondary ? 'secondary' : undefined}
      loading={isLoading}
      tooltip={actionLabel}
      tooltipOptions={ACTION_TOOLTIP_OPTIONS}
      aria-label={`${actionLabel} ${itemLabel}`}
      onClick={onClick}
    />
  )
}

interface ViewRowActionButtonProps {
  itemLabel: string
  onClick: () => void
}

// Abre o item da linha (diálogo ou página), onde ele também se edita.
export function ViewRowActionButton({ itemLabel, onClick }: ViewRowActionButtonProps) {
  return (
    <RowActionButton
      icon="pi pi-search"
      actionLabel="Visualizar"
      itemLabel={itemLabel}
      onClick={onClick}
    />
  )
}
