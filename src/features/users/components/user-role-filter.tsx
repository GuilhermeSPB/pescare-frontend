import { Dropdown } from 'primereact/dropdown'

import type { UserRole } from '@/types/user'

const ROLE_FILTER_OPTIONS: { label: string; value: UserRole }[] = [
  { label: 'Administradores', value: 'ADMIN' },
  { label: 'Pescadores', value: 'FISHER' },
]

interface UserRoleFilterProps {
  // `null`: todos os perfis.
  selectedRole: UserRole | null
  isDisabled: boolean
  onRoleChange: (role: UserRole | null) => void
}

export function UserRoleFilter({ selectedRole, isDisabled, onRoleChange }: UserRoleFilterProps) {
  return (
    // Limpar o Dropdown manda `undefined`: volta a todos os perfis. O nome acessível vai como
    // `aria-label`: o Dropdown só repassa atributos `aria-*` ao input que recebe o foco, não `ariaLabel`.
    <Dropdown
      value={selectedRole}
      options={ROLE_FILTER_OPTIONS}
      onChange={(event) => onRoleChange((event.value as UserRole | undefined) ?? null)}
      placeholder="Todos os perfis"
      aria-label="Filtrar por perfil"
      showClear
      disabled={isDisabled}
      className="w-full md:w-48"
    />
  )
}
