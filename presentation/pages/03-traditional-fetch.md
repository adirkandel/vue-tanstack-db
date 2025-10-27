---
layout: statement
---

<img src="/assets/me-and-tanner.png" />

---
layout: statement
---

# The Challenges of Traditional Data Fetching
<br/>

## Before TanStack Query

---
layout: center-new
---

#### 👎 Problem 1:

## Manual State Management

<br />

```vue
<script setup>
import { ref } from "vue";

const todos = ref([]);
const loading = ref(false);
const error = ref(null);
</script>
```

---
layout: center-new
---

#### 👎 Problem 2:

## Complex Fetch Logic

<br>


```js
const fetchTodos = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await fetch("/api/todos");
    if (!response.ok) {
      throw new Error("Failed to fetch todos");
    }
    const data = await response.json();
    todos.value = data;
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};
```

---
layout: center-new
---

#### 👎 Problem 3:

## Manual Lifecycle Management


<br />

```vue
<script>
import { onMounted } from "vue";

// Have to manually trigger on mount
onMounted(() => {
  fetchTodos();
});
</script>
```
