import { Button } from 'primereact/button'

// O balão aparece acima do botão para não cobrir a linha de baixo.
const ACTION_TOOLTIP_OPTIONS = { position: 'top', showDelay: 300 } as const

// O botão pequeno do Lara deixa o ícone em 0.875rem (~12px), difícil de distinguir na linha.
const ACTIONS_ICON_CLASS = '[&_.p-button-icon]:text-lg'

interface CatalogRowActionsProps {
  // Nome que identifica a linha nos rótulos dos botões: "Editar Tarrafa".
  itemLabel: string
  isActive: boolean
  // Ativação/desativação desta linha em andamento (mostra o botão carregando).
  isToggling: boolean
  onEditClick: () => void
  onToggleActiveClick: () => void
}

// Botões redondos só com ícone; o nome da ação aparece no balão e no aria-label.
export function CatalogRowActions({
  itemLabel,
  isActive,
  isToggling,
  onEditClick,
  onToggleActiveClick,
}: CatalogRowActionsProps) {
  const toggleLabel = isActive ? 'Desativar' : 'Ativar'

  return (
    <div className={`flex justify-center gap-1 ${ACTIONS_ICON_CLASS}`}>
      <Button
        icon="pi pi-pencil"
        rounded
        text
        size="small"
        tooltip="Editar"
        tooltipOptions={ACTION_TOOLTIP_OPTIONS}
        aria-label={`Editar ${itemLabel}`}
        onClick={onEditClick}
      />
      <Button
        icon={isActive ? 'pi pi-eye-slash' : 'pi pi-eye'}
        rounded
        text
        size="small"
        severity={isActive ? 'secondary' : undefined}
        loading={isToggling}
        tooltip={toggleLabel}
        tooltipOptions={ACTION_TOOLTIP_OPTIONS}
        aria-label={`${toggleLabel} ${itemLabel}`}
        onClick={onToggleActiveClick}
      />
    </div>
  )
}
