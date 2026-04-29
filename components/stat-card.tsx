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
    <section className="border-line bg-panel rounded-lg border p-4 transition-colors hover:bg-panel-soft">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium text-muted">{label}</p>
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-accent-soft text-accent">
          <Icon aria-hidden className="h-4 w-4 stroke-[1.5]" />
        </span>
      </div>
      <p className="mt-2.5 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
      <p className="mt-1.5 text-[11px] text-muted">{detail}</p>
    </section>
  );
}
