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
        label: 'Períodos de defeso',
        icon: 'pi pi-calendar-times',
        description: 'Cadastre os períodos de defeso com espécies, municípios e tipos de local.',
        to: paths.fishingBanPeriods,
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
        description: 'Veja os usuários, cadastre administradores e desative acessos.',
        to: paths.users,
      },
      {
        label: 'Municípios',
        icon: 'pi pi-building',
        description: 'Consulte os municípios do IBGE e corrija o nome.',
        to: paths.municipalities,
      },
    ],
  },
]

// Menu lateral: "Início" no topo, sem título de grupo, e depois os módulos.
export const sidebarNavGroups: NavGroup[] = [
  { items: [{ label: 'Início', icon: 'pi pi-home', to: paths.home }] },
  ...moduleNavGroups,
]
