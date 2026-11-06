import type { User } from '@/types/user'

/**
 * Texto em que a busca de usuários procura: nome e e-mail.
 *
 * @example
 * useCatalogFilter(users, getUserSearchText)
 */
export const getUserSearchText = (user: User): string => `${user.name} ${user.email}`
