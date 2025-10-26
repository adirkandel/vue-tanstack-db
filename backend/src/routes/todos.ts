import { Router } from 'express'
import { db } from '../db/index.js'
import { todos } from '../db/schema.js'
import { eq } from 'drizzle-orm'

const router = Router()

// GET /api/todos - Get all todos
router.get('/', async (req, res) => {
  try {
    const result = await db.select().from(todos)
    res.json(result)
  } catch (error) {
    console.error('Error fetching todos:', error)
    res.status(500).json({ error: 'Failed to fetch todos' })
  }
})

// GET /api/todos/:id - Get single todo
router.get('/:id', async (req, res) => {
  try {
    const result = await db.select().from(todos).where(eq(todos.id, req.params.id))
    if (result.length === 0) {
      return res.status(404).json({ error: 'Todo not found' })
    }
    res.json(result[0])
  } catch (error) {
    console.error('Error fetching todo:', error)
    res.status(500).json({ error: 'Failed to fetch todo' })
  }
})

// POST /api/todos - Create todo
router.post('/', async (req, res) => {
  try {
    const todoData = {
      ...req.body,
      dueDate: req.body.dueDate ? new Date(req.body.dueDate) : undefined,
      createdAt: req.body.createdAt ? new Date(req.body.createdAt) : new Date(),
      updatedAt: req.body.updatedAt ? new Date(req.body.updatedAt) : new Date(),
    }
    
    const result = await db.insert(todos).values(todoData).returning()
    res.status(201).json(result[0])
  } catch (error) {
    console.error('Error creating todo:', error)
    res.status(500).json({ error: 'Failed to create todo' })
  }
})

// PATCH /api/todos/:id - Update todo
router.patch('/:id', async (req, res) => {
  try {
    // Convert ISO string dates back to Date objects if present
    const updateData: any = {}
    if (req.body.dueDate !== undefined) {
      updateData.dueDate = req.body.dueDate ? new Date(req.body.dueDate) : null
    }
    // Copy other fields
    Object.keys(req.body).forEach(key => {
      if (key !== 'dueDate') {
        updateData[key] = req.body[key]
      }
    })
    updateData.updatedAt = new Date()
    
    const result = await db.update(todos)
      .set(updateData)
      .where(eq(todos.id, req.params.id))
      .returning()
    
    if (result.length === 0) {
      return res.status(404).json({ error: 'Todo not found' })
    }
    res.json(result[0])
  } catch (error) {
    console.error('Error updating todo:', error)
    res.status(500).json({ error: 'Failed to update todo' })
  }
})

// DELETE /api/todos/:id - Delete todo
router.delete('/:id', async (req, res) => {
  try {
    await db.delete(todos).where(eq(todos.id, req.params.id))
    res.json({ success: true })
  } catch (error) {
    console.error('Error deleting todo:', error)
    res.status(500).json({ error: 'Failed to delete todo' })
  }
})

export default router

