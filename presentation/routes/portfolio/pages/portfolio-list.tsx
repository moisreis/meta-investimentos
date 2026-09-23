"use client"

import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { SharedKpiCard } from "@/presentation/shared/components/shared-kpi-card"
import { SharedKpiCardGroup } from "@/presentation/shared/components/shared-kpi-card-group"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"

import { PortfolioDataTable } from "../datatable/portfolio-datatable"

interface PortfolioListProps {
  data: PortfolioResponseDTO[]
}

function PortfolioList({ data }: PortfolioListProps) {
  return (
    <>
      <SharedKpiCardGroup>
        <SharedKpiCard
          title="Patrimônio Total"
          value="R$ 1.901.910,00"
          trend="+ 12%"
          dotIndicator="success"
          comparison="vs. mês anterior"
          icon={IconTrendingUp}
        />
        <SharedKpiCard
          title="Rendimento Mensal"
          value="R$ 18.450,20"
          trend="- 2.4%"
          dotIndicator="negative"
          comparison="vs. mês anterior"
          icon={IconTrendingDown}
        />
        <SharedKpiCard
          title="Ativos Custodiados"
          value="14"
          comparison="em 4 corretoras"
        />
        <SharedKpiCard
          title="Maior Alocação"
          value="Renda Fixa"
          comparison="45% da carteira"
        />
      </SharedKpiCardGroup>
      <PortfolioDataTable data={data} />
    </>
  )
}

export { PortfolioList }
