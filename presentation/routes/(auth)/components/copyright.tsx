import BRAND from "@/presentation/constants/brand.constants"

/**
 * @summary
 * Renders the brand copyright notice.
 *
 * @remarks
 * Shows the legal name of **Meta Investimentos** and the
 * current year at the bottom of the authentication screen.
 *
 * @explanation
 * Use this component at the bottom of the authentication
 * layout to present the brand legal information. It positions
 * the text absolutely and keeps it centered.
 *
 * @returns The copyright notice.
 *
 * @example
 * <Copyright />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
function Copyright() {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
      <p className="text-center text-xs text-muted-foreground">
        © 2026 {BRAND.BRAND_LEGAL_NAME}. Todos os direitos reservados.
      </p>
    </div>
  )
}

export { Copyright }