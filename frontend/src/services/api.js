import axios from 'axios'

const FALLBACK_ITEMS = [
  {
    id: 1,
    item_type: 'found',
    name: 'Blue campus keychain',
    location: 'Library',
    category: 'Accessories',
    date: 'Yesterday',
    description: 'Small blue keychain with the university logo attached.',
  },
  {
    id: 2,
    item_type: 'lost',
    name: 'Student ID card',
    location: 'Cafeteria',
    category: 'Cards',
    date: 'Today',
    description: 'Red student ID card with a photo and student name.',
  },
  {
    id: 3,
    item_type: 'found',
    name: 'Wireless earbuds',
    location: 'Engineering building',
    category: 'Electronics',
    date: 'This week',
    description: 'White wireless earbuds in a charging case.',
  },
]

function normalizeApiBaseUrl(url) {
  if (!url) return undefined
  return url
    .replace(/host\.docker\.internal/gi, 'localhost')
    .replace(/https?:\/\/backend:8000/gi, 'http://localhost:8000')
    .replace(/https?:\/\/localhost:8000/gi, match => match.startsWith('https') ? 'https://localhost:8000' : 'http://localhost:8000')
}

function getDefaultApiBaseUrl() {
  if (typeof window === 'undefined') return 'http://localhost:8000'
  const protocol = window.location.protocol || 'http:'
  const hostname = window.location.hostname || 'localhost'

  // Only default to localhost when running locally.
  // On GitHub Pages or another public host, the backend must be configured explicitly.
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `${protocol}//${hostname}:8000`
  }

  return undefined
}

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()
const normalizedBaseUrl = normalizeApiBaseUrl(rawBaseUrl)
const BASE_URL = normalizedBaseUrl || getDefaultApiBaseUrl()

if (!BASE_URL && typeof window !== 'undefined') {
  console.warn(
    'No frontend API URL configured. Set VITE_API_BASE_URL for local builds or FRONTEND_API_URL in GitHub Actions to point to your deployed backend.'
  )
}

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
  if (!BASE_URL) {
    return FALLBACK_ITEMS
  }

  try {
    const response = await api.get('/items')
    return response.data
  } catch (err) {
    console.warn('Unable to fetch items from backend, showing fallback items.', err)
    return FALLBACK_ITEMS
  }
}

export async function createItem(data) {
  const response = await api.post('/items', data)
  // emit a storage event for other tabs/components to react
  if (typeof window !== 'undefined') {
    try { localStorage.setItem('__clf_last_action', JSON.stringify({type: 'item_created', time: Date.now()})) } catch (e) {}
  }
  return response.data
}

export async function fetchClaims() {
  if (!BASE_URL) {
    return []
  }

  try {
    const response = await api.get('/claims')
    return response.data
  } catch (err) {
    console.warn('Unable to fetch claims from backend.', err)
    return []
  }
}

export async function createClaim(data) {
  const response = await api.post('/claims', data)
  if (typeof window !== 'undefined') {
    try { localStorage.setItem('__clf_last_action', JSON.stringify({type: 'claim_created', time: Date.now()})) } catch (e) {}
  }
  return response.data
}
