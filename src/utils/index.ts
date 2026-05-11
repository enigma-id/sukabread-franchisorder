import { dateFormat, currencyFormat } from "./common";

// Re-export everything from submodules
export { currencyFormat, dateFormat, postedAgo, updateAt, extractIds, capitalizeFirst, findByKeyValue } from "./common";
export { withGuard } from "./guard";
export * from "./url";
export * from "./permission";
export * from "./errors";
export * from "./cn";

// Convenience alias
export const formatCurrency = currencyFormat;

// Date helpers used by pages
export function formatDate(v?: string | Date | null, format = "DD/MM/YYYY"): string {
  return dateFormat(v, format, "-");
}

export function formatTime(v?: string | Date | null): string {
  return dateFormat(v, "HH:mm", "-");
}

export function formatDateTime(v?: string | Date | null): string {
  return dateFormat(v, "DD/MM/YYYY HH:mm", "-");
}

// A "never logged in" date is 0001-01-01 or 1970-01-01
export function isNeverLoggedIn(date: string | null | undefined): boolean {
  if (!date) return true;
  return date.includes("0001-01-01") || date.includes("1970-01-01");
}

// An "ongoing" session has no real finished_at date
export function isOngoing(date: string | null | undefined): boolean {
  if (!date) return true;
  return date.includes("0001-01-01") || date.includes("1970-01-01");
}

// Display payment method name or fallback
export function displayPaymentMethod(name: string | null): string {
  if (!name) return "-";
  return name;
}
