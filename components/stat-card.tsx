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
    <section className="border-line bg-panel rounded-2xl border p-5 shadow-[var(--shadow-soft)] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-muted text-xs font-bold uppercase tracking-wider">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">{value}</p>
        </div>
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent sm:h-12 sm:w-12">
          <Icon aria-hidden className="h-6 w-6 stroke-[1.5]" />
        </span>
      </div>
      <p className="text-muted mt-4 text-xs font-medium">{detail}</p>
    </section>
  );
}
