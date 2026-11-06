import { ProfilePage } from '@/features/auth/pages/profile-page'
import { useMunicipalities } from '@/features/municipalities/api/get-municipalities'

export function ProfileRoute() {
  // "Meu perfil" escolhe município; uma feature não importa a outra, então a rota compõe.
  const municipalitiesQuery = useMunicipalities()

  return <ProfilePage municipalitiesQuery={municipalitiesQuery} />
}
