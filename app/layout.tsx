import { Metadata } from "next"
import {
  Geist,
  Geist_Mono,
  Roboto_Slab,
  Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/presentation/theme/theme-provider"
import { TooltipProvider } from "@/presentation/ui/tooltip"
import { Toaster } from "@/presentation/ui/toast"
import { cn } from "@/lib/utils"
import { BRAND } from "@/presentation/constants/brand.constants"

// Stores the **Manrope** heading font configuration, used by
// the titles of the shared surfaces.
const geistHeading = Geist({subsets:['latin'],variable:'--font-heading'})

// Stores the **Roboto Slab** figure font configuration. The
// slab is reserved for figures of account — the headline
// numbers of a detail screen — and never for interface chrome,
// so a figure of money never reads as a component title.
const slabFigure = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-figure",
})

// Stores the **Geist** sans-serif font configuration.
const inter = Inter({subsets:['latin'],variable:'--font-sans'})

// Stores the **Geist Mono** font configuration.
const FONT_MONO = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

// Defines default application metadata for **Next.js**.
// Configures document titles and short brand names.
export const metadata: Metadata = {
  title: {
    template: `%s | ${BRAND.SHORT_NAME}`,
    default: BRAND.SHORT_NAME,
  },
  description: BRAND.LEGAL_NAME,
}

/**
 * @summary
 * Renders the root layout for the application.
 *
 * @remarks
 * The layout loads the application fonts and theme provider.
 * It also enables hydration support for the active theme.
 *
 * @explanation
 * This layout defines the shared application document structure.
 * It applies fonts and renders children inside **ThemeProvider**.
 * Use it as the root layout for all application routes.
 *
 * @param props - Props of the root layout.
 * @param props.children - Content rendered by the layout.
 * @returns The root application document.
 *
 * @example
 * <RootLayout>
 *   <main>Application content.</main>
 * </RootLayout>
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        FONT_MONO.variable,
        "font-sans",
        inter.variable,
        geistHeading.variable,
        slabFigure.variable
      )}
    >
      <body>
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
