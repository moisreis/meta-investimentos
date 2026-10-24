import type { ApplicationResponseDTO } from "@/services/application/dto/application-response.dto"
import type { WithdrawalResponseDTO } from "@/services/withdrawal/dto/withdrawal-response.dto"
import type { PortfolioHolding } from "@/presentation/types/portfolio-holding.types"
import type {
  PortfolioActivityKind,
  PortfolioActivityRow,
} from "@/presentation/types/portfolio-activity-row.types"

// A movement of the portfolio, before it is labeled.
interface Movement {
  id: string
  positionId: string
  kind: PortfolioActivityKind
  date: string
  amount: string
  quotas: string
  reversedAt: string | null
}

// Maps an application DTO onto an unlabeled movement.
function ToMovement(
  application: ApplicationResponseDTO
): Movement {
  return {
    id: application.id,
    positionId: application.positionId,
    kind: "application",
    date: application.date,
    amount: application.amount,
    quotas: application.quotas,
    reversedAt: application.reversedAt,
  }
}

// Maps a withdrawal DTO onto an unlabeled movement.
function ToWithdrawalMovement(
  withdrawal: WithdrawalResponseDTO
): Movement {
  return {
    id: withdrawal.id,
    positionId: withdrawal.positionId,
    kind: "withdrawal",
    date: withdrawal.date,
    amount: withdrawal.amount,
    quotas: withdrawal.quotas,
    reversedAt: withdrawal.reversedAt,
  }
}

// Orders the movements from the newest to the oldest. The
// date is an ISO 8601 string, so the lexicographic order is
// also the chronological one.
function SortNewestFirst(
  movements: readonly Movement[]
): Movement[] {
  return [...movements].sort((left, right) =>
    right.date.localeCompare(left.date)
  )
}

/**
 * @summary
 * Resolves the activity rows of a portfolio from its
 * holdings and its movements.
 *
 * @remarks
 * Joins every application and withdrawal with the
 * holding of its position, which already carries the fund
 * name and the custodian bank name, so a row renders with
 * the two lines a user expects without loading the fund and
 * bank registries a second time. A movement whose position
 * has no resolved holding is dropped, since it could not be
 * labeled. Reversed movements remain listed and carry
 * `reversedAt`. The rows come out newest first, which is
 * the order a recent activity table should open in.
 *
 * @explanation
 * Use this helper from the portfolio detail loader. The
 * filtering by the selected window is applied later, over
 * these rows, so re-picking the dates never re-queries the
 * database.
 *
 * @param holdings - The resolved holdings of the portfolio,
 *   keyed by position through their `positionId`.
 * @param applications - The applications of the portfolio's
 *   positions, reversed or not.
 * @param withdrawals - The withdrawals of the portfolio's
 *   positions, reversed or not.
 *
 * @returns The activity rows, newest first.
 *
 * @example
 * const ROWS = BuildPortfolioActivityRows(
 *   HOLDINGS, APPLICATIONS, WITHDRAWALS);
 *
 * @author Moisés Reis
 *
 * @date 2026-10-21
 */
export function BuildPortfolioActivityRows(
  holdings: readonly PortfolioHolding[],
  applications: readonly ApplicationResponseDTO[],
  withdrawals: readonly WithdrawalResponseDTO[]
): PortfolioActivityRow[] {
  const BY_POSITION = new Map(
    holdings.map((holding) => [holding.positionId, holding])
  )

  const MOVEMENTS = [
    ...applications.map((application) =>
      ToMovement(application)
    ),
    ...withdrawals.map((withdrawal) =>
      ToWithdrawalMovement(withdrawal)
    ),
  ]

  return SortNewestFirst(MOVEMENTS).flatMap((movement) => {
    const HOLDING = BY_POSITION.get(movement.positionId)

    if (!HOLDING) return []

    return [
      {
        id: movement.id,
        kind: movement.kind,
        positionId: movement.positionId,
        fundId: HOLDING.fundId,
        fundName: HOLDING.fundName,
        bankName: HOLDING.bankName,
        date: movement.date,
        amount: movement.amount,
        quotas: movement.quotas,
        reversedAt: movement.reversedAt,
      },
    ]
  })
}
