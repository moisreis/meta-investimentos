import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"

import { db } from "@/clients/database.client"
import { auth } from "@/clients/better-auth.client"
import { NotFoundError } from "@/errors"
import { PortfolioRepository } from "@/infrastructure/portfolio/repositories/portfolio.repository"
import { BulkDeletePortfoliosUseCase } from "@/services/portfolio/use-cases/bulk-delete-portfolios.use-case"
import { CreatePortfolioUseCase } from "@/services/portfolio/use-cases/create-portfolio.use-case"

import { bulkDeleteSchema, portfolioPayloadSchema } from "./schemas"

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

  const parsed = portfolioPayloadSchema.safeParse(body)

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

/**
 * @summary
 * Deletes multiple portfolios owned by the authenticated user.
 *
 * @remarks
 * Requires a valid session, validates the ids payload and removes
 * the rows the authenticated user owns. Rows already gone or owned
 * by other users are skipped.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
export async function DELETE(request: NextRequest) {
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

  const parsed = bulkDeleteSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Payload inválido.", issues: parsed.error.issues },
      { status: 400 }
    )
  }

  const useCase = new BulkDeletePortfoliosUseCase(new PortfolioRepository(db))

  try {
    await useCase.execute({
      portfolioIds: parsed.data.ids,
      userId: session.user.id,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof NotFoundError) {
      return NextResponse.json(
        { error: "Carteiras não encontradas." },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: "Não foi possível excluir as carteiras." },
      { status: 500 }
    )
  }
}