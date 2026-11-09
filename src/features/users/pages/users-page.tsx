import type { UseQueryResult } from '@tanstack/react-query'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { useState } from 'react'

import { CatalogEmptyState, type CatalogEmptyStateCopy } from '@/components/catalog-empty-state'
import { CatalogSection } from '@/components/catalog-section'
import { CatalogToolbar } from '@/components/catalog-toolbar'
import { PageHeader } from '@/components/page-header'
import { QueryErrorAlert } from '@/components/query-error-alert'
import { useUsers } from '@/features/users/api/get-users'
import { CreateAdminDialog } from '@/features/users/components/create-admin-dialog'
import { UserRoleFilter } from '@/features/users/components/user-role-filter'
import { UserTable } from '@/features/users/components/user-table'
import { useUserActiveToggle } from '@/features/users/hooks/use-user-active-toggle'
import { useUserListFilters } from '@/features/users/hooks/use-user-list-filters'
import { useToast, type ToastText } from '@/hooks/use-toast'
import type { Municipality } from '@/types/municipality'
import type { User } from '@/types/user'
import { getApiErrorMessage } from '@/utils/api-error'

const USERS_EMPTY_STATE_COPY: CatalogEmptyStateCopy = {
  noMatchTitle: 'Nenhum usuário encontrado',
  noMatchDescription: 'Nenhum usuário corresponde à busca e aos filtros escolhidos.',
  emptyTitle: 'Nenhum usuário cadastrado',
  emptyDescription: 'Pescadores se cadastram pelo app; administradores, por aqui.',
  createLabel: 'Novo administrador',
}

const describeActiveToggle = (user: User, isActive: boolean): ToastText =>
  isActive
    ? ['Usuário reativado', `“${user.name}” voltou a ter acesso.`]
    : ['Usuário desativado', `“${user.name}” não entra mais no app nem no painel.`]

interface UsersPageProps {
  // Vêm de outras features, compostas na rota: opções do cadastro e o usuário da sessão.
  municipalitiesQuery: UseQueryResult<Municipality[]>
  currentUser?: User
}

export function UsersPage({ municipalitiesQuery, currentUser }: UsersPageProps) {
  const userFilters = useUserListFilters()
  const usersQuery = useUsers(userFilters.listFilters)
  const { toastRef, showSuccessToast, showErrorToast } = useToast()
  const [isCreateDialogVisible, setIsCreateDialogVisible] = useState(false)

  const { requestActiveToggle, togglingUserId } = useUserActiveToggle({
    onToggled: (user, isActive) => showSuccessToast(...describeActiveToggle(user, isActive)),
    onToggleFailed: (error) =>
      showErrorToast(
        'Não foi possível mudar a situação',
        getApiErrorMessage(error, 'Tente novamente.'),
      ),
  })

  const handleAdminSaved = (toastText: ToastText) => {
    setIsCreateDialogVisible(false)
    showSuccessToast(...toastText)
  }

  return (
    <div className="flex flex-col gap-6">
      <title>Usuários · Pescare Admin</title>
      <Toast ref={toastRef} position="bottom-right" />
      <PageHeader
        title="Usuários"
        actions={
          <Button
            label="Novo administrador"
            icon="pi pi-plus"
            disabled={!municipalitiesQuery.isSuccess}
            onClick={() => setIsCreateDialogVisible(true)}
          />
        }
      />
      <CatalogSection
        label="Lista de usuários"
        toolbar={
          <CatalogToolbar
            searchTerm={userFilters.searchTerm}
            searchLabel="Buscar usuário pelo nome ou pelo e-mail"
            statusFilter={userFilters.statusFilter}
            isDisabled={usersQuery.isPending}
            extraFilter={
              <UserRoleFilter
                selectedRole={userFilters.selectedRole}
                isDisabled={usersQuery.isPending}
                onRoleChange={userFilters.setSelectedRole}
              />
            }
            onSearchTermChange={userFilters.setSearchTerm}
            onStatusFilterChange={userFilters.setStatusFilter}
          />
        }
      >
        {usersQuery.isError ? (
          <div className="p-4">
            <QueryErrorAlert
              title="Não foi possível carregar os usuários."
              message={getApiErrorMessage(usersQuery.error, 'Tente novamente em instantes.')}
              isRetrying={usersQuery.isRefetching}
              onRetry={() => usersQuery.refetch()}
            />
          </div>
        ) : (
          <UserTable
            users={usersQuery.data ?? []}
            isLoading={usersQuery.isPending}
            currentUserId={currentUser?.id}
            emptyState={
              <CatalogEmptyState
                hasActiveFilter={userFilters.hasActiveFilter}
                copy={USERS_EMPTY_STATE_COPY}
                onClearFilters={userFilters.clearFilters}
                onCreateClick={() => setIsCreateDialogVisible(true)}
              />
            }
            togglingUserId={togglingUserId}
            onToggleActiveClick={requestActiveToggle}
          />
        )}
      </CatalogSection>
      <CreateAdminDialog
        isVisible={isCreateDialogVisible}
        municipalities={municipalitiesQuery.data ?? []}
        defaultMunicipalityCode={currentUser?.fk_municipality_ibge_code ?? ''}
        onHide={() => setIsCreateDialogVisible(false)}
        onSaved={handleAdminSaved}
      />
    </div>
  )
}
