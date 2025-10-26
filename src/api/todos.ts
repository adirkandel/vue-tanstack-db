import { apiGet, apiPost, apiPatch, apiDelete } from './client'
import { Todo } from '../collections/todoCollection'

const ENDPOINT = '/todos'

export const todoApi = {
  // Get all todos
  getAll: () => apiGet<Todo[]>(ENDPOINT),

  // Get single todo by ID
  getById: (id: string) => apiGet<Todo>(`${ENDPOINT}/${id}`),

  // Create a new todo
  create: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'> & Partial<Pick<Todo, 'createdAt' | 'updatedAt'>>) =>
    apiPost<Todo>(ENDPOINT, todo),

  // Update a todo
  update: (id: string, changes: Partial<Todo>) =>
    apiPatch<Todo>(`${ENDPOINT}/${id}`, changes),

  // Delete a todo
  delete: (id: string) => apiDelete<{ success: boolean }>(`${ENDPOINT}/${id}`),
}

