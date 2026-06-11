// Home page.
// Add landing page content, featured items, or dashboard links.
export default function Home() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <section>
        <h1 className="text-3xl font-bold text-slate-900">Campus Lost & Found</h1>
        <p className="mt-4 text-slate-600">
          A central place for students and staff to report, browse, and claim lost or found items on campus.
        </p>
        <button className="mt-6 rounded-md bg-slate-900 px-4 py-2 text-white">
          Report an item
        </button>
      </section>
    </main>
  )
}
