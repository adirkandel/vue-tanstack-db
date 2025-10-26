import { apiGet, apiPost, apiPatch, apiDelete } from './client'
import { Assignee } from '../collections/assigneeCollection'

const ENDPOINT = '/assignees'

export const assigneeApi = {
  // Get all assignees
  getAll: () => apiGet<Assignee[]>(ENDPOINT),

  // Get single assignee by ID
  getById: (id: string) => apiGet<Assignee>(`${ENDPOINT}/${id}`),

  // Create a new assignee
  create: (assignee: Omit<Assignee, 'id' | 'createdAt' | 'updatedAt'> & Partial<Pick<Assignee, 'createdAt' | 'updatedAt'>>) =>
    apiPost<Assignee>(ENDPOINT, assignee),

  // Update an assignee
  update: (id: string, changes: Partial<Assignee>) =>
    apiPatch<Assignee>(`${ENDPOINT}/${id}`, changes),

  // Delete an assignee
  delete: (id: string) => apiDelete<{ success: boolean }>(`${ENDPOINT}/${id}`),
}

