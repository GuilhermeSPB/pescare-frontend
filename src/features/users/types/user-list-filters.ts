import type { UserRole } from '@/types/user'

// Filtros da lista de usuários, aplicados no servidor. Ausente: sem aquele filtro.
export interface UserListFilters {
  search?: string
  role?: UserRole
  isActive?: boolean
}
