---
layout: statement
---

# 3️⃣ Optimistic Updates


---
layout: center-new
---

#### 👍 Update Pattern:

## Simple & Clean optimistic UI

<br />

```js
const handleToggle = async () => {
  await todoCollection.update(props.todo.id, (draft) => {
    draft.completed = !props.todo.completed
    draft.updatedAt = new Date()
  })
}
```

---
layout: center-new
---

#### ⚡ Compare to TanStack Query:

## Much Simpler
<br />

- ❌ No need for `onMutate`, `onError`, `onSettled`
- ❌ No manual cache invalidation
- ✅ Automatic optimistic UI
- ✅ Much less code
