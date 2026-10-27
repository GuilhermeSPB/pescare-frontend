import { NameFormDialog, type NameFormCopy } from '@/components/name-form-dialog'
import type { ToastText } from '@/hooks/use-toast'
import type {
  NamedCatalogCreateMutation,
  NamedCatalogItem,
  NamedCatalogUpdateMutation,
} from '@/types/named-catalog'
import { getApiErrorMessage, getApiErrorStatus } from '@/utils/api-error'

export interface NamedCatalogFormCopy {
  createTitle: string
  editTitle: string
  fieldLabel: string
  requiredMessage: string
  createSubmitLabel: string
  duplicateNameMessage: string
  saveErrorFallback: string
  createdToast: (name: string) => ToastText
  // O detalhe do aviso de edição é sempre o novo nome.
  renamedSummary: string
}

const buildNameFormCopy = (copy: NamedCatalogFormCopy, isEditing: boolean): NameFormCopy => ({
  title: isEditing ? copy.editTitle : copy.createTitle,
  fieldLabel: copy.fieldLabel,
  requiredMessage: copy.requiredMessage,
  submitLabel: isEditing ? 'Salvar alterações' : copy.createSubmitLabel,
})

interface NamedCatalogFormDialogProps {
  isVisible: boolean
  copy: NamedCatalogFormCopy
  // Sem item: cadastro. Com item: edição do nome.
  editingItem?: NamedCatalogItem
  createMutation: NamedCatalogCreateMutation
  renameMutation: NamedCatalogUpdateMutation
  onHide: () => void
  onSaved: (toastText: ToastText) => void
}

export function NamedCatalogFormDialog({
  isVisible,
  copy,
  editingItem,
  createMutation,
  renameMutation,
  onHide,
  onSaved,
}: NamedCatalogFormDialogProps) {
  const activeMutation = editingItem ? renameMutation : createMutation
  const isNameConflict = getApiErrorStatus(activeMutation.error) === 409

  const handleDialogHide = () => {
    createMutation.reset()
    renameMutation.reset()
    onHide()
  }

  const handleNameSubmit = (name: string) => {
    if (editingItem) {
      renameMutation.mutate(
        { id: editingItem.id, data: { name } },
        { onSuccess: (item) => onSaved([copy.renamedSummary, `Agora se chama “${item.name}”.`]) },
      )
      return
    }

    createMutation.mutate({ name }, { onSuccess: (item) => onSaved(copy.createdToast(item.name)) })
  }

  return (
    <NameFormDialog
      isVisible={isVisible}
      onHide={handleDialogHide}
      copy={buildNameFormCopy(copy, Boolean(editingItem))}
      defaultName={editingItem?.name ?? ''}
      isSubmitting={activeMutation.isPending}
      nameServerError={isNameConflict ? copy.duplicateNameMessage : undefined}
      formServerError={
        activeMutation.isError && !isNameConflict
          ? getApiErrorMessage(activeMutation.error, copy.saveErrorFallback)
          : undefined
      }
      onSubmit={handleNameSubmit}
    />
  )
}
