import { Link } from "react-router-dom";
import { useEffect, useState } from 'react'
import { fetchItems } from '../services/api'

export default function Home() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [backendReachable, setBackendReachable] = useState(null)
  const apiBaseUrl = typeof window !== 'undefined' ? window.__CLF_API_BASE : undefined

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const data = await fetchItems()
        setItems(data || [])
        setBackendReachable(typeof window !== 'undefined' ? window.__CLF_BACKEND_REACHABLE ?? false : false)
      } catch (err) {
        setItems([])
        setBackendReachable(false)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const activeReports = items.length
  const recentItems = items.slice(0, 3).map((item) => ({
    id: item.id,
    title: item.name || 'Report',
    type: item.item_type || 'Found',
    location: item.location || 'Unknown',
    time: 'Recently reported',
  }))

  return (
    <main className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
      
      {/* Hero Welcome Section */}
      <section className="rounded-3xl border border-blue-800/80 bg-blue-900/80 px-6 py-12 shadow-2xl shadow-blue-950/25 backdrop-blur-sm sm:px-10 lg:py-16">
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex rounded-full bg-amber-300/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-200 ring-1 ring-amber-200/20">
            Campus Hub
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-amber-100 sm:text-5xl">
            Campus Lost & Found
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-200">
            A central space for students and staff to report, browse, and claim lost or found items on campus with confidence. Keep our community connected.
          </p>
          
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/login" className="inline-flex items-center justify-center rounded-full bg-amber-300 px-6 py-3 text-sm font-semibold text-blue-950 shadow-lg shadow-amber-500/20 transition hover:bg-amber-200">
              Report an item
            </Link>
            <Link to="/browse" className="inline-flex items-center justify-center rounded-full border border-amber-300/30 bg-blue-950/70 px-6 py-3 text-sm font-semibold text-amber-100 transition hover:bg-blue-900">
              Browse reports
            </Link>
          </div>
        </div>
      </section>

     
      <section className="grid gap-6 md:grid-cols-3">
      
        <div className="rounded-2xl border border-blue-800/60 bg-blue-950/50 p-6">
          <p className="text-sm font-medium text-slate-400">Active Reports</p>
          <p className="mt-2 text-3xl font-bold text-amber-100">{activeReports}</p>
          <p className="mt-1 text-xs text-emerald-400">▲ {Math.max(0, Math.min(activeReports, 4))} new entries today</p>
        </div>

       
        <div className="rounded-2xl border border-blue-800/60 bg-blue-950/50 p-6">
          <p className="text-sm font-medium text-slate-400">Items Reunited</p>
          <p className="mt-2 text-3xl font-bold text-amber-100">184</p>
          <p className="mt-1 text-xs text-slate-400">This semester</p>
        </div>

       
        <div className="flex flex-col justify-between rounded-2xl border border-blue-800/60 bg-blue-950/50 p-6">
          <div>
            <p className="text-sm font-medium text-slate-400">Management</p>
            <p className="mt-1 text-sm text-slate-200">Access administrative tools and item queues.</p>
          </div>
          <Link to="/admin" className="mt-4 inline-flex items-center text-sm font-semibold text-amber-300 hover:text-amber-200">
            Open Admin Console &rarr;
          </Link>
        </div>
      </section>

      <section className="rounded-3xl border border-blue-800/80 bg-blue-900/40 p-6 sm:p-8">
        <div className="flex items-center justify-between border-b border-blue-800/60 pb-4">
          <div>
            <h3 className="text-xl font-bold text-amber-100">Recently reported</h3>
            <p className="text-sm text-slate-400">Latest updates across campus active matching logs</p>
          </div>
          <Link to="/browse" className="text-sm font-semibold text-amber-300 hover:text-amber-200 hidden sm:block">
            View full directory
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recentItems.map((item) => (
            <div key={item.id} className="rounded-2xl border border-blue-800/50 bg-blue-950/40 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    item.type === 'Found' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'
                  }`}>
                    {item.type}
                  </span>
                  <span className="text-xs text-slate-400">{item.time}</span>
                </div>
                <h4 className="mt-3 font-semibold text-slate-100">{item.title}</h4>
                <p className="mt-1 text-xs text-slate-400">Near {item.location}</p>
              </div>
              <Link to="/browse" className="mt-4 block text-center rounded-xl bg-blue-900/60 py-2 text-xs font-semibold text-amber-200 hover:bg-blue-800 transition">
                View entry details
              </Link>
            </div>
          ))}
        </div>
      </section>

    </main>
  )
}
