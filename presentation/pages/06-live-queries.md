---
layout: statement
---

# 2️⃣ Live Queries


---
layout: center-new
---

#### 👍 Benefit:

## Automatic joins and updates on collections changes

<br />

```js
import { useLiveQuery } from '@tanstack/vue-db'
import { eq } from '@tanstack/db'

const { data: todos } = useLiveQuery((q) =>
  q
    .from({ todos: todoCollection })
    .join(
      { assignees: assigneeCollection },
      ({ todos, assignees }) => eq(todos.assigneeId, assignees.id),
      'left'
    )
    .select(({ todos, assignees }) => ({
      ...todos,
      assignee: assignees
    }))
)
```
