import { paths } from '@/config/paths'
import type { NavGroup } from '@/types/navigation'

// Módulos do painel, agrupados. Alimentam o menu lateral e os cartões da página inicial.
// Itens sem `to` ainda não têm tela: aparecem apagados, como "Em breve".
export const moduleNavGroups: NavGroup[] = [
  {
    label: 'Catálogos',
    icon: 'pi pi-folder',
    items: [
      {
        label: 'Espécies',
        icon: 'pi pi-book',
        description: 'Cadastre espécies com nome científico, nome popular e grupo-alvo.',
        to: paths.species,
      },
      {
        label: 'Grupos-alvo',
        icon: 'pi pi-sitemap',
        description: 'Gerencie os grupos que classificam as espécies.',
        to: paths.targetGroups,
      },
      {
        label: 'Métodos de pesca',
        icon: 'pi pi-wrench',
        description: 'Gerencie os métodos que o pescador escolhe ao registrar uma pescaria.',
        to: paths.fishingMethods,
      },
      {
        label: 'Tipos de local',
        icon: 'pi pi-map-marker',
        description: 'Gerencie os tipos de local de pesca, como rio, lago e mar.',
        to: paths.fishingLocationTypes,
      },
      {
        label: 'Tipos de comprador',
        icon: 'pi pi-shopping-cart',
        description: 'Gerencie os tipos de comprador usados no registro das vendas.',
        to: paths.buyerTypes,
      },
    ],
  },
  {
    label: 'Regras e avisos',
    icon: 'pi pi-megaphone',
    items: [
      {
        label: 'Defesos',
        icon: 'pi pi-calendar-times',
        description: 'Cadastre normas de defeso com períodos, espécies, municípios e locais.',
      },
      {
        label: 'Alertas',
        icon: 'pi pi-bell',
        description: 'Crie, publique e arquive alertas para todos ou por município.',
      },
    ],
  },
  {
    label: 'Administração',
    icon: 'pi pi-cog',
    items: [
      {
        label: 'Usuários',
        icon: 'pi pi-users',
        description: 'Cadastre, ative e desative pescadores e administradores.',
      },
      {
        label: 'Municípios',
        icon: 'pi pi-building',
        description: 'Consulte os municípios pelo código do IBGE.',
      },
    ],
  },
]

// Menu lateral: "Início" no topo, sem título de grupo, e depois os módulos.
export const sidebarNavGroups: NavGroup[] = [
  { items: [{ label: 'Início', icon: 'pi pi-home', to: paths.home }] },
  ...moduleNavGroups,
]
