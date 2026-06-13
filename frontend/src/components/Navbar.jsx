import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="mx-auto flex max-w-7xl flex-col gap-4 rounded-3xl border border-blue-800/80 bg-blue-950/90 px-5 py-4 shadow-xl shadow-blue-950/20 sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-amber-300/90">Campus Lost & Found</p>
        <h1 className="mt-1 text-2xl font-bold text-amber-100">Blue & Gold Campus</h1>
      </div>

      <ul className="flex flex-wrap items-center gap-4 text-sm text-slate-200">
        <li>
          <Link className="rounded-full px-4 py-2 transition hover:bg-amber-300/15 hover:text-amber-100" to="/">
            Home
          </Link>
        </li>
        <li>
          <Link className="rounded-full px-4 py-2 transition hover:bg-amber-300/15 hover:text-amber-100" to="/browse">
            Browse
          </Link>
        </li>
        <li>
          <Link className="rounded-full px-4 py-2 transition hover:bg-amber-300/15 hover:text-amber-100" to="/report/lost">
            Report Lost
          </Link>
        </li>
        <li>
          <Link className="rounded-full px-4 py-2 transition hover:bg-amber-300/15 hover:text-amber-100" to="/report/found">
            Report Found
          </Link>
        </li>
        <li>
          <Link className="rounded-full px-4 py-2 transition hover:bg-amber-300/15 hover:text-amber-100" to="/claims">
            My Claims
          </Link>
        </li>
        <li>
          <Link className="rounded-full px-4 py-2 border border-amber-300/30 bg-blue-900/90 text-amber-100 transition hover:bg-blue-900" to="/login">
            Login
          </Link>
        </li>
        <li>
          <Link className="rounded-full px-4 py-2 bg-amber-300 text-blue-950 transition hover:bg-amber-200" to="/register">
            Register
          </Link>
        </li>
        <li>
          <Link className="rounded-full px-4 py-2 transition hover:bg-amber-300/15 hover:text-amber-100" to="/admin">
            Admin
          </Link>
        </li>
      </ul>
    </nav>
  )
}
