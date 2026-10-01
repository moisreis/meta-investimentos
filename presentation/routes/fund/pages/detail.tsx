"use client"

import { IconCoin } from "@tabler/icons-react"

import { EntityDetailShell } from "@/presentation/parts/components/entity-detail-shell"
import { EntityDetailSummary } from "@/presentation/parts/components/entity-detail-summary"
import { EntityEmptyTable } from "@/presentation/parts/datatable/pagination/entity-empty-table"

import { FundLinkedPositionsDatatable } from "../components/fund-linked-positions-datatable"
import { BuildFundSummary } from "../helpers/build-fund-summary.helper"
import { FUND_DETAIL } from "../settings/labels.settings"
import type { FundOverviewData } from "../types/fund-overview.types"
import { EMPTY_FUND_OVERVIEW } from "../types/fund-overview.types"

interface FundDetailProps {
  data: FundOverviewData | null
}

/**
 * @summary
 * Renders the fund detail screen.
 *
 * @remarks
 * Opens with the registry profile — the fund name as the
 * headline, its CNPJ under it and the registry links and
 * fee figures in the ledger grid below — then continues
 * with the linked positions section, which lists every
 * position of the session user that holds the fund.
 *
 * The page composes the blocks and owns no markup: the
 * summary comes from its builder and the shell, the profile
 * block and the linked positions section are the parts and
 * route components that render them.
 *
 * Without a resolved fund the profile gives way to the
 * shared empty state, because there is no registry to
 * describe.
 *
 * @param props - Props of the fund detail screen.
 * @param props.data - The overview data, or `null` when
 *   the fund cannot be resolved.
 *
 * @returns The fund detail screen.
 *
 * @example
 * <FundDetail data={DATA} />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
function FundDetail({ data }: FundDetailProps) {
  const DATA = data ?? EMPTY_FUND_OVERVIEW
  const RESOLVED = DATA.fundId.length > 0
  const SUMMARY = BuildFundSummary(DATA)

  return (
    <EntityDetailShell>
      {RESOLVED ? (
        <>
          <EntityDetailSummary {...SUMMARY} />
          <FundLinkedPositionsDatatable rows={DATA.positions} />
        </>
      ) : (
        <EntityEmptyTable
          icon={IconCoin}
          title={FUND_DETAIL.EMPTY_TITLE}
          description={FUND_DETAIL.EMPTY_DESCRIPTION}
        />
      )}
    </EntityDetailShell>
  )
}

export { FundDetail }
