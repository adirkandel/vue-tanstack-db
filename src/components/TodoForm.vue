<template>
  <Card class="w-full">
    <template #header>
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-xl font-semibold text-gray-900">Add New Todo</h3>
      </div>
    </template>
    <template #content>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Title -->
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <InputText
            id="title"
            v-model="form.title"
            placeholder="Enter todo title"
            required
            class="w-full"
          />
        </div>

        <!-- Priority -->
        <div>
          <label for="priority" class="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <Select
            id="priority"
            v-model="form.priority"
            :options="priorityOptions"
            option-value="value"
            option-label="label"
            placeholder="Select priority"
            class="w-full"
          />
        </div>

        <!-- Category -->
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <Select
            id="category"
            v-model="form.category"
            :options="categoryOptions"
            option-value="value"
            option-label="label"
            placeholder="Select category"
            :filter="true"
            :allow-empty="true"
            class="w-full"
          >
            <template #option="slotProps">
              <span>{{ slotProps.option.label }}</span>
            </template>
          </Select>
        </div>

        <!-- Due Date -->
        <div>
          <label for="dueDate" class="block text-sm font-medium text-gray-700 mb-2">
            Due Date
          </label>
          <DatePicker
            id="dueDate"
            v-model="form.dueDate"
            placeholder="Select date"
            show-time
            hour-format="12"
            class="w-full"
          />
        </div>

        <!-- Assignee -->
        <div>
          <label for="assignee" class="block text-sm font-medium text-gray-700 mb-2">
            Assignee
          </label>
          <div class="relative">
            <Select
              v-model="form.assigneeId"
              :options="assigneesOptionValuesWithAdd"
              option-value="id"
              option-label="name"
              placeholder="Select an assignee"
              :class="['w-full']"
              :filter="true"
              @change="handleAssigneeChange"
              @filter="handleAssigneeFilter"
            >
              <template #option="slotProps">
                <div class="flex items-center gap-2">
                  <AssigneeAvatar
                    :name="slotProps.option.name"
                    size="small"
                  />
                  <span>{{ slotProps.option.isNew ? `+ Add "${slotProps.option.name}"` : slotProps.option.name }}</span>
                </div>
              </template>
            </Select>
            <div v-if="selectedAssignee" class="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none">
              <AssigneeAvatar
                :name="selectedAssignee.name"
                size="small"
              />
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end">
          <Button type="submit" :disabled="!form.title.trim()">
            Add Todo
          </Button>
        </div>
      </form>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLiveQuery, createTransaction } from '@tanstack/vue-db'
import { Todo, todoCollection } from '../collections/todoCollection'
import { Assignee, assigneeCollection } from '../collections/assigneeCollection'
import Card from '../volt/Card.vue'
import Button from '../volt/Button.vue'
import InputText from '../volt/InputText.vue'
import Select from '../volt/Select.vue'
import DatePicker from '../volt/DatePicker.vue'
import AssigneeAvatar from './AssigneeAvatar.vue'
import { assigneeApi } from '@/api/assignees'
import { todoApi } from '@/api/todos'

const emit = defineEmits<{
  todoCreated: []
}>()

const form = ref({
  title: '',
  priority: 'medium' as 'low' | 'medium' | 'high',
  category: null as string | null,
  dueDate: null as Date | null,
  assigneeId: undefined as string | undefined,
})

const pendingAssigneeName = ref('')
const pendingAssignee = ref<{ id: string; name: string; createdAt: Date; updatedAt: Date } | null>(null)

// Priority options
const priorityOptions = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' }
]

// Common category options
const categoryOptions = [
  { label: 'Work', value: 'Work' },
  { label: 'Personal', value: 'Personal' },
  { label: 'Shopping', value: 'Shopping' },
  { label: 'Health', value: 'Health' },
  { label: 'Family', value: 'Family' },
  { label: 'Finance', value: 'Finance' },
  { label: 'Other', value: 'Other' }
]

// Fetch assignees
const { data: assignees } = useLiveQuery((q) =>
  q.from({ assignees: assigneeCollection })
)

// Include pending assignee in the list for display purposes
const allAssignees = computed(() => {
  if (!assignees.value) return []
  if (pendingAssignee.value) {
    return [...assignees.value, pendingAssignee.value]
  }
  return assignees.value
})

const selectedAssignee = computed(() => {
  if (!form.value.assigneeId) return null
  return allAssignees.value.find(a => a.id === form.value.assigneeId) || null
})

const assigneesOptionValues = computed(() => {
  return allAssignees.value.map(a => ({ id: a.id, name: a.name }))
})

const assigneesOptionValuesWithAdd = computed(() => {
  const options = assigneesOptionValues.value
  if (pendingAssigneeName.value && pendingAssigneeName.value.trim() && !pendingAssignee.value) {
    // Check if the pending name already exists
    const exists = options.some(opt => 
      opt.name.toLowerCase() === pendingAssigneeName.value.toLowerCase()
    )
    if (!exists) {
      return [
        ...options,
        { id: `add-${pendingAssigneeName.value}`, name: pendingAssigneeName.value, isNew: true }
      ]
    }
  }
  return options
})

const handleAssigneeFilter = (event: any) => {
  if (event.value) {
    pendingAssigneeName.value = event.value
  }
}

const handleAssigneeChange = (event: any) => {
  const newValue = event.value
  // Check if it's an "add" action
  if (newValue && typeof newValue === 'string' && newValue.startsWith('add-')) {
    const nameToAdd = newValue.replace('add-', '')
    
    // Store the pending assignee to be created along with the todo
    const now = new Date()
    const newAssignee = {
      id: `assignee-${Date.now()}`,
      name: nameToAdd.trim(),
      createdAt: now,
      updatedAt: now,
    }

    pendingAssignee.value = newAssignee
    
    // Select the newly created assignee ID
    form.value.assigneeId = newAssignee.id
    pendingAssigneeName.value = ''
  }
}

const handleSubmit = async () => {
  if (!form.value.title.trim()) {
    return
  }

  try {
    // Create a transaction that batches both assignee and todo creation
    const tx = createTransaction({
      mutationFn: async ({ transaction }) => {
        for (const mutation of transaction.mutations) {
          switch (mutation.collection.id) {
            case 'assignees':
              await assigneeApi.create(mutation.modified as Assignee)
              break
            case 'todos':
              await todoApi.create(mutation.modified as Todo)
              break
            default:
              break
          }
        }
      },
    })

    // Perform mutations within the transaction
    tx.mutate(() => {
      // First, insert the pending assignee if it exists
      if (pendingAssignee.value) {
        assigneeCollection.insert(pendingAssignee.value)
      }

      // Then, insert the todo
      const now = new Date()
      const todo = {
        id: `todo-${Date.now()}`,
        title: form.value.title.trim(),
        completed: false,
        priority: form.value.priority,
        category: form.value.category || undefined,
        dueDate: form.value.dueDate ? new Date(form.value.dueDate) : undefined,
        assigneeId: form.value.assigneeId,
        createdAt: now,
        updatedAt: now,
      }

      todoCollection.insert(todo)
    })

    // Wait for the transaction to complete
    await tx.isPersisted.promise

    // Clear pending assignee after successful submission
    if (pendingAssignee.value) {
      pendingAssignee.value = null
    }

    // Reset form
    form.value = {
      title: '',
      priority: 'medium',
      category: null,
      dueDate: null,
      assigneeId: undefined,
    }

    emit('todoCreated')
  } catch (error) {
    console.error('Error creating todo:', error)
  }
}
</script>
