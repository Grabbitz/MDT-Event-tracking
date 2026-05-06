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
    <section className="frosted-card rounded-[30px] p-5 transition-transform duration-200 hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium text-muted">{label}</p>
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-panel-soft text-foreground">
          <Icon aria-hidden className="h-4 w-4 stroke-[1.5]" />
        </span>
      </div>
      <p className="mt-4 text-3xl font-light tracking-normal text-foreground">{value}</p>
      <p className="mt-2 text-[11px] leading-5 text-muted">{detail}</p>
    </section>
  );
}
