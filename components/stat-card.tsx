import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
}) {
  return (
    <section className="border-line bg-panel rounded-lg border p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-muted text-sm font-semibold">{label}</p>
          <p className="mt-2 text-3xl font-black tracking-normal">{value}</p>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-md bg-accent-soft text-accent-strong">
          <Icon aria-hidden className="h-5 w-5" />
        </span>
      </div>
      <p className="text-muted mt-4 text-sm">{detail}</p>
    </section>
  );
}
