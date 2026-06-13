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
