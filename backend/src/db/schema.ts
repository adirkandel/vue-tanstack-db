import { pgTable, text, boolean, timestamp } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const todos = pgTable('todos', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  completed: boolean('completed').default(false).notNull(),
  priority: text('priority', { enum: ['low', 'medium', 'high'] }).default('medium').notNull(),
  category: text('category'),
  dueDate: timestamp('due_date', { mode: 'date' }),
  assigneeId: text('assignee_id').references(() => assignees.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
})

export const assignees = pgTable('assignees', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
})

// Relations
export const todosRelations = relations(todos, ({ one }) => ({
  assignee: one(assignees, {
    fields: [todos.assigneeId],
    references: [assignees.id],
  }),
}))

export const assigneesRelations = relations(assignees, ({ many }) => ({
  todos: many(todos),
}))

// Type exports
export type Todo = typeof todos.$inferSelect
export type NewTodo = typeof todos.$inferInsert
export type Assignee = typeof assignees.$inferSelect
export type NewAssignee = typeof assignees.$inferInsert

