import { getChannels } from "@/lib/events";

export default async function ChannelsPage() {
  const channels = await getChannels();

  return (
    <div className="space-y-6">
      <header>
        <p className="font-black text-accent-strong">Settings</p>
        <h1 className="mt-2 text-4xl font-black">ช่องทาง</h1>
        <p className="text-muted mt-3 max-w-2xl leading-7">
          Lookup table สำหรับสีใน calendar และการ filter รายการอีเวนท์
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {channels.map((channel) => (
          <article key={channel.name} className="border-line rounded-lg border bg-panel p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ background: channel.color }} />
                  <h2 className="text-2xl font-black">{channel.name}</h2>
                </div>
                <p className="text-muted mt-2 text-sm">{channel.eventCount} events, {channel.joiningCount} joining</p>
              </div>
              <span className="border-line rounded-md border px-2 py-1 text-xs font-black">{channel.color}</span>
            </div>
            <div className="bg-panel-soft mt-5 rounded-md p-3 text-sm">
              <p className="text-muted font-semibold">Next event</p>
              <p className="mt-1 font-black">{channel.nextEvent?.name ?? "ไม่มีรายการถัดไป"}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
