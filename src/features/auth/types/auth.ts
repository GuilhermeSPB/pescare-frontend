import type { User } from '@/types/user'

export interface SignInInput {
  email: string
  password: string
}

// O login devolve o usuário sem a relação `municipality`.
export interface SignInResponse {
  token: string
  user: Omit<User, 'municipality'>
}

// PATCH /users/me: o próprio usuário só muda nome e município. E-mail e perfil não mudam aqui.
export interface UpdateMeInput {
  name: string
  fk_municipality_ibge_code: string
}

// PATCH /users/me/password: exige a senha atual; a nova deve ser diferente dela.
export interface ChangePasswordInput {
  current_password: string
  new_password: string
}
