import { headers } from "next/headers"
import type { Metadata } from "next"

import { auth } from "@/clients/better-auth.client"
import { db } from "@/clients/database.client"
import { PortfolioRepository } from "@/infrastructure/portfolio/repositories/portfolio.repository"
import { PortfolioList } from "@/presentation/routes/portfolio/pages/list"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"
import { ListPortfoliosUseCase } from "@/services/portfolio/use-cases/list-portfolios.use-case"

export const metadata: Metadata = {
  title: "Carteiras",
}

export default async function PortfoliosRoutePage() {
  let PORTFOLIOS: PortfolioResponseDTO[] | null = null

  const SESSION = await auth.api.getSession({
    headers: await headers(),
  })

  if (SESSION?.user) {
    const REPOSITORY = new PortfolioRepository(db)
    const USE_CASE = new ListPortfoliosUseCase(REPOSITORY)

    PORTFOLIOS = await USE_CASE.execute({
      userId: SESSION.user.id,
    })
  }

  return (
    <>
      <PortfolioList data={PORTFOLIOS} />
    </>
  )
}
