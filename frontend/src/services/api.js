import axios from 'axios'

function normalizeApiBaseUrl(url) {
  if (!url) return url
  return url
    .replace('host.docker.internal', 'localhost')
    .replace('http://backend:8000', 'http://localhost:8000')
    .replace('https://backend:8000', 'https://localhost:8000')
}

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL
const normalizedBaseUrl = normalizeApiBaseUrl(rawBaseUrl)
const BASE_URL = normalizedBaseUrl
  || (typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:8000` : 'http://localhost:8000')

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// expose the resolved API base URL in the browser for debugging
if (typeof window !== 'undefined') {
  try {
    window.__CLF_API_BASE = BASE_URL
  } catch (e) {
    /* ignore */
  }
}

export async function registerUser(data) {
  const response = await api.post('/auth/register', data)
  return response.data
}

export async function loginUser(data) {
  const response = await api.post('/auth/login', data)
  return response.data
}

export async function fetchItems() {
  const response = await api.get('/items')
  return response.data
}

export async function createItem(data) {
  const response = await api.post('/items', data)
  return response.data
}

export async function fetchClaims() {
  const response = await api.get('/claims')
  return response.data
}

export async function createClaim(data) {
  const response = await api.post('/claims', data)
  return response.data
}
