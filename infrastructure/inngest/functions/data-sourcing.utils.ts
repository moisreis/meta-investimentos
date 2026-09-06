/**
 * Resolves the CNPJs to import.
 *
 * When a subset is requested it is returned as-is; otherwise every
 * tracked fund in the registry is resolved.
 *
 * @param requestedCnpjs - The optional subset of fund CNPJs.
 * @returns A promise resolving to the fund CNPJs (digit-only strings).
 */
export async function resolveTrackedFundCnpjs(
  requestedCnpjs?: string[],
): Promise<string[]> {
  if (requestedCnpjs !== undefined && requestedCnpjs.length > 0) {
    return requestedCnpjs;
  }

  const [{ db }, { FundRepository }] = await Promise.all([
    import("@/infrastructure/clients/drizzle.client"),
    import("@/infrastructure/repositories/fund/fund.repository"),
  ]);

  const FUNDS = await new FundRepository(db).findAll({ limit: 100_000 });
  return FUNDS.map((fund) => fund.cnpj.value);
}

/**
 * Resolves the id of every registered portfolio.
 *
 * @param limit - The maximum number of portfolios to resolve.
 * @returns A promise resolving to the portfolio id strings.
 */
export async function resolveAllPortfolioIds(
  limit = 100_000,
): Promise<string[]> {
  const [{ db }, { PortfolioRepository }] = await Promise.all([
    import("@/infrastructure/clients/drizzle.client"),
    import("@/infrastructure/repositories/portfolio/portfolio.repository"),
  ]);

  const PORTFOLIOS = await new PortfolioRepository(db).findAll({ limit });
  return PORTFOLIOS.map((portfolio) => portfolio.id?.toString() ?? "").filter(
    (id) => id !== "",
  );
}
