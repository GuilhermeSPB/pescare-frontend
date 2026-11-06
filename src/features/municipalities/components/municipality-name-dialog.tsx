import { NameFormDialog, type NameFormCopy } from '@/components/name-form-dialog'
import { useUpdateMunicipality } from '@/features/municipalities/api/update-municipality'
import type { ToastText } from '@/hooks/use-toast'
import type { Municipality } from '@/types/municipality'
import { getApiErrorMessage } from '@/utils/api-error'

const MUNICIPALITY_NAME_FORM_COPY: NameFormCopy = {
  title: 'Editar município',
  fieldLabel: 'Nome',
  requiredMessage: 'Informe o nome do município.',
  submitLabel: 'Salvar alterações',
}

const SAVE_ERROR_FALLBACK = 'Não foi possível salvar o município. Tente novamente.'

interface MunicipalityNameDialogProps {
  isVisible: boolean
  // Fica preenchido enquanto o diálogo fecha, para o conteúdo não sumir na animação.
  editingMunicipality?: Municipality
  onHide: () => void
  onSaved: (toastText: ToastText) => void
}

export function MunicipalityNameDialog({
  isVisible,
  editingMunicipality,
  onHide,
  onSaved,
}: MunicipalityNameDialogProps) {
  const updateMutation = useUpdateMunicipality()

  const handleDialogHide = () => {
    updateMutation.reset()
    onHide()
  }

  const handleNameSubmit = (name: string) => {
    if (!editingMunicipality) return

    updateMutation.mutate(
      { ibgeCode: editingMunicipality.ibge_code, data: { name } },
      {
        onSuccess: (municipality) =>
          onSaved(['Município atualizado', `Agora se chama “${municipality.name}”.`]),
      },
    )
  }

  return (
    <NameFormDialog
      isVisible={isVisible}
      onHide={handleDialogHide}
      copy={MUNICIPALITY_NAME_FORM_COPY}
      defaultName={editingMunicipality?.name ?? ''}
      isSubmitting={updateMutation.isPending}
      formServerError={
        updateMutation.isError
          ? getApiErrorMessage(updateMutation.error, SAVE_ERROR_FALLBACK)
          : undefined
      }
      onSubmit={handleNameSubmit}
    />
  )
}
