import type { ParticipationStatus } from "@/lib/types";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const statusLabels: Record<ParticipationStatus, string> = {
  joining: "เข้าร่วม",
  not_joining: "ไม่เข้าร่วม",
  pending: "รอตัดสินใจ",
};

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("th-TH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

export function formatDateRange(startDate: string, endDate: string) {
  if (startDate === endDate) return formatDate(startDate);
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

export function getEventDurationDays(startDate: string, endDate: string) {
  const start = parseDateOnly(startDate);
  const end = parseDateOnly(endDate);
  const diff = Math.floor((end.getTime() - start.getTime()) / DAY_IN_MS) + 1;
  return Math.max(1, diff);
}

export function formatEventDuration(startDate: string, endDate: string) {
  return `${getEventDurationDays(startDate, endDate)} วัน`;
}

export function getStatusLabel(status: ParticipationStatus) {
  return statusLabels[status];
}

export function getStatusClass(status: ParticipationStatus) {
  if (status === "joining") return "bg-[oklch(0.93_0.05_151)] text-[oklch(0.34_0.09_151)]";
  if (status === "not_joining") return "bg-[oklch(0.93_0.05_28)] text-[oklch(0.36_0.12_28)]";
  return "bg-[oklch(0.93_0.04_75)] text-[oklch(0.38_0.08_65)]";
}

function parseDateOnly(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}
