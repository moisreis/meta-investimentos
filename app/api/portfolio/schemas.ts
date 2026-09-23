import { z } from "zod"

// Mirrors the client form validation over the numeric payload.
export const portfolioPayloadSchema = z
  .object({
    acronym: z.string().trim().min(1).max(16),
    name: z.string().trim().min(1).max(120),
    annualInterestRate: z.number().min(0).max(999.99),
    minAllocation: z.number().min(0).max(999.99),
    targetAllocation: z.number().min(0).max(999.99),
    maxAllocation: z.number().min(0).max(999.99),
  })
  .refine((values) => values.minAllocation <= values.targetAllocation, {
    message: "A alocação mínima deve ser menor ou igual à alocação alvo.",
    path: ["minAllocation"],
  })
  .refine((values) => values.targetAllocation <= values.maxAllocation, {
    message: "A alocação alvo deve ser menor ou igual à alocação máxima.",
    path: ["maxAllocation"],
  })