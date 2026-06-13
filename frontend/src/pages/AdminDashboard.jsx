
export default function AdminDashboard() {
  
  const stats = [
    { label: 'Open reports', value: '24' },
    { label: 'Pending claims', value: '8' },
    { label: 'Matched items', value: '13' },
    { label: 'Resolved today', value: '5' },
  ]

  const reviewItems = [
    {
      title: 'Black laptop sleeve',
      type: 'Found',
      location: 'Library front desk',
      status: 'Needs review',
    },
    {
      title: 'Student ID card',
      type: 'Lost',
      location: 'Science block',
      status: 'Possible match',
    },
    {
      title: 'Wireless earbuds case',
      type: 'Found',
      location: 'Cafeteria',
      status: 'Awaiting owner',
    },
  ]

  const claims = [
    { claimant: 'Amina K.', item: 'Blue backpack', confidence: 'High' },
    { claimant: 'David M.', item: 'Calculator', confidence: 'Medium' },
    { claimant: 'Joy W.', item: 'Keys with red tag', confidence: 'High' },
  ]

  
  return (
    <main className="mx-auto max-w-7xl space-y-6">
      <section className="rounded-3xl border border-blue-800/80 bg-blue-900/80 p-6 shadow-2xl shadow-blue-950/25 sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-300/90">Admin Console</p>
            <h2 className="mt-2 text-3xl font-bold text-amber-100">Review items and claims</h2>
            <p className="mt-3 max-w-2xl text-slate-200">
              Keep campus reports moving by approving submissions, validating claims, and closing matched items.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="rounded-full bg-amber-300 px-5 py-2 text-sm font-semibold text-blue-950 transition hover:bg-amber-200">
              Export report
            </button>
            <button className="rounded-full border border-amber-300/40 bg-blue-950/70 px-5 py-2 text-sm font-semibold text-amber-100 transition hover:bg-blue-900">
              Add notice
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <article key={stat.label} className="rounded-2xl border border-blue-800/70 bg-blue-950/70 p-5">
            <p className="text-sm text-slate-300">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-amber-100">{stat.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-3xl border border-blue-800/80 bg-blue-900/80 p-6">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-xl font-bold text-amber-100">Item review queue</h3>
            <button className="text-sm font-semibold text-amber-200 hover:text-amber-100">View all</button>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-blue-800/70">
            <table className="w-full text-left text-sm">
              <thead className="bg-blue-950/80 text-slate-300">
                <tr>
                  <th className="px-4 py-3 font-semibold">Item</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Location</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-800/70">
                {reviewItems.map((item) => (
                  <tr key={item.title} className="bg-blue-950/40">
                    <td className="px-4 py-4 font-semibold text-slate-100">{item.title}</td>
                    <td className="px-4 py-4 text-slate-200">{item.type}</td>
                    <td className="px-4 py-4 text-slate-200">{item.location}</td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-amber-300/15 px-3 py-1 text-xs font-semibold text-amber-100 ring-1 ring-amber-200/20">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="rounded-3xl border border-blue-800/80 bg-blue-900/80 p-6">
          <h3 className="text-xl font-bold text-amber-100">Claim approvals</h3>
          <div className="mt-5 space-y-4">
            {claims.map((claim) => (
              <article key={`${claim.claimant}-${claim.item}`} className="rounded-2xl border border-blue-800/70 bg-blue-950/60 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-100">{claim.item}</p>
                    <p className="mt-1 text-sm text-slate-300">Claimed by {claim.claimant}</p>
                  </div>
                  <span className="rounded-full bg-blue-800 px-3 py-1 text-xs font-semibold text-amber-100">
                    {claim.confidence}
                  </span>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-blue-950 transition hover:bg-amber-200">
                    Approve
                  </button>
                  <button className="flex-1 rounded-full border border-blue-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-blue-800/70">
                    Review
                  </button>
                </div>
              </article>
            ))}
          </div>
        </aside>
      </section>
    </main> 
  )
}