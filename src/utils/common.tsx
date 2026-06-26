import type { RegionAdministrativeArea } from "@/services/types/region";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

export function currencyFormat(
  value: string | number | null | undefined,
  usingText = true,
  prefix: string = "Rp",
  nullText = "-",
): string {
  const p = usingText ? prefix : "";

  const num =
    typeof value === "string" ? parseInt(value.replace(/[^\d]/g, "")) : value;

  if (isNaN(num as number)) return nullText;

  return `${p}${new Intl.NumberFormat("id-ID").format(num as number)}`;
}

export function dateFormat(
  v?: string | Date | dayjs.Dayjs | null,
  format: string = "DD/MM/YYYY HH:mm",
  nullText: string = "-",
): string {
  if (!v) return nullText;

  const date = dayjs(v);

  // Kalau invalid → return nullText
  if (!date.isValid()) return nullText;

  const year = date.year();
  if (year === 1 || year === 1970) {
    return nullText;
  }

  return date.format(format);
}

export function postedAgo(date: string | Date): string {
  dayjs.extend(relativeTime);

  const d = dayjs(date);
  const now = dayjs();

  const diffHours = now.diff(d, "hour");

  if (diffHours < 24) {
    return `Posted ${d.fromNow()}`;
  } else {
    return dateFormat(d, "DD MMM YYYY HH:mm");
  }
}

export function updateAt(date: string | Date): string {
  dayjs.extend(relativeTime);

  const d = dayjs(date);
  const now = dayjs();

  const diffHours = now.diff(d, "hour");

  if (diffHours < 24) {
    return `Last updated at ${d.fromNow()}`;
  } else {
    return dateFormat(d, "DD MMM YYYY HH:mm");
  }
}

type ItemWithId = { id?: string } | string | undefined;

export function extractIds(items: ItemWithId[]): string[] {
  return items
    .map((item) => {
      if (!item) return undefined;
      if (typeof item === "string") return item;
      return item.id;
    })
    .filter((id): id is string => Boolean(id));
}

export function capitalizeFirst(str: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function findByKeyValue<T, K extends keyof T>(
  array: readonly T[],
  key: K,
  value: T[K],
): T | undefined {
  return array.find((item) => item[key] === value);
}

export function formatRegion(
  item?: {
    name?: string;
    administrative_area?: RegionAdministrativeArea;
  } | null,
): string {
  if (!item) return "";
  const parts = [];
  const area = item.administrative_area;
  if (area?.village) parts.push(area.village);
  if (area?.district) parts.push(area.district);
  if (area?.regency) parts.push(area.regency);
  if (area?.province) parts.push(area.province);
  if (area?.country) parts.push(area.country);
  return parts.filter(Boolean).join(", ");
}
