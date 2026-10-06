/**
 * @summary
 * The three fields it takes to recognise a person.
 *
 * @remarks
 * The chrome names whoever is behind a screen: the sidebar
 * header names the signed-in user and a detail summary names
 * the owner of the subject. Both need a first name, a last
 * name and a picture, and nothing else, so the shape is
 * narrower than the user row. It carries no e-mail, no CPF
 * and no role, so a name can cross into the client without
 * carrying the account behind it.
 *
 * @explanation
 * Use this type in loaders, in layout props and in the parts
 * that render a person. The route loader maps the response
 * DTO into it, so no view file depends on the service layer.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
export interface UserIdentity {
  // First name of the person.
  firstName: string
  // Last name of the person.
  lastName: string
  // Avatar image URL, or `null` when none is registered, so
  // the avatar falls back to the initials.
  image: string | null
}
