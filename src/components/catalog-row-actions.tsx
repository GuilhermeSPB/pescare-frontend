import { RowActionButton, RowActions, ViewRowActionButton } from '@/components/row-action-button'

interface CatalogRowActionsProps {
  // Nome que identifica a linha nos rótulos dos botões: "Visualizar Tarrafa".
  itemLabel: string
  isActive: boolean
  // Ativação/desativação desta linha em andamento (mostra o botão carregando).
  isToggling: boolean
  onEditClick: () => void
  onToggleActiveClick: () => void
}

// Visualizar (onde também se edita) e ativar/desativar, as duas ações de toda linha de catálogo.
export function CatalogRowActions({
  itemLabel,
  isActive,
  isToggling,
  onEditClick,
  onToggleActiveClick,
}: CatalogRowActionsProps) {
  return (
    <RowActions>
      <ViewRowActionButton itemLabel={itemLabel} onClick={onEditClick} />
      <RowActionButton
        icon={isActive ? 'pi pi-eye-slash' : 'pi pi-eye'}
        actionLabel={isActive ? 'Desativar' : 'Ativar'}
        itemLabel={itemLabel}
        isLoading={isToggling}
        isSecondary={isActive}
        onClick={onToggleActiveClick}
      />
    </RowActions>
  )
}
