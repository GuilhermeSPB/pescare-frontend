export interface NavItem {
  label: string
  icon: string
  // Uma linha sobre o que se faz no módulo; aparece só no cartão da página inicial.
  description?: string
  // Sem `to`, a seção ainda não existe e aparece desativada no menu.
  to?: string
}

export interface NavGroup {
  // Sem rótulo, o grupo aparece no menu sem título (ex.: o item "Início").
  label?: string
  // Ícone do grupo nas abas da página inicial.
  icon?: string
  items: NavItem[]
}
