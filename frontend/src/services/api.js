import axios from 'axios'

// Axios instance for frontend API calls to the backend.
export const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add API helpers for authentication, items, and claims here.
