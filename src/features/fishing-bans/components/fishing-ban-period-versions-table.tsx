import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'

import { RowActions, ViewRowActionButton } from '@/components/row-action-button'
import { FishingBanPeriodStatusTag } from '@/features/fishing-bans/components/fishing-ban-period-status-tag'
import { FishingBanPeriodWindowsText } from '@/features/fishing-bans/components/fishing-ban-period-windows-text'
import type { FishingBanPeriodRow } from '@/features/fishing-bans/utils/fishing-ban-period-status'
import { formatValidityRange } from '@/features/fishing-bans/utils/fishing-ban-period-summary'

const VERSION_COLUMN_CLASS = 'w-28 whitespace-nowrap'
const WINDOW_COLUMN_CLASS = 'w-36 max-md:hidden'
const VALIDITY_COLUMN_CLASS = 'w-56 whitespace-nowrap tabular-nums max-lg:hidden'
const STATUS_COLUMN_CLASS = 'w-32'
const ACTIONS_COLUMN_CLASS = 'w-24'

interface FishingBanPeriodVersionsTableProps {
  // Da versão mais nova para a mais antiga, como a API manda.
  versions: FishingBanPeriodRow[]
  // A versão aberta na página: não tem "Visualizar", já está na tela.
  viewedPeriodId: number
  onViewClick: (version: FishingBanPeriodRow) => void
}

// Histórico de um período. As células leem a versão aberta, de fora da linha: `cellMemo={false}`.
export function FishingBanPeriodVersionsTable({
  versions,
  viewedPeriodId,
  onViewClick,
}: FishingBanPeriodVersionsTableProps) {
  const renderVersion = (version: FishingBanPeriodRow) => (
    <div className="flex flex-col">
      <span className="font-medium text-ink">Versão {version.version}</span>
      {version.is_current_version && <span className="text-sm text-ink-muted">Atual</span>}
    </div>
  )

  const renderActions = (version: FishingBanPeriodRow) =>
    version.id === viewedPeriodId ? (
      <span className="block text-center text-sm text-ink-muted">Aberta</span>
    ) : (
      <RowActions>
        <ViewRowActionButton
          itemLabel={`versão ${version.version}`}
          onClick={() => onViewClick(version)}
        />
      </RowActions>
    )

  return (
    <DataTable value={versions} dataKey="id" cellMemo={false} tableStyle={{ minWidth: '24rem' }}>
      <Column
        header="Versão"
        body={renderVersion}
        headerClassName={VERSION_COLUMN_CLASS}
        bodyClassName={VERSION_COLUMN_CLASS}
      />
      <Column header="Portaria" body={(version: FishingBanPeriodRow) => version.fishing_ban.rule} />
      <Column
        header="Janela"
        body={(version: FishingBanPeriodRow) => (
          <FishingBanPeriodWindowsText windows={version.windows} />
        )}
        headerClassName={WINDOW_COLUMN_CLASS}
        bodyClassName={WINDOW_COLUMN_CLASS}
      />
      <Column
        header="Vigência"
        body={formatValidityRange}
        headerClassName={VALIDITY_COLUMN_CLASS}
        bodyClassName={VALIDITY_COLUMN_CLASS}
      />
      <Column
        header="Status"
        body={(version: FishingBanPeriodRow) => (
          <FishingBanPeriodStatusTag status={version.display_status} />
        )}
        headerClassName={STATUS_COLUMN_CLASS}
        bodyClassName={STATUS_COLUMN_CLASS}
      />
      <Column
        header="Ações"
        alignHeader="center"
        body={renderActions}
        headerClassName={ACTIONS_COLUMN_CLASS}
        bodyClassName={ACTIONS_COLUMN_CLASS}
      />
    </DataTable>
  )
}
