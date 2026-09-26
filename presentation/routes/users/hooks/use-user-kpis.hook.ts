"use client"

import { useCallback } from "react"

import type { EntityKpi } from "@/presentation/parts/hooks/use-entity-kpis.hook"
import { useEntityKpis } from "@/presentation/parts/hooks/use-entity-kpis.hook"
import { FormatCount } from "@/presentation/presenters/count.presenter"
import type { UserResponseDTO } from "@/services/user/dto/user-response.dto"

import { USER_KPI } from "../settings/labels.settings"

interface UseUserKpisInput {
  users: UserResponseDTO[]
}

/**
 * @summary
 * Builds the data-driven KPI cards of the user list.
 *
 * @remarks
 * Tallies the registered users, the managers, and the
 * users with and without a verified email. All values
 * are formatted through the count presenter.
 *
 * @param users - The rows of the user list.
 *
 * @returns The KPI card props.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function BuildUserKpis(
  users: readonly UserResponseDTO[]
): EntityKpi[] {
  const MANAGERS = users.filter(
    (user) => user.role === "MANAGER"
  ).length

  const VERIFIED = users.filter(
    (user) => user.emailVerified
  ).length

  return [
    {
      key: "users",
      title: USER_KPI.USERS_COUNT_TITLE,
      value: FormatCount(users.length),
      comparison: USER_KPI.USERS_COUNT_COMPARISON,
    },
    {
      key: "managers",
      title: USER_KPI.MANAGERS_COUNT_TITLE,
      value: FormatCount(MANAGERS),
      comparison: USER_KPI.MANAGERS_COUNT_COMPARISON,
    },
    {
      key: "verified",
      title: USER_KPI.VERIFIED_COUNT_TITLE,
      value: FormatCount(VERIFIED),
      comparison: USER_KPI.VERIFIED_COUNT_COMPARISON,
    },
    {
      key: "pending",
      title: USER_KPI.PENDING_COUNT_TITLE,
      value: FormatCount(users.length - VERIFIED),
      comparison: USER_KPI.PENDING_COUNT_COMPARISON,
    },
  ]
}

/**
 * @summary
 * Resolves the KPI cards of the user list.
 *
 * @remarks
 * Delegates the computation to `BuildUserKpis` and the
 * memoization to the shared entity KPI hook.
 *
 * @param input - The rows of the user list.
 *
 * @returns The KPI card props.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useUserKpis({ users }: UseUserKpisInput): EntityKpi[] {
  const compute = useCallback(
    (items: readonly UserResponseDTO[]) => BuildUserKpis(items),
    []
  )

  return useEntityKpis({
    items: users,
    compute,
  })
}

export { useUserKpis }
