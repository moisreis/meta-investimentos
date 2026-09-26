"use client"

import { useCallback, useMemo, useState } from "react"

import type { UserResponseDTO } from "@/services/user/dto/user-response.dto"

interface UseUserDatatableFiltersOutput {
  query: string
  onQueryChange: (query: string) => void
  filteredUsers: UserResponseDTO[]
}

/**
 * @summary
 * Coordinates the user datatable filters.
 *
 * @remarks
 * Owns the search query and narrows the rows by the user
 * name or email before the table receives them.
 *
 * @param users - The rows rendered by the datatable.
 *
 * @returns The filter state and the filtered rows.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useUserDatatableFilters(
  users: UserResponseDTO[]
): UseUserDatatableFiltersOutput {
  const [QUERY, setQuery] = useState("")

  const FILTERED_USERS = useMemo(() => {
    const NORMALIZED = QUERY.trim().toLowerCase()

    if (!NORMALIZED) return users

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(NORMALIZED) ||
        user.email.toLowerCase().includes(NORMALIZED)
    )
  }, [users, QUERY])

  return {
    query: QUERY,
    onQueryChange: setQuery,
    filteredUsers: FILTERED_USERS,
  }
}

export { useUserDatatableFilters }
