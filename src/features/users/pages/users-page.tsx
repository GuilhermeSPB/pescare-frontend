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
import { useUserRoleFilter } from '@/features/users/hooks/use-user-role-filter'
import { getUserSearchText } from '@/features/users/utils/get-user-search-text'
import { useCatalogFilter } from '@/hooks/use-catalog-filter'
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
  const usersQuery = useUsers()
  const roleFilter = useUserRoleFilter(usersQuery.data ?? [])
  const catalogFilter = useCatalogFilter(roleFilter.usersWithRole, getUserSearchText)
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

  const clearFilters = () => {
    catalogFilter.clearFilters()
    roleFilter.setSelectedRole(null)
  }

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
            searchTerm={catalogFilter.searchTerm}
            searchLabel="Buscar usuário pelo nome ou pelo e-mail"
            statusFilter={catalogFilter.statusFilter}
            counts={usersQuery.isSuccess ? catalogFilter.counts : undefined}
            extraFilter={
              <UserRoleFilter
                selectedRole={roleFilter.selectedRole}
                isDisabled={!usersQuery.isSuccess}
                onRoleChange={roleFilter.setSelectedRole}
              />
            }
            onSearchTermChange={catalogFilter.setSearchTerm}
            onStatusFilterChange={catalogFilter.setStatusFilter}
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
            users={catalogFilter.filteredItems}
            isLoading={usersQuery.isPending}
            currentUserId={currentUser?.id}
            emptyState={
              <CatalogEmptyState
                hasActiveFilter={catalogFilter.hasActiveFilter || roleFilter.selectedRole !== null}
                copy={USERS_EMPTY_STATE_COPY}
                onClearFilters={clearFilters}
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
