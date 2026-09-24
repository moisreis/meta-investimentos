# Overview

This skill defines the rules for writing **TSDoc** documentation comments for code blocks and variables. Follow all Simplified Technical English (**ASD-STE100**) rules: use short sentences, direct verbs, active voice, and approved words only. For terms, see the glossary in `INDEX.md`.

# Instructions

  Always construct **TSDoc** blocks in this strict sequence:
  - **(1)** `@summary`
    - Describe what the code block does.
    - Keep it direct and simple.
    - Maximum 65 characters per line.
    - Maximum 2 lines.
  - **(2)** `@remarks`
    - Provide additional implementation details, constraints, edge cases, or important usage notes.
    - Use **TSDoc** syntax.
    - Keep each line within 65 characters.
  - **(3)** `@explanation`
    - Provide a short paragraph explaining:
      - Why the code exists.
      - How it works.
      - Where it should be used.
      - When it should be used.
    - Maximum 65 characters per line.
    - Keep the explanation concise and practical.
  - **(4)** `@param`
    - Document parameters when the code block accepts them.
    - Describe each parameter clearly.
    - Omit `@param` when there are no parameters.
  - **(5)** `@returns`
    - Include it when the code produces a return value.
    - Maximum 25 characters.
  - **(6)** `@example`
    - Provide a complete, working example.
    - The example must be easy to copy and paste.
    - Use realistic values and valid syntax.
    - The example should demonstrate the intended usage.
  - **(7)** `@author`
    - Always use `@author Moisés Reis`.
  - **(8)** `@date`
    - Always use the current date when the code is added.

# Formatting rules

  - Maximum 65 characters per line for code and documentation lines. Documentation prose in markdown files is excluded from this limit. JSX markup lines in `.tsx` files are also exempt. Break longer lines manually.
  - When referring to nouns or proper names, such as **Drizzle** or **TypeScript**, always wrap the term in `**` to emphasize and distinguish it from the surrounding text.
  - Each sentence must finish with a period (.).
  - Insert a blank line between each **TSDoc** section (e.g., between `@summary` and `@remarks`, between `@explanation` and `@param`).
  - For complex files, divide functional sections using this pattern:

  ```typescript
  // ---------------------------------
  // SECTION TITLE
  // ---------------------------------

  /**
   * Code block.
   */
  ```

  - For long parameter descriptions, align multi-line descriptions with the start of the text on the line above:

  ```typescript
  * @param userId - Owner whose organization is queried
  *                 by the backend service.
  * @param limit - Maximum rows to return; the server caps
  *                this value at 100.
  * @returns User objects.
  ```

# Variables

The instructions above apply only to code blocks.

Variables, including `const` and `let` declarations, must still have proper documentation. For variables, use `//` comments with one or two lines, keeping each line within 65 characters.

Variable comments must:

* Use simple, direct text only.
* Contain no `@` markers.
* Contain no `@param`, `@returns`, or other **TSDoc** tags.
* Avoid unnecessary details or verbose explanations.

For example:

  ```typescript
  // Maximum number of users returned by the query.
  const MAX_USERS = 100;

  // Stores the user's preferred display name.
  let displayName = "Moisés";
  ```

# Reference example

Custom **React** hooks follow a naming exception. They use _camelCase_ and must be prefixed with `use` instead of the usual _PascalCase_ function rule. Document them exactly like any other function:

  ```typescript
  /**
   * @summary
   * Tracks the state of the portfolio sidebar.
   *
   * @remarks
   * Hooks are a naming exception: they use camelCase
   * and keep the `use` prefix.
   *
   * @explanation
   * Use this hook in the shell sidebar. It stores the
   * expanded menus and reacts to user clicks.
   *
   * @returns The sidebar state.
   *
   * @example
   * const SIDEBAR = useSidebarState();
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  function useSidebarState(): SidebarState {
    return { isOpen: true, Toggle: ToggleSidebar };
  }
  ```

  ```typescript
  // ---------------------------------
  // MATHEMATICAL OPERATIONS
  // ---------------------------------

  /**
   * @summary
   * Returns the arithmetic mean of two numbers.
   *
   * @remarks
   * Both inputs are treated as finite; passing `NaN`
   * propagates `NaN`. For a list of values, use
   * {@link Average} instead.
   *
   * @explanation
   * Use this function to find the midpoint of two values
   * in calculation modules. It adds both inputs together
   * and divides the sum by two.
   *
   * @param a - First finite number to calculate.
   * @param b - Second finite number to calculate
   *            for the arithmetic mean.
   * @returns The mean value.
   *
   * @example
   * const RESULT = AddMean(10, 20);
   * // returns 15
   *
   * @author Moisés Reis
   *
   * @date 2026-09-12
   */
  function AddMean(a: number, b: number): number {
    return (a + b) / 2;
  }
  ```

  and

  ```typescript
  // Maximum number of API retries before failure.
  // Do not increase this value past ten.
  const MAX_RETRIES = 5;
  ```

