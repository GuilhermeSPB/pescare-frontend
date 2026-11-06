import { ConfirmDialog } from 'primereact/confirmdialog'
import { Sidebar } from 'primereact/sidebar'
import { useState } from 'react'
import { Navigate, Outlet, useLocation, useMatches, useNavigate } from 'react-router'

import { sidebarNavGroups } from '@/app/nav-groups'
import { getRouteBreadcrumb } from '@/app/route-handle'
import { ProductWordmark } from '@/components/product-wordmark'
import { SidebarNav } from '@/components/sidebar-nav'
import { TopBar } from '@/components/top-bar'
import { paths } from '@/config/paths'
import { useMe } from '@/features/auth/api/get-me'
import { useSignOut } from '@/features/auth/hooks/use-sign-out'
import { getAuthToken } from '@/lib/auth-token'
import { getRoleLabel } from '@/utils/get-role-label'

function AppShell() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const meQuery = useMe()
  const signOut = useSignOut()
  const navigate = useNavigate()
  const breadcrumb = getRouteBreadcrumb(useMatches())
  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
      <a
        href="#conteudo"
        className="sr-only rounded-md bg-white px-4 py-2 font-medium text-primary shadow focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
      >
        Pular para o conteúdo
      </a>
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-line bg-white lg:flex">
        <div className="flex h-15 shrink-0 items-center border-b border-line px-6">
          <ProductWordmark />
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-5">
          <SidebarNav groups={sidebarNavGroups} />
        </div>
      </aside>
      <Sidebar
        visible={isMobileMenuOpen}
        onHide={closeMobileMenu}
        header={<ProductWordmark />}
        className="w-72 max-w-[85vw]"
      >
        <SidebarNav groups={sidebarNavGroups} onNavigate={closeMobileMenu} />
      </Sidebar>
      <div className="flex min-w-0 flex-col">
        <TopBar
          breadcrumb={breadcrumb}
          phoneBrand={<ProductWordmark />}
          userName={meQuery.data?.name}
          userCaption={meQuery.data ? getRoleLabel(meQuery.data.role) : ''}
          onMenuClick={() => setIsMobileMenuOpen(true)}
          onProfileClick={() => navigate(paths.profile)}
          onSignOutClick={signOut}
        />
        {/* Mesmo recuo lateral da barra do topo: o título alinha com o caminho acima dele. */}
        <main id="conteudo" className="w-full flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
      <ConfirmDialog
        className="w-[min(30rem,calc(100vw-2rem))]"
        rejectClassName="p-button-text p-button-secondary"
      />
    </div>
  )
}

// Sem token, nem monta o painel: vai para o login lembrando de onde veio.
export function AppLayoutRoute() {
  const location = useLocation()

  if (!getAuthToken()) {
    return <Navigate to={paths.signIn} replace state={{ from: location.pathname }} />
  }

  return <AppShell />
}
