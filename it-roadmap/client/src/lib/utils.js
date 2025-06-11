/**
 * Combines multiple class names into a single string, filtering out falsy values.
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
