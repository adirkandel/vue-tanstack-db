---
layout: statement
---

# TanStack Query - Better Data Fetching
<br/>

## TanStack Query Improved Everything


---
layout: center-new
---

#### 👍 Benefit:

## Automatic Data Fetching & Caching

<br />

```vue
<script setup>
import { useQuery } from "@tanstack/vue-query";
import { todoApi } from "@/api/todos";

const { data: todos, isLoading, error } = useQuery({
  queryKey: ["todos"],
  queryFn: () => todoApi.getAll(),
});
</script>

<template>
  <div v-if="isLoading">Loading...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else>
    <div v-for="todo in todos" :key="todo.id">
      {{ todo.title }}
    </div>
  </div>
</template>
```

---
layout: center-new
---

#### 👎 Problem 1:

## Manual Joins

You have to manually combine data from multiple queries

<br />

```js
// Fetching assignees separately
const { data: assignees } = useQuery({
  queryKey: ["assignees"],
  queryFn: () => assigneeApi.getAll(),
});

// Manual enrichment needed
const enrichedTodos = computed(() => {
  return (
    todos.value?.map((todo) => ({
      ...todo,
      assignee: assignees.value?.find((a) => a.id === todo.assigneeId),
    })) || []
  );
});
```

---
layout: center-new
---

#### 👎 Problem 2:

## Complex Optimistic Updates

Requires lots of manual setup for each mutation

<br />

```js
const queryClient = useQueryClient();

const deleteMutation = useMutation({
  mutationFn: (id: string) => todoApi.delete(id),
  onMutate: async (id) => {
    await queryClient.cancelQueries({ queryKey: ["todos"] });
    const previousTodos = queryClient.getQueryData(["todos"]);
    queryClient.setQueryData(["todos"], (old) =>
      old.filter((todo) => todo.id !== id)
    );
    return { previousTodos };
  },
  onError: (err, id, context) => {
    queryClient.setQueryData(["todos"], context.previousTodos);
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ["todos"] });
  },
});
```

---
layout: statement
---

## There must be a better way...
