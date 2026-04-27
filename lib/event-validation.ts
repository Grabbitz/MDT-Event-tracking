export function hasInvalidDateRange(startDate: string, endDate: string) {
  if (!startDate || !endDate) return false;
  return endDate < startDate;
}
