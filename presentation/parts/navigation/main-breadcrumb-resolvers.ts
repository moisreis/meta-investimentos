import { getPortfolioNameAction } from "@/presentation/routes/portfolio/actions/get-portfolio-name.action"

// Resolves a dynamic breadcrumb segment by id.
export type MainBreadcrumbResolver = (
  id: string
) => Promise<{ name: string | null }>

async function ResolvePortfolioName(
  id: string
): Promise<{ name: string | null }> {
  const RESULT = await getPortfolioNameAction(id)

  if (!RESULT.success) {
    return { name: null }
  }

  return { name: RESULT.data }
}

// Dynamic detail resolvers keyed by their parent href.
export const MAIN_BREADCRUMB_RESOLVERS: Record<
  string,
  MainBreadcrumbResolver
> = {
  "/portfolio": ResolvePortfolioName,
}
