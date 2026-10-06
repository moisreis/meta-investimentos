/**
 * @summary
 * The hex palette of the statement PDF.
 *
 * @remarks
 * Values are hand-converted from the light theme tokens
 * of `app/globals.css`, because **react-pdf** cannot
 * resolve `oklch` variables. Each key documents the
 * shadcn/ui token it mirrors, so the document stays in
 * step with the application design system.
 *
 * @explanation
 * Use this palette when wiring the **react-pdf**
 * Tailwind converter and the report document.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
export const STATEMENT_REPORT_PALETTE = {
  // Token `--background`.
  background: "#ffffff",
  // Token `--foreground`.
  foreground: "#0c0c09",
  // Token `--primary`.
  primary: "#007149",
  // Token `--primary-foreground`.
  onPrimary: "#fafafa",
  // Token `--muted`, the card surface behind blocks.
  surface: "#f4f4f0",
  // Token `--muted-foreground`, secondary text.
  subdued: "#7c7c67",
  // Token `--border`.
  border: "#e8e8e3",
  // Token `--positive`.
  positive: "#007f50",
  // Token `--negative`.
  negative: "#c2272a",
}

/**
 * @summary
 * The PT-BR copy of the statement PDF.
 *
 * @remarks
 * Follows the application sentence-case convention,
 * with labels as short sentence fragments.
 *
 * @explanation
 * Use these strings in the statement report document
 * so the PDF copy stays consistent with the screens.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
export const STATEMENT_REPORT_COPY = {
  title: "Extrato mensal",
  periodLabel: "Período",
  issuedLabel: "Emissão",
  patrimonyLabel: "Patrimônio em",
  returnNote: "no mês",
  openingEntryLabel: "Saldo inicial",
  applicationsEntryLabel: "Entradas",
  withdrawalsEntryLabel: "Saídas",
  resultEntryLabel: "Resultado do período",
  positionsTitle: "Posições da Carteira",
  positionsEmpty: "Nenhuma posição.",
  movementsTitle: "Movimentações do Período",
  movementsEmpty: "Nenhuma movimentação no período.",
  fundColumn: "Fundo",
  bankColumn: "Banco",
  weightColumn: "Peso",
  investedColumn: "Valor investido",
  typeColumn: "Tipo",
  dateColumn: "Data",
  amountColumn: "Valor",
  quotasColumn: "Cotas",
  typeApplication: "Aplicação",
  typeWithdrawal: "Resgate",
  footer: "Documento gerado pela plataforma.",
  pagePrefix: "Página",
  pageSeparator: "de",
  unavailable: "-",
}
