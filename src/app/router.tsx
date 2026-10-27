import { createBrowserRouter, RouterProvider } from 'react-router'

import type { RouteHandle } from '@/app/route-handle'
import { AppLayoutRoute } from '@/app/routes/app-layout'
import { HomeRoute } from '@/app/routes/home'
import { NotFoundRoute } from '@/app/routes/not-found'
import { SpeciesRoute } from '@/app/routes/species'
import { paths } from '@/config/paths'
import { SignInPage } from '@/features/auth/pages/sign-in-page'
import { BuyerTypesPage } from '@/features/buyer-types/pages/buyer-types-page'
import { FishingLocationTypesPage } from '@/features/fishing-location-types/pages/fishing-location-types-page'
import { FishingMethodsPage } from '@/features/fishing-methods/pages/fishing-methods-page'
import { TargetGroupsPage } from '@/features/target-groups/pages/target-groups-page'

const homeHandle: RouteHandle = { breadcrumb: ['Início'] }
const speciesHandle: RouteHandle = { breadcrumb: ['Catálogos', 'Espécies'] }
const targetGroupsHandle: RouteHandle = { breadcrumb: ['Catálogos', 'Grupos-alvo'] }
const fishingMethodsHandle: RouteHandle = { breadcrumb: ['Catálogos', 'Métodos de pesca'] }
const fishingLocationTypesHandle: RouteHandle = { breadcrumb: ['Catálogos', 'Tipos de local'] }
const buyerTypesHandle: RouteHandle = { breadcrumb: ['Catálogos', 'Tipos de comprador'] }

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
    ],
  },
  { path: '*', element: <NotFoundRoute /> },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
