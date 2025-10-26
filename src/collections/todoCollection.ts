import { createCollection } from '@tanstack/vue-db'
import { localStorageCollectionOptions } from '@tanstack/vue-db'
import { z } from 'zod'

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

// Function to create todo collection using localStorage
function createTodoCollection() {
  return createCollection(
    localStorageCollectionOptions({
      id: 'todos',
      storageKey: 'todos',
      getKey: (todo: Todo) => todo.id,
      onInsert: async ({ transaction }) => {
        const mutation = transaction.mutations[0];
        console.log('Todo inserted:', mutation.modified);
        // localStorage persistence is handled automatically
      },
      onUpdate: async ({ transaction }) => {
        const mutation = transaction.mutations[0];
        console.log('Todo updated:', mutation.original.id, mutation.changes);
        // localStorage persistence is handled automatically
      },
      onDelete: async ({ transaction }) => {
        const mutation = transaction.mutations[0];
        console.log('Todo deleted:', mutation.original.id);
        // localStorage persistence is handled automatically
      }
    })
  )
}

export const todoCollection = createTodoCollection()

