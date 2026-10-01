/**
 * @summary
 * Copy for the main shell home screen.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
export const MAIN_HOME = {
  // Screen heading.
  TITLE: "Painel",

  // One line of direction below the heading.
  INTRO: "Escolha uma área para abrir.",

  // The home does not link to itself.
  HOME_HREF: "/main",
} as const

// Type of the main home copy, for parts that receive
// it as props.
export type MainHomeCopy = typeof MAIN_HOME
