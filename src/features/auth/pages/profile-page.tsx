import type { UseQueryResult } from '@tanstack/react-query'
import { Skeleton } from 'primereact/skeleton'
import { Toast } from 'primereact/toast'

import { FormSection } from '@/components/form-section'
import { PageHeader } from '@/components/page-header'
import { QueryErrorAlert } from '@/components/query-error-alert'
import { useMe } from '@/features/auth/api/get-me'
import { ChangePasswordForm } from '@/features/auth/components/change-password-form'
import { ProfileDetailsForm } from '@/features/auth/components/profile-details-form'
import { useToast } from '@/hooks/use-toast'
import type { Municipality } from '@/types/municipality'
import { getApiErrorMessage } from '@/utils/api-error'

// Esqueleto dos dados pessoais: nome e município, enquanto o usuário e a lista carregam.
function ProfileDetailsSkeleton() {
  return (
    <div className="flex flex-col gap-5" aria-busy="true">
      <Skeleton height="2.75rem" />
      <Skeleton height="2.75rem" />
      <Skeleton width="60%" height="2.75rem" />
    </div>
  )
}

interface ProfilePageProps {
  // Vem da feature de municípios, composta na rota: opções do campo de município.
  municipalitiesQuery: UseQueryResult<Municipality[]>
}

export function ProfilePage({ municipalitiesQuery }: ProfilePageProps) {
  const meQuery = useMe()
  const { toastRef, showSuccessToast } = useToast()
  const failedQueries = [meQuery, municipalitiesQuery].filter((query) => query.isError)

  const renderDetails = () => {
    if (failedQueries.length > 0) {
      return (
        <QueryErrorAlert
          title="Não foi possível carregar seus dados."
          message={getApiErrorMessage(failedQueries[0]?.error, 'Tente novamente em instantes.')}
          isRetrying={failedQueries.some((query) => query.isRefetching)}
          onRetry={() => failedQueries.forEach((query) => query.refetch())}
        />
      )
    }

    if (!meQuery.data || !municipalitiesQuery.data) return <ProfileDetailsSkeleton />

    return (
      <ProfileDetailsForm
        currentUser={meQuery.data}
        municipalities={municipalitiesQuery.data}
        onSaved={() => showSuccessToast('Dados salvos', 'Seu perfil foi atualizado.')}
      />
    )
  }

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <title>Meu perfil · Pescare Admin</title>
      <Toast ref={toastRef} position="bottom-right" />
      <PageHeader title="Meu perfil" />
      <FormSection title="Dados pessoais">{renderDetails()}</FormSection>
      <FormSection title="Senha">
        <ChangePasswordForm
          onPasswordChanged={() =>
            showSuccessToast('Senha alterada', 'Use a nova senha na próxima vez que entrar.')
          }
        />
      </FormSection>
    </div>
  )
}
