import { INVESTMENT_FUND_IDS } from "@/__tests__/__datasets__/_investment-funds.dataset";

/**
 * Provides the cash flows used in portfolio calculation
 * tests.
 *
 * Each row records one cash flow into or out of a fund.
 * The row contains the fund ID, the flow date, the number
 * of quotas, and the monetary value of the flow.
 *
 * A positive value represents an application. A negative
 * value represents a redemption. Tests use these flows to
 * reproduce the change in a portfolio's quota balance.
 *
 * The tuple labels are `fundId`, `date`, `quotas`, and
 * `value`.
 */
export const CASH_FLOWS: [
  fundId: number,
  date: string,
  quotas: string,
  value: string,
][] = [
  [
    INVESTMENT_FUND_IDS.CAIXA_BRASIL_TITULOS_PUBLICOS_FI_RENDA_FIXA_LP,
    "2026-05-05",
    "155070.582490",
    "1100000",
  ],
  [
    INVESTMENT_FUND_IDS.CAIXA_BRASIL_IMA_GERAL_TITULOS_PUBLICOS_FI_RF_LP,
    "2026-05-05",
    "212221.316273",
    "1000000",
  ],
  [
    INVESTMENT_FUND_IDS.CAIXA_BRASIL_MATRIZ_RESP_LIMITADA_FIF_RENDA_FIXA,
    "2026-05-05",
    "388088.176738",
    "1000000",
  ],
  [
    INVESTMENT_FUND_IDS.CAIXA_BRASIL_FIF_RENDA_FIXA_REFERENCIADO_DI_LP,
    "2026-05-05",
    "150579.255810",
    "1000000",
  ],
  [
    INVESTMENT_FUND_IDS.CAIXA_BRASIL_IRF_M_1_TITULOS_PUBLICOS_FI_RF,
    "2026-05-05",
    "225825.442804",
    "1000000",
  ],
  [
    INVESTMENT_FUND_IDS.BB_PREVID_RENDA_FIXA_REF_DI_LP_PERFIL_SOBERANO_FIC_FIF,
    "2026-05-11",
    "38619.656246",
    "40000",
  ],
  [
    INVESTMENT_FUND_IDS.CAIXA_BRASIL_TITULOS_PUBLICOS_FI_RENDA_FIXA_LP,
    "2026-05-19",
    "-140244.645565",
    "-1000000",
  ],
  [
    INVESTMENT_FUND_IDS.CAIXA_BRASIL_IMA_GERAL_TITULOS_PUBLICOS_FI_RF_LP,
    "2026-05-19",
    "-106020.344032",
    "-500000",
  ],
  [
    INVESTMENT_FUND_IDS.CAIXA_BRASIL_MATRIZ_RESP_LIMITADA_FIF_RENDA_FIXA,
    "2026-05-19",
    "-385967.011400",
    "-1000000",
  ],
  [
    INVESTMENT_FUND_IDS.CAIXA_BRASIL_FIF_RENDA_FIXA_REFERENCIADO_DI_LP,
    "2026-05-19",
    "-74872.436087",
    "-500000",
  ],
  [
    INVESTMENT_FUND_IDS.CAIXA_BRASIL_IRF_M_1_TITULOS_PUBLICOS_FI_RF,
    "2026-05-19",
    "-224675.226343",
    "-1000000",
  ],
];
