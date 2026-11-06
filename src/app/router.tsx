import { createBrowserRouter, RouterProvider } from 'react-router'

import type { RouteHandle } from '@/app/route-handle'
import { AppLayoutRoute } from '@/app/routes/app-layout'
import { FishingBanPeriodRoute } from '@/app/routes/fishing-ban-period'
import { HomeRoute } from '@/app/routes/home'
import { NotFoundRoute } from '@/app/routes/not-found'
import { ProfileRoute } from '@/app/routes/profile'
import { SpeciesRoute } from '@/app/routes/species'
import { UsersRoute } from '@/app/routes/users'
import { paths } from '@/config/paths'
import { SignInPage } from '@/features/auth/pages/sign-in-page'
import { BuyerTypesPage } from '@/features/buyer-types/pages/buyer-types-page'
import { FishingBanPeriodViewPage } from '@/features/fishing-bans/pages/fishing-ban-period-view-page'
import { FishingBanPeriodsPage } from '@/features/fishing-bans/pages/fishing-ban-periods-page'
import { FishingLocationTypesPage } from '@/features/fishing-location-types/pages/fishing-location-types-page'
import { FishingMethodsPage } from '@/features/fishing-methods/pages/fishing-methods-page'
import { MunicipalitiesPage } from '@/features/municipalities/pages/municipalities-page'
import { TargetGroupsPage } from '@/features/target-groups/pages/target-groups-page'

const homeHandle: RouteHandle = { breadcrumb: ['Início'] }
const speciesHandle: RouteHandle = { breadcrumb: ['Catálogos', 'Espécies'] }
const targetGroupsHandle: RouteHandle = { breadcrumb: ['Catálogos', 'Grupos-alvo'] }
const fishingMethodsHandle: RouteHandle = { breadcrumb: ['Catálogos', 'Métodos de pesca'] }
const fishingLocationTypesHandle: RouteHandle = { breadcrumb: ['Catálogos', 'Tipos de local'] }
const buyerTypesHandle: RouteHandle = { breadcrumb: ['Catálogos', 'Tipos de comprador'] }
const fishingBanPeriodsBreadcrumb = ['Regras e avisos', 'Períodos de defeso']
const fishingBanPeriodsHandle: RouteHandle = { breadcrumb: fishingBanPeriodsBreadcrumb }
const newFishingBanPeriodHandle: RouteHandle = {
  breadcrumb: [...fishingBanPeriodsBreadcrumb, 'Novo período'],
}
const fishingBanPeriodHandle: RouteHandle = {
  breadcrumb: [...fishingBanPeriodsBreadcrumb, 'Período'],
}
const editFishingBanPeriodHandle: RouteHandle = {
  breadcrumb: [...fishingBanPeriodsBreadcrumb, 'Editar período'],
}
const newFishingBanPeriodVersionHandle: RouteHandle = {
  breadcrumb: [...fishingBanPeriodsBreadcrumb, 'Nova versão'],
}
const profileHandle: RouteHandle = { breadcrumb: ['Meu perfil'] }
const usersHandle: RouteHandle = { breadcrumb: ['Administração', 'Usuários'] }
const municipalitiesHandle: RouteHandle = { breadcrumb: ['Administração', 'Municípios'] }

const router = createBrowserRouter([
  { path: paths.signIn, element: <SignInPage /> },
  {
    path: paths.home,
    element: <AppLayoutRoute />,
    children: [
      { index: true, element: <HomeRoute />, handle: homeHandle },
      { path: paths.species, element: <SpeciesRoute />, handle: speciesHandle },
      { path: paths.targetGroups, element: <TargetGroupsPage />, handle: targetGroupsHandle },
      {
        path: paths.fishingMethods,
        element: <FishingMethodsPage />,
        handle: fishingMethodsHandle,
      },
      {
        path: paths.fishingLocationTypes,
        element: <FishingLocationTypesPage />,
        handle: fishingLocationTypesHandle,
      },
      { path: paths.buyerTypes, element: <BuyerTypesPage />, handle: buyerTypesHandle },
      {
        path: paths.fishingBanPeriods,
        element: <FishingBanPeriodsPage />,
        handle: fishingBanPeriodsHandle,
      },
      {
        path: paths.newFishingBanPeriod,
        element: <FishingBanPeriodRoute mode="create" />,
        handle: newFishingBanPeriodHandle,
      },
      {
        path: paths.fishingBanPeriod,
        element: <FishingBanPeriodViewPage />,
        handle: fishingBanPeriodHandle,
      },
      {
        path: paths.editFishingBanPeriod,
        element: <FishingBanPeriodRoute mode="edit" />,
        handle: editFishingBanPeriodHandle,
      },
      {
        path: paths.newFishingBanPeriodVersion,
        element: <FishingBanPeriodRoute mode="new-version" />,
        handle: newFishingBanPeriodVersionHandle,
      },
      { path: paths.profile, element: <ProfileRoute />, handle: profileHandle },
      { path: paths.users, element: <UsersRoute />, handle: usersHandle },
      {
        path: paths.municipalities,
        element: <MunicipalitiesPage />,
        handle: municipalitiesHandle,
      },
    ],
  },
  { path: '*', element: <NotFoundRoute /> },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
