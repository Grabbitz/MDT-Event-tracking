import { getChannels } from "@/lib/events";

export const dynamic = "force-dynamic";

export default async function ChannelsPage() {
  const channels = await getChannels();

  return (
    <div className="space-y-6">
      <header className="rounded-[40px] px-1 pt-8">
        <p className="text-sm font-normal text-muted">Settings</p>
        <h1 className="display-title mt-3 text-5xl text-foreground sm:text-6xl">ช่องทาง</h1>
        <p className="mt-5 max-w-2xl leading-7 text-muted">
          Lookup table สำหรับสีใน calendar และการ filter รายการอีเวนท์
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {channels.map((channel) => (
          <article key={channel.name} className="frosted-card rounded-[30px] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ background: channel.color }} />
                  <h2 className="text-2xl font-light">{channel.name}</h2>
                </div>
                <p className="text-muted mt-2 text-sm">{channel.eventCount} events, {channel.joiningCount} joining</p>
              </div>
              <span className="rounded-full bg-panel-soft px-3 py-1 text-xs font-medium text-muted">{channel.color}</span>
            </div>
            <div className="mt-5 rounded-[22px] bg-panel-soft p-4 text-sm">
              <p className="font-medium text-muted">Next event</p>
              <p className="mt-1 font-medium">{channel.nextEvent?.name ?? "ไม่มีรายการถัดไป"}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
