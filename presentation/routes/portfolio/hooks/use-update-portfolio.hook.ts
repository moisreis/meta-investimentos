"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import type { PortfolioFormValues } from "../validations/portfolio-form.validations"

/**
 * @summary
 * Persists a portfolio edit through the API route.
 *
 * @remarks
 * Sends the validated form values to `PATCH /api/portfolio/:id`
 * and refreshes the server-rendered table data on success.
 *
 * @explanation
 * Use inside the portfolio edit flow.
 *
 * @returns The update portfolio callback and pending flag.
 *
 * @example
 * const { updatePortfolio } = useUpdatePortfolio()
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
function useUpdatePortfolio() {
  const router = useRouter()
  const [isPending, setIsPending] = React.useState(false)

  const updatePortfolio = React.useCallback(
    async (portfolioId: string, values: PortfolioFormValues) => {
      setIsPending(true)

      try {
        const response = await fetch(`/api/portfolio/${portfolioId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        })

        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as {
            error?: string
          } | null

          throw new Error(payload?.error ?? "Não foi possível editar a carteira.")
        }

        router.refresh()
      } finally {
        setIsPending(false)
      }
    },
    [router]
  )

  return { updatePortfolio, isPending }
}

export { useUpdatePortfolio }