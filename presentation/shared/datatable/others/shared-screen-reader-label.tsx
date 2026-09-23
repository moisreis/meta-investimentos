"use client"

/**
 * Renders text visible only to screen readers.
 */
export function SharedScreenReaderLabel({ text }: { text: string }) {
  return <span className="sr-only">{text}</span>
}