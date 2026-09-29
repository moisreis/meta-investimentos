import type { ApplicationRow } from "@/presentation/types/application-row.types"

import { EMPTY_APPLICATION_LOOKUPS } from "../helpers/build-application-lookups.helper"
import { BuildApplicationLookups } from "../helpers/build-application-lookups.helper"
import { LoadApplications } from "../helpers/load-applications.helper"
import {
  BuildApplicationFundOptions,
  BuildApplicationPortfolioOptions,
  type ApplicationAddOptions,
} from "../types/application-add.types"
import type { ApplicationLookups } from "../types/application-list.types"
import type { ApplicationListProps } from "../pages/list"

/**
 * @summary
 * Resolves the props for the application list page.
 *
 * @remarks
 * Loads the session applications, the fund lookups the
 * table needs and the add flow options. The options are
 * derived from the portfolios and funds the loader already
 * read, so the add dialog can pick a portfolio and a fund
 * without a second round trip.
 *
 * @returns The application list props, or empty props when
 * there is no active session.
 *
 * @example
 * const PROPS = await LoadApplicationPageProps();
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
export async function LoadApplicationPageProps(): Promise<ApplicationListProps> {
  let data: ApplicationRow[] | null = null
  let lookups: ApplicationLookups = {
    rows: {},
    portfolioOptions: [],
    fundOptions: [],
  }
  let options: ApplicationAddOptions = {
    funds: [],
    portfolios: [],
  }

  const LOADED = await LoadApplications()

  if (LOADED) {
    data = LOADED.applications
    lookups = BuildApplicationLookups(LOADED)
    options = {
      funds: BuildApplicationFundOptions(LOADED.funds),
      portfolios: BuildApplicationPortfolioOptions(LOADED.portfolios),
    }
  }

  return { data, lookups, options }
}
