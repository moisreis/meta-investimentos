import type { Metadata } from "next"
import { asc, eq } from "drizzle-orm"
import { headers } from "next/headers"

import { PortfolioList } from "@/presentation/routes/portfolio/pages/portfolio-list"
import { db } from "@/clients/database.client"
import { auth } from "@/clients/better-auth.client"
import { portfolio } from "@db-schemas/portfolio.schema"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"

export const metadata: Metadata = {
  title: "Carteiras",
}

export const dynamic = "force-dynamic"

export default async function PortfoliosRoutePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const rows = session
    ? await db
        .select()
        .from(portfolio)
        .where(eq(portfolio.userId, session.user.id))
        .orderBy(asc(portfolio.createdAt))
    : []

  const data: PortfolioResponseDTO[] = rows.map((row) => ({
    id: row.id,
    acronym: row.acronym,
    name: row.name,
    userId: row.userId,
    annualInterestRate: row.annualInterestRate,
    minAllocation: row.minAllocation,
    maxAllocation: row.maxAllocation,
    targetAllocation: row.targetAllocation,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }))

  return <PortfolioList data={data} />
}
