/**
 * Maps investment fund names to their database IDs.
 *
 * Each key identifies one real investment fund. Each
 * value is the numeric primary key of that fund in the
 * test database.
 *
 * Tests use these IDs to cross-reference a fund across the
 * cash flow, quota balance, and quota value datasets.
 */
export const INVESTMENT_FUND_IDS = {
  CAIXA_BRASIL_IRF_M_1_TITULOS_PUBLICOS_FI_RF: 3,
  CAIXA_BRASIL_TITULOS_PUBLICOS_FI_RENDA_FIXA_LP: 4,
  CAIXA_BRASIL_GESTAO_ESTRATEGICA_FIC_RENDA_FIXA: 7,
  CAIXA_BRASIL_IMA_GERAL_TITULOS_PUBLICOS_FI_RF_LP: 10,
  CAIXA_BRASIL_MATRIZ_RESP_LIMITADA_FIF_RENDA_FIXA: 12,
  CAIXA_BRASIL_FIF_RENDA_FIXA_REFERENCIADO_DI_LP: 13,
  BB_PREVID_RENDA_FIXA_REF_DI_LP_PERFIL_SOBERANO_FIC_FIF: 158,
} as const;
