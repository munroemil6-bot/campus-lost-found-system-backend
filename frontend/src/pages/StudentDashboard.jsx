import { Link } from 'react-router-dom'
import { clearCurrentUser, getCurrentUser } from '../utils/auth'
import { useEffect, useState } from 'react'
import { fetchClaims } from '../services/api'

export default function StudentDashboard() {
  const user = getCurrentUser()
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setClaims([])
      setLoading(false)
      return
    }
    const load = () => fetchClaims()
      .then((data) => {
        // filter claims belonging to this user by claimant_email or user_id
        const my = data.filter(c => {
          if (user.user_id && c.user_id === user.user_id) return true
          if (user.email && c.claimant_email && c.claimant_email.toLowerCase() === user.email.toLowerCase()) return true
          return false
        })
        setClaims(my)
      })
      .catch(() => setClaims([]))
      .finally(() => setLoading(false))

    // refresh when other tabs/components trigger an action (create claim/item)
    const onStorage = (e) => {
      if (e.key === '__clf_last_action') load()
    }

    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [user])

  return (
    <main className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-amber-100">Student Dashboard</h2>
        <div>
          <Link to="/browse" className="mr-3 text-sm text-slate-300">Browse</Link>
          <button
            onClick={() => { clearCurrentUser(); window.location.href = '/' }}
            className="rounded-full bg-amber-300 px-3 py-1 text-sm font-semibold text-blue-950"
          >
            Sign out
          </button>
        </div>
      </div>

      <section className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Link to="/report/lost" className="block rounded-2xl border border-blue-800 p-6 text-slate-200 hover:bg-blue-900/60">
            Report Lost
          </Link>
          <Link to="/report/found" className="block rounded-2xl border border-blue-800 p-6 text-slate-200 hover:bg-blue-900/60">
            Report Found
          </Link>
        </div>

        <div className="rounded-3xl border border-blue-800/70 bg-blue-900/70 p-6">
          <h3 className="text-lg font-bold text-amber-100">My Claims</h3>

          {loading ? (
            <p className="text-sm text-slate-300">Loading your claims...</p>
          ) : claims.length === 0 ? (
            <p className="text-sm text-slate-300">No claims submitted yet.</p>
          ) : (
            <div className="mt-4 space-y-4">
              {claims.map(c => (
                <article key={c.id} className="rounded-2xl border border-blue-800/70 bg-blue-950/60 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-slate-100">Item ID: {c.item_id}</p>
                      <p className="mt-1 text-sm text-slate-300">Claimed by: {c.claimant_name || 'Unknown'}</p>
                      <p className="mt-1 text-sm text-slate-300">Email: {c.claimant_email || 'Unknown'}</p>
                    </div>
                    <span className="rounded-full bg-blue-800 px-3 py-1 text-xs font-semibold text-amber-100">
                      {c.status || 'pending'}
                    </span>
                  </div>
                  <div className="mt-4 text-sm text-slate-300">{c.proof}</div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
