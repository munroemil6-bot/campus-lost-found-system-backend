// Home page.
// Add landing page content, featured items, or dashboard links.
export default function Home() {
  return (
    <main className="mx-auto max-w-4xl rounded-3xl border border-blue-800/80 bg-blue-900/80 px-6 py-12 shadow-2xl shadow-blue-950/25 backdrop-blur-sm sm:px-10">
      <section>
        <p className="mb-4 inline-flex rounded-full bg-amber-300/15 px-3 py-1 text-sm font-semibold text-amber-200 ring-1 ring-amber-200/20">
          Campus community alert
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-amber-100 sm:text-5xl">
          Campus Lost & Found
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200">
          A central home for students and staff to report, browse, and claim lost or found items on campus with confidence.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <button className="inline-flex items-center justify-center rounded-full bg-amber-300 px-6 py-3 text-sm font-semibold text-blue-950 shadow-lg shadow-amber-500/20 transition hover:bg-amber-200">
            Report an item
          </button>
          <button className="inline-flex items-center justify-center rounded-full border border-amber-300/30 bg-blue-950/70 px-6 py-3 text-sm font-semibold text-amber-100 transition hover:bg-blue-900">
            Browse reports
          </button>
        </div>
      </section>
    </main>
  )
}
