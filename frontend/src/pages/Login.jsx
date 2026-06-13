import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../services/api'

export default function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async event => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const loginUsername = username
      const loginPassword = password
      const data = await loginUser({ username: loginUsername, password: loginPassword })
      setSuccess(data.message)
      // Save user locally for protected routes
      import('../utils/auth').then(mod => {
        const isAdmin = data.email === 'admin@gmail.com' && data.username === 'admin' && loginPassword === 'admin123'
        const userObj = { user_id: data.user_id, email: data.email, username: data.username }
        mod.setCurrentUser(userObj)
        setTimeout(() => {
          if (isAdmin) navigate('/admin')
          else navigate('/student-dashboard')
        }, 600)
      })
      setUsername('')
      setPassword('')
    } catch (err) {
      setError(err?.response?.data?.detail || 'Login failed. Check your username and password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-lg rounded-3xl border border-blue-800/80 bg-blue-900/90 px-8 py-10 shadow-2xl shadow-blue-950/25 sm:px-10">
      <div className="space-y-4 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-300/80">Member access</p>
        <h1 className="text-3xl font-bold text-amber-100">Login to your account</h1>
        <p className="text-sm leading-6 text-slate-300">Use your campus username and password to access claims and reports.</p>
      </div>

      <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-200" htmlFor="username">
            Username or Email
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={event => setUsername(event.target.value)}
            required
            className="w-full rounded-3xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20"
            placeholder="Enter your username or email"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-200" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            required
            className="w-full rounded-3xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20"
            placeholder="Enter your password"
          />
        </div>

        {error && <p className="rounded-3xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}
        {success && <p className="rounded-3xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-3xl bg-amber-300 px-5 py-3 text-sm font-semibold text-blue-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </main>
  )
}
