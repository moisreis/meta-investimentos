import { LoadNorms } from "../helpers/load-norms.helper"
import {
  BuildNormNameLookups,
  EMPTY_NORM_NAME_LOOKUPS,
} from "../helpers/build-norm-name-lookups.helper"
import type { NormListProps } from "../pages/list"

/**
 * @summary
 * Resolves the props for the norm list page.
 *
 * @remarks
 * Loads the session norms, the category options used by
 * the form and the category name lookups used by the
 * datatable.
 *
 * @returns The norm list props, or empty props when
 * there is no active session.
 *
 * @example
 * const PROPS = await LoadNormPageProps();
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
export async function LoadNormPageProps(): Promise<NormListProps> {
  const LOADED = await LoadNorms()

  if (LOADED) {
    return {
      data: LOADED.norms,
      options: { categories: LOADED.categories },
      names: BuildNormNameLookups(LOADED.categories),
    }
  }

  return {
    data: null,
    options: null,
    names: EMPTY_NORM_NAME_LOOKUPS,
  }
}
