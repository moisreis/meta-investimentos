import { PortfolioList } from "@/presentation/routes/portfolio/pages/list"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Carteiras",
}

export default async function PortfoliosRoutePage() {
  return (
    <>
      <PortfolioList data={null} />
    </>
  )
}
