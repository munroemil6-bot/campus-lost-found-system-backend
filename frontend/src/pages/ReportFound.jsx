import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createItem } from '../services/api'

export default function ReportFound() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    category: 'Electronics',
    location: '',
    dateFound: '2026-06-13',
    description: '',
    storageLocation: 'Central Security Desk',
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setErrorMessage('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.location || !formData.description) {
      setErrorMessage('Please fill out all required fields.')
      return
    }

    try {
      await createItem({
        name: formData.name,
        category: formData.category,
        description: formData.description,
        location: formData.location,
        item_type: 'found',
      })
      setSuccessMessage('Found item reported successfully.')
      setIsSubmitted(true)
      setTimeout(() => navigate('/browse'), 1200)
    } catch (err) {
      setErrorMessage(err?.response?.data?.detail || 'Unable to submit the report.')
    }
  }

  return (
    <main className="mx-auto max-w-4xl rounded-3xl border border-blue-800/80 bg-blue-900/90 px-6 py-10 shadow-2xl shadow-blue-950/25 sm:px-10">
      <h2 className="text-3xl font-bold text-amber-100">Report a found item</h2>

      {isSubmitted ? (
        <section className="mt-8 rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-emerald-100">
          <h3 className="text-xl font-semibold">Report submitted</h3>
          <p className="mt-2 text-sm text-slate-300">{successMessage}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link className="rounded-full bg-blue-950 px-4 py-2 text-sm text-amber-200 hover:bg-blue-900" to="/browse">
              Browse items
            </Link>
            <button className="rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-blue-950" onClick={() => setIsSubmitted(false)}>
              Report another
            </button>
          </div>
        </section>
      ) : (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errorMessage && <p className="rounded-3xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">{errorMessage}</p>}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm text-slate-200">
              Item Name *
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20"
                placeholder="Black wallet"
                required
              />
            </label>
            <label className="block text-sm text-slate-200">
              Category
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20"
              >
                <option>Electronics</option>
                <option>Books & Stationery</option>
                <option>Clothing & Bags</option>
                <option>Keys & Wallets</option>
                <option>Other</option>
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm text-slate-200">
              Location *
              <input
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20"
                placeholder="Library front desk"
                required
              />
            </label>
            <label className="block text-sm text-slate-200">
              Date Found
              <input
                type="date"
                name="dateFound"
                value={formData.dateFound}
                onChange={handleInputChange}
                className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20"
              />
            </label>
          </div>

          <label className="block text-sm text-slate-200">
            Description *
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="5"
              className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20"
              placeholder="Describe the found item and where you located it."
              required
            />
          </label>

          <label className="block text-sm text-slate-200">
            Held at
            <select
              name="storageLocation"
              value={formData.storageLocation}
              onChange={handleInputChange}
              className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20"
            >
              <option>Central Security Desk</option>
              <option>Library Front Counter</option>
              <option>Student Union Office</option>
            </select>
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <Link className="rounded-full border border-blue-800 bg-blue-950/70 px-5 py-3 text-sm text-amber-100 hover:bg-blue-900" to="/">
              Cancel
            </Link>
            <button type="submit" className="rounded-full bg-amber-300 px-5 py-3 text-sm font-semibold text-blue-950 hover:bg-amber-200">
              Publish Report
            </button>
          </div>
        </form>
      )}
    </main>
  )
}
