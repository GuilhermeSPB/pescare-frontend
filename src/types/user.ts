// Compartilhado: o usuário da sessão (auth) e a lista de usuários (users) têm a mesma forma.
export type UserRole = 'ADMIN' | 'FISHER'

// Resposta de GET /users e GET /users/me (o backend nunca devolve a senha).
export interface User {
  id: number
  name: string
  email: string
  // DATE do banco, serializado como meia-noite UTC: "AAAA-MM-DDT00:00:00.000Z".
  registration_date: string
  role: UserRole
  is_active: boolean
  fk_municipality_ibge_code: string
  municipality: {
    name: string
    uf: string
  }
}
