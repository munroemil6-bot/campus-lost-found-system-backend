import { Link } from 'react-router-dom'
import { clearCurrentUser, getCurrentUser } from '../utils/auth'

export default function StudentDashboard() {
  const user = getCurrentUser()

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

      <section className="grid gap-4 sm:grid-cols-2">
        <Link to="/report/lost" className="block rounded-2xl border border-blue-800 p-6 text-slate-200 hover:bg-blue-900/60">
          Report Lost
        </Link>
        <Link to="/report/found" className="block rounded-2xl border border-blue-800 p-6 text-slate-200 hover:bg-blue-900/60">
          Report Found
        </Link>
        <Link to="/claims" className="block rounded-2xl border border-blue-800 p-6 text-slate-200 hover:bg-blue-900/60">
          My Claims
        </Link>
      </section>
    </main>
  )
}
