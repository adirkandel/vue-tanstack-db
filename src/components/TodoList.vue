<template>
  <div class="space-y-4">
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-12 text-gray-500">
      Loading todos...
    </div>

    <!-- Empty State -->
    <div
      v-else-if="filteredTodos.length === 0"
      class="text-center py-12 text-gray-500"
    >
      <svg
        class="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No todos</h3>
      <p class="mt-1 text-sm text-gray-500">
        Get started by creating a new todo.
      </p>
    </div>

    <!-- Todo Items -->
    <TodoItem
      v-for="todo in sortedTodos"
      :key="todo.id"
      :todo="todo"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLiveQuery } from '@tanstack/vue-db'
import { eq } from '@tanstack/db'
import { todoCollection } from '../collections/todoCollection'
import { assigneeCollection } from '../collections/assigneeCollection'
import TodoItem from './TodoItem.vue'

const props = defineProps<{
  statusFilter: 'all' | 'active' | 'completed'
  priorityFilter: 'all' | 'low' | 'medium' | 'high'
  categoryFilter: string
  searchQuery: string
  sortBy: 'date' | 'priority' | 'alphabetical'
}>()

// Use live query with join to get todos with assignee data
const { data: todos, isLoading } = useLiveQuery((q) =>
  q
    .from({ todos: todoCollection })
    .join(
      { assignees: assigneeCollection },
      ({ todos, assignees }) => eq(todos.assigneeId, assignees.id),
      'left'
    )
    .select(({ todos, assignees }) => ({
      ...todos,
      assignee: assignees
    }))
)

// Apply filters
const filteredTodos = computed(() => {
  let result = todos.value

  // Status filter
  if (props.statusFilter === 'active') {
    result = result.filter((t) => !t.completed)
  } else if (props.statusFilter === 'completed') {
    result = result.filter((t) => t.completed)
  }

  // Priority filter
  if (props.priorityFilter !== 'all') {
    result = result.filter((t) => t.priority === props.priorityFilter)
  }

  // Category filter
  if (props.categoryFilter) {
    result = result.filter((t) => t.category === props.categoryFilter)
  }

  // Search filter
  if (props.searchQuery) {
    const query = props.searchQuery.toLowerCase()
    result = result.filter((t) => t.title.toLowerCase().includes(query))
  }

  return result
})

// Apply sorting
const sortedTodos = computed(() => {
  const result = [...filteredTodos.value]

  // First, sort based on user selection
  let sorted
  switch (props.sortBy) {
    case 'priority':
      // High -> Medium -> Low
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      sorted = result.sort(
        (a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]
      )
      break
    case 'alphabetical':
      sorted = result.sort((a, b) => a.title.localeCompare(b.title))
      break
    case 'date':
    default:
      // Most recent first
      sorted = result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      break
  }

  // Then move completed todos to the end while preserving order
  return sorted.sort((a, b) => {
    // If both are completed or both are not completed, maintain order (return 0)
    if (a.completed === b.completed) return 0
    // If a is completed and b is not, move a to end
    if (a.completed) return 1
    // If b is completed and a is not, move b to end
    return -1
  })
})
</script>


