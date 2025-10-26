import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import todosRouter from './routes/todos.js'
import assigneesRouter from './routes/assignees.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/todos', todosRouter)
app.use('/api/assignees', assigneesRouter)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})

