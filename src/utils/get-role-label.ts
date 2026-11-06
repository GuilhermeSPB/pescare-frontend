import type { UserRole } from '@/types/user'

const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: 'Administrador',
  FISHER: 'Pescador',
}

/**
 * Nome do perfil em português para exibir na interface.
 *
 * @example
 * getRoleLabel('ADMIN') // 'Administrador'
 */
export const getRoleLabel = (role: UserRole): string => ROLE_LABELS[role]
