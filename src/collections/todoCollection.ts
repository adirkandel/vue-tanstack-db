import { createCollection } from '@tanstack/vue-db'
import { z } from 'zod'
import { queryCollectionOptions } from '@tanstack/query-db-collection'
import { queryClient } from '../queryClient'
import { todoApi } from '../api/todos'

export const todoSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  completed: z.boolean().default(false),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  category: z.string().optional(),
  dueDate: z.date().optional(),
  assigneeId: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Todo = z.infer<typeof todoSchema>

function createTodoCollection() {
  return createCollection(
    queryCollectionOptions({
      id: 'todos',
      queryClient: queryClient,
      queryKey: ['todos'],
      queryFn: async () => {
        return todoApi.getAll()
      },
      getKey: (todo: Todo) => todo.id,
      
      // Insert handler
      onInsert: async ({ transaction }) => {
        const mutation = transaction.mutations[0]
        await todoApi.create(mutation.modified)
      },
      
      // Update handler
      onUpdate: async ({ transaction }) => {
        const mutation = transaction.mutations[0]
        await todoApi.update(mutation.original.id, mutation.changes)
      },
      
      // Delete handler
      onDelete: async ({ transaction }) => {
        const mutation = transaction.mutations[0]
        await todoApi.delete(mutation.original.id)
      },
    })
  )
}

export const todoCollection = createTodoCollection()

