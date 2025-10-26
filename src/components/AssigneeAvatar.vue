<template>
  <div
    :class="[
      'rounded-full flex items-center justify-center text-white font-semibold',
      colorClass,
      sizeClasses[size]
    ]"
    :title="name"
  >
    {{ initials }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getInitials, getColorFromName } from '../collections/assigneeCollection'

const props = withDefaults(
  defineProps<{
    name: string
    size?: 'small' | 'medium' | 'large'
  }>(),
  {
    size: 'medium'
  }
)

const sizeClasses = {
  small: 'w-6 h-6 text-xs',
  medium: 'w-10 h-10 text-sm',
  large: 'w-16 h-16 text-xl'
}

const initials = computed(() => getInitials(props.name))
const colorClass = computed(() => getColorFromName(props.name))
</script>

