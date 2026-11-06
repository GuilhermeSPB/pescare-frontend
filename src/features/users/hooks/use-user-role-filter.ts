import { useState } from 'react'

import type { User, UserRole } from '@/types/user'

/**
 * Filtro por perfil da lista de usuários. Roda antes do `useCatalogFilter`, para as
 * contagens de status acompanharem o perfil escolhido.
 *
 * @example
 * const { usersWithRole, selectedRole, setSelectedRole } = useUserRoleFilter(users)
 * const catalogFilter = useCatalogFilter(usersWithRole, getUserSearchText)
 */
export const useUserRoleFilter = (users: User[]) => {
  // `null`: todos os perfis.
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)

  return {
    selectedRole,
    setSelectedRole,
    usersWithRole: selectedRole ? users.filter((user) => user.role === selectedRole) : users,
  }
}
