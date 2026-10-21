import type { PositionAddOption } from "../types/withdrawal-add.types"

import Decimal from "decimal.js"

import { FormatCnpjOptional } from "@/presentation/presenters/cnpj.presenter"
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
 * Joins the qualifiers shown under the position name.
 *
 * @remarks
 * The CNPJ comes first, masked exactly like the fund picker
 * of the add application form, so the two pickers read the
 * same way and the search matches the CNPJ the user already
 * knows. The share follows it, so a position still states
 * what it is worth inside the portfolio. Either part is
 * dropped when absent, and the separator only joins the two.
 *
 * @param cnpj - The masked CNPJ of the fund, if any.
 * @param weight - The share of the portfolio, if any.
 *
 * @returns The combined subtitle, possibly empty.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-20
 */
function JoinQualifiers(cnpj: string, weight: string): string {
  return [cnpj, weight].filter(Boolean).join(" · ")
}

/**
 * @summary
 * Derives the position options from the loaded positions,
 * resolving the fund name through the fund lookup and
 * ordering the result by label. The subtitle under the name
 * carries the masked CNPJ of the fund and the share of the
 * position, so the picker shows both the fund identity the
 * application picker shows and the weight the service layer
 * derived from the money invested in it.
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
  const FUND_BY_ID = new Map(
    input.funds.map((fund) => [fund.id, fund])
  )
  const WEIGHTS = new Map(
    input.weights.map((weight) => [
      weight.positionId,
      weight.weight,
    ])
  )

  return input.positions
    .map((position) => {
      const FUND = FUND_BY_ID.get(position.fundId)
      const CNPJ = FormatCnpjOptional(FUND?.cnpj) ?? ""
      const WEIGHT = FormatWeight(
        WEIGHTS.get(position.id) ?? "0"
      )

      return {
        id: position.id,
        name: FUND?.name ?? "Fundo",
        portfolioId: position.portfolioId,
        fundId: position.fundId,
        description: JoinQualifiers(CNPJ, WEIGHT),
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
}
