import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

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
