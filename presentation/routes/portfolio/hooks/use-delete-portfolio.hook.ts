"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

/**
 * @summary
 * Deletes a portfolio through the API route.
 *
 * @remarks
 * Sends a `DELETE /api/portfolio/:id` request and refreshes the
 * server-rendered table data on success.
 *
 * @explanation
 * Use inside the portfolio delete flow.
 *
 * @returns The delete portfolio callback and pending flag.
 *
 * @example
 * const { deletePortfolio } = useDeletePortfolio()
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
function useDeletePortfolio() {
  const router = useRouter()
  const [isPending, setIsPending] = React.useState(false)

  const deletePortfolio = React.useCallback(
    async (portfolioId: string) => {
      setIsPending(true)

      try {
        const response = await fetch(`/api/portfolio/${portfolioId}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as {
            error?: string
          } | null

          throw new Error(payload?.error ?? "Não foi possível excluir a carteira.")
        }

        router.refresh()
      } finally {
        setIsPending(false)
      }
    },
    [router]
  )

  return { deletePortfolio, isPending }
}

export { useDeletePortfolio }