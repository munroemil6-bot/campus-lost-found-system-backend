'use client'

import { useEffect, useState } from 'react'
import { fetchItems } from '../services/api'

export default function BrowseItems() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('All')

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true)
      try {
        const data = await fetchItems()
        setItems(data || [])
      } catch (err) {
        setItems([])
      } finally {
        setLoading(false)
      }
    }

    loadItems()

    const onStorage = (e) => {
      if (e.key === '__clf_last_action') {
        loadItems()
      }
    }

    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const filteredItems = items.filter((item) => {
    const title = item.name || item.title || ''
    const location = item.location || ''
    const itemType = (item.item_type || item.type || '').toLowerCase()
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'All' || itemType === filterType.toLowerCase()

    return matchesSearch && matchesType
  })

  return (
    <main className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">

      <section className="rounded-3xl border border-blue-800/80 bg-blue-900/80 p-6 shadow-2xl shadow-blue-950/25 sm:p-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-300/90">Campus Directory</p>
          <h2 className="mt-2 text-3xl font-bold text-amber-100">Browse reported items</h2>
          <p className="mt-3 max-w-2xl text-slate-200">
            Search for misplaced items or browse recently found catalog entries across campus.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-2xl border border-blue-800/70 bg-blue-950/70 p-5 sm:flex-row sm:items-center sm:justify-between">
       
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search items or locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-full border border-blue-800 bg-blue-900/40 px-5 py-2.5 text-sm text-slate-100 placeholder-slate-400 outline-none transition focus:border-amber-300/60 focus:ring-1 focus:ring-amber-300/60"
          />
        </div>

        
        <div className="flex flex-wrap gap-2">
          {['All', 'Found', 'Lost'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                filterType === type
                  ? 'bg-amber-300 text-blue-950'
                  : 'border border-blue-800 bg-blue-900/40 text-slate-300 hover:bg-blue-900/70 hover:text-slate-100'
              }`}
            >
              {type} Items
            </button>
          ))}
        </div>
      </section>

     
      {loading ? (
        <section className="rounded-2xl border border-blue-800/80 bg-blue-900/20 p-12 text-center">
          <p className="text-lg font-semibold text-slate-300">Loading items...</p>
        </section>
      ) : filteredItems.length > 0 ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => {
            const itemType = (item.item_type || item.type || 'Found').charAt(0).toUpperCase() + (item.item_type || item.type || 'Found').slice(1)
            return (
              <article
                key={item.id}
                className="flex flex-col justify-between rounded-2xl border border-blue-800/80 bg-blue-900/50 p-5 shadow-lg transition hover:border-blue-700"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`rounded-full px-3 py-0.5 text-xs font-semibold ring-1 ${
                        itemType === 'Found'
                          ? 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/20'
                          : 'bg-rose-500/15 text-rose-300 ring-rose-500/20'
                      }`}
                    >
                      {itemType}
                    </span>
                    <span className="text-xs text-slate-400">{item.category || item.date || 'Unknown'}</span>
                  </div>

                  <h4 className="mt-4 text-lg font-bold text-amber-100">{item.name || item.title}</h4>
                  <p className="mt-1 text-sm text-slate-300">
                    <span className="font-medium text-slate-400">Location:</span> {item.location || 'Unknown'}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-blue-800/40">
                  <ClaimButton item={item} />
                </div>
              </article>
            )
          })}
        </section>
      ) : (
        <section className="rounded-2xl border border-dashed border-blue-800/80 bg-blue-900/20 p-12 text-center">
          <p className="text-lg font-semibold text-slate-300">No reported items match your criteria.</p>
          <p className="mt-1 text-sm text-slate-400">Try adjusting your search filters or check back later.</p>
        </section>
      )}
    </main>
  )
}

function ClaimButton({ item }) {
  // quick check for auth stored in localStorage
  const isLogged = !!localStorage.getItem('clf_user')

  if (!isLogged) {
    return (
      <button onClick={() => (window.location.href = '/login')} className="w-full rounded-full border border-amber-300/30 bg-blue-950/60 py-2 text-sm font-semibold text-amber-200 transition hover:bg-amber-300 hover:text-blue-950">
        {item.type === 'Found' ? 'Claim item' : 'I found this'}
      </button>
    )
  }

  return (
    <button onClick={() => openClaimModal(item)} className="w-full rounded-full border border-amber-300/30 bg-emerald-500/60 py-2 text-sm font-semibold text-amber-200 transition hover:bg-emerald-400 hover:text-blue-950">
      {item.type === 'Found' ? 'Claim item' : 'I found this'}
    </button>
  )
}

function openClaimModal(item) {
  const container = document.createElement('div')
  container.id = 'clf-claim-modal'
  document.body.appendChild(container)

  container.innerHTML = `
  <div style="position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(2,6,23,0.6);z-index:9999">
    <div style="background:#031025;padding:20px;border-radius:12px;max-width:480px;width:90%;color:#e6eef8">
      <h3 style="margin:0 0 10px;font-size:18px">Claim this item</h3>
      <p style="margin:0 0 12px">Please provide your full name and email to submit a claim.</p>
      <input id="clf-claim-name" placeholder="Full name" style="width:100%;padding:10px;margin-bottom:8px;border-radius:8px;border:1px solid #1f2937;background:#0b1220;color:#e6eef8" />
      <input id="clf-claim-email" placeholder="Email" style="width:100%;padding:10px;margin-bottom:12px;border-radius:8px;border:1px solid #1f2937;background:#0b1220;color:#e6eef8" />
      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button id="clf-claim-cancel" style="padding:8px 12px;border-radius:8px;background:#0b1220;border:1px solid #374151;color:#e6eef8">Cancel</button>
        <button id="clf-claim-submit" style="padding:8px 12px;border-radius:8px;background:#10b981;color:#021124">Submit claim</button>
      </div>
    </div>
  </div>`

  document.getElementById('clf-claim-cancel').onclick = () => { document.getElementById('clf-claim-modal')?.remove() }
  document.getElementById('clf-claim-submit').onclick = async () => {
    const name = document.getElementById('clf-claim-name').value
    const email = document.getElementById('clf-claim-email').value
    if (!name || !email) return alert('Please enter name and email')

    try {
      const user = JSON.parse(localStorage.getItem('clf_user'))
      const payload = { user_id: user?.user_id || null, item_id: item.id, proof: `Claim by ${name} <${email}>`, claimant_name: name, claimant_email: email }
      await (await import('../services/api')).createClaim(payload)
      alert('Claim submitted — admin will review it.')
      document.getElementById('clf-claim-modal')?.remove()
    } catch (err) {
      alert('Unable to submit claim')
    }
  }
}
