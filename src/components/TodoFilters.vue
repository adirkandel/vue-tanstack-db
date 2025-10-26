<template>
  <Card class="w-full">
    <template #content>
      <div>
        <!-- Filters Row -->
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <!-- Search -->
          <div>
            <label for="search" class="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <InputText
              id="search"
              v-model="localSearchQuery"
              placeholder="Search todos..."
              class="w-full"
            />
          </div>
          <!-- Status Filter -->
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <Select
              id="status"
              v-model="localStatusFilter"
              :options="statusOptions"
              option-value="value"
              option-label="label"
              placeholder="Select status"
              class="w-full"
            />
          </div>

          <!-- Priority Filter -->
          <div>
            <label for="priority" class="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <Select
              id="priority"
              v-model="localPriorityFilter"
              :options="priorityOptions"
              option-value="value"
              option-label="label"
              placeholder="Select priority"
              class="w-full"
            />
          </div>

          <!-- Category Filter -->
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <Select
              id="category"
              v-model="localCategoryFilter"
              :options="categoryOptions"
              option-value="value"
              option-label="label"
              placeholder="Select category"
              :allow-empty="true"
              class="w-full"
            />
          </div>

          <!-- Sort -->
          <div>
            <label for="sort" class="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <Select
              id="sort"
              v-model="localSortBy"
              :options="sortOptions"
              option-value="value"
              option-label="label"
              placeholder="Select sort"
              class="w-full"
            />
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLiveQuery } from '@tanstack/vue-db'
import { todoCollection } from '../collections/todoCollection'
import Card from '../volt/Card.vue'
import InputText from '../volt/InputText.vue'
import Select from '../volt/Select.vue'

const props = defineProps<{
  statusFilter: string
  priorityFilter: string
  categoryFilter: string
  searchQuery: string
  sortBy: string
}>()

const emit = defineEmits<{
  'update:statusFilter': [value: string]
  'update:priorityFilter': [value: string]
  'update:categoryFilter': [value: string]
  'update:searchQuery': [value: string]
  'update:sortBy': [value: string]
}>()

// Local state with watchers to emit updates
const localStatusFilter = computed({
  get: () => props.statusFilter,
  set: (value) => emit('update:statusFilter', value),
})

const localPriorityFilter = computed({
  get: () => props.priorityFilter,
  set: (value) => emit('update:priorityFilter', value),
})

const localCategoryFilter = computed({
  get: () => props.categoryFilter,
  set: (value) => emit('update:categoryFilter', value),
})

const localSearchQuery = computed({
  get: () => props.searchQuery,
  set: (value) => emit('update:searchQuery', value),
})

const localSortBy = computed({
  get: () => props.sortBy,
  set: (value) => emit('update:sortBy', value),
})

// Status options
const statusOptions = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' }
]

// Priority options
const priorityOptions = [
  { label: 'All', value: 'all' },
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' }
]

// Sort options
const sortOptions = [
  { label: 'Date', value: 'date' },
  { label: 'Priority', value: 'priority' },
  { label: 'Alphabetical', value: 'alphabetical' }
]

// Fetch unique categories from collection using live query
const { data: todos } = useLiveQuery((q) =>
  q.from({ todos: todoCollection })
)
const categories = computed(() => {
  const cats = new Set(
    todos.value
      .map((t) => t.category)
      .filter((c): c is string => !!c)
  )
  return Array.from(cats).sort()
})

// Category options with "All" option
const categoryOptions = computed(() => {
  return [
    { label: 'All', value: '' },
    ...categories.value.map(cat => ({ label: cat, value: cat }))
  ]
})
</script>


