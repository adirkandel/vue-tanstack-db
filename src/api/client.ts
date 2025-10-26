import { serializeDates, deserializeDates } from './utils'

// Base API client configuration
const API_BASE_URL = '/api'

// Generic fetch wrapper with error handling
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }))
    throw new Error(error.error || `API request failed with status ${response.status}`)
  }

  const data = await response.json()
  
  // Deserialize dates from API response
  if (Array.isArray(data)) {
    return data.map(item => deserializeDates(item)) as T
  }
  return deserializeDates(data) as T
}

// GET request
export function apiGet<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'GET',
  })
}

// POST request
export function apiPost<T>(endpoint: string, data: any): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(serializeDates(data)),
  })
}

// PATCH request
export function apiPatch<T>(endpoint: string, data: any): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(serializeDates(data)),
  })
}

// DELETE request
export function apiDelete<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'DELETE',
  })
}

