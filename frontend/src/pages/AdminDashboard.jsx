import { useEffect, useState } from 'react'
import { fetchClaims, fetchItems } from '../services/api'
import { getCurrentUser } from '../utils/auth'
import { useNavigate } from 'react-router-dom'
import { navigateToRoute } from '../utils/navigation'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)
  const user = getCurrentUser()

  const [items, setItems] = useState([])
  const resolvedClaims = claims.filter((c) => (c.status || '').toLowerCase() === 'resolved')
  const pendingClaims = claims.filter((c) => (c.status || '').toLowerCase() !== 'resolved')

  const stats = [
    { label: 'Open reports', value: String(items.length) },
    { label: 'Pending claims', value: String(pendingClaims.length) },
    { label: 'Matched items', value: String(resolvedClaims.length) },
    { label: 'Resolved today', value: String(resolvedClaims.length) },
  ]

  const reviewItems = items.length > 0 ? items.map(it => ({ title: it.name || `Item ${it.id}`, type: it.item_type || 'Found', location: it.location || 'Unknown', status: 'Needs review' })) : [
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

  useEffect(() => {
    if (!user || !user.is_admin) {
      navigate('/login')
      return
    }

    const load = async () => {
      try {
        const [c, its] = await Promise.all([fetchClaims(), fetchItems()])
        setClaims(c || [])
        setItems(its || [])
      } catch (e) {
        setClaims([])
        setItems([])
      } finally {
        setLoading(false)
      }
    }

    // refresh when other tabs/components trigger an action (create claim/item)
    const onStorage = (e) => {
      if (e.key === '__clf_last_action') load()
    }

    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [navigate, user])

  function signOut() {
    localStorage.removeItem('clf_user')
    navigateToRoute('/')
  }

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
            <button onClick={signOut} className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white">
              Sign out
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
            {loading ? (
              <p className="text-sm text-slate-300">Loading claims...</p>
            ) : claims.length === 0 ? (
              <p className="text-sm text-slate-300">No claims submitted yet.</p>
            ) : (
              claims.map((claim) => (
                <article key={claim.id} className="rounded-2xl border border-blue-800/70 bg-blue-950/60 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-100">Item ID: {claim.item_id}</p>
                      <p className="mt-1 text-sm text-slate-300">Claimed by: {claim.claimant_name || 'Unknown'}</p>
                      <p className="mt-1 text-sm text-slate-300">Email: {claim.claimant_email || 'Unknown'}</p>
                    </div>
                    <span className="rounded-full bg-blue-800 px-3 py-1 text-xs font-semibold text-amber-100">
                      {claim.status || 'pending'}
                    </span>
                  </div>
                  <div className="mt-4 rounded-2xl bg-blue-900/60 p-3 text-sm text-slate-300">
                    {claim.proof}
                  </div>
                </article>
              ))
            )}
          </div>
        </aside>
      </section>
    </main> 
  )
}