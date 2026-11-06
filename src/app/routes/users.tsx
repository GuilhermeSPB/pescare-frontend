import { useMe } from '@/features/auth/api/get-me'
import { useMunicipalities } from '@/features/municipalities/api/get-municipalities'
import { UsersPage } from '@/features/users/pages/users-page'

export function UsersRoute() {
  // Usuários escolhe município no cadastro e reconhece a própria linha; uma feature não
  // importa a outra, então a rota compõe.
  const municipalitiesQuery = useMunicipalities()
  const meQuery = useMe()

  return <UsersPage municipalitiesQuery={municipalitiesQuery} currentUser={meQuery.data} />
}
