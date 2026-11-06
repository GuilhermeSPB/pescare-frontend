import { Column, type ColumnBodyOptions } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Skeleton } from 'primereact/skeleton'
import type { ReactNode } from 'react'

import { ActiveStatusTag } from '@/components/active-status-tag'
import { RowActionButton, RowActions } from '@/components/row-action-button'
import type { User } from '@/types/user'
import { getCatalogPaginatorProps } from '@/utils/catalog-paginator'
import { getRoleLabel } from '@/utils/get-role-label'
import { formatDatabaseDate } from '@/utils/iso-date'

// Larguras no cabeçalho e no corpo: sem linhas (lista vazia), o cabeçalho não muda de lugar.
// Somem nesta ordem conforme a tela estreita: município, cadastro, perfil e situação.
const ROLE_COLUMN_CLASS = 'w-36 max-sm:hidden'
const MUNICIPALITY_COLUMN_CLASS = 'w-48 max-lg:hidden'
const REGISTRATION_COLUMN_CLASS = 'w-28 max-md:hidden'
const STATUS_COLUMN_CLASS = 'w-28 max-sm:hidden'
const ACTIONS_COLUMN_CLASS = 'w-24'

// Mesmo esqueleto dos catálogos: larguras variadas para não parecer um carimbo.
const SKELETON_NAME_WIDTHS = ['9rem', '12rem', '7rem', '10rem', '8rem', '11rem']
const SKELETON_ROWS: User[] = SKELETON_NAME_WIDTHS.map((_, index) => ({
  id: -(index + 1),
  name: '',
  email: '',
  registration_date: '',
  role: 'FISHER',
  is_active: true,
  fk_municipality_ibge_code: '',
  municipality: { name: '', uf: '' },
}))

const formatRegistrationDate = (user: User) => formatDatabaseDate(user.registration_date)

interface UserTableProps {
  users: User[]
  isLoading: boolean
  // Usuário da sessão: a linha dele não tem ação, porque ninguém desativa a si mesmo.
  currentUserId?: number
  emptyState: ReactNode
  // Linha cuja ativação/desativação está em andamento (mostra o botão carregando).
  togglingUserId?: number
  onToggleActiveClick: (user: User) => void
}

export function UserTable({
  users,
  isLoading,
  currentUserId,
  emptyState,
  togglingUserId,
  onToggleActiveClick,
}: UserTableProps) {
  const withSkeleton =
    (render: (user: User) => ReactNode, skeletonWidth: string) => (user: User) =>
      isLoading ? <Skeleton width={skeletonWidth} /> : render(user)

  const renderName = (user: User, options: ColumnBodyOptions) => {
    if (isLoading) return <Skeleton width={SKELETON_NAME_WIDTHS[options.rowIndex]} />

    return (
      <div className="flex flex-col items-start gap-0.5">
        <span className="font-medium text-ink">
          {user.name}
          {user.id === currentUserId && <span className="font-normal text-ink-muted"> (você)</span>}
        </span>
        <span className="break-all text-ink-muted">{user.email}</span>
        {/* No celular perfil e situação saem das colunas e vêm para baixo do nome. */}
        <span className="mt-1 flex items-center gap-2 text-ink-muted sm:hidden">
          {getRoleLabel(user.role)}
          <ActiveStatusTag isActive={user.is_active} />
        </span>
      </div>
    )
  }

  const renderActions = (user: User) => {
    if (isLoading) return <Skeleton width="2rem" className="mx-auto" />
    if (user.id === currentUserId) return null

    return (
      <RowActions>
        <RowActionButton
          icon={user.is_active ? 'pi pi-eye-slash' : 'pi pi-eye'}
          actionLabel={user.is_active ? 'Desativar' : 'Ativar'}
          itemLabel={user.name}
          isLoading={togglingUserId === user.id}
          isSecondary={user.is_active}
          onClick={() => onToggleActiveClick(user)}
        />
      </RowActions>
    )
  }

  return (
    <DataTable
      value={isLoading ? SKELETON_ROWS : users}
      dataKey="id"
      emptyMessage={emptyState}
      sortField="name"
      sortOrder={1}
      {...getCatalogPaginatorProps(users.length, isLoading)}
      aria-busy={isLoading}
      tableStyle={{ minWidth: '18rem' }}
      // O DataTable memoiza as células pelo `rowData`: sem isto, o usuário da sessão e o botão
      // carregando (dados de fora da linha) não chegam ao template quando mudam.
      cellMemo={false}
    >
      <Column field="name" header="Nome" sortable={!isLoading} body={renderName} />
      <Column
        field="role"
        header="Perfil"
        sortable={!isLoading}
        body={withSkeleton((user) => getRoleLabel(user.role), '6rem')}
        headerClassName={ROLE_COLUMN_CLASS}
        bodyClassName={ROLE_COLUMN_CLASS}
      />
      <Column
        header="Município"
        body={withSkeleton((user) => `${user.municipality.name}/${user.municipality.uf}`, '8rem')}
        headerClassName={MUNICIPALITY_COLUMN_CLASS}
        bodyClassName={MUNICIPALITY_COLUMN_CLASS}
      />
      <Column
        field="registration_date"
        header="Cadastro"
        sortable={!isLoading}
        body={withSkeleton(formatRegistrationDate, '5rem')}
        headerClassName={REGISTRATION_COLUMN_CLASS}
        bodyClassName={`${REGISTRATION_COLUMN_CLASS} tabular-nums`}
      />
      <Column
        field="is_active"
        header="Status"
        sortable={!isLoading}
        body={withSkeleton(
          (user) => (
            <ActiveStatusTag isActive={user.is_active} />
          ),
          '4.5rem',
        )}
        headerClassName={STATUS_COLUMN_CLASS}
        bodyClassName={STATUS_COLUMN_CLASS}
      />
      <Column
        header="Ações"
        alignHeader="center"
        body={renderActions}
        headerClassName={ACTIONS_COLUMN_CLASS}
        bodyClassName={ACTIONS_COLUMN_CLASS}
      />
    </DataTable>
  )
}
