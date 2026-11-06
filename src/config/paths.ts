// Caminhos das rotas num só lugar: o api-client (lib/) também redireciona
// para o login e não pode importar de app/.
export const paths = {
  home: '/',
  signIn: '/entrar',
  species: '/catalogos/especies',
  targetGroups: '/catalogos/grupos-alvo',
  fishingMethods: '/catalogos/metodos-de-pesca',
  fishingLocationTypes: '/catalogos/tipos-de-local',
  buyerTypes: '/catalogos/tipos-de-comprador',
  fishingBanPeriods: '/defesos/periodos',
  newFishingBanPeriod: '/defesos/periodos/novo',
  // Visualização de uma versão; monte os links com `generatePath(paths.fishingBanPeriod, { periodId })`.
  fishingBanPeriod: '/defesos/periodos/:periodId',
  // Corrige a versão no lugar.
  editFishingBanPeriod: '/defesos/periodos/:periodId/editar',
  // Cria a versão que substitui esta.
  newFishingBanPeriodVersion: '/defesos/periodos/:periodId/nova-versao',
  // Fora do menu lateral: abre pelo menu do usuário, na barra do topo.
  profile: '/perfil',
  users: '/administracao/usuarios',
  municipalities: '/administracao/municipios',
} as const
