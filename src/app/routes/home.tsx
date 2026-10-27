import { TabPanel, TabView } from 'primereact/tabview'
import { useState } from 'react'

import { moduleNavGroups } from '@/app/nav-groups'
import { ModuleCard } from '@/components/module-card'
import { PageHeader } from '@/components/page-header'

export function HomeRoute() {
  const [activeGroupIndex, setActiveGroupIndex] = useState(0)

  return (
    <div className="flex flex-col gap-6">
      <title>Início · Pescare Admin</title>
      <PageHeader title="Bem-vindo ao Pescare Admin" />
      {/* Uma aba por grupo do menu; os cartões de cada grupo ficam no painel da aba. */}
      <TabView
        activeIndex={activeGroupIndex}
        onTabChange={(event) => setActiveGroupIndex(event.index)}
      >
        {moduleNavGroups.map((group) => (
          <TabPanel
            key={group.label}
            header={group.label}
            // No celular as abas ficam só com o texto, para as três caberem na largura.
            leftIcon={group.icon && `${group.icon} max-sm:hidden`}
          >
            <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {group.items.map((item) => (
                <li key={item.label}>
                  <ModuleCard
                    label={item.label}
                    icon={item.icon}
                    description={item.description}
                    to={item.to}
                  />
                </li>
              ))}
            </ul>
          </TabPanel>
        ))}
      </TabView>
    </div>
  )
}
