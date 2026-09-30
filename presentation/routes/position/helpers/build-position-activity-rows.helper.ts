import type { ApplicationResponseDTO } from "@/services/application/dto/application-response.dto"
import type { WithdrawalResponseDTO } from "@/services/withdrawal/dto/withdrawal-response.dto"
import type {
  PortfolioActivityKind,
  PortfolioActivityRow,
} from "@/presentation/types/portfolio-activity-row.types"

/**
 * @summary
 * Identity of a position, enough to label its movements.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
export interface PositionActivityIdentity {
  // Id of the position the movements went through.
  id: string
  // Id of the fund the position holds.
  fundId: string
  // Fund name, rendered as the title of the row.
  fundName: string
  // Bank that custodies the fund, rendered under the name.
  bankName: string
}

// A movement of the position, before it is labeled.
interface Movement {
  id: string
  kind: PortfolioActivityKind
  date: string
  amount: string
  quotas: string
}

// Maps an application DTO onto an unlabeled movement. A
// reversed application never happened, so it is dropped
// instead of being reported next to the ones that did.
function ToMovement(
  application: ApplicationResponseDTO
): Movement | null {
  return ToActiveMovement(
    {
      id: application.id,
      kind: "application",
      date: application.date,
      amount: application.amount,
      quotas: application.quotas,
    },
    application.reversedAt
  )
}

// Maps a withdrawal DTO onto an unlabeled movement. A
// reversed withdrawal never happened, so it is dropped for
// the same reason as a reversed application.
function ToWithdrawalMovement(
  withdrawal: WithdrawalResponseDTO
): Movement | null {
  return ToActiveMovement(
    {
      id: withdrawal.id,
      kind: "withdrawal",
      date: withdrawal.date,
      amount: withdrawal.amount,
      quotas: withdrawal.quotas,
    },
    withdrawal.reversedAt
  )
}

// Drops a movement that has been reversed, keeping the rest.
// The reversal is read directly from the DTO, so the service
// layer keeps owning the meaning of a reversal.
function ToActiveMovement(
  movement: Movement,
  reversedAt: string | null
): Movement | null {
  return reversedAt === null ? movement : null
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
 * Resolves the activity rows of a position from its
 * identity and its movements.
 *
 * @remarks
 * Joins every active application and withdrawal with the
 * identity of its position, which already carries the fund
 * name and the custodian bank name, so a row renders with
 * the two lines a user expects without loading the fund and
 * bank registries a second time.
 *
 * Reversed movements are left out: a reversal means the
 * movement never happened, so reporting it beside the ones
 * that did would claim money that left no trace in the
 * patrimony. The rows come out newest first, which is the
 * order a recent activity table should open in.
 *
 * @explanation
 * Use this helper from the position detail loader. The
 * filtering by the selected window is applied later, over
 * these rows, so re-picking the dates never re-queries the
 * database.
 *
 * @param identity - The resolved identity of the position,
 *   carrying the fund and bank labels.
 * @param applications - The applications of the position,
 *   reversed or not.
 * @param withdrawals - The withdrawals of the position,
 *   reversed or not.
 *
 * @returns The activity rows, newest first.
 *
 * @example
 * const ROWS = BuildPositionActivityRows(
 *   IDENTITY, APPLICATIONS, WITHDRAWALS);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
export function BuildPositionActivityRows(
  identity: PositionActivityIdentity,
  applications: readonly ApplicationResponseDTO[],
  withdrawals: readonly WithdrawalResponseDTO[]
): PortfolioActivityRow[] {
  const MOVEMENTS = [
    ...applications.flatMap((application) => {
      const MOVEMENT = ToMovement(application)
      return MOVEMENT ? [MOVEMENT] : []
    }),
    ...withdrawals.flatMap((withdrawal) => {
      const MOVEMENT = ToWithdrawalMovement(withdrawal)
      return MOVEMENT ? [MOVEMENT] : []
    }),
  ]

  return SortNewestFirst(MOVEMENTS).map((movement) => ({
    id: movement.id,
    kind: movement.kind,
    positionId: identity.id,
    fundId: identity.fundId,
    fundName: identity.fundName,
    bankName: identity.bankName,
    date: movement.date,
    amount: movement.amount,
    quotas: movement.quotas,
  }))
}
