<template>
  <div class="space-y-4">
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-12 text-gray-500">
      Loading assignees...
    </div>

    <!-- Empty State -->
    <div
      v-else-if="assignees.length === 0"
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
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No assignees</h3>
      <p class="mt-1 text-sm text-gray-500">
        Get started by creating a new assignee.
      </p>
    </div>

    <!-- Assignee Items -->
    <div
      v-for="assignee in assignees"
      :key="assignee.id"
      class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <AssigneeAvatar :name="assignee.name" size="medium" />
          <div>
            <h3 class="text-lg font-medium text-gray-900">
              {{ assignee.name }}
            </h3>
            <p v-if="assignee.email" class="text-sm text-gray-600">
              {{ assignee.email }}
            </p>
          </div>
        </div>
        <SecondaryButton
          @click="handleDelete(assignee.id)"
          class="text-xs text-red-600 hover:text-red-700"
        >
          Delete
        </SecondaryButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLiveQuery } from '@tanstack/vue-db'
import { assigneeCollection } from '../collections/assigneeCollection'
import AssigneeAvatar from './AssigneeAvatar.vue'
import SecondaryButton from '../volt/SecondaryButton.vue'

const { data: assignees, isLoading } = useLiveQuery((q) =>
  q.from({ assignees: assigneeCollection })
)

const handleDelete = async (id: string) => {
  if (confirm('Are you sure you want to delete this assignee?')) {
    await assigneeCollection.delete(id)
  }
}
</script>

