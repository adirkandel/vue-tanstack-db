<template>
  <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
    <div class="flex items-start gap-4">
      <!-- Checkbox -->
      <input
        type="checkbox"
        :checked="todo.completed"
        @change="handleToggle"
        class="mt-1 h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
      />

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <!-- Title and Actions -->
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1">
            <h3
              class="text-lg font-medium"
              :class="todo.completed ? 'line-through text-gray-500' : 'text-gray-900'"
            >
              {{ todo.title }}
            </h3>
          </div>
          <div class="flex gap-2">
            <SecondaryButton @click="handleEdit" class="text-xs">
              {{ editing ? 'Save' : 'Edit' }}
            </SecondaryButton>
            <SecondaryButton @click="handleDelete" class="text-xs text-red-600 hover:text-red-700">
              Delete
            </SecondaryButton>
          </div>
        </div>

        <!-- Metadata -->
        <div class="flex flex-wrap items-center gap-3 mt-3">
          <!-- Assignee Avatar -->
          <div v-if="(todo as any).assignee">
            <AssigneeAvatar
              :name="(todo as any).assignee.name"
              size="small"
              class="cursor-pointer"
              :title="(todo as any).assignee.name"
            />
          </div>
        
          <!-- Priority Badge -->
          <span
            class="px-2 py-1 rounded-full text-xs font-medium"
            :class="{
              'bg-red-100 text-red-800': todo.priority === 'high',
              'bg-yellow-100 text-yellow-800': todo.priority === 'medium',
              'bg-green-100 text-green-800': todo.priority === 'low',
            }"
          >
            {{ todo.priority }}
          </span>

          <!-- Category -->
          <span
            v-if="todo.category"
            class="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
          >
            {{ todo.category }}
          </span>

          <!-- Due Date -->
          <span
            v-if="todo.dueDate"
            class="px-2 py-1 rounded-full text-xs font-medium"
            :class="{
              'bg-red-100 text-red-800': isOverdue,
              'bg-gray-100 text-gray-800': !isOverdue,
            }"
          >
            Due: {{ formatDate(todo.dueDate) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Edit Mode -->
    <div v-if="editing" class="mt-4 pt-4 border-t border-gray-200">
      <form @submit.prevent="handleSaveEdit" class="space-y-3">
        <div class="grid grid-cols-4 gap-3">
          <InputText
            v-model="editForm.title"
            placeholder="Title"
            required
            class="w-full"
          />
          <Select
            v-model="editForm.priority"
            :options="priorityOptions"
            option-value="value"
            option-label="label"
            placeholder="Select priority"
            class="w-full"
          />
          <Select
            v-model="editForm.category"
            :options="categoryOptions"
            option-value="value"
            option-label="label"
            placeholder="Select category"
            :filter="true"
            :allow-empty="true"
            class="w-full"
          />
          <DatePicker
            v-model="editForm.dueDate"
            placeholder="Select date"
            show-time
            hour-format="12"
            class="w-full"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { todoCollection } from '../collections/todoCollection'
import type { Todo } from '../collections/todoCollection'
import SecondaryButton from '../volt/SecondaryButton.vue'
import InputText from '../volt/InputText.vue'
import Select from '../volt/Select.vue'
import DatePicker from '../volt/DatePicker.vue'
import AssigneeAvatar from './AssigneeAvatar.vue'

const props = defineProps<{
  todo: Todo
}>()

const editing = ref(false)
const editForm = ref({
  title: '',
  priority: 'medium' as 'low' | 'medium' | 'high',
  category: null as string | null,
  dueDate: null as Date | null,
})

// Priority options
const priorityOptions = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' }
]

// Category options
const categoryOptions = [
  { label: 'Work', value: 'Work' },
  { label: 'Personal', value: 'Personal' },
  { label: 'Shopping', value: 'Shopping' },
  { label: 'Health', value: 'Health' },
  { label: 'Family', value: 'Family' },
  { label: 'Finance', value: 'Finance' },
  { label: 'Other', value: 'Other' }
]

const isOverdue = computed(() => {
  if (!props.todo.dueDate) return false
  return new Date(props.todo.dueDate) < new Date() && !props.todo.completed
})

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const handleToggle = async () => {
  await todoCollection.update(props.todo.id, (draft) => {
    draft.completed = !props.todo.completed
    draft.updatedAt = new Date()
  })
}

const handleEdit = () => {
  if (editing.value) {
    handleSaveEdit()
  } else {
    editing.value = true
    editForm.value = {
      title: props.todo.title,
      priority: props.todo.priority,
      category: props.todo.category || null,
      dueDate: props.todo.dueDate ? new Date(props.todo.dueDate) : null,
    }
  }
}

const handleSaveEdit = async () => {
  if (!editForm.value.title.trim()) {
    editing.value = false
    return
  }

  await todoCollection.update(props.todo.id, (draft) => {
    draft.title = editForm.value.title.trim()
    draft.priority = editForm.value.priority
    draft.category = editForm.value.category || undefined
    draft.dueDate = editForm.value.dueDate || undefined
    draft.updatedAt = new Date()
  })

  editing.value = false
}

const handleDelete = async () => {
  if (confirm('Are you sure you want to delete this todo?')) {
    await todoCollection.delete(props.todo.id)
  }
}
</script>


