import BRAND from "@/presentation/constants/brand.constants"

/**
 * Renders the brand copyright notice.
 *
 * @returns The copyright notice.
 */
export function Copyright() {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
      <p className="text-center text-xs text-muted-foreground">
        © 2026 {BRAND.BRAND_LEGAL_NAME}. Todos os direitos reservados.
      </p>
    </div>
  );
}
