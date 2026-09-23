"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

/**
 * @summary
 * Deletes multiple portfolios through the API route.
 *
 * @remarks
 * Sends the selected ids to `DELETE /api/portfolio` and refreshes
 * the server-rendered table data on success.
 *
 * @explanation
 * Use inside the portfolio bulk delete flow.
 *
 * @returns The bulk delete callback and pending flag.
 *
 * @example
 * const { bulkDeletePortfolios } = useBulkDeletePortfolio()
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
function useBulkDeletePortfolio() {
  const router = useRouter()
  const [isPending, setIsPending] = React.useState(false)

  const bulkDeletePortfolios = React.useCallback(
    async (portfolioIds: string[]) => {
      setIsPending(true)

      try {
        const response = await fetch("/api/portfolio", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: portfolioIds }),
        })

        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as {
            error?: string
          } | null

          throw new Error(payload?.error ?? "Não foi possível excluir as carteiras.")
        }

        router.refresh()
      } finally {
        setIsPending(false)
      }
    },
    [router]
  )

  return { bulkDeletePortfolios, isPending }
}

export { useBulkDeletePortfolio }