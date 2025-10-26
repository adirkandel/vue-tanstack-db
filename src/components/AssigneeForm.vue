<template>
  <Card class="w-full">
    <template #header>
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-xl font-semibold text-gray-900">Add New Assignee</h3>
      </div>
    </template>
    <template #content>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Name -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
            Name *
          </label>
          <InputText
            id="name"
            v-model="form.name"
            placeholder="Enter assignee name"
            required
            class="w-full"
          />
        </div>

        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <InputText
            id="email"
            v-model="form.email"
            type="email"
            placeholder="Enter email (optional)"
            class="w-full"
          />
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end">
          <Button type="submit" :disabled="!form.name.trim()">
            Add Assignee
          </Button>
        </div>
      </form>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { assigneeCollection } from '../collections/assigneeCollection'
import Card from '../volt/Card.vue'
import Button from '../volt/Button.vue'
import InputText from '../volt/InputText.vue'

const emit = defineEmits<{
  assigneeCreated: []
}>()

const form = ref({
  name: '',
  email: '',
})

const handleSubmit = async () => {
  if (!form.value.name.trim()) {
    return
  }

  const now = new Date()
  const assignee = {
    id: `assignee-${Date.now()}`,
    name: form.value.name.trim(),
    email: form.value.email.trim() || undefined,
    createdAt: now,
    updatedAt: now,
  }

  // Insert assignee into collection
  await assigneeCollection.insert(assignee)

  // Reset form
  form.value = {
    name: '',
    email: '',
  }

  emit('assigneeCreated')
}
</script>

