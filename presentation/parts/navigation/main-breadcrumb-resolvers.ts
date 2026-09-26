import { getPortfolioNameAction } from "@/presentation/routes/portfolio/actions/get-portfolio-name.action"

// Resolves a dynamic breadcrumb segment by id.
export type MainBreadcrumbResolver = (
  id: string
) => Promise<{ name: string | null }>

// Dynamic detail resolvers keyed by their parent href.
export const MAIN_BREADCRUMB_RESOLVERS: Record<
  string,
  MainBreadcrumbResolver
> = {
  "/portfolio": getPortfolioNameAction,
}
