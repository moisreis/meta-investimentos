"use client"

import { useRouter } from "next/navigation"

// Route that hosts the create portfolio form.
const ADD_PORTFOLIO_ROUTE = "/portfolio/new"

/**
 * @summary
 * Manages the behaviors of the portfolio datatable toolbar.
 *
 * @remarks
 * Exposes the add-item handler that navigates to the
 * create portfolio screen. Keeps the toolbar component
 * presentational.
 *
 * @explanation
 * Use inside `PortfolioDatatableToolbar` to wire the
 * add-item button. Navigation replaces the current
 * history entry with the create route.
 *
 * @returns Toolbar behavior handlers.
 *
 * @example
 * const { handleAddItem } = usePortfolioDatatableToolbar()
 *
 * @author Moisés Reis
 *
 * @date 2026-09-24
 */
function usePortfolioDatatableToolbar() {
  const ROUTER = useRouter()

  /**
   * @summary
   * Navigates to the create portfolio screen.
   *
   * @remarks
   * Pushes the add portfolio route onto the history
   * stack, keeping back-navigation available.
   *
   * @explanation
   * Use as the click handler of the add-item button.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-24
   */
  function HandleAddItem() {
    ROUTER.push(ADD_PORTFOLIO_ROUTE)
  }

  return { handleAddItem: HandleAddItem }
}

export { usePortfolioDatatableToolbar }
