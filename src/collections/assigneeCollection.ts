import { createCollection } from '@tanstack/vue-db'
import { z } from 'zod'
import { queryCollectionOptions } from '@tanstack/query-db-collection'
import { queryClient } from '../queryClient'
import { assigneeApi } from '../api/assignees'

export const assigneeSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Assignee = z.infer<typeof assigneeSchema>

// Helper function to generate initials from name
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase()
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

// Helper function to generate consistent color from name
export function getColorFromName(name: string): string {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-orange-500',
    'bg-cyan-500',
  ]
  
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  return colors[Math.abs(hash) % colors.length]
}

function createAssigneeCollection() {
  return createCollection(
    queryCollectionOptions({
      id: 'assignees',
      queryClient: queryClient,
      queryKey: ['assignees'],
      queryFn: async () => {
        return assigneeApi.getAll()
      },
      getKey: (assignee: Assignee) => assignee.id,
      
      // Insert handler
      onInsert: async ({ transaction }) => {
        const mutation = transaction.mutations[0]
        await assigneeApi.create(mutation.modified)
      },
      
      // Update handler
      onUpdate: async ({ transaction }) => {
        const mutation = transaction.mutations[0]
        await assigneeApi.update(mutation.original.id, mutation.changes)
      },
      
      // Delete handler - cascade deletes handled by database foreign key
      onDelete: async ({ transaction }) => {
        const mutation = transaction.mutations[0]
        await assigneeApi.delete(mutation.original.id)
      },
    })
  )
}

export const assigneeCollection = createAssigneeCollection()

