<template>
  <div class="home min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Todo App</h1>
            <p class="mt-1 text-sm text-gray-600">
              Manage your tasks with categories, priorities, and due dates
            </p>
          </div>
          <router-link to="/assignees">
            <SecondaryButton>Manage Assignees</SecondaryButton>
          </router-link>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Side: Filters + Stats + Todo List -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Filters -->
          <TodoFilters
            v-model:status-filter="filters.status"
            v-model:priority-filter="filters.priority"
            v-model:category-filter="filters.category"
            v-model:search-query="filters.search"
            v-model:sort-by="filters.sortBy"
          />

          <!-- Stats -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <template #content>
                <div class="text-center">
                  <div class="text-3xl font-bold text-primary">{{ totalTodos }}</div>
                  <div class="text-sm text-gray-600 mt-1">Total Todos</div>
                </div>
              </template>
            </Card>
            <Card>
              <template #content>
                <div class="text-center">
                  <div class="text-3xl font-bold text-yellow-600">{{ activeTodos }}</div>
                  <div class="text-sm text-gray-600 mt-1">Active</div>
                </div>
              </template>
            </Card>
            <Card>
              <template #content>
                <div class="text-center">
                  <div class="text-3xl font-bold text-green-600">{{ completedTodos }}</div>
                  <div class="text-sm text-gray-600 mt-1">Completed</div>
                </div>
              </template>
            </Card>
          </div>

          <!-- Todo List -->
          <div>
            <h2 class="text-xl font-semibold text-gray-900 mb-6">
              Your Todos
            </h2>
            <TodoList
              :status-filter="filters.status"
              :priority-filter="filters.priority"
              :category-filter="filters.category"
              :search-query="filters.search"
              :sort-by="filters.sortBy"
            />
          </div>
        </div>

        <!-- Right Side: Add Todo Form -->
        <div class="lg:col-span-1">
          <div class="sticky top-8">
            <TodoForm @todo-created="handleTodoCreated" />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLiveQuery } from '@tanstack/vue-db'
import { todoCollection } from '../collections/todoCollection'
import TodoForm from '../components/TodoForm.vue'
import TodoFilters from '../components/TodoFilters.vue'
import TodoList from '../components/TodoList.vue'
import Card from '../volt/Card.vue'
import SecondaryButton from '../volt/SecondaryButton.vue'

const filters = ref({
  status: 'all' as 'all' | 'active' | 'completed',
  priority: 'all' as 'all' | 'low' | 'medium' | 'high',
  category: '',
  search: '',
  sortBy: 'date' as 'date' | 'priority' | 'alphabetical',
})

// Use live query for reactive todo list
const { data: todos } = useLiveQuery((q) =>
  q.from({ todos: todoCollection })
)

const totalTodos = computed(() => todos.value.length)
const activeTodos = computed(() =>
  todos.value.filter((t) => !t.completed).length
)
const completedTodos = computed(() =>
  todos.value.filter((t) => t.completed).length
)

const handleTodoCreated = () => {
  console.log('Todo created successfully')
}
</script>
