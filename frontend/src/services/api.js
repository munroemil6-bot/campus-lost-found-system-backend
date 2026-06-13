import axios from 'axios'

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
  return `${protocol}//${hostname}:8000`
}

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL
const normalizedBaseUrl = normalizeApiBaseUrl(rawBaseUrl)
const BASE_URL = normalizedBaseUrl || getDefaultApiBaseUrl()

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
  // emit a storage event for other tabs/components to react
  if (typeof window !== 'undefined') {
    try { localStorage.setItem('__clf_last_action', JSON.stringify({type: 'item_created', time: Date.now()})) } catch (e) {}
  }
  return response.data
}

export async function fetchClaims() {
  const response = await api.get('/claims')
  return response.data
}

export async function createClaim(data) {
  const response = await api.post('/claims', data)
  if (typeof window !== 'undefined') {
    try { localStorage.setItem('__clf_last_action', JSON.stringify({type: 'claim_created', time: Date.now()})) } catch (e) {}
  }
  return response.data
}
