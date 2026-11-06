import type { FishingBanPeriodWindow } from '@/features/fishing-bans/types/fishing-ban-period'
import { formatPeriodWindow } from '@/features/fishing-bans/utils/period-window'

// Uma janela por linha: um período chega a ter cinco (a andada do caranguejo-uçá).
export function FishingBanPeriodWindowsText({ windows }: { windows: FishingBanPeriodWindow[] }) {
  return (
    <span className="flex flex-col tabular-nums">
      {windows.map((window) => (
        <span key={window.start_date} className="whitespace-nowrap">
          {formatPeriodWindow(window.start_date, window.end_date)}
        </span>
      ))}
    </span>
  )
}
