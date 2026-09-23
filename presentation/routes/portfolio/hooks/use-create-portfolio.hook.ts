"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import type { PortfolioFormValues } from "../validations/portfolio-form.validations"

/**
 * @summary
 * Persists a new portfolio through the API route.
 *
 * @remarks
 * Sends the validated form values to `POST /api/portfolio`
 * and refreshes the server-rendered table data on success.
 *
 * @explanation
 * Use inside the portfolio add flow.
 *
 * @returns The create portfolio callback and pending flag.
 *
 * @example
 * const { createPortfolio } = useCreatePortfolio()
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
function useCreatePortfolio() {
  const router = useRouter()
  const [isPending, setIsPending] = React.useState(false)

  const createPortfolio = React.useCallback(
    async (values: PortfolioFormValues) => {
      setIsPending(true)

      try {
        const response = await fetch("/api/portfolio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        })

        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as {
            error?: string
          } | null

          throw new Error(payload?.error ?? "Não foi possível criar a carteira.")
        }

        router.refresh()
      } finally {
        setIsPending(false)
      }
    },
    [router]
  )

  return { createPortfolio, isPending }
}

export { useCreatePortfolio }