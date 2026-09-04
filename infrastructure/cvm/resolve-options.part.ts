import type { IFund } from "@/business/interfaces/fund/fund.interface";
import { CvmSourceError } from "@/shared/errors";
import type { CvmImportContext } from "./types";

/**
 * Resolves the import options into a fully-formed
 * {@link CvmImportContext}.
 *
 * The function loads the fund CNPJ→id map from the database, computes
 * the set of `(year, month)` tuples the import must cover and returns
 * the context shared across every downstream pipeline step.
 *
 * @param funds - The fund repository used to load the CNPJ→id map.
 * @param requestedStart - The start of the date range, when provided.
 * @param requestedEnd - The end of the date range, when provided.
 * @param monthsBack - The number of months to look back when no date
 *   range is provided.
 * @param requestedCnpjs - The optional subset of CNPJs to import.
 * @param importId - The id of the import record being built.
 * @returns The resolved import context.
 */
export async function resolveOptions(
  funds: IFund,
  requestedStart: Date | undefined,
  requestedEnd: Date | undefined,
  monthsBack: number,
  requestedCnpjs: string[] | undefined,
  importId: string,
): Promise<CvmImportContext> {
  const ALL_FUNDS = await funds.findAll();

  const CNPJ_MAP = new Map<string, string>();

  for (const FUND of ALL_FUNDS) {
    if (
      FUND.id &&
      (!requestedCnpjs || requestedCnpjs.includes(FUND.cnpj.value))
    ) {
      CNPJ_MAP.set(FUND.cnpj.value, FUND.id.toString());
    }
  }

  if (CNPJ_MAP.size === 0) {
    throw new CvmSourceError("No matching funds found for the provided CNPJs.");
  }

  return {
    importId,
    fundCnpjMap: CNPJ_MAP,
    requestedStart,
    requestedEnd,
    monthsBack,
    source: "CVM",
  };
}
