import type { BankResponseDTO } from "@/services/bank/dto/bank-response.dto"
import type { BenchmarkResponseDTO } from "@/services/benchmark/dto/benchmark-response.dto"
import type { CategoryResponseDTO } from "@/services/category/dto/category-response.dto"

// Options consumed by the fund form selects.
export interface FundSelectOptions {
  banks: BankResponseDTO[]
  benchmarks: BenchmarkResponseDTO[]
  categories: CategoryResponseDTO[]
}

// Derived data rendered on a fund row.
export interface FundRowSummary {
  // Positions linked to the fund.
  positionCount: number
}

// Name lookups used by the fund datatable.
export interface FundNameLookups {
  banks: Record<string, string>
  benchmarks: Record<string, string>
  categories: Record<string, string>
}
