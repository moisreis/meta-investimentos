import { Geist, Geist_Mono, Roboto_Slab } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/presentation/components/theme-provider";
import { cn } from "@/lib/utils";

// Stores the **Roboto Slab** heading font configuration.
const ROBOTO_SLAB_HEADING = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-heading",
});

// Stores the **Geist** sans-serif font configuration.
const GEIST = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

// Stores the **Geist Mono** font configuration.
const FONT_MONO = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

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
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        FONT_MONO.variable,
        "font-sans",
        GEIST.variable,
        ROBOTO_SLAB_HEADING.variable,
      )}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
