import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { z } from "zod"

import { db } from "@/clients/database.client"
import { auth } from "@/clients/better-auth.client"
import { PortfolioRepository } from "@/infrastructure/portfolio/repositories/portfolio.repository"
import { CreatePortfolioUseCase } from "@/services/portfolio/use-cases/create-portfolio.use-case"

// Mirrors the client form validation over the numeric payload.
const createPortfolioSchema = z
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

/**
 * @summary
 * Creates a portfolio for the authenticated user.
 *
 * @remarks
 * Requires a valid session, validates the numeric payload and
 * persists the portfolio through the service layer. Numeric
 * percentages are stringified for the create DTO.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 })
  }

  const parsed = createPortfolioSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Payload inválido.", issues: parsed.error.issues },
      { status: 400 }
    )
  }

  const useCase = new CreatePortfolioUseCase(new PortfolioRepository(db))

  const created = await useCase.execute({
    acronym: parsed.data.acronym,
    name: parsed.data.name,
    userId: session.user.id,
    annualInterestRate: String(parsed.data.annualInterestRate),
    minAllocation: String(parsed.data.minAllocation),
    targetAllocation: String(parsed.data.targetAllocation),
    maxAllocation: String(parsed.data.maxAllocation),
  })

  return NextResponse.json(created, { status: 201 })
}