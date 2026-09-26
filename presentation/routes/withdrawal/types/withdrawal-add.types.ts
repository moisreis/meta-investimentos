import type { FundResponseDTO } from "@/services/fund/dto/fund-response.dto"
import type { PositionResponseDTO } from "@/services/position/dto/position-response.dto"

// Input resolved by the position option builder.
export interface BuildPositionAddOptionsInput {
  positions: PositionResponseDTO[]
  funds: FundResponseDTO[]
}

// Position offered by the add withdrawal form.
export interface PositionAddOption {
  id: string
  // Fund name of the position, rendered as the primary
  // text.
  name: string
  // Share of the portfolio the position holds, rendered
  // under the fund name.
  description: string
}

// Options consumed by the add withdrawal form.
export interface WithdrawalAddOptions {
  positions: PositionAddOption[]
}

// Empty options used before the loader resolves.
export const EMPTY_WITHDRAWAL_ADD_OPTIONS: WithdrawalAddOptions =
  {
    positions: [],
  }

// Builds the share shown under the position name.
function FormatAllocation(allocation: string): string {
  return `${allocation.replace(".", ",")}% da carteira`
}

// Derives the position options from the loaded positions,
// resolving the fund name through the fund lookup and
// ordering the result by label.
export function BuildPositionAddOptions(
  input: BuildPositionAddOptionsInput
): PositionAddOption[] {
  const FUND_NAMES = new Map(
    input.funds.map((fund) => [fund.id, fund.name])
  )

  return input.positions
    .map((position) => ({
      id: position.id,
      name: FUND_NAMES.get(position.fundId) ?? "Fundo",
      description: FormatAllocation(position.allocation),
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
}
