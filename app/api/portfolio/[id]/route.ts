import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { z } from "zod"

import { db } from "@/clients/database.client"
import { auth } from "@/clients/better-auth.client"
import { ConcurrencyError, NotFoundError, ValidationError } from "@/errors"
import { PortfolioRepository } from "@/infrastructure/portfolio/repositories/portfolio.repository"
import { UpdatePortfolioUseCase } from "@/services/portfolio/use-cases/update-portfolio.use-case"

import { portfolioPayloadSchema } from "../schemas"

// Route params for the portfolio id.
const portfolioIdSchema = z.string().trim().min(1)

/**
 * @summary
 * Updates a portfolio owned by the authenticated user.
 *
 * @remarks
 * Requires a valid session, validates the numeric payload and the
 * route id, and persists the changes through the service layer.
 * Ownership is enforced: rows of other users are not found.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 })
  }

  const { id } = await context.params

  if (!portfolioIdSchema.safeParse(id).success) {
    return NextResponse.json(
      { error: "Identificador inválido." },
      { status: 400 }
    )
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

  const useCase = new UpdatePortfolioUseCase(new PortfolioRepository(db))

  try {
    const updated = await useCase.execute({
      portfolioId: id,
      userId: session.user.id,
      acronym: parsed.data.acronym,
      name: parsed.data.name,
      annualInterestRate: String(parsed.data.annualInterestRate),
      minAllocation: String(parsed.data.minAllocation),
      targetAllocation: String(parsed.data.targetAllocation),
      maxAllocation: String(parsed.data.maxAllocation),
    })

    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof NotFoundError) {
      return NextResponse.json(
        { error: "Carteira não encontrada." },
        { status: 404 }
      )
    }

    if (error instanceof ConcurrencyError) {
      return NextResponse.json(
        {
          error:
            "A carteira foi alterada em outro lugar. Recarregue a página e tente novamente.",
        },
        { status: 409 }
      )
    }

    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(
      { error: "Não foi possível editar a carteira." },
      { status: 500 }
    )
  }
}