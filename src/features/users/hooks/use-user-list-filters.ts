import { useState } from 'react'

import type { UserListFilters } from '@/features/users/types/user-list-filters'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import type { ActiveStatusFilter } from '@/types/catalog'
import type { UserRole } from '@/types/user'
import { SERVER_SEARCH_DEBOUNCE_MS } from '@/utils/server-search'

/**
 * Estado da busca e dos filtros de perfil e situação da lista de usuários. A filtragem é no
 * servidor: o hook só monta os filtros da consulta, com o termo já estabilizado.
 *
 * @example
 * const { listFilters, searchTerm, setSearchTerm } = useUserListFilters()
 */
export const useUserListFilters = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<ActiveStatusFilter>('all')
  // `null`: todos os perfis.
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const debouncedSearchTerm = useDebouncedValue(searchTerm.trim(), SERVER_SEARCH_DEBOUNCE_MS)

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setSelectedRole(null)
  }

  const listFilters: UserListFilters = {
    ...(debouncedSearchTerm !== '' && { search: debouncedSearchTerm }),
    ...(selectedRole !== null && { role: selectedRole }),
    ...(statusFilter !== 'all' && { isActive: statusFilter === 'active' }),
  }

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    selectedRole,
    setSelectedRole,
    clearFilters,
    listFilters,
    hasActiveFilter: searchTerm.trim() !== '' || statusFilter !== 'all' || selectedRole !== null,
  }
}