# React components

A **React** component must document its `Props` object, not only plain function arguments. Define a `Props` interface for the component and document every prop with `@param`. Use `@returns` to describe the rendered element. The file name stays _kebab-case_ while the component export uses _PascalCase_.

  ```typescript
  interface PortfolioTableProps {
    entries: PortfolioEntry[];
    onSelect: (id: string) => void;
  }

  /**
   * @summary
   * Renders the portfolio entries in a table.
   *
   * @remarks
   * This is a Client Component that receives entries
   * and callbacks through its Props object.
   *
   * @param props - Props of the component.
   * @param props.entries - Rows to display.
   * @param props.onSelect - Callback for row selection.
   * @returns The rendered table element.
   *
   * @example
   * <PortfolioTable entries={ENTRIES} onSelect={SelectRow} />
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  function PortfolioTable(props: PortfolioTableProps): JSX.Element {
    return <div>{props.entries.length}</div>;
  }
  ```

# Anti-patterns

Do not violate any of the following rules when writing documentation:

* **Do not place a full description on the tag line for multiline tags.**

  Multiline tags such as `@remarks` and `@explanation` start their description on the next line. Short `@param` comments may start on the tag line and continue on the lines below.

  TypeScript:

  ```ts
  // BAD
  * @remarks Write remarks here directly on the line

  // GOOD
  * @remarks
  * Write remarks here starting on the next line.
  ```

* **Do not exceed 65 characters per code or documentation line.**

  TypeScript:

  ```ts
  // BAD
  * @summary This line is far too long and clearly exceeds the
  * maximum character limit.

  // GOOD
  * @summary
  * This line stays strictly below the 65 character limit
  * by using manual line breaks.
  ```

* **Do not alter the tag order or skip tag separation.**

  TypeScript:

  ```ts
  // BAD
  * @author Moisés Reis
  * @summary Missing empty line and wrong sequence

  // GOOD
  * @summary
  * Correct order with blank lines between tags.
  *
  * @author Moisés Reis
  ```

* **Do not use TSDoc tags on standard variables.**

  TypeScript:

  ```ts
  // BAD
  /**
   * @param count - Total items.
   */
  const COUNT = 10;

  // GOOD
  // Stores the total number of items.
  const COUNT = 10;
  ```

* **Do not omit periods at the end of sentences.**

  TypeScript:

  ```ts
  // BAD
  * @summary Returns the sum of two values

  // GOOD
  * @summary
  * Returns the sum of two values.
  ```

* **Do not leave proper nouns unformatted.**

  TypeScript:

  ```ts
  // BAD
  * Connects to the Drizzle client for TypeScript.

  // GOOD
  * Connects to the **Drizzle** client for **TypeScript**.
  ```

# Checklist

Verify every point before finalizing documentation comments:

* [ ] Does the **TSDoc** block follow the strict order?
* [ ] Are all code and documentation lines 65 characters or fewer?
* [ ] Do **React** components document a `Props` interface with `@param`?
* [ ] Are `@param` prop names documented with the `props.` prefix?
* [ ] Do custom **React** hooks use _camelCase_ with the `use` prefix?
* [ ] Does every sentence end with a period?
* [ ] Are all proper nouns and tools wrapped in `**`?
* [ ] Is there a blank line between each major tag section?
* [ ] Does `@summary` contain no more than 2 lines?
* [ ] Does `@explanation` follow the WHWW pattern?
* [ ] Does `@explanation` address Why, How, Where, and When?
* [ ] Are multiline `@param` descriptions properly aligned?
* [ ] Does `@returns` stay within 25 characters?
* [ ] Is `@author` strictly set to `Moisés Reis`?
* [ ] Is `@date` set to the current date in `YYYY-MM-DD` format?
* [ ] Do variables use simple `//` comments without `@` tags?
