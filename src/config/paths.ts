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
} as const
