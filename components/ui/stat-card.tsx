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
    <section className="frosted-card rounded-xl p-5 transition-shadow duration-200 hover:shadow-[rgba(0,0,0,0.12)_0px_0px_0px_1px,rgba(0,0,0,0.06)_0px_4px_8px,inset_#fafafa_0px_0px_0px_1px]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-widest text-muted">{label}</p>
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-panel-soft text-foreground">
          <Icon aria-hidden className="h-3.5 w-3.5 stroke-[1.5]" />
        </span>
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-foreground">{value}</p>
      <p className="mt-2 text-xs leading-5 text-muted">{detail}</p>
    </section>
  );
}
