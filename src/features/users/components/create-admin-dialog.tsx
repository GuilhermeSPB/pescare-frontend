import { FormDialog } from '@/components/form-dialog'
import { useCreateAdmin } from '@/features/users/api/create-admin'
import { CreateAdminForm } from '@/features/users/components/create-admin-form'
import type { CreateAdminInput } from '@/features/users/types/user-input'
import type { ToastText } from '@/hooks/use-toast'
import type { Municipality } from '@/types/municipality'
import { getApiErrorMessage, getApiErrorStatus } from '@/utils/api-error'

const EMAIL_CONFLICT_MESSAGE = 'Já existe um usuário com este e-mail.'
const SAVE_ERROR_FALLBACK = 'Não foi possível cadastrar o administrador. Tente novamente.'

interface CreateAdminDialogProps {
  isVisible: boolean
  municipalities: Municipality[]
  defaultMunicipalityCode: string
  onHide: () => void
  onSaved: (toastText: ToastText) => void
}

export function CreateAdminDialog({
  isVisible,
  municipalities,
  defaultMunicipalityCode,
  onHide,
  onSaved,
}: CreateAdminDialogProps) {
  const createMutation = useCreateAdmin()
  const isEmailConflict = getApiErrorStatus(createMutation.error) === 409

  const handleDialogHide = () => {
    createMutation.reset()
    onHide()
  }

  const handleAdminSubmit = (input: CreateAdminInput) => {
    createMutation.mutate(input, {
      onSuccess: (admin) =>
        onSaved([
          'Administrador cadastrado',
          `“${admin.name}” já pode entrar no painel com a senha inicial.`,
        ]),
    })
  }

  return (
    <FormDialog
      isVisible={isVisible}
      title="Novo administrador"
      isSubmitting={createMutation.isPending}
      onHide={handleDialogHide}
    >
      <CreateAdminForm
        municipalities={municipalities}
        defaultMunicipalityCode={defaultMunicipalityCode}
        isSubmitting={createMutation.isPending}
        emailServerError={isEmailConflict ? EMAIL_CONFLICT_MESSAGE : undefined}
        formServerError={
          createMutation.isError && !isEmailConflict
            ? getApiErrorMessage(createMutation.error, SAVE_ERROR_FALLBACK)
            : undefined
        }
        onSubmit={handleAdminSubmit}
        onCancel={handleDialogHide}
      />
    </FormDialog>
  )
}
