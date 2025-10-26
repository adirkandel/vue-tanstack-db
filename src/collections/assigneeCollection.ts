import { createCollection } from '@tanstack/vue-db'
import { localStorageCollectionOptions } from '@tanstack/vue-db'
import { z } from 'zod'
import { todoCollection } from './todoCollection'

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

// Function to create assignee collection using localStorage
function createAssigneeCollection() {
  return createCollection(
    localStorageCollectionOptions({
      id: 'assignees',
      storageKey: 'assignees',
      getKey: (assignee: Assignee) => assignee.id,
      onInsert: async ({ transaction }) => {
        const mutation = transaction.mutations[0];
        console.log('Assignee inserted:', mutation.modified);
      },
      onUpdate: async ({ transaction }) => {
        const mutation = transaction.mutations[0];
        console.log('Assignee updated:', mutation.original.id, mutation.changes);
      },
      onDelete: async ({ transaction }) => {
        const mutation = transaction.mutations[0];
        const deletedAssigneeId = mutation.original.id;
        console.log('Assignee deleted:', deletedAssigneeId);
        
        // Delete all todos assigned to this assignee
        const todosToDelete = Array.from(todoCollection.state.entries())
          .filter(([_, todo]) => todo.assigneeId === deletedAssigneeId)
          .map(([id]) => ({ id }));

        if (todosToDelete.length > 0) {
          console.log(`Deleting ${todosToDelete.length} todo(s) assigned to deleted assignee`);
          await Promise.all(todosToDelete.map(todo => todoCollection.delete(todo.id)));
        }
      }
    })
  )
}

export const assigneeCollection = createAssigneeCollection()

