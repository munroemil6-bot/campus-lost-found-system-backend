'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ReportFound() {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Electronics',
    location: '',
    dateFound: '2026-06-13',
    description: '',
    storageLocation: 'Central Security Desk'
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

  // Clean JavaScript submit handler
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title || !formData.location || !formData.description) {
      setErrorMessage('Please fill out all required fields.')
      return
    }
    setIsSubmitted(true)
  }

  return (
    <main>
      <h2>Log a found item</h2>
      {isSubmitted ? (
        <section>
          <h3>Report successfully logged!</h3>
          <Link href="/">Return Home</Link>
          <button onClick={() => setIsSubmitted(false)}>Log another item</button>
        </section>
      ) : (
        <form onSubmit={handleSubmit}>
          {errorMessage && <p> {errorMessage}</p>}
          <div>
            <label>Item Name *</label>
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
            <label>Date Found *</label>
            <input type="date" name="dateFound" value={formData.dateFound} onChange={handleInputChange} />
          </div>
          <div>
            <label>Location *</label>
            <input type="text" name="location" value={formData.location} onChange={handleInputChange} />
          </div>
          <div>
            <label>Description *</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} />
          </div>
          <div>
            <label>Storage Location</label>
            <select name="storageLocation" value={formData.storageLocation} onChange={handleInputChange}>
              <option value="Central Security Desk">Central Security Desk</option>
              <option value="Library Front Counter">Library Front Counter</option>
              <option value="Student Union Office">Student Union Office</option>
            </select>
          </div>
          <div>
            <Link href="/">Cancel</Link>
            <button type="submit">Publish Report</button>
          </div>
        </form>
      )}
    </main>
  )
}
