---
layout: statement
---

#  4️⃣ Transactions

---
layout: two-cols
---

#### 💡 Real Example:

## Commit and Rollback

- **Atomic**: All changes succeed or all fail together
- **Rollback**: Automatic rollback if any operation fails
- **Multi-collection**: Update multiple collections atomically
- **Consistent state**: No partial updates

## Perfect For

- Creating related entities (todo + assignee)
- Deleting with cascade operations
- Complex multi-step updates

::right::

```js
const handleSubmit = async () => {
  // Create transaction for atomic operations
  const tx = createTransaction({
    mutationFn: async ({ transaction }) => {
      // Apply all changes to server
      for (const mutation of transaction.mutations) {
        switch (mutation.collection.id) {
          case 'assignees':
            await assigneeApi.create(mutation.modified)
            break
          case 'todos':
            await todoApi.create(mutation.modified)
            break
        }
      }
    },
  })

  // Perform mutations within transaction
  tx.mutate(() => {
    if (pendingAssignee.value) {
      assigneeCollection.insert(pendingAssignee.value)
    }
    todoCollection.insert(todo)
  })

  await tx.isPersisted.promise
  // await tx.commit() -> manual submit
}
```

<style>
  .slidev-code {
    --slidev-code-font-size: 10.5px;
    --slidev-code-line-height: 1.5;
  }
</style>
