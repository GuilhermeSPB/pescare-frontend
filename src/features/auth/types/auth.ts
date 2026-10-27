export type UserRole = 'ADMIN' | 'FISHER'

// Resposta de GET /users/me (o backend nunca devolve a senha).
export interface AuthUser {
  id: number
  name: string
  email: string
  registration_date: string
  role: UserRole
  is_active: boolean
  fk_municipality_ibge_code: string
  municipality: {
    name: string
    uf: string
  }
}

export interface SignInInput {
  email: string
  password: string
}

// O login devolve o usuário sem a relação `municipality`.
export interface SignInResponse {
  token: string
  user: Omit<AuthUser, 'municipality'>
}
