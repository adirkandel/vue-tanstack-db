import { Router } from 'express'
import { db } from '../db/index.js'
import { assignees } from '../db/schema.js'
import { eq } from 'drizzle-orm'

const router = Router()

// GET /api/assignees - Get all assignees
router.get('/', async (req, res) => {
  try {
    const result = await db.select().from(assignees)
    res.json(result)
  } catch (error) {
    console.error('Error fetching assignees:', error)
    res.status(500).json({ error: 'Failed to fetch assignees' })
  }
})

// GET /api/assignees/:id - Get single assignee
router.get('/:id', async (req, res) => {
  try {
    const result = await db.select().from(assignees).where(eq(assignees.id, req.params.id))
    if (result.length === 0) {
      return res.status(404).json({ error: 'Assignee not found' })
    }
    res.json(result[0])
  } catch (error) {
    console.error('Error fetching assignee:', error)
    res.status(500).json({ error: 'Failed to fetch assignee' })
  }
})

// POST /api/assignees - Create assignee
router.post('/', async (req, res) => {
  try {
    const assigneesData = {
      ...req.body,
      createdAt: req.body.createdAt ? new Date(req.body.createdAt) : new Date(),
      updatedAt: req.body.updatedAt ? new Date(req.body.updatedAt) : new Date(),
    }
    
    const result = await db.insert(assignees).values(assigneesData).returning()
    res.status(201).json(result[0])
  } catch (error) {
    console.error('Error creating assignee:', error)
    res.status(500).json({ error: 'Failed to create assignee' })
  }
})

// PATCH /api/assignees/:id - Update assignee
router.patch('/:id', async (req, res) => {
  try {
    const assigneesData = {
      ...req.body,
      updatedAt: req.body.updatedAt ? new Date(req.body.updatedAt) : new Date(),
    }
    
    const result = await db.update(assignees)
      .set(assigneesData)
      .where(eq(assignees.id, req.params.id))
      .returning()
    
    if (result.length === 0) {
      return res.status(404).json({ error: 'Assignee not found' })
    }
    res.json(result[0])
  } catch (error) {
    console.error('Error updating assignee:', error)
    res.status(500).json({ error: 'Failed to update assignee' })
  }
})

// DELETE /api/assignees/:id - Delete assignee (cascades to todos via foreign key)
router.delete('/:id', async (req, res) => {
  try {
    await db.delete(assignees).where(eq(assignees.id, req.params.id))
    res.json({ success: true })
  } catch (error) {
    console.error('Error deleting assignee:', error)
    res.status(500).json({ error: 'Failed to delete assignee' })
  }
})

export default router

