---
layout: statement
---

# TanStack DB

---
layout: statement
---

# 1️⃣ Collections


---
layout: center-new
---

#### 👍 Benefit 1:

## Type-Safe Schema with Zod

<br />

```typescript
import { z } from "zod";

export const todoSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  completed: z.boolean().default(false),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  category: z.string().optional(),
  dueDate: z.date().optional(),
  assigneeId: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Todo = z.infer<typeof todoSchema>;
```

---
layout: center-new
---

#### 👍 Benefit 2:

## Automatic Sync to Server

```typescript
import { createCollection } from "@tanstack/vue-db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";

function createTodoCollection() {
  return createCollection(
    queryCollectionOptions({
      id: "todos",
      queryClient: queryClient,
      queryKey: ["todos"],
      queryFn: async () => todoApi.getAll(),
      getKey: (todo: Todo) => todo.id,

      // Automatic sync handlers
      onInsert: async ({ transaction }) => {
        await todoApi.create(transaction.mutations[0].modified);
      },
      onUpdate: async ({ transaction }) => {
        const mutation = transaction.mutations[0];
        await todoApi.update(mutation.original.id, mutation.changes);
      },
      onDelete: async ({ transaction }) => {
        await todoApi.delete(transaction.mutations[0].original.id);
      },
    })
  );
}
```

<style>
  .slidev-code {
    --slidev-code-font-size: 10.5px;
    --slidev-code-line-height: 1.5;
  }
</style>

