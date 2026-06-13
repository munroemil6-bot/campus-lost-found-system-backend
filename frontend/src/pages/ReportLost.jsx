'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ReportLost() {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Electronics',
    lastSeenLocation: '',
    dateLost: '2026-06-13',
    description: '',
    contactMethod: 'Email',
    rewardOffered: 'No'
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
    setErrorMessage('')
  }


  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title || !formData.lastSeenLocation || !formData.description) {
      setErrorMessage('Please fill out all required fields.')
      return
    }
    setIsSubmitted(true)
  }

  return (
    <main>
      <h2>File a missing item report</h2>
      {isSubmitted ? (
        <section>
          <h3>Missing report logged</h3>
          <Link href="/my-claims">Track My Reports</Link>
          <Link href="/">Return Home</Link>
        </section>
      ) : (
        <form onSubmit={handleSubmit}>
          {errorMessage && <p> {errorMessage}</p>}
          <div>
            <label>Item Lost *</label>
            <input type="text" name="title" value={formData.title} onChange={handleInputChange} />
          </div>
          <div>
            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleInputChange}>
              <option value="Electronics">Electronics</option>
              <option value="Books & Stationery">Books & Stationery</option>
              <option value="Clothing & Bags">Clothing & Bags</option>
              <option value="Keys & Wallets">Keys & Wallets</option>
              <option value="Other">Other Miscellaneous</option>
            </select>
          </div>
          <div>
            <label>Date Lost *</label>
            <input type="date" name="dateLost" value={formData.dateLost} onChange={handleInputChange} />
          </div>
          <div>
            <label>Last Seen Location *</label>
            <input type="text" name="lastSeenLocation" value={formData.lastSeenLocation} onChange={handleInputChange} />
          </div>
          <div>
            <label>Description *</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} />
          </div>
          <div>
            <label>Preferred Contact Channel</label>
            <select name="contactMethod" value={formData.contactMethod} onChange={handleInputChange}>
              <option value="Email">Campus Email</option>
              <option value="SMS">SMS Text Messages</option>
              <option value="In App">In-App Dashboard Alerts</option>
            </select>
          </div>
          <div>
            <label>Offering Reward?</label>
            <select name="rewardOffered" value={formData.rewardOffered} onChange={handleInputChange}>
              <option value="No">No financial reward</option>
              <option value="Yes">Yes (Cash amount or treat)</option>
            </select>
          </div>
          <div>
            <Link href="/">Cancel</Link>
            <button type="submit">Submit Missing Report</button>
          </div>
        </form>
      )}
    </main>
  )
}
