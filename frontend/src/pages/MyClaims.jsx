'use client'

import { useEffect, useState } from 'react'
import { getCurrentUser } from '../utils/auth'
import { fetchClaims } from '../services/api'

export default function MyClaims() {
  const user = getCurrentUser()
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setClaims([])
      setLoading(false)
      return
    }

    const loadClaims = async () => {
      setLoading(true)
      try {
        const data = await fetchClaims()
        const myClaims = data.filter((c) => {
          if (user.user_id && c.user_id === user.user_id) return true
          if (user.email && c.claimant_email && c.claimant_email.toLowerCase() === user.email.toLowerCase()) return true
          return false
        })
        setClaims(myClaims)
      } catch (err) {
        setClaims([])
      } finally {
        setLoading(false)
      }
    }

    loadClaims()

    const onStorage = (e) => {
      if (e.key === '__clf_last_action') loadClaims()
    }

    let interval = null
    const startPolling = () => {
      loadClaims()
      interval = setInterval(loadClaims, 10000)
    }

    window.addEventListener('storage', onStorage)
    startPolling()
    return () => {
      window.removeEventListener('storage', onStorage)
      if (interval) clearInterval(interval)
    }
  }, [user])

  return (
    <main className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      <section className="rounded-3xl border border-blue-800/80 bg-blue-900/80 p-6 shadow-2xl shadow-blue-950/25 sm:p-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-300/90">My Claims</p>
          <h2 className="mt-2 text-3xl font-bold text-amber-100">Your submitted claim history</h2>
          <p className="mt-3 max-w-2xl text-slate-200">
            View your submitted claims and their current processing status from the admin team.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-blue-800/70 bg-blue-950/70 p-6">
        {loading ? (
          <p className="text-sm text-slate-300">Loading your claims...</p>
        ) : !user ? (
          <p className="text-sm text-slate-300">Please sign in to view your claim history.</p>
        ) : claims.length === 0 ? (
          <p className="text-sm text-slate-300">No claims submitted yet.</p>
        ) : (
          <div className="space-y-4">
            {claims.map((claim) => (
              <article key={claim.id} className="rounded-2xl border border-blue-800/70 bg-blue-950/60 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-slate-100">Item ID: {claim.item_id}</p>
                    <p className="mt-1 text-sm text-slate-300">Claimed by: {claim.claimant_name || user.username || 'You'}</p>
                    <p className="mt-1 text-sm text-slate-300">Email: {claim.claimant_email || user.email}</p>
                  </div>
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    claim.status === 'Resolved' ? 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/20' :
                    claim.status === 'pending' ? 'bg-amber-300/15 text-amber-200 ring-amber-200/20' :
                    'bg-slate-500/15 text-slate-400 ring-slate-500/20'
                  }`}>
                    {claim.status || 'pending'}
                  </span>
                </div>
                <div className="mt-4 text-sm text-slate-300">
                  {claim.proof || 'No additional claim details were provided.'}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
