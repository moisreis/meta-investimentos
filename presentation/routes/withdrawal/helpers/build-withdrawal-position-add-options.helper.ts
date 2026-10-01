import type { PositionAddOption } from "../types/withdrawal-add.types"

import Decimal from "decimal.js"

import { FormatPercentage } from "@/presentation/presenters/percentage.presenter"
import type { FundRow } from "@/presentation/types/fund-row.types"
import type { PositionRow } from "@/presentation/types/position-row.types"
import type { PositionWeightRow } from "@/presentation/types/position-weight-row.types"

/**
 * @summary
 * Input resolved by the position option builder.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export interface BuildPositionAddOptionsInput {
  positions: PositionRow[]
  funds: FundRow[]
  // Share each position holds of its portfolio, keyed by
  // position. Positions without an entry weigh nothing.
  weights: PositionWeightRow[]
}

/**
 * @summary
 * Builds the share shown under the position name.
 *
 * @remarks
 * The share comes from the money invested in the position,
 * not from the nominal even split persisted on it, so it
 * reflects what the position is actually worth inside its
 * portfolio.
 *
 * @remarks
 * A position that holds nothing of its portfolio has no
 * share worth reporting, so its line is left out instead of
 * showing a placeholder.
 *
 * @param weight - The share of the portfolio, in percent
 * units.
 *
 * @returns The share rendered under the position name, or
 * an empty string when the position weighs nothing.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function FormatWeight(weight: string): string {
  if (new Decimal(weight || 0).isZero()) return ""

  return `${FormatPercentage(weight)} da carteira`
}

/**
 * @summary
 * Derives the position options from the loaded positions,
 * resolving the fund name through the fund lookup and
 * ordering the result by label. The share under the name
 * comes from the weight of the position, which the service
 * layer derived from the money invested in it.
 *
 * @param input - The positions, funds and weights to
 * project.
 *
 * @returns The position options, ordered by fund name.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export function BuildPositionAddOptions(
  input: BuildPositionAddOptionsInput
): PositionAddOption[] {
  const FUND_NAMES = new Map(
    input.funds.map((fund) => [fund.id, fund.name])
  )
  const WEIGHTS = new Map(
    input.weights.map((weight) => [
      weight.positionId,
      weight.weight,
    ])
  )

  return input.positions
    .map((position) => ({
      id: position.id,
      name: FUND_NAMES.get(position.fundId) ?? "Fundo",
      portfolioId: position.portfolioId,
      fundId: position.fundId,
      description: FormatWeight(WEIGHTS.get(position.id) ?? "0"),
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
}
