ס<template>
  <div class="assignees min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Assignees</h1>
            <p class="mt-1 text-sm text-gray-600">
              Manage people who can be assigned to todos
            </p>
          </div>
          <router-link to="/">
            <SecondaryButton>Back to Todos</SecondaryButton>
          </router-link>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Side: Assignee List -->
        <div class="lg:col-span-2">
          <div>
            <h2 class="text-xl font-semibold text-gray-900 mb-6">
              All Assignees
            </h2>
            <AssigneeList />
          </div>
        </div>

        <!-- Right Side: Add Assignee Form -->
        <div class="lg:col-span-1">
          <div class="sticky top-8">
            <AssigneeForm @assignee-created="handleAssigneeCreated" />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import AssigneeForm from '../components/AssigneeForm.vue'
import AssigneeList from '../components/AssigneeList.vue'
import SecondaryButton from '../volt/SecondaryButton.vue'

const handleAssigneeCreated = () => {
  console.log('Assignee created successfully')
}
</script>

