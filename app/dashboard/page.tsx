export default function JupiterDashboard() {
  const cards = [
    {
      title: "Mission Revenue",
      value: "$1.40M",
      change: "+10.1%",
    },
    {
      title: "Investment Score",
      value: "92%",
      change: "+4%",
    },
    {
      title: "Active Agents",
      value: "147",
      change: "+12",
    },
    {
      title: "Humanitarian Missions",
      value: "38",
      change: "+6",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-50">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
            Jupiter Command
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Mission dashboard
          </h1>
          <p className="max-w-2xl text-sm text-slate-400 sm:text-base">
            Monitor revenue, agent activity, and humanitarian impact from a
            single command center.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <article
              key={card.title}
              className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-cyan-950/20"
            >
              <p className="text-sm font-medium text-slate-400">{card.title}</p>
              <div className="mt-4 flex items-end justify-between gap-4">
                <span className="text-3xl font-semibold tracking-tight">
                  {card.value}
                </span>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-300">
                  {card.change}
                </span>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
