import type { FundResponseDTO } from "@/services/fund/dto/fund-response.dto"

// Fund offered by the add application form.
export interface ApplicationFundOption {
  id: string
  name: string
  // Rendered under the fund name.
  description: string
}

// Options consumed by the add application form.
export interface ApplicationAddOptions {
  funds: ApplicationFundOption[]
}

// Empty options used before the loader resolves.
export const EMPTY_APPLICATION_ADD_OPTIONS: ApplicationAddOptions =
  {
    funds: [],
  }

// Derives the fund options from the loaded funds, ordered
// by label.
export function BuildApplicationFundOptions(
  funds: FundResponseDTO[]
): ApplicationFundOption[] {
  return funds
    .map((fund) => ({
      id: fund.id,
      name: fund.name,
      description: fund.cnpj,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
}
