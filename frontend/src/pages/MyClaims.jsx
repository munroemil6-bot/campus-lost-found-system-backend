'use client'

import { useState } from 'react'

export default function MyClaims() {
 
  const personalClaims = [
    {
      id: 'CLM-9021',
      item: 'Blue backpack',
      dateSubmitted: '2026-06-11',
      locationFound: 'Student Center',
      status: 'Approved',
      statusNote: 'Ready for pickup at Central Security Office.',
    },
    {
      id: 'CLM-8411',
      item: 'Scientific calculator',
      dateSubmitted: '2026-06-08',
      locationFound: 'Engineering Lab',
      status: 'In Review',
      statusNote: 'Admin team is verifying ownership photos.',
    },
    {
      id: 'CLM-7320',
      item: 'Leather wallet',
      dateSubmitted: '2026-05-24',
      locationFound: 'Gymnasium',
      status: 'Resolved',
      statusNote: 'Item returned to owner.',
    },
  ]

  return (
    <main className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      
      
      <section className="rounded-3xl border border-blue-800/80 bg-blue-900/80 p-6 shadow-2xl shadow-blue-950/25 sm:p-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-300/90">User Dashboard</p>
          <h2 className="mt-2 text-3xl font-bold text-amber-100">My claim requests</h2>
          <p className="mt-3 max-w-2xl text-slate-200">
            Track the validation status, processing history, and pickup instructions for your claimed missing property.
          </p>
        </div>
      </section>

      
      <section className="space-y-4">
        {personalClaims.map((claim) => (
          <article 
            key={claim.id} 
            className="rounded-2xl border border-blue-800/70 bg-blue-950/70 p-5 lg:p-6 transition hover:border-blue-700/80"
          >
           
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="text-xs font-mono tracking-wider text-slate-400">{claim.id}</span>
                <h3 className="mt-1 text-xl font-bold text-amber-100">{claim.item}</h3>
              </div>
              
             
              <div>
                <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                  claim.status === 'Approved' ? 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/20' :
                  claim.status === 'In Review' ? 'bg-amber-300/15 text-amber-200 ring-amber-200/20' :
                  'bg-slate-500/15 text-slate-400 ring-slate-500/20'
                }`}>
                  ● {claim.status}
                </span>
              </div>
            </div>

            
            <div className="mt-4 grid gap-4 border-t border-blue-800/40 pt-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className="text-slate-400 font-medium">Date Claimed</p>
                <p className="mt-1 text-slate-200">{claim.dateSubmitted}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Estimated Location</p>
                <p className="mt-1 text-slate-200">{claim.locationFound}</p>
              </div>
              <div className="sm:col-span-2 lg:col-span-1">
                <p className="text-slate-400 font-medium">Latest Administrative Update</p>
                <p className="mt-1 text-slate-200 italic">"{claim.statusNote}"</p>
              </div>
            </div>

            
            <div className="mt-5 flex justify-end gap-3 border-t border-blue-800/20 pt-4">
              <button className="rounded-full border border-blue-800 bg-blue-900/40 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:bg-blue-900/80 hover:text-slate-100">
                Message reviewer
              </button>
              {claim.status === 'In Review' && (
                <button className="rounded-full border border-rose-900/50 bg-rose-950/20 px-4 py-2 text-xs font-semibold text-rose-300 transition hover:bg-rose-950/50">
                  Cancel claim
                </button>
              )}
            </div>
          </article>
        ))}
      </section>

    </main>
  )
}
