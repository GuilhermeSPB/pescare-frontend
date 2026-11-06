// POST /users: o backend cria sempre um ADMIN. Pescadores se cadastram pelo app.
export interface CreateAdminInput {
  name: string
  email: string
  // Senha inicial, que quem cadastra repassa ao novo admin.
  password: string
  fk_municipality_ibge_code: string
}

// PATCH /users/:id: o admin só ativa e desativa; o perfil não muda.
export interface UpdateUserStatusInput {
  id: number
  data: { is_active: boolean }
}
