export function toSafeRedirectPath(next: string | null) {
  if (!next || !next.startsWith("/")) return "/";
  if (next.startsWith("//")) return "/";
  return next;
}
